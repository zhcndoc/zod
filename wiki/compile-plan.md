# z.compile 实现 + 测试计划

计划将所有内容落地到 `wiki/compile.md`。各阶段按照依赖关系排序；每个阶段结束时测试套件都应通过。阶段内的项目大致按照提交大小划分。

## 当前状态

按阶段跟踪。随着工作落地进行更新。如果上下文被压缩，下一个代理应首先阅读本节。

- **阶段 1** — 已完成。`compile()` 现在返回一个替换了 `_zod.run` 的克隆 schema。快速路径在绕过情况（backward/async/skipChecks）以及 `INVALID` 回退时，委托给*原始* schema 的 `_zod.run`——这会保留 `inst` 引用，使错误消息保持一致。内部已暴露 `compileFastpass()`，供直接使用快速路径（阶段 2 将使用）。急切异步检测会针对 `.refine`/`.transform`/overwrite/pipe-transform/custom-fn 抛出 `ZodCompileAsyncError`。测试已迁移到 schema API。完整仓库测试套件：4055/4055 通过。
- **阶段 2** — 已完成。`compile-differential.test.ts` 会针对每个受支持的组合器运行约 50 组 fixture，并断言成功时数据逐字节相同、失败时 `issues` 深度相等。发现并修复了三个真实差异：（1）`z.number()` 接受 `Infinity`（compile 使用了 `!Number.isNaN`，但 runtime 使用 `Number.isFinite`）；（2）codec transform（`z.stringbool`）访问 `payload.issues.push`——pipe 代码生成现在会伪造一个 payload，并在任意 issue 被推入时强制回退；（3）带有 enum/literal key 的 records（`z.record(z.enum([...]), v)`）缺少穷举性检查——compile 现在会针对这种情况强制回退，动态 key records 仍然走快速路径。完整仓库测试套件：4157/4157 通过。
- **阶段 2b** — 已完成。通过单独的 `vitest.compile.config.ts` 进行双套件验证，该配置由 `pnpm test:compile` 调用。设置文件 `scripts/enable-compile.ts` 安装全局后处理器（惰性 shim，带重入保护，并通过 `__originalRun` 暴露 shim 之前的 runtime）。`core/core.ts` 中的构造函数钩子会调用 `globalConfig.postProcessor?.(inst)`。`compile-stats.test.ts` 验证后处理器已接入。发现并完成了关键修复：compile() 的 wrapper 必须*急切地*捕获 `schema._zod.run`，并跳过已安装的 shim 进行解包——惰性捕获会在 shim 自我替换时导致无限递归。`pnpm test`（默认）仍然完全通过；`pnpm test:compile` 有 50 个跨功能领域的已知失败，作为阶段 4 的工作进行跟踪（见下方“阶段 4 待办清单”）。
- **阶段 3** — 已完成。`packages/zod/src/compile.ts` 是仅产生副作用的子路径模块，用于安装全局后处理器。`package.json` 将其暴露为 `./compile`（带有 `@zod/source`/`import`/`require`/`types` 条件），并在 `sideEffects` 中列出该文件，使 bundler 在 `import "zod/compile"` 时保留它，而在未导入时执行 tree-shake。`scripts/enable-compile.ts` 现在简化为围绕 `import "zod/compile"` 的薄 wrapper，并增加用于双套件统计测试的计数覆盖层。新增 `compile-global.test.ts`，验证面向用户的子路径导入方式。完整套件：4165 个默认测试 + 同样 50 个已知 compile-mode 差异。通过 bundle fixture 进行的 tree-shaking 验证推迟到阶段 5。
- **阶段 4** — 已完成。两套件均通过：默认模式和 compile-mode。现有测试语料库中的每个 schema 在全局 compile 模式下产生的输出，都与 runtime parser 完全一致。新增 `ZodCompileUnsupportedError`，并使 compile pass 针对真正不受支持的形状抛出该错误（强制回退）。此后实现了若干此前的回退项：intersection、prefault、z.xor、URL/base64/JWT string formats、optional-wrapping-default/prefault、tuple 缺失 slot 的 defaults/prefaults、带 key transforms 的穷举 records、record symbol keys，以及 exactOptional 顶层/对象属性行为。修复了真实的代码生成 bug：`z.number()` 接受 `Infinity`、dynamic-record-key 不验证 keys、record 使用 `typeof === "object"` 而非 `isPlainObject`（Date 接受行为回归）、object output 始终包含缺失的 optional keys、object 缺少 required keys 的 presence 检查、mini-style number formats（int/int32/uint32/float32）将 format 内联到 schema def 中，以及 readonly 不冻结输出。
- **阶段 5** — 除了 tree-shaking 与顶层 `z.compile` 之间的明确 API 决策外，实际上已完成。`play.ts` 已恢复为其主分支内容。`packages/bench/compile.ts` 已更新为新的返回 schema API。`packages/bench/compile-vs-arktype.ts` 已更新为依次比较 `z.compile().safeParse`、`compileFastpass`、arktype、手写实现和常规 Zod。`compile()` 现在会在克隆的 schema 上安装快速 `parse`/`safeParse` 闭包，全局模式下惰性 compile 后还会将这些闭包复制到原始 schema 上。这消除了大部分公共 wrapper 开销。目前的 arktype 基准结果：简单 object 的 `z.compile().safeParse` 为 **27.0M ops/sec**，arktype 为 **34.4M**；嵌套 moltar object 为 **15.9M** 对 **17.2M**；包含 100 个 number 的 array 为 **8.75M** 对 **15.4M**；包含 50 个 object 的 array 为 **3.99M** 对 **4.62M**。已添加并完成基准测试 discriminated-union 快速路径：3 分支 DU 的 `z.compile().safeParse` 为 **27.0M ops/sec**，arktype 为 **23.9M**（原始快速路径为 **34.5M**）。新增 `packages/bench/compile-helper-scope.ts`，并将 base64/base64url/JWT 从强制回退改为提升 runtime helpers。helper-call 基准：base64url compiled `.safeParse` 为 **5.45k ops/sec**，runtime zod `.safeParse` 为 **4.74k**；JWT 编译版本为 **4.56k**，runtime 版本为 **4.09k**。新增 `packages/bench/compile-base64-inline-vs-hoist.ts`，用于单字符串信号：有效 `z.base64()` 手动提升 helper 为 **10.6M ops/sec**，手动内联 body 为 **10.1M**，compileFastpass 为 **10.4M**，compiled `.safeParse` 为 **9.36M**，runtime `.safeParse` 为 **8.13M**。这确认了在成功路径上，提升的 helper 调用与将 base64 body 复制内联相比没有可测量的速度差异。无效输入的 `.safeParse` 仍然按设计较慢，因为它会回退到 runtime 以构建规范错误。作用域常量数量基准显示：未使用的作用域常量不会实质影响运行时性能，但构造成本会随数量增长（一个 helper 时约为 1.51M ops/sec，helper+10 个常量时约为 969k，helper+50 个常量时约为 369k），因此对于生成函数的整洁性，仍采取选择性提升策略（构造成本本身不是发布问题）。`AGENTS.md`（同步到 `CLAUDE.md` 和 `.cursorrules`）现在列出了 `pnpm test:compile`。已添加 README 文案。`pnpm build`、`pnpm test` 和 `pnpm test:compile` 均通过；已更新 ATTW 快照以包含 `zod/compile`。bundle 检查发现一个尚未解决的 API 权衡：只有在导入时才会包含 `zod/compile` 副作用模块，但普通的 `import * as z from "zod"` 会因为 `z.compile` 是公共 namespace export 而保留 `core/compile.ts`。真正让 compiler 对 namespace 用户执行 tree-shaking，与顶层 `z.compile` 存在冲突。

