# Zod v4 中的可选性

关于 Zod 的解析如何处理“缺失”/“undefined”输入的内部参考。反映了 `main` 的当前状态以及正在进行中的分支 `fix-fallback-flag-and-preprocess`。

系统已经积累了几个彼此正交的机制。本文档会给它们命名，说明哪些 schema 会设置什么，并梳理这些棘手的交互。

## TL;DR

三个运行时信号，每个只有一个消费者：

| 信号 | 由谁设置 | 被谁消费 | 含义 |
|---|---|---|---|
| `_zod.optin === "optional"` | catch、default、prefault、optional、transform | `$ZodObject`、`$ZodTuple`、`$ZodOptional` | “我接受缺失输入” |
| `_zod.optout === "optional"` | optional、exact-optional、输出端 default 的情况 | `$ZodObject`、`$ZodTuple` | “我的输出在语义上可能是 `undefined`；在长度截断 / 键省略时把它当作缺失” |
| `payload.fallback === true` | catch（当 `catchValue` 进行替换时）、transform | `$ZodOptional`（在 `handleOptionalResult` 中） | “这个值只是暂定的；外层包装器在 `undefined` 输入时可能会覆盖它” |

另外还有一个记账标志：

| 信号 | 由谁设置 | 被谁消费 | 含义 |
|---|---|---|---|
| `payload.aborted` | 带有 issues 的 pipe 阶段、codecs | 下游阶段 | 跳过链中的剩余工作 |

## 这两个维度

可选性有两个彼此独立的轴：

1. **存在性**：这个 key/index 在输入中到底有没有出现？
2. **值有效性**：该位置上的值是否能被 schema 接受？

在 4.4 之前，Zod 把这两者混在了一起：对于对象属性 `a`，解析 `{}` 和解析 `{ a: undefined }` 会走同一条代码路径。属性 schema 对 `undefined` 输入产生什么结果，就会被赋给它。这是不健全的——那些静态上声明“key 是必需的”的 schema，会在运行时无声地接受缺失 key。

#5661 把这两个轴拆开了。`$ZodObject` 和 `$ZodTuple` 现在会先查看 `optin`，决定缺失输入是否*合法*，然后才运行属性 schema。

## `optin`

> “父容器能否省略这个槽位？”

这是 schema 的 `_zod` 上一个静态兼运行时的声明。可能的值：`"optional"` 或 `undefined`。

### 谁设置它

| Schema | `optin`（静态） | `optin`（运行时） | 备注 |
|---|---|---|---|
| `$ZodOptional` | `"optional"` | `"optional"` | 写死的——这就是它的目的 |
| `$ZodExactOptional` | `"optional"` | `"optional"` | 与 optional 一样，但不会在值侧放宽为 undefined |
| `$ZodNonOptional` | `"optional" \| undefined` | 继承 inner | 只收窄值的 *类型* |
| `$ZodDefault` | `"optional"` | `"optional"` | 写死的 |
| `$ZodPrefault` | `"optional"` | `"optional"` | 写死的 |
| `$ZodCatch` | `T["_zod"]["optin"]`（委托给 inner） | `"optional"` | **静态/运行时不一致**——见下文 |
| `$ZodTransform` | 继承（默认 `undefined`） | `"optional"` | **静态/运行时不一致**——分支专用、原型性质 |
| `$ZodPipe` | `def.in._zod.optin`（延迟委托给 in 端） | 相同 | pipe 的前置位置决定 optin |
| `$ZodPreprocess` | `B["_zod"]["optin"]`（委托给 inner） | 通过 pipe 继承（in = transform → `"optional"`） | 在原型之后，没有构造函数主体 |
| `$ZodNullable` | `T["_zod"]["optin"]` | 相同 | 透明 |
| `$ZodReadonly` | `T["_zod"]["optin"]` | 相同 | 透明 |
| 其他所有内容（string、number 等） | `undefined` | `undefined` | 默认必需 |

### 静态/运行时不一致

有三个 schema 的静态 `optin` 和运行时 `optin` 不同：

