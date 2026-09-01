# Zod v4 中的可选性

关于 Zod 的解析如何处理“缺失”／`undefined` 输入的参考。反映 `main` 的当前状态。

系统已经积累了几个彼此正交的机制。本文档会给它们命名，说明哪些 schema 会设置什么，并梳理这些棘手的交互。

## TL;DR

两个运行时信号：

| 信号 | 由谁设置 | 被谁消费 | 含义 |
|---|---|---|---|
| `_zod.optin` — `undefined`／`"optional"`／`"defaulted"` | catch、default、prefault、optional、transform | `$ZodObject`、`$ZodTuple`、`$ZodOptional`；以及 JSON Schema emitter，其中 `objectProcessor` 和 `tupleProcessor` 都读取**静态**值——见下文 | 三档阶梯：必需／允许缺失／允许缺失*并替缺失提供值* |
| `_zod.optout === "optional"` | optional、exact-optional、输出侧 default 情况 | `$ZodObject`、`$ZodTuple` | “我的输出可能合法地是 `undefined`；在截短长度／省略 key 时，请将其视为缺失” |

另外还有一个记录用标志：

| 信号 | 由谁设置 | 被谁消费 | 含义 |
|---|---|---|---|
| `payload.aborted` | 带有 issues 的 pipe 阶段、codecs | 下游阶段 | 跳过链中剩余的工作 |

## 这两个维度

可选性有两个彼此独立的轴：

1. **存在性**：这个 key／index 在输入中到底有没有出现？
2. **值有效性**：该位置上的值是否能被 schema 接受？

在 4.4 之前，Zod 把这两者混在了一起：对于对象属性 `a`，解析 `{}` 和解析 `{ a: undefined }` 会走同一条代码路径。属性 schema 对 `undefined` 输入产生什么结果，就会被赋给它。这是不健全的——那些静态上声明“key 是必需的”的 schema，会在运行时无声地接受缺失 key。

#5661 把这两个轴拆开了。`$ZodObject` 和 `$ZodTuple` 现在会先查看 `optin`，决定缺失输入是否*合法*，然后才运行属性 schema。

## `optin`

> “父级容器可以省略这个槽位吗？有没有东西会填充它？”

schema 的 `_zod` 上的静态和运行时声明。共有三档，每一档都严格强于前一档：

| 值 | 含义 |
|---|---|
| `undefined` | 必需。容器不能省略这个槽位。 |
| `"optional"` | 容器可以省略它。不为其提供任何替代值。 |
| `"defaulted"` | 容器可以省略它，**并且**这个 schema 会替代缺失值提供一个值。 |

询问“槽位是否可以缺失”的消费者会测试 `!== undefined`。`$ZodOptional` 会询问更强的问题，测试 `=== "defaulted"`。