- **加固阶段（2026 年 6 月）** — 已完成。一次完整的对抗性评估（针对每个组合器执行差分探测，对每个声称的差异运行复现程序）发现并修复了以下问题：lazy islands 在没有 ctx 的情况下调用内部 runtime（任何包含 checks/defaults 的已编译 `z.lazy` 树在有效输入上都会出现 TypeError）；url string-format checks 向 const accessors 赋值（导致崩溃）并修改调用方输入；`z.success` 返回内部值而非 boolean；严格 object 的 key-count shortcut 接受继承的 enumerable keys（通过提升的 prototype guard 关闭该问题，开销约 2%）；object output 差异（unknown-key 顺序、`{k: undefined}` 的 materialization 与 runtime 的 value-or-presence 规则不一致、空 shape 的 loose spread、多次读取 getter——通过 `mayOutputUndefined` 门控的 assembly 和单次读取的属性缓存修复，最终基准结果反而提升）；literal-union Set 优化绕过 literal checks；sync refine 返回 Promise 时静默通过；全局模式下用户回调在无效输入上执行 3-4 次（现在通过 ctx fallback flag 以及 shim/closure 修改，精确为 2 次）。`z.xor` 恢复为强制回退（针对任意错误拒绝分支，match counting 不可靠）。自定义 `when`-gated checks、NaN/Invalid-Date bounds、`__proto__` shape/record keys 强制回退；Date gt/lt bounds 通过提升的常量进行 compile。错误分类已统一：每个不受支持的 shape 都会抛出 `ZodCompileUnsupportedError`（已消除普通 Error 抛出和始终为 INVALID 的发出；`new Function` 失败也会转换）。全局模式遵循 `config().jitless`。差分 harness 已加固：比较 key-order/absence/frozenness/NaN 敏感项，并为每个 fixture 断言快速路径确实产生了该 value。经过所有修复后，Moltar strict-object 基准：原始快速路径为 44.6k ops/sec，带 wrapper 的 safeParse 为 31.6k；此前分别为 43.6k/29.3k。