- **`$ZodCatch`**：静态上委托给 inner，运行时是 `"optional"`。原因：输入类型仍应显示该 key 是必需的（catch 是一种恢复机制，不是关于存在性的声明），但运行时应接受缺失 key（catch 的替换会覆盖它们）。

- **`$ZodTransform`**：静态上是 undefined（继承），运行时是 `"optional"`。原因：和 catch 相同——transform 的静态输入类型保持必需，但运行时 fn 会拿到出现的任何输入，包括 `undefined`。

- **`$ZodPreprocess`**：通过 pipe 继承，因此静态和运行时都会追踪到 `def.in = $ZodTransform`。静态类型最终会变成 `B["_zod"]["optin"]`，这是因为 `$ZodPreprocessInternals` 上的接口声明（覆盖了 pipe 继承来的类型）。运行时最终是 `"optional"`，因为 pipe 的运行时会委托到 `def.in.optin = transform.optin = "optional"`。

用户可见的结果是：`z.input<typeof z.object({ a: z.preprocess(fn, T) })>` 会把 `a` 显示为必需，但 `parse({})` 会成功。catch 也是同样的技巧。

### 消费者如何读取它

`$ZodObject.handlePropertyResult`（以及与之对应的 JIT 代码生成）：

```ts
const isPresent = key in input;
const isOptionalIn = propSchema._zod.optin === "optional";

if (result.issues.length) {
  if (isOptionalIn && isOptionalOut && !isPresent) {
    return; // 吞掉这个问题——schema 在缺失输入上不可能成功，但允许失败
  }
  final.issues.push(...prefixed);
}

if (!isPresent && !isOptionalIn) {
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

`$ZodTuple` 对尾部的 tuple 槽位做类似处理。

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

## `optout`

> “即使输入存在，我的输出也可能是 `undefined`，并且父级是否应该把它当成‘缺失’来处理，用于长度截断 / key 省略？”

这是与 `optin` 分开的另一个轴。由以下 schema 设置：

| Schema | `optout` |
|---|---|
| `$ZodOptional` | `"optional"` |
| `$ZodExactOptional` | `"optional"` |
| 其他所有内容 | 继承或 `undefined` |

`$ZodObject` 会使用它（结合 `optin` 和 `isPresent`）来决定是赋值还是跳过。`$ZodTuple` 会用它来决定是否裁掉一个值回传为 `undefined` 的尾部槽位。

对用户来说，相关的观察是：一个 schema 可以是**输入必需、输出可选**（某些形状下的 `z.string().nullable()`），也可以是**输入可选、输出必需**（`z.string().default("d")` —— 接受缺失，但永远不会产出 undefined）。`optin` × `optout` 矩阵有四种组合，它们在对象/tuple 解析里都很重要。

## `fallback`

> “当输入为 `undefined` 时，外层包装器可以用自己的解释覆盖这个值。”

一个*仅运行时*的 payload 标志。存在于 `ParsePayload` 上：

```ts
interface ParsePayload<T> {
  value: T;
  issues: $ZodRawIssue[];
  aborted?: boolean;
  fallback?: boolean | undefined;
}
```

### 谁设置它

| Schema | 何时 | 原因 |
|---|---|---|
| `$ZodCatch` | 当 `catchValue` 进行替换时（即 inner schema 产生了 issues） | 替换值是一种恢复，而不是有意的输出；外层 optional 应该可以覆盖它 |
| `$ZodTransform` | 每次 fn 调用时（同步和异步路径，core 和 classic 构造函数都包括） | transform 的输出只是暂定的——尤其对于 `undefined` 输入，外层 optional 应把 transform 的输出视为“输入缺失时我们得到的结果”，并将其替换为 `undefined` |

### 谁读取它

只有 `$ZodOptional`，在 `handleOptionalResult` 中：

```ts
function handleOptionalResult(result: ParsePayload, input: unknown) {
  if (input === undefined && (result.issues.length || result.fallback)) {
    return { issues: [], value: undefined };
  }
  return result;
}
```

翻译过来就是：“如果 optional 的*原始*输入是 `undefined`，并且 inner 要么失败了，要么产生了一个 fallback 值，那就覆盖为 `undefined`。”

`input === undefined` 这个门槛至关重要：当输入是一个已定义值时，inner 的输出才是*真正的*输出（例如一次成功的 transform 运行），不是 fallback，即使这个标志碰巧被设置了也一样。这正是“在 transform 上总是设置该标志”之所以安全的原因——已定义输入的 transform 会带着这个标志，但它从不会被读取。

### pipe 的传播

`handlePipeResult` 会为 pipe 的右侧构建一个新的 payload：

```ts
return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
```

`fallback` 的传播就是 #5941 修复的内容。在那之前，任何形如 `catch().transform()...optional()` 的链都会在 `.transform()` 引入的隐式 pipe 边界处丢失这个标志，而 `optional` 就无法看出 inner 已经恢复了。

## 什么是 `respect` 和 `clobber`？

当 `optional` 包裹了一个在 `undefined` 输入上产生*某种*值的 schema 时，问题在于：包装器应该返回 inner 的值（respect），还是覆盖为 `undefined`（clobber）？

这个规则在 `handleOptionalResult` 中表达为：

```
输入是 undefined 且（有 issues 或 fallback） → clobber
否则                                         → respect
```

所以：

| Inner schema 产生了... | issues？ | fallback？ | 结果 |
|---|---|---|---|
| 通过正常路径得到的有效值（default 触发，prefault 填充） | 否 | 否 | **respect** —— 返回 inner 值 |
| 恢复替换（catch 触发） | 否（已清除） | 是 | **clobber** —— 返回 undefined |
| transform 的输出（preprocess、独立 transform、任何在输入侧带 transform fn 的东西） | 否 | 是 | **clobber** —— 返回 undefined |
| 校验失败但没有恢复 | 是 | 否 | **clobber**（issues 被吞掉）—— 返回 undefined |

### 为什么 default 和 prefault 不会被覆盖

default 和 prefault 都在运行时把 `optin = "optional"`，所以 `optional` 会调用它们。但它们不会设置 `fallback`。`default` 会在 `undefined` 输入上于运行 inner 之前直接短路——它是一个显式的缺失处理器，直接返回 `def.defaultValue`。`prefault` 则是在运行 inner 之前把 prefault 值替换进输入里。两者产生的都是“有意的值”，而不是“恢复值”——这就是为什么 `optional` 会尊重它们。

### 为什么 catch 会被覆盖

catch 会运行 inner，并且只在 inner 产生 *issues* 时才触发。替换是反应式的——“我正在从失败中恢复。”在 `undefined` 输入上，inner 失败是因为 inner 不接受 `undefined`，而不是因为用户真的想要“替换值”。optional 说：`“用户写了 .optional()，所以在 undefined 输入上，他们想要的是 undefined，而不是你的恢复值。”`

### 为什么 transform 会被覆盖

对于 preprocess，用户的 fn 会在 `undefined` 上运行，因为是*外层* schema 调用了它（对象接受一个缺失的 key，或者 optional 因为 `optin === "optional"` 而调用 inner）。用户的意图是“转换出现的任何输入”，但他们也把它包在 `.optional()` 里，表示“缺失输入 → 缺失输出”。`fallback` 让 `.optional()` 能尊重这一点。

独立的 transform（比较少见）也会因为同样被标记而得到相同的处理。

## 浏览这些案例

具体的形状以及它们的求值结果。星号标记的是依赖于当前分支的行为。

```ts
// === Catch ===

