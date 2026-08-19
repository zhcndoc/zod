# 编译后的构造函数图

这是一份关于降低 Zod Core、Mini 和 Classic 构造函数图运行时成本的内部提案，同时不改变可观察行为。

## 状态

探索阶段。这不应阻塞 [#6318](https://github.com/colinhacks/zod/pull/6318) 中的 trait 工作。提议的实验足够小，可以独立评估；如果无法带来明确的包体积和构造时间收益，也可以直接放弃。

## 摘要

Zod 的运行时类型图不是类层次结构，而是一个有向无环图：字符串格式同时是 schema 和 check，Mini 与 Classic 在此基础上添加各自的身份，而 codec 则组合多个身份。Traits 当前能够正确地表示这张图，但每个实例都会通过递归调用初始化器、检查 trait 成员关系、添加 trait 名称以及应用原型来重建其中一部分。

另一种方案是在每个内置构造函数定义时，只编译一次内置构造函数图。每个内置构造函数都将拥有一个静态描述符，其中包含由本地初始化块和父级调用组成的有序程序。编译器会将该程序转换为一个扁平的操作序列，同时保留当前的进入、父级调用、原型以及回退顺序。普通构造过程将直接执行该操作序列。现有的动态 `$constructor` 路径仍然可供第三方和运行时组合使用。

第一版应在 `_zod.traits` 中保留一个真实且可变的 `Set<string>`，并继续通过该集合实现 `instanceof`。这会有意放弃尽可能大的内存收益，以换取保留 trait 顺序、集合身份、每个实例的变更、跨副本 `instanceof`、自定义构造函数组合，以及下游读取 `_zod.traits` 的代码。

该设计可以从内置构造过程中移除重复的图遍历和成员检查。对于具名导入，它还可能让打包器丢弃更多通用组合机制。但它不保证一定有收益：在扩大实验之前，必须测量包体积和端到端构造性能。

## 目标

- 保留所有当前运行时行为，包括 Core、Mini、Classic 以及多个已安装副本之间的 `instanceof`
- 保留 `_zod.traits`，使其继续作为一个自有、可变的 `Set<string>`，并保持当前的插入顺序
- 保留自定义 `$constructor` 组合、原型扩展、提取的方法、克隆和错误构造
- 减小最小化具名 Mini 和 Classic 导入的包体积
- 改进内置 schema 构造，同时不降低解析速度

## 非目标

- 不将公开的类形 API 替换为普通对象或函数
- 不移除 traits 这一兼容性表示
- 不改变解析器内核或 schema 定义
- 第一版不让 `_zod.traits` 变为惰性属性
- 在 spike 证明能够带来可测量收益之前，不重写每个构造函数

## 为什么仅使用原生类还不够

原生类只有一个原型父级，而 Zod 构造函数可能拥有多个语义父级。

例如，Core 字符串格式同时参与 schema 图和 check 图。随后，Classic 和 Mini 又在 Core 身份之上添加各自的公共身份。类似地，codec 也会组合 pipe、transform 和 codec 身份。将这些关系扁平化为单一的原生继承链，要么会丢失有效的 `instanceof` 结果，要么需要额外的身份机制，而这会以另一个名称重新创建 traits。

兼容性图还扩展到了原型之外：

- 一个构造函数可能初始化由多个父级贡献的状态
- 初始化器具有幂等性，因为自定义构造函数可能会动态组合它们
- 下游包会直接检查 `_zod.traits`
- 用户可以在导入后扩展构造函数原型
- 方法可以从实例中提取出来，并在没有原始接收者的情况下调用

因此，相关的优化目标是图的执行，而不是图模型本身。

## 兼容性契约

Spike 应将以下行为视为固定不变：

| 表面 | 必须满足的行为 |
| --- | --- |
| `instanceof` | 每个当前有效的 Core、Mini 和 Classic 关系都必须保持有效，包括重复包副本之间的关系 |
| `_zod.traits` | 继续作为一个自有、可变的 `Set<string>`，包含相同的名称和插入顺序 |
| Trait 变更 | 添加或删除名称后，基于 trait 的 `instanceof` 行为必须继续与当前完全一致 |
| 自定义构造函数 | 第三方 `$constructor` 值可以动态组合内置和自定义初始化器 |
| 原型扩展 | 添加到构造函数原型上的方法，在已有实例和新实例上都保持可见 |
| 提取的方法 | `const optional = schema.optional; optional()` 继续正常工作 |
| 构造 | `constructor`、`name`、克隆、延迟初始化和错误父级继续保持当前行为 |
| 解析 | 解析结果、issues、异步行为和热点路径性能保持不变 |

因此，第一版实现不应使用代理、虚拟 trait 集合、共享可变集合或仅基于描述符的 `instanceof`。

## 提议的设计

### 内置构造函数的静态描述符

每个内置构造函数都将声明一个类似如下的描述符：

```ts
type $ConstructorProgramStep =
  | { kind: "init"; run: $Initializer }
  | { kind: "parent"; descriptor: $ConstructorDescriptor };

interface $ConstructorDescriptor {
  name: string;
  constr: $constructor;
  program: readonly $ConstructorProgramStep[];
  compiledOperations: readonly $ConstructorOperation[];
  traits: readonly string[];
}
```

描述符编译器会在构造函数定义时运行一次。它将：

1. 在进入其程序时发出构造函数的 trait 插入操作
2. 在每次父级调用的准确位置内联父级程序
3. 保留发生在父级调用之前、之间或之后的本地工作
4. 在每个构造函数程序回退时发出原型安装操作
5. 按身份去重重复的构造函数程序，与当前的 trait guard 保持一致
6. 在开发阶段检测循环
7. 将生成的扁平操作序列存储到构造函数上

这个顺序非常重要。一些构造函数会在调用父级之前修改其定义，而字符串格式初始化则会有意先调用 check 父级，再调用 string 父级。预先填充所有 trait，或应用通用的拓扑排序，都会使初始化器内部的行为变得可观察，并且无法满足兼容性目标。

Spike 应显式声明这张图。在运行时设计得到验证之前，代码生成会增加另一个变量。

### 快速的内置构造

内置 schema 的普通构造过程将使用其编译后的描述符：

```ts
function constructBuiltin(instance: object, def: unknown, descriptor: $ConstructorDescriptor) {
  installZodInternals(instance, {
    def,
    constr: descriptor.constr,
    traits: new Set(),
  });

  for (const operation of descriptor.compiledOperations) {
    operation.run(instance, def);
  }

  runDeferredInitializers(instance);
}
```

操作序列会按照当前顺序包含 trait 添加、本地初始化块和原型安装。父级遍历和去重已经完成编译，因此普通路径可以避免重复的 `Set.has`、递归和原型发现。它会有意保留每次有序的 `Set.add`，因为初始化器可能在构造进行期间观察 trait 集合。

### 兼容的动态初始化

公开的 `.init(instance, def)` 行为应继续保持幂等且动态。当自定义构造函数直接调用它时，它可以使用当前的 trait guard 来解释相同的描述符程序。因此，编译路径和动态路径将共享同一个声明式顺序来源，而不是维护两套互不相关的初始化器实现。

这样会形成两条路径：

- 内置 `new` 调用使用编译后的计划
- 自定义和运行时组合使用现有的带 guard 的初始化语义

通用的 `$constructor` 导出应继续保留。内置构造函数可以使用更小的内部工厂，使具名导入不一定保留通用组合路径。

### 保留基于 trait 的 `instanceof`

第一版实现应继续通过 `_zod.traits.has(name)` 解析 `instanceof`。切换到描述符祖先关系会让 `instanceof` 更快，但在用户修改 trait 集合后会改变结果。保留当前检查可以将实验范围限定在构造和打包上。

如果发布后未发现生态系统依赖 trait 变更，则可以单独评估描述符祖先关系，将其作为明确的破坏性变更或放宽兼容性的变更。

## 预期影响

### 构造性能

可能的收益在于从每个内置实例中移除重复的图操作：

- 递归的父级初始化变为扁平循环
- 在已知的内置路径中移除 trait 成员检查，同时保留有序的 trait 添加
- 原型贡献者只需发现一次，而不是每个实例发现一次
- 去重从运行时转移到构造函数定义时

必须在完整构造函数上进行测量。对 `new Set()` 或直接函数调用进行微基准测试有助于归因，但不能作为验收结果。

### 包体积

包体积假设是：内置构造函数可以保留一个小型的编译执行器，同时让通用图构建器保持可 tree-shake。这必须同时针对 Mini 和 Classic 进行测试；将元数据从代码移入描述符，如果描述符重复信息或阻碍死代码消除，反而可能增加包体积。

### 内存

初始设计不应声称能节省每个实例的内存。它仍然会分配相同的 trait 集合。共享或惰性的 trait 表示可以为 trait 较多的实例节省数百字节，但这会使零回归要求面临风险。

### 解析性能

解析在结构上应不受影响。任何超出基准控制范围的可重复变化，都应在得到解释之前视为回归。

## 为什么不让 traits 变为惰性

惰性的 `_zod.traits` 访问器很有吸引力，因为大多数实例不会暴露其 trait 集合。但它不适合第一轮实验：

- `_zod.traits` 作为自有属性是可观察的
- 下游包会直接读取它，并期望其拥有 Set 方法
- 每个实例的变更必须保持隔离
- 访问器和延迟属性安装可能改变对象形状和字典行为
- 如果在其他位置检查祖先关系，物化过程还会向 `instanceof` 增加另一个分支

在编译后的图本身证明有用之后，可以再测量惰性物化。

## 已考虑的替代方案

| 方案 | 不继续采用的原因 |
| --- | --- |
| 仅使用原生类 | 无法在不引入额外祖先关系机制的情况下表示当前的多重身份图 |
| 普通函数式对象 | 会破坏公共构造函数、原型、扩展和 `instanceof` |
| 包装对象 | 会改变对象身份，并使克隆、错误和方法提取更加复杂 |
| 代理 | 会增加运行时开销和反射差异，同时使性能更难预测 |
| 数字 trait 位掩码 | 会破坏可扩展性、跨副本身份、可读的 trait 名称和任意自定义 trait |
| 共享 trait `Set` | 会破坏每个实例的变更和 Set 身份 |
| 仅基于描述符的 `instanceof` | 会破坏由变更驱动的 `instanceof` 和自定义运行时组合，除非通过回退机制重新实现当前检查 |
| 惰性 trait `Set` | 可能减少内存，但在构造函数优化得到验证之前，可能带来反射和对象形状回归 |

## Spike 范围

实验应在以下三个有代表性的切片完成后停止：

1. Core `$ZodType`、`$ZodString`、`$ZodStringFormat` 和 `$ZodEmail`
2. 对应的 Mini type、string、string-format 和 email 构造函数
3. Mini pipe 和 codec 构造函数，它们会测试多个语义父级

这些内容足以测试简单链、schema/check 菱形、特定风格的身份以及更复杂的图。即使第一版实现主要集中于 Mini，Classic 也应纳入包体积和兼容性测量。

## 验证计划

### 行为

添加一个紧凑的构造函数矩阵，覆盖：

- Spike 中预期的每个 Core、Mini 和 Classic `instanceof` 关系
- ESM 和 CJS 导入
- 两个已安装的 Zod 副本
- Trait Set 身份、插入顺序和每个实例的变更
- 直接调用 `.init()` 和自定义 `$constructor` 组合
- 创建实例之前和之后的原型扩展
- 提取的方法
- 克隆、构造函数、名称、延迟初始化和错误父级行为

现有的原型和 codec 测试应保持不变并通过：

```sh
pnpm vitest run \
  packages/zod/src/v4/classic/tests/prototypes.test.ts \
  packages/zod/src/v4/mini/tests/prototypes.test.ts \
  packages/zod/src/v4/classic/tests/codec.test.ts \
  packages/zod/src/v4/mini/tests/codec.test.ts \
  packages/zod/src/v4/classic/tests/instance-footprint.test.ts
```

在提交实现之前，运行完整的仓库检查：

```sh
pnpm build
pnpm vitest run
```

### 包体积

使用相同的合并基线和完全相同的 esbuild 设置，将 Spike 与基线进行比较。至少测量：

- 从 `zod/mini` 导入最小化的具名 `string`
- 从 `zod` 导入最小化的具名 `string`
- string-format 导入
- codec 导入

记录原始、压缩、gzip 和 Brotli 大小。除了总大小，还要检查生成的 bundle，以确保收益来自移除构造函数机制，而不是偶然的符号重命名。

### 性能

测量：

- type、string、email、pipe 和 codec schema 的构造
- 一个混合的真实 schema 工厂
- 同步解析成功和失败
- 异步解析成功和失败
- 大批量存活实例的堆内存使用

在同一进程配置中交错运行基线和候选版本。报告置信区间或多次运行的波动范围，而不是单次最佳结果。

## 验收标准

只有在以下条件全部满足时，才应继续推进 Spike：

- 完整的兼容性矩阵和现有测试全部通过，且不修改测试断言
- 最小化具名导入在 Mini 和 Classic 中经 gzip 和 Brotli 压缩后都变得更小
- 具有代表性的构造函数基准测试超出运行间噪声范围并得到改善
- 解析基准测试保持在控制范围内
- 该实现比维护两套完全独立的构造函数系统更简单

如果保留真实 trait Set 会消除包体积收益，如果快速路径和动态路径开始出现语义分歧，或者如果设计必须依赖访问器、代理或构建时代码生成才能显示改进，则应停止。

## 当前证据

推动本提案的测量结果属于探索性结果，并且与机器有关：

- 在隔离的 Node 26.5.0 微基准测试中，分配共享祖先引用明显比构造一个包含五个条目的 Set 更便宜，这确认 trait 初始化具有可测量的底层成本
- 每个实例包含五个名称的 Set，比共享引用大约多使用 232 字节；包含十个名称的 Set 则大约多使用 392 字节。初始提案有意不采用这一内存节省
- 当前基于 trait 的 `instanceof` 与针对更深层基础类的原生检查相比具有竞争力，甚至更快。这也是不将构造函数实验与新的 `instanceof` 机制结合的另一个原因
- 使用最小化具名 `string` 导入，将 [#6318](https://github.com/colinhacks/zod/pull/6318) 与其合并基线进行比较时，本地测试环境中的 gzip 输出 Mini 增加约 166 字节，Classic 增加约 142 字节。只有当编译后的内置执行器能够逆转这些总量，而不是在文件之间转移成本时，才值得考虑

这些数字说明了调查方向，而不是验收阈值。Spike 需要仓库级别的基准测试和包检查。

## 与方法绑定的关系

构造函数图和方法绑定是相互独立的优化。[#5870](https://github.com/colinhacks/zod/pull/5870) 证明，将行为移到原型上可能会破坏提取的方法；[#5897](https://github.com/colinhacks/zod/pull/5897) 通过惰性绑定而不是急切地创建每个闭包，恢复了这一契约。编译后的构造函数图应假设当前的方法绑定契约，不要重新打开这一问题。

实际顺序是：

1. 继续根据 [#6318](https://github.com/colinhacks/zod/pull/6318) 自身的兼容性和性能表现进行评估
2. 在稳定的基线上实现范围受限的编译图 Spike
3. 只有在产生额外且可独立测量的收益时，才保留这项变更

## 建议

不要用原生类、普通对象、代理或位掩码替换 traits。保留 traits 作为兼容性表示，并尝试编译内置构造函数图，使实例不再在运行时重新发现这张图。

最安全的第一版实现应当有意保持保守：显式描述符、扁平的内置构造计划、现有的动态 `$constructor` 回退，以及普通的每个实例 trait Set。如果该版本无法同时让 Mini 和 Classic 变得更小，并让构造过程更快，就应停止。更激进的 trait 表示将不再符合零回归前提。