本分支上的活动提交（最新在前）：

- `36225b9f` wiki：记录 z.compile 设计决策
- `a9e28f0d` wiki：z.compile 实现 + 测试计划
- `ac063f28` WIP：在编译后的 multipleOf 中提升 util.floatSafeRemainder
- `30d3aaf7` WIP：使 compile 与 main 行为保持一致
- `3539cfc1` WIP
- `7e64b278` WIP

## 阶段 1 — 将 `compile()` 转换为 schema-clone + fallback

当前分支返回 `((input) => T | INVALID) & { code: string }`。我们需要让它返回一个替换了 `_zod.run` 的克隆 schema，该 `_zod.run` 首先调用编译后的快速路径，并在返回 `INVALID` 时回退到原始 `_zod.run`。这是整个计划中最大的单项变更，并且会重写现有测试套件的调用点。

- [ ] 添加 `compileFastpass(schema)`（内部名称已重命名），返回现有的 `(input) => T | INVALID` 函数。函数体与当前导出的 compile 相同。这是其他所有部分构建于其上的底层原语。
- [ ] 重新实现 `compile(schema)`：
  1. 使用现有的 `util.clone` 机制克隆 schema（确认它会生成可用的 schema graph snapshot，而不会浅层共享 `_zod`）。
  2. 在调用时生成 `fast = compileFastpass(clone)`。
  3. 用 wrapper 替换 `clone._zod.run`：
     ```ts
     const originalRun = clone._zod.run;
     clone._zod.run = (payload, ctx) => {
       if (ctx?.direction === "backward" || ctx?.async) return originalRun(payload, ctx);
       const out = fast(payload.value);
       if (out !== INVALID) {
         payload.value = out;
         return payload;
       }
       return originalRun(payload, ctx);
     };
     ```
  4. 返回 `clone`（类型与输入相同的 `ZodType`）。
