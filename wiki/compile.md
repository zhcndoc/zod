# z.compile

v4 schemas 的 AOT 编译器。

## Surface

两个有意不重叠的入口：

- `z.compile(schema)` — 返回一个克隆的 schema，其 `_zod.run` 运行 AOT 编译的快速路径，失败时回退到原始的 `_zod.run`。在调用时立即编译。原始 schema 不受影响。克隆对象是普通的 `ZodType` — `.parse`、`.safeParse`、`.refine`、`.extend`、交集、管道等都照常工作。注意，派生操作（`.refine`、`.extend`、`.optional`、`.meta`……）会构造**新的** schema，这些 schema 不会继承快速路径 — 应编译最终 schema，而不是中间 schema。永不抛出：对于编译器拒绝的 schema，会原样返回并继续使用运行时解析器，这与全局模式的行为一致。`z.compile(schema, { strict: true })` 会改为抛出拒绝错误，这也是 bench matrix 和 fuzzer 用于对 schema 进行分类的方式。
- `import "zod/compile"` — 安装一个全局后处理器，用一次性的延迟编译 shim 包装每个新构造的 schema。该功能由一个 subpath export 提供，其 backing module 在 `package.json` 中标记为 `sideEffects: true`。

不存在无参数形式的 `z.compile()`。不同形状对应不同任务：显式的逐 schema 编译，以及项目范围的选择性启用。

### Tree-shaking 说明

`z.compile` 从主 `zod` 命名空间导出。针对构建后的 dist 进行测量（esbuild 和 Rollup，已压缩）：当命名空间导入中未使用 `z.compile` 时，两个打包器都会完全移除 `core/compile.ts`（压缩后约 25–28 KB）——此前关于命名空间导入会保留编译器的担忧，经测量并未成立。只有当命名空间对象逃逸静态分析时，成本才会出现（重新导出整个命名空间、动态属性访问）。副作用模块 `zod/compile` 只有在被导入时才会保留，这是通过 `package.json` 中的 `sideEffects` allowlist 实现的。决定：`z.compile` 保留在主命名空间中。

## Failure model

编译后的快速路径是一个 happy-path 验证器。它返回解析／转换后的输出，或一个 `INVALID` sentinel。在 `INVALID` 的情况下，包装器调用原始的 `_zod.run` 以生成规范的 `ZodError`。

`INVALID` 并不总是表示拒绝，因此 codegen 会跟踪一个 `definite` 标志，并且 `z.validate` 只会在该标志仍然有效时跳过解释器回退。有两种情况会清除它。任何提升的**用户回调**——refine、transform、自定义 predicate、catch value 或 lazy getter——都会通过 `addUserConstant` 清除该标志，因为该回调可能抛出异常，并且生成的代码可能在到达它之前就拒绝了更早的兄弟节点，因此该拒绝不再能证明解释器会拒绝而不是抛出异常。**runtime island**、**intersection**，以及其自身编译结果不确定的**record key**，也会直接清除该标志，理由相同，只是应用对象从回调变成了构造。能够保留下来的是不含回调的子集——类型、范围和格式检查、枚举、字面量、联合，以及对象、数组和元组成员——这正是类型守卫通常需要判断的形状。

transform 情况正是该标志存在的原因，而不是在生成代码中抛出异常：当 transform 返回一个 thenable 时，必须继续返回 `INVALID`，因为解释器自身的 union 会在那里继续尝试下一个分支，而不是向上传播该 thenable。`compile-differential` 对此进行了固定测试。

后果：

- 通过设计实现与未编译 Zod 100% 的错误一致性。快速路径永远不会生成错误；runtime 是 `ZodError` 的唯一来源。我们不维护第二套错误路径实现，这也是该设计优于 arktype 双重 `Allows` + `Apply` codegen 的主要原因。
- 用户提供的 `.refine`／`.transform`／`.superRefine` 回调在无效输入上**最多执行两次**——一次在快速路径中，一次在运行时回退中。这与 Zod 现有的 Standard Schema 同步后异步行为一致。该上限会被强制执行，包括全局模式下每个嵌套 schema 都携带自身编译包装器的情况：当某个包装器回退时，它会标记 parse ctx，后续编译包装器会在本次解析的剩余过程中跳过快速路径。
- 成功路径上的*值*一致性由编译器负责，并通过与 runtime 的差分测试进行验证（包括键顺序、值为 `undefined` 的键与缺失键、数组空洞、冻结状态，以及 NaN／-0——此外每个 fixture 还会断言快速路径确实生成了该值，而不是静默回退）。这并非免费；必须针对每种 schema 类型和每项检查逐一实现。
- 任何快速路径无法精确建模的内容，都会在 codegen 时抛出 `ZodCompileUnsupportedError`。如果未设置 `strict`，`compile()` 会吸收该错误并返回未编译的 schema——不存在静默失效、始终回退的快速路径，也不会有普通 `Error` 逃逸；`new Function` 失败（代码生成错误、CSP 拒绝）也会被转换成同一种类型。容器会将不支持的子项隔离；联合不会这样做（错误拒绝的分支会破坏匹配语义），并且 `z.xor` 出于相同原因始终回退。自定义 `when` 门控检查、NaN／Invalid-Date 比较边界，以及 `__proto__` 形状／record 键也会强制回退。
- 字符串格式通过一个**允许列表**进行分类，该列表包含其 `def.pattern` 即为完整检查的格式，而不是根据是否存在 pattern 来判断。有些格式只声明了形状模式，还会单独验证其余内容——`credit_card`（Luhn 数字）、`base64`、`base64url`、`jwt`、`ipv6`、`cidrv6`、`url`——这些格式会改为提升 runtime validator。自定义格式会编译 `def.fn`，也就是 runtime 自身调用的 predicate，而不是信任其生成所依据的 pattern。既不在任何一个列表中的格式会失去快速路径，而不会被编译成一个可能比 runtime 接受更多内容的正则表达式。