z.string().catch("c").parse(undefined)
// → "c"  （catch 在 string(undefined) 失败时触发，设置了 fallback，没有外层读取它）

z.string().catch("c").parse(123)
// → "c"  （catch 在 string(123) 失败时触发）

z.string().catch("c").optional().parse(undefined)
// → undefined  （catch 触发，fallback=true；handleOptionalResult 在 undef 输入上覆盖了它）

z.string().catch("c").optional().parse("hi")
// → "hi"  （catch 不触发，没有 fallback）

z.string().catch("c").transform((s) => s + "!").optional().parse(undefined)
// → undefined  （catch 触发，fallback 通过 pipe 传播，optional 覆盖）
//   pre-#5941: 之前是 "c!"，因为 fallback 在 pipe 边界被丢弃了

z.object({ a: z.string().catch("c") }).parse({})
// → { a: "c" }  （catch.optin = "optional" 运行时；obj 以 undefined 调用 catch；catch 触发）

z.object({ a: z.string().catch("c") }).parse({ a: undefined })
// → { a: "c" }  （键存在但值为 undefined；catch 在 string(undefined) 上触发）

z.object({ a: z.string().catch("c").optional() }).parse({})
// → {}  （键缺失；optional 通过 fallback 标志覆盖了恢复值）

// === Default ===