- [ ] 在 compile-walk 时检测异步（已有部分实现——`isAsyncFunction` checks），并抛出一个名为 `ZodCompileAsyncError` 的错误类，使调用方能够方便地使用 `try/catch`。
- [ ] 更新 `core/index.ts` exports：从公共 surface 中移除 `INVALID`（它现在是 wrapper 的内部实现细节）。保留从 `compile.ts` 导出，供内部使用。
- [ ] 迁移 `packages/zod/src/v4/core/tests/compile.test.ts`：
  - 将所有 `compile(schema)` → function 模式替换为 `compile(schema).safeParse(input)`。
  - 重写 `valid()` / `invalid()` helpers，使其断言 `SafeParseResult` 的形状。
  - 验证错误情况现在会产生真实的 `ZodError`，且 paths 与 runtime 一致（这是因为回退而隐式保证的）。

**本阶段测试范围：**

- 全部 228 个现有 compile 测试通过新 API 运行。
- 添加 `compile-fallback.test.ts`：明确断言编译 wrapper 抛出的错误与原始 schema 的 `safeParse` 产生的错误逐字节一致（issue codes、paths、messages）。
- 添加 `compile-snapshot.test.ts`：明确断言 `z.compile` 后原始 schema 未发生变化——相同的 `_zod.run` 引用，没有泄漏的 mutations。
- 添加 `compile-direction.test.ts`：`z.compile(z.codec(...)).safeParse(x)` 和 `.encode(x)` 均产生与原始 schema 相同的输出（encode 路径会经过 fallback）。

## 阶段 2 — 差分测试

我们通过构造加测试来声明成功路径输出具有一致性，而不是仅依靠构造本身。需要真正的测试 harness，以捕获 runtime 与编译后的快速路径之间的输出差异。

- [ ] 添加 `packages/zod/src/v4/core/tests/compile-differential.test.ts`，包含如下 fixture-driven harness：
  ```ts
  function differential(schema: z.ZodType, inputs: unknown[]) {
    const compiled = z.compile(schema);
    for (const input of inputs) {
      const r1 = schema.safeParse(input);
      const r2 = compiled.safeParse(input);
      expect(r2.success).toBe(r1.success);
      if (r1.success) expect(r2.data).toEqual(r1.data);
      else expect(r2.error.issues).toEqual(r1.error.issues);
    }
  }
  ```
- [ ] 构建 fixture matrix：针对每种受支持的 schema type，提供一个代表性 schema 以及覆盖有效、无效、边界和奇异情况的 inputs 数组（NaN、`__proto__`、prototype-polluted、symbol keys、稀疏数组、holes 等）。
- [ ] 添加嵌套组合 fixture：由 objects 组成的 arrays，其中包含 records 的 unions；带有 arrays 的 rest、包含 defaults 的 optionals 的 tuples；深层嵌套的 codec chains 等。这些位置最容易产生输出差异。
- [ ] 将 harness 接入 `pnpm test`。

**验收标准：** 对 compile 支持的每个 schema combinator，差分 harness 都能通过。任何失败的 combinator 都应在 compiler 中修复，或从受支持列表中移除，并让 schema-walk 拒绝为其安装快速路径。

## 阶段 3 — 子路径 + 全局模式

- [ ] 添加一个新的子路径模块。暂定名称为 `packages/zod/src/v4/classic/external-compile.ts`（或不会被主 `zod/v4` barrel 引入的类似位置）。模块体恰好只有一条设置 `globalConfig.postProcessor = compile` 的语句。不导出任何其他内容。
- [ ] 在 `packages/zod/package.json` 的 `exports` 字段中添加 `"./compile"`，指向构建后的位置。
- [ ] 将 `packages/zod/package.json` 中的 `sideEffects` 设置为列表。默认整个 package 使用 `sideEffects: false`，并显式列出 compile 子路径模块。使用 esbuild + Vite + Rollup 进行测试，确认 dead-code elimination 正常工作（一个只导入 `zod` 而不导入 `zod/compile` 的 fixture app 不应在输出中包含 `compile.ts`）。
- [ ] 在 `core/core.ts` 的 `globalConfig` 中添加 `postProcessor?: (schema: SomeType) => void`。标记为内部 API。
- [ ] 修改 `core/core.ts` 中的 `_` constructor function，使其在 `_zod.deferred` flush 后调用 `globalConfig.postProcessor?.(inst)`。
- [ ] 实现后处理器本身（由子路径模块安装的函数）：安装一个 one-shot shim，在第一次 parse 时进行编译。
  ```ts
  function postProcess(inst: SomeType) {
    if (compiling) return;
    const originalRun = inst._zod.run;
    inst._zod.run = (payload, ctx) => {
      compiling = true;
      try {
        const compiled = compile(inst);
        inst._zod.run = compiled._zod.run; // overwrite self
      } finally {
        compiling = false;
      }
      return inst._zod.run(payload, ctx);
    };
  }
  ```
