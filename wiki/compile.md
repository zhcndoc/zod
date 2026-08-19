# z.compile

v4 schemas 的 AOT 编译器。位于 `z.compile` 分支。

## Surface

两个有意不重叠的入口：

- `z.compile(schema)` — 返回一个克隆的 schema，其 `_zod.run` 运行 AOT 编译的快速路径，失败时回退到原始的 `_zod.run`。在调用时立即编译。原始 schema 不受影响。克隆对象是普通的 `ZodType` — `.parse`、`.safeParse`、`.refine`、`.extend`、交集、管道等都照常工作。注意，派生操作（`.refine`、`.extend`、`.optional`、`.meta` 等）会构造*新的* schema，不会继承快速路径 — 应该编译最终的 schema，而不是中间 schema。
- `import "zod/compile"` — 安装一个全局后处理器，为每个新构造的 schema 包装一个一次性的惰性编译 shim。该功能由一个子路径导出支持，其 backing module 在 `package.json` 中标记为 `sideEffects: true`。

不存在无参数形式的 `z.compile()`。不同形状对应不同任务：显式的逐 schema 编译，以及项目范围的选择性启用。

### Tree-shaking 说明

`z.compile` 从主 `zod` 命名空间导出。针对构建后的 dist 进行测量（esbuild 和 Rollup，已压缩）：当命名空间导入中未使用 `z.compile` 时，两个打包器都会完全移除 `core/compile.ts`（压缩后约 25–28 KB）——此前关于命名空间导入会保留编译器的担忧，经测量并未成立。只有当命名空间对象逃逸静态分析时，成本才会出现（重新导出整个命名空间、动态属性访问）。副作用模块 `zod/compile` 只有在被导入时才会保留，这是通过 `package.json` 中的 `sideEffects` allowlist 实现的。决定：`z.compile` 保留在主命名空间中。

## Failure model

编译后的快速路径是一个 happy-path 验证器。它返回解析／转换后的输出，或一个 `INVALID` sentinel。在 `INVALID` 的情况下，包装器调用原始的 `_zod.run` 以生成规范的 `ZodError`。

后果：

- 通过设计实现与未编译 Zod 100% 的错误一致性。快速路径从不生成错误；runtime 是 `ZodError` 的唯一来源。我们不维护第二套错误路径实现，这也是该设计优于 arktype 的双重 `Allows` + `Apply` codegen 的主要原因。
- 用户提供的 `.refine`／`.transform`／`.superRefine` 回调在无效输入上**最多运行两次** — 一次在快速路径中，一次在 runtime 回退中。这与 Zod 现有的 Standard Schema 同步后异步行为一致。该上限也会被强制执行，包括全局模式下每个嵌套 schema 都带有自己的编译包装器时：当一个包装器回退时，它会标记 parse ctx，下游编译包装器会在本次解析的剩余过程中跳过自己的快速路径。
- 成功路径的*值*一致性由编译器负责，并通过与 runtime 的差分测试验证（包括键顺序、值为 `undefined` 的键与缺失键、数组空洞、冻结状态，以及 NaN／-0 — 还包括每个 fixture 都会断言快速路径确实生成了该值，而不是静默回退）。这并非免费；必须针对每种 schema 类型和每项 check 分别实现并验证。
- 任何快速路径无法精确建模的内容，都会在代码生成时抛出 `ZodCompileUnsupportedError` — 不存在静默失效、始终回退的快速路径，也不会出现普通的 `Error` 逸出；`new Function` 失败（代码生成错误、CSP 拒绝）也会转换为相同类型。容器会将不支持的子项隔离；联合不会这样做（错误拒绝某个分支会破坏匹配语义），`z.xor` 出于同样原因始终回退。自定义的 `when` 门控 check、NaN／Invalid-Date 比较边界，以及 `__proto__` shape／record 键也会强制回退。
- 字符串格式通过一个**allowlist**分类，该 allowlist 中的格式其 `def.pattern` 是完整的 check，而不是根据是否存在 pattern 来分类。多个格式会声明一个仅用于 shape 的 pattern，并在其他地方单独验证 — `credit_card`（Luhn 数字）、`base64`、`base64url`、`jwt`、`ipv6`、`cidrv6`、`url` — 对这些格式会改为提升 runtime 验证器。自定义格式会编译 `def.fn`，也就是 runtime 本身调用的 predicate，而不是信任它构建所依据的 pattern。既不在任一列表中的格式会失去快速路径，而不会被编译成一个接受范围超过 runtime 的正则表达式。

## Scope cuts