这个阶梯是一种恢复：`_zod.optionality?: "optional" | "defaulted"` 在 4.0 之前就存在，后来由于 [#4405](https://github.com/colinhacks/zod/pull/4405) 将单一轴拆分成 `optin`／`optout` 而被附带合并为两个值。丢失的区别曾通过运行时的 `payload.fallback` 标志（[#5939](https://github.com/colinhacks/zod/pull/5939)／[#5941](https://github.com/colinhacks/zod/pull/5941)）得到部分恢复，随后在这里恢复到了 schema 上。

### 谁设置它

| Schema | `optin`（静态） | `optin`（运行时） | 备注 |
|---|---|---|---|
| `$ZodOptional` | `"optional" \| "defaulted"` | inner 的最高档，否则为 `"optional"` | 传播缺失而不是进行替代，因此 defaulted 的 inner 会保留自己的档位 |
| `$ZodExactOptional` | `"optional"` | `"optional"` | 与 optional 相同，但不会在值侧扩大 `undefined` |
| `$ZodNonOptional` | `"optional" \| undefined` | 继承 inner | 只收窄值的*类型* |
| `$ZodDefault` | `"defaulted"` | `"defaulted"` | 硬编码——它会进行替代 |
| `$ZodPrefault` | `"defaulted"` | `"defaulted"` | 硬编码——它会进行替代 |
| `$ZodCatch` | `T["_zod"]["optin"]`（委托给 inner） | inner 的最高档，否则为 `"optional"` | **静态／运行时不一致**——见下文 |
| `$ZodTransform` | 继承（默认为 `undefined`） | `"optional"` | **静态／运行时不一致**——仅为分支、原型 |
| `$ZodPipe` | `def.in._zod.optin`（延迟委托给 in 侧） | 相同 | pipe 的前导位置驱动 optin |
| `$ZodPreprocess` | `B["_zod"]["optin"]`（委托给 inner） | 通过 pipe 继承（in = transform → `"optional"`） | 原型之后没有构造函数体 |
| `$ZodNullable` | `T["_zod"]["optin"]` | 相同 | 透明 |
| `$ZodReadonly` | `T["_zod"]["optin"]` | 相同 | 透明 |
| `$ZodUnion` | 任一 option 声明的最高档 | 相同 | 如果任一项为 `defaulted`，则为 `defaulted`；否则如果任一项为 `optional`，则为 `optional` |
| 其他所有内容（string、number 等） | `undefined` | `undefined` | 默认是必需的 |

### 静态／运行时不一致

有三个 schema 的静态 `optin` 和运行时 `optin` 不同：

- **`$ZodCatch`**：静态上委托给 inner，运行时是 `"optional"`。原因：输入类型仍应显示该 key 是必需的（catch 是一种恢复机制，不是关于存在性的声明），但运行时应接受缺失 key（catch 的替换会覆盖它们）。

- **`$ZodTransform`**：静态上是 undefined（继承），运行时是 `"optional"`。原因：和 catch 相同——transform 的静态输入类型保持必需，但运行时 fn 会拿到出现的任何输入，包括 `undefined`。

- **`$ZodPreprocess`**：通过 pipe 继承，因此静态和运行时都会追踪到 `def.in = $ZodTransform`。静态类型最终会变成 `B["_zod"]["optin"]`，这是因为 `$ZodPreprocessInternals` 上的接口声明（覆盖了 pipe 继承来的类型）。运行时最终是 `"optional"`，因为 pipe 的运行时会委托到 `def.in.optin = transform.optin = "optional"`。

用户可见的结果是：`z.input<typeof z.object({ a: z.preprocess(fn, T) })>` 会把 `a` 显示为必需，但 `parse({})` 会成功。catch 也是同样的技巧。

### 消费者如何读取它

`$ZodObject.handlePropertyResult`（以及与之对应的 JIT 代码生成）：

```ts
const isPresent = key in input;
const isOptionalOut = optout === "optional";   // optin and optout both arrive raw

if (!isPresent && isOptionalOut && optin === "optional") {
  return; // absent slot, middle rung: contribute nothing at all — no issue, no key
}

if (result.issues.length) {
  if (optin !== undefined && isOptionalOut && !isPresent) {
    return; // swallow the issue — schema can't possibly succeed on absent input but is allowed to fail
  }
  final.issues.push(...prefixed);
}

if (!isPresent && optin === undefined) {
  if (!result.issues.length) {
    final.issues.push({ code: "invalid_type", expected: "nonoptional", input: undefined, path: [key] });
  }
  return; // 在缺失 + 必需时绝不赋值
}

if (result.value === undefined) {
  if (isPresent) (final.value as any)[key] = undefined; // 保留显式的 undefined
} else {
  (final.value as any)[key] = result.value;
}
```

前置门控正是保持缺失 key 处于缺失状态的机制。这个阶梯表示，中间档允许缺失，*但不会在原位置提供任何内容*，因此属性 schema 对 `undefined` 产生的任何结果都是臆造出来的；赋值会与 schema 自己的声明相矛盾。`optout` 是门控的另一半：不是 output-optional 的 schema 必须保留这个 key，这就是为什么仅 optional-in 的 `z.string().catch("c")` 仍然会用 `"c"` 填充缺失 key。只有最高档会带着值到达赋值步骤。

单靠包装器无法完成这个判断。`$ZodOptional` 在带值的情况下永远不会命中门控，因为除非 inner 是 `"defaulted"`，否则它会在 `undefined` 上短路；`$ZodExactOptional` 则刻意不会短路，因为委托给 inner 是让它拒绝显式存在的 `undefined` 的唯一方式。由于 `el._zod.run({ value: input[key], issues: [] }, ctx)` 不携带存在性信息，只有 `$ZodObject` 知道其中的区别，因此门控必须位于那里。

`$ZodTuple` 对尾部 tuple 槽位执行相同的操作，此时“省略 key”变成了“截断尾部”。

共有三条解析路径，门控必须出现在全部三条路径中，否则编译模式会产生分歧。解释执行路径是上面的 `handlePropertyResult`；`$ZodObjectJIT` 会针对中间档 key 生成 `if (<key>_present)`，而不是 `if (value !== undefined || <key>_present)`；`z.compile()` 会自行组装输出对象，因此 `compileObject` 使用 `dropsWhenAbsent`——`optin === "optional" && optout === "optional"`——来选择相同的条件，而 tuple compiler 则会截断，而不是运行缺失的中间档项目。

`$ZodOptional`（独立包装器）会读取 *inner 的* `optin`，以决定是否在 `undefined` 输入上短路：

```ts
inst._zod.parse = (payload, ctx) => {
  if (def.innerType._zod.optin === "optional") {
    const input = payload.value;
    const result = def.innerType._zod.run(payload, ctx);
    return handleOptionalResult(result, input);
  }
  if (payload.value === undefined) return payload; // 短路：inner 没有声明自己能处理 undefined，原样返回 undefined
  return def.innerType._zod.run(payload, ctx);
};
```

所以 `optional` 会在 inner 说“我处理缺失”时调用 inner。只有当 inner 对这个问题保持沉默时，它才会短路。

### JSON Schema emitter 读取*静态*值

JSON Schema emitter 也会消费 `optin`，有两个地方：`objectProcessor` 用于处理 `required`，`tupleProcessor` 用于处理 `minItems`。`io: "input"` 描述声明的输入类型，因此上面三个存在分歧的 schema 必须追溯到实际承载可选性的部分。两者都会经过 `json-schema-processors.ts` 中的一个辅助函数：

```ts
function inputOptin(schema: $ZodType): "optional" | undefined {
  const def = schema._zod.def;
  if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) return inputOptin(def.out);
  if (def.type === "catch") return inputOptin(def.innerType);
  return schema._zod.optin;
}
```

直接读取 `_zod.optin` 会构造出一个与运行时解析行为相匹配的 `required` 列表——或 `minItems`——而不是与声明类型相匹配的结果，从而丢弃经过 preprocess 或 catch 的槽位，尽管 `z.input<>` 显示它是必需的。#5003 确定了这一策略——输入 JSON Schema 描述的是你*应该*传入的内容，而不是所有你*可以*传入的内容——随后在 #5939 和 #5941 设置运行时标志后，#6133 恢复了这一策略。

tuple 侧在 #6418 中采取了相同的方式。它的 `minItems` 尾部扫描过去读取运行时标志，因此尾部的 preprocess 槽位会缩短 `minItems`，生成的 schema 既不匹配声明类型，也不匹配解析器：

```ts
z.toJSONSchema(z.tuple([z.string(), z.preprocess((v) => v, z.string())]), { io: "input" });
// before: minItems 1 — but z.input<> is [string, string], and .safeParse(["a"]) rejects
// now:    minItems 2, matching the object equivalent's required: ["a", "b"]
```

输出模式仍会在两个 processor 中直接读取 `optout`——分歧只存在于输入侧。

同样的拆分也适用于输出的*值*，而不仅仅是 required：`isTransforming` 现在会递归穿过 `catch`（#6409），因此 catch 不再向祖先隐藏 inner transform，并且在 `io: "input"` 下会移除输出类型的 `default`。在非 transforming 的 inner 外包裹 catch 时，则会保留其 `default`。这两部分回答的是同一个问题，因此必须以相同的方式回答。

## `optout`

> “即使输入存在，我的输出也可能是 `undefined`，并且父级是否应该把它当成‘缺失’来处理，用于长度截断／key 省略？”

这是与 `optin` 分开的另一个轴。由以下 schema 设置：

| Schema | `optout` |
|---|---|
| `$ZodOptional` | `"optional"` |
| `$ZodExactOptional` | `"optional"` |
| 其他所有内容 | 继承或 `undefined` |

`$ZodObject` 会使用它（结合 `optin` 和 `isPresent`）来决定是赋值还是跳过。`$ZodTuple` 会用它来决定是否裁掉一个值回传为 `undefined` 的尾部槽位。

对用户来说，相关的观察是：一个 schema 可以是**输入必需、输出可选**（某些形状下的 `z.string().nullable()`），也可以是**输入可选、输出必需**（`z.string().default("d")`——接受缺失，但永远不会产出 undefined）。`optin` × `optout` 矩阵有四种组合，它们在对象／tuple 解析里都很重要。

## `$ZodOptional` 如何决定

> “缺失的输入到了。我应该信任 inner，还是产出 `undefined`？”

`$ZodOptional` 只读取阶梯，不读取其他内容：

```ts
inst._zod.parse = (payload, ctx) => {
  if (payload.value === undefined) {
    // Only the top rung substitutes a value for absence; everything else leaves it intact, which is what .optional() means.
    if (def.innerType._zod.optin !== "defaulted") return payload;
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) return result.then(handleOptionalResult);
    return handleOptionalResult(result);
  }
  return def.innerType._zod.run(payload, ctx);
};
```

有两个后果值得说明：

- 一个不会进行替代的 inner 在输入缺失时**完全不会运行**。以前它会运行，但其输出会被丢弃，因此有副作用的 `preprocess` fn 每次解析缺失值时都会触发一次；现在它会触发零次。结果相同，但副作用更少。
- `handleOptionalResult` 只需要吞掉 issues。一个会进行替代、但随后仍然失败的 schema（例如 inner 拒绝某个 `prefault` 值）没有可用答案，因此会产出 `undefined`。

### 不存在 payload 标志

以前有一个。`payload.fallback` 曾由 `$ZodCatch` 在替代时设置，也由 `$ZodTransform` 在每次调用时设置，再由 `handlePipeResult` 手动传播，并由 `handleOptionalResult` 读取。它的存在是为了撤销一个错误结论：`$ZodTransform` 和 `$ZodCatch` 声明 `optin = "optional"`，因此对象解析器会在缺失 key 上运行它们，这让 `$ZodOptional` 误以为它们已经回答了缺失问题。

这个阶梯移除了错误结论，而不是撤销它，因此该标志已经消失。记录一下，它在此过程中有两点错误：

- 它会泄漏。`$ZodPipe` 必须显式复制它（[#5941](https://github.com/colinhacks/zod/pull/5941) 的第一个提交就是修复这一点），而 `$ZodUnion` 根本没有将它复制到自己的 options 中。
- 当 transform 和 optional 之间有一个 `.default()` 时，为每次 transform 调用都设置该标志是不健全的：门控检查的是 *optional* 的输入，而 transform 接收到的是*替代后的*值。这就是 [#6321](https://github.com/colinhacks/zod/issues/6321)。

## 什么是 `respect` 和 `clobber`？

当 `optional` 收到 `undefined` 时，问题是：它返回 inner 产生的任何内容（respect），还是产出 `undefined`（clobber）？

规则就是这个阶梯：

```
inner optin === "defaulted"  →  respect (run it, use its value)
otherwise                    →  clobber (yield undefined, don't run it)
```

所以：

| Inner schema | `optin` | result |
|---|---|---|
| `default` fired, `prefault` filled | `"defaulted"` | **respect**——返回 inner 值 |
| recovery substitution（catch 包裹一个不进行替代的 inner） | `"optional"` | **clobber**——返回 undefined |
| transform 的输出（preprocess、独立 transform） | `"optional"` | **clobber**——返回 undefined |
| 普通必需 schema | `undefined` | **clobber**——返回 undefined |
| 进行替代后仍然失败的 schema | `"defaulted"` | **clobber**（吞掉 issues）——返回 undefined |

### 为什么 default 和 prefault 不会被覆盖

它们是唯一真正*回答*缺失问题的 schema。`default` 会在输入为 undefined 时、运行 inner 之前短路，并返回 `def.defaultValue`；`prefault` 会将其值替换到输入中，然后运行 inner。两者都会产生一个有意提供的值，而不是偶然产生的值，这正是最高档所记录的内容。

### 为什么 catch 会被覆盖

Catch 只会在其 inner 产生 *issues* 时触发。对于 `undefined` 输入，inner 失败的原因是它不接受 `undefined`，而不是用户想要替代值。因此 catch 不会自行声明最高档——它会传递 inner 所声明的内容，这意味着 `z.string().default("D").catch("C")` 确实是 `"defaulted"`，并且会被尊重。

### 为什么 transform 会被覆盖

对于 preprocess，用户的 fn 之所以会在 `undefined` 上运行，只是因为外层 schema 调用了它。用户的意图是“转换出现的任何内容”，但他们还写了 `.optional()` 来表达“缺失输入 → 缺失输出”。Transform 从不声明最高档，因此 `.optional()` 胜出——并且在这个阶梯下，它胜出时*不会运行* fn。

注意这个组合：位于 default 下游的 transform 会通过 pipe 的 `def.in` 继承 `"defaulted"`，因此 `z.string().default("").transform(fn)` 会被尊重，而 `z.preprocess(fn, T)` 不会。这就是 [#6321](https://github.com/colinhacks/zod/issues/6321)，现在通过结构性方式修复，而不是检查 transform 的输入。

## 浏览这些案例

具体形状及其求值结果。

```ts
// === Catch ===

z.string().catch("c").parse(undefined)
// → "c"  (catch fires on string(undefined) failure; nothing outer to override it)

z.string().catch("c").parse(123)
// → "c"  （catch 在 string(123) 失败时触发）

z.string().catch("c").optional().parse(undefined)
// → undefined  (catch.optin = "optional", not "defaulted", so optional yields undefined without running it)

z.string().catch("c").optional().parse("hi")
// → "hi"  (input defined, so optional just runs the inner)

z.string().catch("c").transform((s) => s + "!").optional().parse(undefined)
// → undefined  (pipe.optin = catch.optin = "optional"; optional yields undefined)

z.object({ a: z.string().catch("c") }).parse({})
// → { a: "c" }  （catch.optin = "optional" 运行时；obj 以 undefined 调用 catch；catch 触发）

z.object({ a: z.string().catch("c") }).parse({ a: undefined })
// → { a: "c" }  （键存在但值为 undefined；catch 在 string(undefined) 上触发）

z.object({ a: z.string().catch("c").optional() }).parse({})
// → {}  (key absent; optional sees optin = "optional", not "defaulted", so yields undefined; obj omits)

// === Default ===

z.string().default("d").parse(undefined)
// → "d"  （default 在 undef 输入上短路，直接返回 d）

z.string().default("d").optional().parse(undefined)
// → "d"  (default.optin = "defaulted"; optional runs it and respects the result)

z.object({ a: z.string().default("d") }).parse({})
// → { a: "d" }  (obj asks optin !== undefined; invokes default; short-circuits to d)

// === Prefault ===

z.string().prefault("p").parse(undefined)
// → "p"  （prefault 替换输入，运行内部的 string("p")，其成功）

z.string().prefault("p").optional().parse(undefined)
// → "p"  (prefault.optin = "defaulted" — it answers the absence, so optional respects it)

// === Preprocess ===

z.preprocess((v) => v ?? "X", z.string()).parse(undefined)
// → "X"  （preprocess 函数产生 "X"，内部 string 接受）

z.preprocess((v) => v ?? "X", z.string()).optional().parse(undefined)
// → undefined  (pipe.optin = transform.optin = "optional"; optional yields undefined, fn never runs)

z.object({ a: z.preprocess((v) => v ?? "X", z.string()) }).parse({})
// → { a: "X" }  (preprocess.optin = "optional" via transform; obj invokes; fn runs)

z.object({ a: z.preprocess((v) => v ?? "X", z.string()).optional() }).parse({})
// → {}  (optional sees "optional", not "defaulted"; yields undefined without running the fn; obj omits)

z.object({ a: z.preprocess((v) => v, z.string().optional()) }).parse({})
// → {}  （内部 optional 的 preprocess；#5917/#5929 路径）

// === Default feeding a transform (the #6321 shape) ===

z.string().default("").transform((v) => (v ? v.split(",") : [])).optional().parse(undefined)
// → []  (pipe.optin = def.in.optin = default.optin = "defaulted"; optional runs it and respects)
//   4.4.3-4.4.x: was undefined, because transform flagged every invocation as a fallback

z.object({ a: z.string().default("").transform((v) => v.length) }).partial().parse({})
// → { a: 0 }  (.partial() wraps in optional; the top rung carries through the pipe)

// === Transform ===

z.string().transform((s) => s + "!").parse("hi")
// → "hi!"

z.string().transform((s) => s + "!").parse(undefined)
// → THROW  （string 在 transform 运行前拒绝 undef）

z.transform((v) => v ?? "X").parse(undefined)
// → "X"  （transform 函数在 undef 上运行，返回 "X"）

z.transform((v) => v ?? "X").optional().parse(undefined)
// → undefined  (transform.optin = "optional"; optional yields undefined, fn never runs)

z.object({ a: z.transform((v) => v ?? "X") }).parse({})
// → { a: "X" }  （transform.optin = "optional" 运行时；obj 以 undef 调用 transform）

z.object({ a: z.string().transform((s) => s + "!") }).parse({})
// → THROW  （pipe.optin = string.optin = undefined —— OUT 侧的 transform 不会驱动 optin）

z.object({ a: z.unknown().transform((v) => String(v ?? "X")).pipe(z.string()) }).parse({})
// → THROW  （outer pipe.optin = inner pipe.optin = unknown.optin = undefined —— transform 在
//   内层 pipe 的 OUT 侧，而内层 pipe 位于外层 pipe 的 IN 侧；前导的
//   `z.unknown()` 驱动 optin，而它不是 "optional"）
//
//   对比 z.preprocess(fn, T):
//     z.preprocess(fn, T) === pipe(transform(fn), T)         — transform 是唯一 pipe 的 def.in
//     z.unknown().transform(fn).pipe(T) === pipe(pipe(unknown, transform), T)  — 这里有一个
//                                                                                内层 pipe，
//                                                                                且 z.unknown()
//                                                                                位于 in 侧
//
//   Preprocess 之所以接受缺失，是因为它的前导位置就是 transform 本身。
//   unknown.transform.pipe(T) 这种形状则不行，因为它的前导位置是 z.unknown()。
//   如果你想要类似 preprocess 的缺失处理，请用 z.preprocess；如果你明确想要
//   在前导槽位上获得严格的输入类型，则 unknown.transform.pipe 这种形状可以做到这一点。

// === Coerce / unknown / any（在缺失时故意保持严格）===

z.object({ a: z.coerce.string() }).parse({})
// → THROW  （coerce.string.optin = undefined；object 拒绝缺失键）

z.object({ a: z.unknown() }).parse({})
// → THROW  （unknown.optin = undefined；来自 4.4 的健全性修复）

z.object({ a: z.any() }).parse({})
// → THROW  （同上）

// === exactOptional (delegates instead of short-circuiting) ===

z.object({ a: z.coerce.string().exactOptional() }).parse({})
// → {}  (absent + middle rung: the object drops what coerce made of undefined)

z.object({ a: z.coerce.string().exactOptional() }).parse({ a: undefined })
// → { a: "undefined" }  (present: the inner runs and its answer stands)

z.object({ a: z.string().exactOptional() }).parse({ a: undefined })
// → THROW  (present: string rejects undefined, and the object surfaces it)

z.object({ a: z.string().default("x").exactOptional() }).parse({})
// → { a: "x" }  (top rung substitutes, so the gate doesn't fire)

z.tuple([z.string(), z.coerce.string().exactOptional()]).parse(["x"])
// → ["x"]  (the tuple analog: truncate rather than materialize)

// === Static type vs runtime divergence ===

z.input<typeof z.object({ a: z.string().catch("c") })>
// → { a: string }   — 类型层面上 `a` 是必需的

z.object({ a: z.string().catch("c") }).parse({})
// → { a: "c" }      — 但运行时接受 {}

z.input<typeof z.object({ a: z.preprocess(fn, T) })>
// → { a: <transform's input type> }   — 类型层面上 `a` 是必需的

z.object({ a: z.preprocess(fn, T) }).parse({})
// → { a: fn(undefined) }   — 运行时接受 {}
```

## 元组

`$ZodTuple` 对尾部位置的逻辑与 `$ZodObject` 保持一致。相同的 `optin`／`optout` 标志决定缺失的尾部槽位是否合法，以及是用显式 `undefined` 填充还是裁剪。

元组中与 `handlePropertyResult` 在结构上完全一致的辅助函数是 `handleTupleResult`。相同的门控逻辑，相同的标志读取。

## 公共 API 的绕过方式是什么样的

如果你在某种我们刻意保持严格的 schema 类型上遇到了缺失键拒绝（coerce、unknown、原始的 transform-on-the-out-side 等），答案就是显式声明缺失：

```ts
// 想让 coerce 允许缺失？包一层 optional：
z.object({ a: z.coerce.string().optional() }).parse({})
// → {}

// 想让缺失映射到默认值？
z.object({ a: z.coerce.string().default("x") }).parse({})
// → { a: "x" }

// 想让 preprocess 在缺失的、内部必需的 schema 上触发？使用内部 optional：
z.object({ a: z.preprocess(fn, z.string().optional()) }).parse({})
// → {}  （或者 { a: fn(undefined) }，如果 fn 返回了一个已定义值——取决于 optional）
```

## 历史与动机

| PR | 内容 |
|---|---|
| [#5661](https://github.com/colinhacks/zod/pull/5661) | 让 `$ZodObject`／`$ZodTuple` 对缺失槽位严格处理——查询 `optin`。这是 4.4 回归问题的来源。 |
| [#5917](https://github.com/colinhacks/zod/pull/5917)／[#5929](https://github.com/colinhacks/zod/pull/5929) | 让 preprocess 将可选性委托给 inner schema（从而使 `preprocess(fn, X.optional())` 再次正常工作）。纯粹的元数据覆盖子类型设计。 |
| [#5937](https://github.com/colinhacks/zod/issues/5937)／[#5939](https://github.com/colinhacks/zod/pull/5939) | 恢复 `$ZodCatch.optin = "optional"` 运行时行为，并引入 `caught` 标志，使外层 `$ZodOptional` 能覆盖 catch 的恢复值。 |
| [#4405](https://github.com/colinhacks/zod/pull/4405) | 将 `_zod.optionality` 拆分为 `optin`／`optout`。作为附带影响，将旧的 `"optional" \| "defaulted"` 阶梯合并为两个值——下面恢复了这一差别。在 4.0 之前，因此没有任何内容依赖它。 |
| [#5941](https://github.com/colinhacks/zod/pull/5941) | 将 `caught → fallback` 重命名；穿过 `$ZodPipe` 边界传播；同时让 `$ZodPreprocess.optin = "optional"`，并让 `$ZodTransform` 在每次调用时设置 `fallback`。恢复裸 `preprocess` 的回归行为。 |
| [#6321](https://github.com/colinhacks/zod/issues/6321)／[#6419](https://github.com/colinhacks/zod/pull/6419) | 当 transform 和外层 optional 之间存在 `.default()` 时，“在每次 transform 调用时设置”并不健全。恢复第三档（`optin = "defaulted"`），并彻底废弃 `payload.fallback`。 |

## 设计原则：灵活输入，严格输出（在运行时）

静态／运行时分歧模式并非偶然——它体现了一种有意的理念：

- **静态类型保持严格。** `z.input<typeof schemaWithCatch>` 在类型中显示该字段是必需的。`z.input<typeof schemaWithPreprocess>` 也显示它是必需的。编写 TypeScript 的用户看到的是一份契约：你必须提供这个键。

- **运行时更灵活。** Catch 处理失败，包括内部 schema 无法接受 `undefined` 的失败。Preprocess 和 transform 会对出现的任何输入运行它们的函数，包括 `undefined`。运行时比类型更宽松。

从技术上讲，这并不健全——运行时接受了类型拒绝的输入——但这符合用户对这些原语的*预期*。`.catch(default)` 读起来像“当事情出错时给我这个值，包括输入缺失时”。`z.preprocess(fn, T)` 读起来像“对我拿到的任何东西都运行这个函数，包括缺失值”。把静态类型视为更严格的契约，而运行时更宽容，这是从易用性角度做出的选择。

那些在运行时仍然保持严格的输入 schema——`coerce`、`unknown`、`any`、普通的 `string`／`number`／等等——并没有用户编写的逃逸口。没有理由让它们声称自己能处理缺失；它们应该拒绝，并让用户显式选择是否启用。所以规则是：**带有用户编写逃逸口的 schema（catch 的恢复、transform 的函数）在运行时接受 `undefined`；没有逃逸口的则不接受。**

`optin` 阶梯使其能够安全地与 `optional` 组合：逃逸口会获得 `"optional"`（允许缺失），但不会获得 `"defaulted"`（已回答缺失），因此当外层包装器*也*对缺失输入有自己的判断时，用户显式写出的 `.optional()` 会获胜。Default 和 prefault 会声明最高档，因为它们的值*就是*有意提供的输出，而不是逃逸口产生的输出。

## 心智模型（一段话）

一个 schema 的 `optin` 是三档阶梯：`undefined`（必需）、`"optional"`（允许缺失）、`"defaulted"`（允许缺失*并且*进行替代）。Object 和 tuple 解析器会先提出较弱的问题——`!== undefined`——然后再运行槽位。Default 和 prefault 声明最高档；optional、catch、transform 和 preprocess 只声明 `"optional"`；透明包装器和 pipe 的输入侧会传递它们所包装内容的值，这就是 `z.string().default("D").transform(fn)` 能保持 `"defaulted"` 的原因。

当 `optional` 收到 `undefined` 时，它会提出较强的问题——`=== "defaulted"`——只有当下层确实有内容回答缺失问题时，才会运行 inner。否则它会在不运行任何内容的情况下产出 `undefined`。不存在 payload 标志：答案是 schema 形状的属性，因此不需要传播，也不可能在 combinator 边界处丢失。

对于其他所有情况——`coerce`、`string`、`unknown`、`any`、`transform.pipe` 这类 transform 位于 OUT 侧的形状——`optin` 都保持为 `undefined`。Object 和 tuple 解析器会拒绝缺失输入。用户在希望接受缺失时，需要通过 `.optional()` 或 `.default(...)` 显式选择。