- [ ] 添加重入保护（`compiling` flag），并通过测试验证：即使启用了全局模式，`z.compile(z.object({ a: z.string() }))` 也不会无限循环。
- [ ] 确保 `import "zod/compile"` 具有幂等性——重复导入不会安装两次后处理器（第二次赋值是 no-op，这没问题；只需验证）。

**测试范围：**

- 添加 `compile-global.test.ts`：导入子路径，构造 schema，执行 parse，并验证输出与未编译版本一致。关键是测试文件需要隔离（使用独立的 vitest worker），因为它会修改全局状态。
- Bundle 大小合理性测试：创建一个只导入 `zod` 的 fixture script，以及一个导入 `zod` + `zod/compile` 的 fixture script。构建产物大小应因 compile.ts 的体积而有所不同，并使用容差断言锁定结果。

## 阶段 4 — 来自 main 差异审计的待修复 bug

这些问题来自此前的审查，目前尚未修复：

- [ ] **Record key schema transforms**（#5891）。有两个选择：（a）检测 key schema 上的任意 check/transform，并完全跳过该 record 的快速路径（最简单，但最慢）；（b）对于已知 key，在编译时对 key schema 执行一次，并发出经过转换的 output key（为带 transforms 的 enum/literal keys 保留快速路径）。建议对 enum/literal key schemas 采用（b），其他情况采用（a）。
- [ ] **Record symbol keys**（#5719）。Compile 使用 `for...in`，只会遍历 enumerable string keys。Runtime 使用 `Reflect.ownKeys` 来支持 symbol keys。要么匹配 runtime（使用 `Reflect.ownKeys` + `propertyIsEnumerable` 循环），要么记录该差异。建议匹配 runtime——record 中的 symbol keys 虽然少见，但属于受支持功能。
- [ ] **base64 / base64url** 二次确认。通过 `addConstant` 提升 `util.isValidBase64` / `util.isValidBase64URL`，并在 regex pattern 后作为第二项检查调用。这样可以防止再次出现类似 #5888 的 regex/runtime 漂移。
- [ ] **Discriminated union 优化。** 专用的 `generateDiscriminatedUnionCheck` 会提取 discriminator key value，在提升的 Map 中查找匹配的 branch，并只验证该 branch。如果 discriminator value 缺失或未知，则回退到普通 union traversal。

**测试范围：** 每个修复都添加回归测试，并覆盖差分 matrix。

## 阶段 5 — 收尾 + 发布准备

- [x] 在打开 PR 前，从 WIP 提交中移除 `play.ts` 的修改（它是用户 scratch，不属于该分支）。
- [x] 从编译函数中移除 `.code` 属性（或在 `compile()` 中通过 `{ debug: true }` 选项控制）。它对开发很有用，但会增加生产环境内存占用。
- [x] 验证 `pnpm build` 生成干净的 ESM bundle，并且 `zod/compile` 子路径在 `import` 和 `require` 条件下都能正确解析。
- [x] 运行完整仓库测试套件（`pnpm vitest run`），而不只是 compile 相关测试。
- [x] 运行 `pnpm check:semver` + 其余 prepublish gates。
- [x] 验证 dts emit：克隆 schema 的返回类型 `compile<T>(s: T): T` 应准确保留 `T`，不能发生 widening 或 branding。
- [x] 运行 `packages/bench/compile-*.ts` 中的 benches。确认 schema-wrapper 开销没有显著削弱 headline 8x figure。如果有，则进行 profiling 并降低 wrapper 成本（可能的候选项包括：对 `_zod` 使用 `Object.assign`，以及 wrapper function 相对于直接编译函数的 indirect-call 成本）。
- [x] 用一行说明更新 `AGENTS.md`，指出存在 `z.compile`，且该子路径可以全局启用它。
- [x] 决定 README 文案。可能在“Performance”下添加一个简短 section，包含示例、性能数字和指向 wiki 文档的链接。

