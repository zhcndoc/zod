# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在处理本仓库代码时提供指导。

## 开发命令

项目使用 pnpm workspace。主要命令：

- `pnpm build` - 构建所有包（递归执行构建命令）
- `pnpm vitest run` - 使用 Vitest 运行所有测试
- `pnpm vitest run <path>` - 运行特定测试文件（例如 `packages/zod/src/v4/classic/tests/string.test.ts`）
- `pnpm vitest run <path> -t "<pattern>"` - 运行文件内的特定测试（例如 `-t "MAC"`）
- `pnpm vitest run --update` - 更新全部测试快照
- `pnpm vitest run <path> --update` - 更新特定测试文件的快照
- `pnpm test:watch` - 以监听模式运行测试
- `pnpm vitest run --coverage` - 运行带覆盖率报告的测试
- `pnpm dev` - 在源代码环境下通过 tsx 执行代码
- `pnpm dev <file>` - 使用 tsx 和正确的解析条件执行 `<file>`。通常用于 `play.ts`。
- `pnpm dev:play` - 快速别名，用于运行 play.ts 以进行试验
- `pnpm lint` - 使用 biome 运行自动修复的代码检查器
- `pnpm format` - 使用 biome 格式化代码
- `pnpm fix` - 同时运行格式化和代码检查

## 规则

- 需要 Node.js v24+（如有需要请使用 nvm）；pnpm 版本为 v10.12.1
- 全程使用 ES 模块（`"type": "module"`）
- 所有测试必须用 TypeScript 编写，禁止使用 JavaScript
- 快速试验使用 `play.ts`；所有正式测试用例需使用正规的测试文件
- 无测试的功能都是不完整的 —— 每个新功能或漏洞修复都需覆盖测试
- 不要因为类型问题跳过测试 —— 应修正类型错误
- 测试需覆盖成功和失败用例及边界情况
- 测试和生产代码中禁止出现日志语句（`console.log`，`debugger`）
- 新建文件前需先询问
- 使用 `util.defineLazy()` 定义计算属性以避免循环依赖
- 性能至关重要 —— 为了优化允许进行参数重赋值