- **仅支持正向方向。** Codec encode／`ctx.direction === "backward"` 路径会跳过快速路径，直接进入 runtime。包装器检查 `ctx.direction`，在 backward 时退出。以后如果基准测试显示有必要，再添加 backward codegen。
- **不支持异步。** 如果在代码生成遍历期间遇到异步 refinement、transform 或 check，编译器会立即抛出异常。生成的代码中完全没有 promise 的处理能力。`safeParseAsync` 会跳过快速路径。
- **jitless。** 全局模式遵循 `config().jitless`：shim 会恢复 runtime parser，而不是进行编译，因此在 CSP／no-eval 环境中，`import "zod/compile"` 不会产生作用。显式调用 `z.compile(schema)` 仍然是对 `new Function` 的显式选择；在 CSP 下，它会抛出 `ZodCompileUnsupportedError`，而不是原始的 `EvalError`。
- **不支持递归 schema。** 子树中包含环的 schema 会抛出 `ZodCompileUnsupportedError`，并通过 runtime 解析。包含引用环的输入能够终止，是因为 memoizer 会在子项运行前注册每个进行中的输出，并以本次调用中所有 schema 共享的 parse context 为键；生成的快速路径接收输入并返回值，没有可用作键的 context，因此会沿着环继续运行直到栈耗尽。当编译节点接收到的值是 memoizer 的 back edge 时，它也会交还给 runtime，因此位于环上的 transform 仍然会从自身的 parse 中抛出 `$ZodCyclicError`。要正确支持这一点，就意味着要将 parse context 和 `memo.alloc` 传入生成的容器。

## Benchmarks

`pnpm dev packages/bench/compile-matrix.ts` 会遍历所有类别中的 55 个 schema，并打印 runtime、compiled 和 raw-fast-path 的吞吐量及加速比。阅读这些数字时，该方法有三点需要注意：

- **共享进程的 schema 数量。** 这是对结果影响最大的单一因素，比编译器所做的任何事情都更重要。当有很多 schema 同时存在时，`safeParse` 调用点和 Zod 自己的内部 dispatch 点会变成 megamorphic，这对遍历节点树的解释器造成的负担，远大于对一个扁平的生成函数造成的负担。同样的 55 个 schema，在一起测量时报告的中位数为 **2.4x**，每个进程单独测量时为 **1.6x**。默认采用一起测量，因为应用会同时持有许多 schema，而这正是其用户看到的数字；`--isolate` 提供单 schema 数值，这是用于调优的参考。
- **输入通过数组加载到达。** 如果作为常量传入，整个调用会循环不变，V8 会将其移出计时循环 — 相比不透明的 `new Function` 闭包，V8 更容易提升普通解释器代码，这会让 runtime 的表现最高被夸大 1.9x。值不需要不同；一次数组读取就足够。
- **结果必须逃逸。** 被丢弃的结果会让 V8 直接删除整个解析（`z.string()` 测得 625M ops/sec，约 1.6ns）；未逃逸的结果会被分配在栈上。这两种情况都会在计时前排除。
- **交错执行，取 15 轮中的最佳结果。** 笔记本上的绝对 ops/sec 在不同运行之间会漂移几十个百分点，因此每个加速比都是相隔微秒测得的两次结果之比。
- **正确性优先。** 在计时之前，会先将编译后的输出与 runtime 进行比较；每一行还会报告 schema 是成功编译、回退，还是直接通过 — 一个数字不可能来自一个静默未运行的快速路径。

55 个 schema 中有 53 个成功编译。中位数为 **2.4x**，范围为 0.66x–13.9x。

| | |
| --- | --- |
| 最大收益 | `z.array(z.string())` x100 **13.9x**、`z.array(z.object())` x50 **9.3x**、20 键对象 **8.9x**、对象联合 **8.4x**、`.pipe()` **7.7x**、`z.number().int().min().max()` **5.8x** |
| 典型情况 | 嵌套对象 4.5x、tuple 4.8x、交集 4.3x、discriminated union 4.3x、`.refine()` 4.6x、带 check 的字符串 2.8x、strict object 3.0x、扁平 5 键对象 2.5x |
| 边际收益 | 字符串格式 1.4–2.4x、`z.record` 动态键 1.3–1.7x、大多数裸 primitive 1.2–1.7x、`.catch()` 1.2x |
| 编译后更慢 | 裸 `z.string()` **0.70x** — 这里唯一稳定为负的情况 |
| 强制回退 | recursive schema 1.00x、`z.xor` 0.94x — 包装器的绕过检查没有可测量的成本 |

收益取决于 schema 每次解析执行多少工作，因为编译移除的是每节点 dispatch 和 payload 分配，而不是 check 本身。20 键对象或对象数组可以将这些成本分摊到大量工作中；裸 primitive 没有可供分摊的内容。