## 明确不属于 v1 范围的事项

记录在此，以避免 PR 审查再次讨论这些问题：

- 错误路径的双重 codegen（Allows + Apply）。没有必要；fallback 可以提供一致性。
- backward-direction（encode）快速路径。仅支持 forward。
- 在 CSP / jitless 环境中进行 Compile。明确选择使用 `new Function`。
- 公共 `globalConfig.postProcessor`。内部 API。
- 多个已注册的 post-processors / plugin hooks。仅保留一个 slot。
- 异步支持。在 compile 时抛出错误，这是刻意设计。
- 返回函数的 `compile()`。返回 schema。

## 完成定义

- 五个阶段分别以独立提交（或提交组）落地，不进行会丢失历史的 force-push。
- 差分 harness 在完整 combinator matrix 上通过。
- Bundle-size 测试记录 tree-shaking/API 权衡：除非导入，否则 `zod/compile` 副作用模块会被 tree-shake；但顶层 `z.compile` 会使 namespace imports 下的 `core/compile.ts` 保持可达。
- Benches 确认 schema-wrapper 开销处于个位数百分比，而不是 2x。
- wiki 页面（`wiki/compile.md`）与已发布行为一致。
- 存在简短的 README + AGENTS.md 说明。
- PR 描述链接到 wiki 页面，并列出有意排除在范围之外的内容。

## 强制回退情况（阶段 4 结果）

对于以下 schemas/features，compile pass 会在代码生成时抛出 `ZodCompileUnsupportedError`。全局 shim（以及 `import "zod/compile"`）会捕获该错误，并永久恢复该 schema 的 runtime `_zod.run`。直接调用 `z.compile(schema)` 的用户会看到该错误，不应对这类 schema 进行编译。这些情况不会影响*正确性*——runtime 语义通过构造得到保留。

后续工作可以重新为这些情况添加快速路径 codegen，理想情况下每个 PR 处理一类，并配套专门的 benches。