## Scope cuts

- **仅支持正向方向。** Codec encode／`ctx.direction === "backward"` 路径会跳过快速路径，直接进入 runtime。包装器会检查 `ctx.direction`，并在 backward 时退出。之后如果 bench 结果有需要，再添加 backward codegen。
- **不支持 async。** 如果在 codegen 遍历期间遇到 async refinement、transform 或 check，编译器会立即抛出异常。生成代码中完全没有处理 promise 的机制。`safeParseAsync` 会跳过快速路径。
- **jitless。** 全局模式遵守 `config().jitless`：shim 会恢复 runtime parser，而不是进行编译，因此在 CSP／no-eval 环境中，`import "zod/compile"` 不会产生作用。显式调用 `z.compile(schema)` 仍然表示显式选择使用 `new Function`；在 CSP 下，原始的 `EvalError` 会被转换为 `ZodCompileUnsupportedError`，默认入口会像处理其他拒绝一样吸收它。
- **不支持递归 schema。** 子树包含循环的 schema 会在 codegen 时被拒绝，并通过 runtime 进行解析。由于 memoizer 会在子节点运行前注册每个进行中的输出，并以本次调用中所有 schema 共享的 parse context 为键，因此包含引用循环的输入仍然会终止；而生成的快速路径接收输入并返回值，没有可用于建立键的 context，因此会沿着循环继续执行直到栈耗尽。当编译节点接收到的值是 memoizer back edge 时，它也会交回 runtime，因此位于循环上的 transform 仍会从其自身的 parse 中抛出 `$ZodCyclicError`。正确支持这一点意味着要将 parse context 和 `memo.alloc` 传入生成的容器。

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

- **每个节点使用两套编译 codegen（arktype 风格的 `Allows` + `Apply`）。** 不采用；参见 [为什么不值得编译失败路径](#why-the-failure-path-is-not-worth-compiling)。runtime-fallback 模型无需承担并行错误路径 codegen 的维护成本，就能实现错误一致性。
- **返回函数而不是 schema。** 曾考虑过。返回 schema 可以保留链式调用和组合能力，通过现有的 `safeParse → _zod.run` 路径与 Standard Schema 集成，并且能够透明地暴露快速路径，而无需并行的 API surface。
- **原地修改输入 schema。** 曾考虑过。克隆可以避免库代码接收用户 schema 作为输入时产生令人意外的修改风险。
- **公开 `globalConfig.postProcessor`。** 这是内部实现细节。不将其作为公共 config surface 的一部分进行记录。如果将来有多个消费者需要注册钩子，这里应变成 registry，而不是单个 slot。

## Why the failure path is not worth compiling

Apply-mode codegen 会替代失败解析回退到的 runtime 遍历。该遍历只占失败 `safeParse` 的 1.4–9.5%；另外 90–99% 的时间用于生成错误。

| case | walk | `finalizeIssue` | `new ZodError` | total | walk share |
| --- | --- | --- | --- | --- | --- |
| `z.string()` invalid | 13ns | 136ns | 777ns | 926ns | 1.4% |
| 5-key object, one bad key | 69ns | 198ns | 680ns | 947ns | 7.3% |
| nested 3-deep | 75ns | 212ns | 2181ns | 2468ns | 3.0% |
| array of 20, one bad element | 71ns | 174ns | 2242ns | 2487ns | 2.9% |
| 243-leaf object | 2434ns | 12043ns | 11233ns | 25709ns | 9.5% |

低于 10%，却要为每个 generator 增加第二种生成模式，并使每个 schema 的生成代码增加一倍。失败路径性能的关键在于错误构造，而不是编译器——而且当 issue 数量超过几个后，解析其消息的成本会超过构造错误本身。

唯一的例外是自身就很昂贵的提升 validator：`z.url()` 会在快速路径中运行 `new URL()`，并在回退时再次运行；对于无效输入来说，第二次运行是可见的——一次性测量中相对于 runtime 为 0.57x，这是 run-twice 上限产生代价的唯一场景。代价来自 validator 本身，而不是遍历，因此不会改变上述结论；它说明应该缓存快速路径对某个输入的判断结果，而不是编译失败路径。

## Runtime islands

Object、tuple、array、record（value side）、intersection 和 catch codegen 会通过 `compileChild` 路由子项。抛出 `ZodCompileUnsupportedError` 的子项会被回滚，并替换为提升的 runtime 调用（`runtimeRun(schema, value)`），因此单个不支持的叶节点不会中止周围结构的编译。Union 和 discriminated union 则有意**不进行隔离**：first-match／exactly-one 语义要求每个分支的失败都表示“runtime 会拒绝”，而不是“无法编译”。