这有多重要，很大程度上取决于测试环境。每个进程只测量一个 schema 时，有七个 schema 编译后更慢 — 所有裸 primitive 加上对缺失输入使用 `.default()` 的情况，结果为 0.63–0.91x — 因为对于单个 `typeof`，解释器路径足够小，V8 可以将其扁平内联，而生成代码位于 `new Function` 闭包中，V8 不会将其内联到调用方，因此调用本身就超过了 check 的成本。在同时存在许多 schema 时，这种内联优势基本消失，只有裸 `z.string()` 仍然为负。因此，根据这些数字，没有必要对编译叶子节点进行特殊处理：在微基准测试之外，损失仅限于一种 schema 形状，而容器内部的叶子节点会被内联到父级生成函数中，完全不会承担调用成本。

最后一行是设计时需要考虑的重点。**裸 primitive 编译后更慢**，原因并不是 `safeParse`：不分配结果对象的 `.parse()` 反而更差（`z.string()` 为 0.42x，`z.literal()` 为 0.45x），而两个 API 在复合结构上的结果一致（5 键对象为 1.73x 对 1.72x，嵌套对象为 3.59x 对 3.76x）。真正产生成本的是调用本身。生成代码位于 V8 不会内联到调用方的 `new Function` 闭包中，因此每次解析都会产生一次真实调用；当实际工作量低于约十纳秒时，该调用就超过了它所替代的 `typeof`。只需一个 check 就足以扭转结果 — `z.string().min(1)` 为 2.8–3.2x。

有两个后果。全局模式会让简单的叶子 schema 可测量地变慢，同时让由这些叶子 schema 组成的一切都变快，因此它并不是无条件的收益，值得针对真实 schema 集合进行测量。并且表中的 primitive 具体数值最不可靠：在约 8ns/op 时，结果会根据测试工具细节从 0.6x 到 1.0x 之间变化，因此应将其理解为“这里没有收益”，而不是精确比例。所有达到 2x 或更高的结果，在尝试过的每种测量环境中都能复现。

### Against arktype

采用相同方法，使用 arktype 2.1.19，所有案例共享一个进程。Arktype 的契约可配置，因此比较完全取决于选择哪一种：

| case | ark，返回输入 | ark，拒绝未知项 | ark，分配 | `z.object()` | `z.strictObject()` |
| --- | --- | --- | --- | --- | --- |
| 简单 2 键对象 | 130.0M | 13.0M | 1.2M | **64.3M** | **44.6M** |
| 嵌套对象（moltar） | 19.9M | 6.0M | 174k | **30.5M** | **17.6M** |
| `z.array(z.object())` x50 | 3.9M | — | 14k | 3.5M | — |

匹配契约后，compiled zod 除了一个案例外在所有地方都领先：

- **两者都拒绝未声明的键**（`z.strictObject()` 对 `.onUndeclaredKey("reject")`）：在 moltar 上 zod 快 **2.9x**，在简单对象上快 **3.4x**。
- **两者都构建新输出**（`z.object()` 对 `.onDeepUndeclaredKey("delete")`）：zod 快了两个数量级。Arktype 可以生成一个新对象，但该路径的成本约为其自身快速路径的 20 倍 — 这是每次调用都稳定存在的成本，而非预热成本 — 因此这说明 arktype 的 stripping 模式未优化，而不是 zod 在验证方面快了 175 倍。
- **Arktype 原地验证** — 这是它的快速路径，也比 Zod 提供的任何契约都弱，因为它既不分配也不剔除。即便如此，`z.object()` 在 moltar 上仍然胜过它（30.5M 对 19.9M）。它只在扁平的双键对象上获胜，因为那里几乎没有可供分摊的成本。

本 wiki 中较早的数字比较的是会承担未声明键扫描的 `z.strictObject()`，与 arktype 的*默认模式*；后者不会进行这种扫描，并且会返回其输入。这同时施加了两项不利条件，也是 compiled zod 看起来只是与 arktype 持平、而非领先的原因。优先参考上面契约匹配的行。

## Output construction

生成的代码始终构建新的对象和数组；从不修改输入或 `payload.value`。这一点由 `packages/bench/compile-passthrough.ts` 和 `packages/bench/compile-output.ts` 证明：在所有测试过的形状中，构建新对象的方式都胜过或持平于原地修改，并且能产生可预测的语义（调用方可以自由修改返回值）。

包装器只会在快速路径返回非 INVALID 结果后写入 `payload.value`。不存在部分修改导致数据损坏的窗口。

## Global mode mechanics

`import "zod/compile"` 会将 `globalConfig.postProcessor` 设置为 compile function。`core.ts` 中的 schema 构造器（`_` 函数）会在 `init()` 遍历继承链且 `_zod.deferred` 完成刷新后，对每次构造调用一次后处理器。