- **Intersection** — 已完成。左右两侧的 validation 已编译，然后 compiler 提升 runtime `mergeValues` 来执行深层递归 merge。如果 merge 失败，快速路径返回 `INVALID`，runtime fallback 产生规范错误。基准：深度 merge intersection 的 `z.compile().safeParse` 为 **4.78M ops/sec**，runtime 为 **2.56M**（约 **1.9x**）。
- **prefault** — 会将 default value 通过内部 schema 运行（`z.string().trim().prefault("  x  ")` 会 trim 为 `"x"`）。可以通过 codegen 递归地对 default-constant 执行 inner check 来实现。
- **default wrapping transform/pipe** — 当*转换后的* value 为 undefined 时触发 default，而不是当输入为 undefined 时触发。与 prefault 形状相同，需要在 codegen 时进行 hand-off。
- **optional wrapping default** — runtime 会通过 optional wrapper 应用 default。目前如果输入为 undefined，我们会完全跳过 inner。
- **exactOptional** — 顶层 schema、对象属性和 tuple slots 均已完成。顶层会委托给 inner schema，因此 `undefined` 会被拒绝；object codegen 通过由 `fastPathAcceptsAbsence` 驱动的 presence checks，以及考虑 optin/optout 的 output assembly 来处理 optionality；tuple codegen 不再因为 item 是 exactOptional 而强制回退——optout-tail IIFE 分支会吞掉缺失 slot 的 INVALID（truncate），而 inline present 分支会让 inner schema 拒绝显式的 `undefined`。
- **填充缺失 slot 的 Tuple items**（item 的 wrapper chain 内包含 default/prefault）——输出整形规则较为微妙（dense 与 truncated）。带 default 的 tuple 较为少见，因此回退是可以接受的。
- **z.xor** — exclusive-union 要求恰好匹配一个分支；快速路径的 first-match-wins 语义会静默接受多分支匹配。
- **具有自定义 runtime 行为的 String formats** — 已完成。`url`/`httpurl`/URL options 使用导出的 `parseValidURL`，通过 hoisted helper 调用；`base64`、`base64url`、`jwt`、`ipv6`、`cidrv6` 和 `credit_card` 使用 hoisted runtime validators；custom format 会编译 `def.fn`。regex 路径现在受限于一个 allowlist，其中的 formats 的 pattern 必须是完整检查；因此，在 shape-only pattern 之外叠加额外 validation 的 format 不会再仅编译为该 pattern。既不在该列表中的 format 会强制回退。
- **Record key schemas** — 已完成。没有 value set 的 key schema（`z.email()`、`z.string().min(2)`、`z.number()`、template literal、key transform）会编译一次，并在每个 key 上运行，在 strict 和 loose 模式下均如此。bare-`z.string()` shortcut 现在也会排除 string formats（它们位于 def 中，而不是 `checks` 中）以及 coerced keys；此前这两者会被不经检查地接受。剩余的 record 回退情况：`__proto__` key value。
- **Recursive schemas** — 强制回退。包含 cycle 的 subtree 可能在一次 parse 中被重新进入，这是 memoizer 终止带有 reference cycle 的输入的方式；其状态以 parse context 为 key，而生成的 code 没有 context。要解除这一限制，需要将 ctx 和 `memo.alloc` 传入编译后的 containers，此时 `compile()` wrapper 中的 back-edge bail 也可能被移除。

检测位于 `packages/zod/src/v4/core/compile.ts` 中——搜索 `ZodCompileUnsupportedError`。

## 仍待完成的收尾工作（阶段 5）

- **Discriminated-union optimization** — 已完成。专用 discriminator-branch codegen 现在会在通用 xor fallback 之前运行。在一个 3-branch DU case 中，基准优于 arktype。
- **Record key schema transforms** — 对 exhaustive records 已完成。Codegen 现在会遍历已知 key values，每个 key 运行一次 key schema，并使用转换后的 key 作为 output property。已添加差分覆盖。
- **Record symbol keys** — 已完成。Dynamic records 现在使用 `Reflect.ownKeys` + `propertyIsEnumerable`，与 runtime 行为一致。
- **URL/httpurl runtime helper** — 已完成。已提取 `parseValidURL` 并在 compiler 中提升。Helper 基准：URL compiled `.safeParse` 为 **4.04k ops/sec**，runtime zod `.safeParse` 为 **3.58k**。
- **Bench parity** — 运行 `packages/bench/compile-*.ts`，确认 schema-wrapper + force-fallback 开销没有显著削弱 8x figure。
- **Tree-shaking/API 决策** — esbuild bundle fixture 显示：除非存在 `import "zod/compile"`，否则 `packages/zod/src/compile.ts`（全局副作用模块）会被移除；但普通的 `import * as z from "zod"` 会因为公共 namespace 暴露了 `z.compile` 而保留 `packages/zod/src/v4/core/compile.ts`。如果要让 compiler 对 namespace imports 完全可 tree-shake，则 per-schema API 需要从主 namespace 移出（例如改为从 `zod/compile` 导出的 named export），或者接受 `z.compile` 会为了可发现性而牺牲 bundle size。

在此列表编写后完成的收尾工作：