z.string().default("d").parse(undefined)
// → "d"  （default 在 undef 输入上短路，直接返回 d）

z.string().default("d").optional().parse(undefined)
// → "d"  （optional 调用 default；default 返回 d；没有设置 fallback；optional 会尊重它）

z.object({ a: z.string().default("d") }).parse({})
// → { a: "d" }  （default.optin = "optional"；obj 调用 default；短路为 d）

// === Prefault ===

z.string().prefault("p").parse(undefined)
// → "p"  （prefault 替换输入，运行内部的 string("p")，其成功）

z.string().prefault("p").optional().parse(undefined)
// → "p"  （prefault 不设置 fallback——它是缺失处理器，不是恢复处理器）

// === Preprocess ===*

z.preprocess((v) => v ?? "X", z.string()).parse(undefined)
// → "X"  （preprocess 函数产生 "X"，内部 string 接受）

z.preprocess((v) => v ?? "X", z.string()).optional().parse(undefined)
// → undefined  （transform 设置 fallback；optional 覆盖 undef 输入）

z.object({ a: z.preprocess((v) => v ?? "X", z.string()) }).parse({})
// → { a: "X" }  （preprocess.optin = "optional" 通过 transform；obj 调用它；函数运行）
//   pre-branch: FAIL（#5661 之后的 4.4 回归使 obj parser 变为严格）

z.object({ a: z.preprocess((v) => v ?? "X", z.string()).optional() }).parse({})
// → {}  （optional 调用 preprocess；函数运行；fallback=true；optional 覆盖；obj 省略）

z.object({ a: z.preprocess((v) => v, z.string().optional()) }).parse({})
// → {}  （内部 optional 的 preprocess；#5917/#5929 路径）

// === Transform ===

z.string().transform((s) => s + "!").parse("hi")
// → "hi!"

z.string().transform((s) => s + "!").parse(undefined)
// → THROW  （string 在 transform 运行前拒绝 undef）

z.transform((v) => v ?? "X").parse(undefined)
// → "X"  （transform 函数在 undef 上运行，返回 "X"）

z.transform((v) => v ?? "X").optional().parse(undefined)
// → undefined  （optional 调用 transform；函数运行；fallback=true；覆盖）

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

// === 静态类型 vs 运行时分歧 ===

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