后处理器**不会**立即编译。它会安装一个一次性的 `_zod.run` shim，在首次解析时编译并覆盖自身。这避免了为任意 builder 链中 N–1 个被丢弃的中间 schema 支付编译成本（`z.string().min(3).max(10).regex(...)` 会调用四次构造器；实际只会使用最后一个）。这与现有的对象 JIT（`generateFastpass`）模式一致。

可重入性：当模块局部的 `compiling` 标志被设置时，后处理器会直接返回，因此编译过程中进行的内部 schema 构造（例如通过 `util.clone`）不会递归。

## Code sharing with the runtime

当编译器生成的 check 逻辑也存在于 `util.*` 或 runtime parser 中时，应通过 `addConstant(ctx, fn)` 提升 runtime 函数，并生成调用。这样只有一个事实来源；未来的修复会自动传播；同时消除 fix(v4) 提交不断产生的静默偏移类 bug。

已经完成：用于 `multipleOf` 的 `util.floatSafeRemainder`、用于 default 克隆的 `util.shallowClone`、`parseValidURL`、`isValidBase64`、`isValidBase64URL`、`isValidJWT`、字符串格式的提升正则 pattern，以及提升的用户 `.refine`／`.transform`／`.overwrite` 函数。

只有当操作是 1–3 个字节码的语言原生操作时才内联（`typeof`、`===`、`Array.isArray`、`instanceof`、基本比较、属性访问）。将 `typeof x === "string"` 包装在 util 调用中只会更差。

对于 Apply-mode 工作（如果最终会发生），每个 issue 发出位置都应调用 runtime 中提升的 issue-builder — `util.finalizeIssue`、`util.prefixIssues`、`invalid_type`／`too_small`／`too_big` 等的规范 payload 形状。Issue 构造位于冷分支中；调用开销并不重要，一致性才非常重要。

## Composability

`z.compile(schema)` 返回的克隆对象是普通的 Zod schema。它可以嵌入任何位置 — `z.object({ field: compiled })`、进行交集、管道等。在未编译的父级中，快速路径仍会被调用，但会损失大部分收益：父级会再次支付每字段 payload 分配、路径跟踪和 `_zod.run` dispatch 的开销。要获得整个图的性能，应编译最外层 schema，或启用全局模式。

克隆 schema 的子项与原始 schema 按引用共享。`z.compile(schema)` 是一个 snapshot 操作。修改原始对象（`s.refine(...)` 会返回一个新 schema，等等）不会影响克隆对象，反之亦然。

## Non-goals

- **每个节点使用两套 compiled codegen（arktype 风格的 `Allows` + `Apply`）。** 曾对此进行过考虑。runtime-fallback 模型无需承担并行错误路径 codegen 的维护成本，就能实现错误一致性。只有当基准测试显示回退路径成本对真实工作负载很重要时，才重新考虑。
- **返回函数而不是 schema。** 曾对此进行过考虑。返回 schema 可以保留链式调用和组合能力，通过现有的 `safeParse → _zod.run` 路径与 Standard Schema 集成，并且可以透明地暴露快速路径，无需并行的 API surface。
- **原地修改输入 schema。** 曾对此进行过考虑。克隆可以避免库代码接收用户 schema 作为输入时产生意外修改的问题。
- **公开 `globalConfig.postProcessor`。** 这是内部实现细节，不属于公开 config surface 的文档范围。如果未来有多个消费者需要注册 hook，这里应改为 registry，而不是单一 slot。

## Runtime islands

对象、tuple、数组、record（value 侧）、交集和 catch 的 codegen 会通过 `compileChild` 路由子项。若某个子项抛出 `ZodCompileUnsupportedError`，就会回滚并替换为提升的 runtime 调用（`runtimeRun(schema, value)`），因此一个不支持的叶子节点不会中止周围结构的编译。联合和 discriminated union 则有意不进行隔离：first-match／exactly-one 语义要求每个分支的失败都表示“runtime 会拒绝”，而不是“无法编译”。

## Open

- **数组输出策略。** Arktype 经常在数组基准测试中获胜，因为它可以为仅验证的数组返回输入。Zod 语义会返回解析后的输出（新的数组／对象）。任何朝向复用输入的变化都应是有意的语义／性能取舍，而不是偶然的优化。
- **Registry identity。** 编译后的克隆会像任何派生 schema 一样，通过 `_zod.parent` 继承 registry 元数据；根据 registry 的设计，这不包括 `id`。因此，`z.toJSONSchema(z.compile(s))` 会丢失已注册的 `id`；如果 `$defs` identity 很重要，应将原始对象传给 `toJSONSchema`。