- **Record symbol keys** — 已完成。Dynamic `z.record(z.string(), value)` 现在使用 `Reflect.ownKeys` 加 `propertyIsEnumerable`，并拒绝 enumerable symbol keys，与 runtime 一致。已添加差分覆盖。
- **Required-key presence optimization** — 已完成。`requiresPresenceCheck(schema)`（与 `fastPathAcceptsAbsence` 配合）会控制是否为 required object properties 生成 `key in input` guard：只有当 child 的 value-level fast path 会让缺失 key 以 `undefined` 通过时才生成（例如 `z.undefined()`、`z.any()`、包含 undefined 的 unions）。像 `z.string()` 这样的 typed-leaf schemas 不再承担多余的 presence check。
- **Tuple exactOptional** — 已完成。`generateTupleCheck` 不再针对 exactOptional items 抛出 `ZodCompileUnsupportedError`；现有的 optoutStart-tail IIFE 会处理缺失情况（truncate），而 inline present-branch 会让 inner schema 拒绝显式的 `undefined`。差分测试和 focused tests 覆盖了 mixed required + exactOptional，以及 exactOptional 与 regular optional 在显式 undefined 上的差异。

## 阶段 5 — Runtime islands + catch + IPv6 hoist

已完成。Combinator codegen（`generateObjectCheck`、`generateTupleCheck`、`generateArrayCheck`、`generateRecordCheck` value-side、`generateIntersectionCheck`，以及 object 的 catchall-with-schema 路径）现在通过 `compileChild` 路由每个 child。如果 child 抛出 `ZodCompileUnsupportedError`，则会回滚 doc + ctx state，并改为发出 runtime island——child schema 会被提升为 constant，并在调用时通过 `runtimeRun(schema, value)` 进行 parse。这意味着单个不受支持的 leaf 不再会中止外围 object/tuple/array/record/intersection 的编译。Island 边界处的异步检测采取保守策略：如果 `_zod.run` 返回 Promise，island 会返回 `INVALID`，wrapper 随后回退到 runtime。Union / discriminated-union codegen 特意不添加 islands——first-match-wins 语义依赖于每个 option 的失败是 runtime parser failure，而不是“无法编译该分支”的 sentinel；更简单的行为是让 `ZodCompileUnsupportedError` 向上冒泡，并由全局 shim 为整个 union 安装 runtime fallback。

已添加 `case "catch"`。Inner 会通过 `compileChild` 路由（因此 runtime-island inner 也会获得 catch 行为）。当 inner fast path 返回 `INVALID` 时，会运行提升的 `runtimeCatch(inner, catchValue, value)` helper；该 helper 运行 inner runtime，完成 issues，随后以 `$ZodCatchCtx` 形状的 payload（`{ value, issues: [], error: { issues: finalized }, input }`）调用 `catchValue`。异步 inner 会触发 fallback。对于 `catch`，`fastPathAcceptsAbsence` 返回 true（wrapper 即使面对缺失 key 也始终产生 output）。

IPv6 / CIDRv6 hoisting 已在此前的提交中完成（`isValidIPv6` / `isValidCIDRv6` 从 `core/schemas.ts` 导出，并在 `generateStringCheck` 和 `generateStringFormatCheck` 中通过 `addConstant` 提升）。同一提交还将四个普通 `Error` 抛出重新归类为 `ZodCompileUnsupportedError`。

基准差异（阶段 4 之后 → 本次工作之后，均处于 ±5% 噪声范围内）：

| case | 阶段 4 之后 | 本次工作之后 | 差异 |
| --- | --- | --- | --- |
| simple object | 26.2M | 25.9M | -1.1% |
| nested moltar | 18.8M | 19.2M | +2.1% |
| array of 100 numbers | 8.35M | 8.53M | +2.2% |
| array of 50 objects | 3.94M | 3.82M | -3.0% |
| DU 3-branch | 28.0M | 27.1M | -3.2% |
| intersection | 4.78M | 4.70M | -1.7% |

## 阶段 6 — 发布后的生态系统跟进

在仓库之外跟踪。总结：发布后，将 upstream 编译版本条目添加到公共跨库 benchmark 中，并更新引用 Zod runtime 性能数字的外部文档。