`$ZodTuple` 对尾部位置的逻辑与 `$ZodObject` 保持一致。相同的 `optin` / `optout` 标志决定缺失的尾部槽位是否合法，以及是用显式 `undefined` 填充还是裁剪。

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
| [#5661](https://github.com/colinhacks/zod/pull/5661) | 让 `$ZodObject` / `$ZodTuple` 对缺失槽位保持严格——检查 `optin`。是 4.4 回归的源头。 |
| [#5917](https://github.com/colinhacks/zod/pull/5917) / [#5929](https://github.com/colinhacks/zod/pull/5929) | 让 preprocess 将可选性推迟给内部 schema（因此 `preprocess(fn, X.optional())` 又能工作了）。纯元数据覆盖的子类型设计。 |
| [#5937](https://github.com/colinhacks/zod/issues/5937) / [#5939](https://github.com/colinhacks/zod/pull/5939) | 恢复 `$ZodCatch.optin = "optional"` 的运行时行为 + 引入 `caught` 标志，使外层 `$ZodOptional` 可以覆盖 catch 的恢复值。 |
| [#5941](https://github.com/colinhacks/zod/pull/5941) | 将 `caught → fallback` 重命名；通过 `$ZodPipe` 边界传播；还让 `$ZodPreprocess.optin = "optional"`，并让 `$ZodTransform` 在每次调用时设置 `fallback`。恢复 bare-`preprocess` 的回归。**另外**还有一个原型提交，推动将 `optin = "optional"` 从 preprocess 提升到 transform（仍在考虑中）。 |

## 设计原则：灵活输入，严格输出（在运行时）

静态/运行时分歧模式并非偶然——它体现了一种有意的理念：

- **静态类型保持严格。** `z.input<typeof schemaWithCatch>` 在类型中显示该字段是必需的。`z.input<typeof schemaWithPreprocess>` 也显示它是必需的。编写 TypeScript 的用户看到的是一份契约：你必须提供这个键。

- **运行时更灵活。** Catch 处理失败，包括内部 schema 无法接受 `undefined` 的失败。Preprocess 和 transform 会对出现的任何输入运行它们的函数，包括 `undefined`。运行时比类型更宽松。

从技术上讲，这并不健全——运行时接受了类型拒绝的输入——但这符合用户对这些原语的*预期*。`.catch(default)` 读起来像“当事情出错时给我这个值，包括输入缺失时”。`z.preprocess(fn, T)` 读起来像“对我拿到的任何东西都运行这个函数，包括缺失值”。把静态类型视为更严格的契约，而运行时更宽容，这是从易用性角度做出的选择。

那些在运行时仍然保持严格的输入 schema——`coerce`、`unknown`、`any`、普通的 `string`/`number`/等等——并没有用户编写的逃逸口。没有理由让它们声称自己能处理缺失；它们应该拒绝，并让用户显式选择是否启用。所以规则是：**带有用户编写逃逸口的 schema（catch 的恢复、transform 的函数）在运行时接受 `undefined`；没有逃逸口的则不接受。**

`fallback` 是让这种行为能够安全地与 `optional` 组合的运行时机制：当外层包装器*也*对缺失输入表达了意见（“缺失 → undefined”）时，内部 schema 的逃逸口输出就会被覆盖。用户显式写出的 `.optional()` 会胜过内部“我碰巧在接收到 undefined 时生成了这个值”。Catch 和 transform 因此会把输出标记为 fallback；default 和 prefault 不会，因为它们的值是刻意输出的结果，而不是逃逸口的输出。

## 心智模型（一段话）

一个 schema 的 `optin` 声明它是否接受缺失输入。Object 和 tuple 解析器在运行前会检查它。Optional 会先查看它，以决定是短路还是调用内部 schema。Default、prefault、optional 和 exact-optional 都硬编码为 `optin = "optional"`。Catch 和 transform 只在运行时设置它——它们的静态类型并不会声称接受缺失，尽管它们实际上会接受（灵活输入，严格输出）。Preprocess 通过 pipe 继承了 transform 的运行时 optin。

当 `optional` 包裹了某个 `optin === "optional"` 的东西，且输入是 `undefined` 时，它必须决定：*信任内部的输出*，还是*用 `undefined` 覆盖*。`fallback` 载荷标志就是内部告诉外层“这个值是恢复值 / transform 的解释，不是对缺失的刻意处理——你可以覆盖它”的方式。Catch 在替换时设置它；transform 在每次调用时设置它。Default 和 prefault 不设置，因为它们的值*就是*刻意的处理结果。

对于其他所有情况——`coerce`、`string`、`unknown`、`any`、`transform.pipe` 这类 transform 位于 OUT 侧的形状——`optin` 都保持为 `undefined`。Object 和 tuple 解析器会拒绝缺失输入。用户在希望接受缺失时，需要通过 `.optional()` 或 `.default(...)` 显式选择。
