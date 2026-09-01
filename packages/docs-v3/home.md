<p align="center">
  <img src="https://raw.githubusercontent.com/colinhacks/zod/main/logo.svg" width="200px" align="center" alt="Zod logo" />
  <h1 align="center">Zod</h1>
  <p align="center">
  <a href="https://zod.dev">zod.dev</a>
  <br/>
    TypeScript 优先的模式验证与静态类型推断
  </p>
</p>
<p align="center">
<a href="https://github.com/colinhacks/zod/actions?query=branch%3Amain"><img src="https://github.com/colinhacks/zod/actions/workflows/test.yml/badge.svg?event=push&branch=main" alt="Zod CI 状态" /></a>
<a href="https://twitter.com/colinhacks" rel="nofollow"><img src="https://img.shields.io/badge/created%20by-@colinhacks-4BBAAB.svg" alt="由 Colin McDonnell 创建"></a>
<a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/colinhacks/zod" alt="许可证"></a>
<a href="https://www.npmjs.com/package/zod" rel="nofollow"><img src="https://img.shields.io/npm/dw/zod.svg" alt="npm"></a>
<a href="https://github.com/colinhacks/zod" rel="nofollow"><img src="https://img.shields.io/github/stars/colinhacks/zod" alt="stars"></a>
</p>

<div align="center">
  <a href="https://zod.dev">网站</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  
  <a href="https://discord.gg/RcG33DQJdf">Discord</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/colinhacks">𝕏</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://bsky.app/profile/zod.dev">Bluesky</a>
  <br />
</div>

<br/><br/>

<table align="center" style="justify-content:center;align-items:center;display:flex;"><td>
  <p align="center">Zod 4 现已发布！
  <br/>
  <a target="_blank" rel="noopener noreferrer" href="https://zod.dev/v4">阅读公告 👉</a></p></td>
</table>

<br/>
<br/>

## 目录

> 本文档已翻译成[中文](./README_ZH.md)和[韩文](./README_KO.md)。

- [目录](#目录)
- [简介](#简介)
- [赞助商](#赞助商)
  - [生态系统](#生态系统)
    - [资源](#资源)
    - [API 库](#api-库)
    - [表单集成](#表单集成)
    - [Zod 到 X](#zod-到-x)
    - [X 到 Zod](#x-到-zod)
    - [模拟](#模拟)
    - [由 Zod 驱动](#由-zod-驱动)
    - [Zod 工具](#zod-工具)
- [安装](#安装)
  - [要求](#要求)
  - [从 `npm` 安装](#从-npm-安装)
- [基本用法](#基本用法)
- [原始类型](#原始类型)
- [原始类型的强制转换](#原始类型的强制转换)
- [字面量](#字面量)
- [字符串](#字符串)
  - [日期时间](#日期时间)
  - [日期](#日期)
  - [时间](#时间)
  - [IP 地址](#ip-地址)
  - [IP 范围（CIDR）](#ip-范围cidr)
- [数字](#数字)
- [BigInt](#bigint)
- [NaN](#nan)
- [布尔值](#布尔值)
- [日期](#日期-1)
- [Zod 枚举](#zod-枚举)
- [原生枚举](#原生枚举)
- [可选值](#可选值)
- [可空值](#可空值)
- [对象](#对象)
  - [`.shape`](#shape)
  - [`.keyof`](#keyof)
  - [`.extend`](#extend)
  - [`.merge`](#merge)
  - [`.pick/.omit`](#pickomit)
  - [`.partial`](#partial)
  - [`.deepPartial`](#deeppartial)
  - [`.required`](#required)
  - [`.passthrough`](#passthrough)
  - [`.strict`](#strict)
  - [`.strip`](#strip)
  - [`.catchall`](#catchall)
- [数组](#数组)
  - [`.element`](#element)
  - [`.nonempty`](#nonempty)
  - [`.min/.max/.length`](#minmaxlength)
- [元组](#元组)
- [联合类型](#联合类型)
- [判别联合类型](#判别联合类型)
- [记录](#记录)
- [映射](#映射)
- [集合](#集合)
- [交叉类型](#交叉类型)
- [递归类型](#递归类型)
  - [带有 ZodEffects 的 ZodType](#带有-zodeffects-的-zodtype)
  - [JSON 类型](#json-类型)
  - [循环对象](#循环对象)
- [Promise](#promise)
- [Instanceof](#instanceof)
- [函数](#函数)
- [预处理](#预处理)
- [自定义模式](#自定义模式)
- [模式方法](#模式方法)
  - [`.parse`](#parse)
  - [`.parseAsync`](#parseasync)
  - [`.safeParse`](#safeparse)
  - [`.safeParseAsync`](#safeparseasync)
  - [`.refine`](#refine)
    - [参数](#参数)
    - [自定义错误路径](#自定义错误路径)
    - [异步细化](#异步细化)
    - [与转换的关系](#与转换的关系)
  - [`.superRefine`](#superrefine)
    - [提前终止](#提前终止)
    - [类型细化](#类型细化)
  - [`.transform`](#transform)
    - [链式调用顺序](#链式调用顺序)
    - [在转换期间进行验证](#在转换期间进行验证)
    - [与细化的关系](#与细化的关系)
    - [异步转换](#异步转换)
  - [`.default`](#default)
  - [`.describe`](#describe)
  - [`.catch`](#catch)
  - [`.optional`](#optional)
  - [`.nullable`](#nullable)
  - [`.nullish`](#nullish)
  - [`.array`](#array)
  - [`.promise`](#promise)
  - [`.or`](#or)
  - [`.and`](#and)
  - [`.brand`](#brand)
  - [`.readonly`](#readonly)
  - [`.pipe`](#pipe)
- [指南与概念](#指南与概念)
  - [类型推断](#类型推断)
  - [编写泛型函数](#编写泛型函数)
    - [推断推断出的类型](#推断推断出的类型)
    - [约束允许的输入](#约束允许的输入)
  - [错误处理](#错误处理)
  - [错误格式化](#错误格式化)
- [比较](#比较)
  - [Joi](#joi)
  - [Yup](#yup)
  - [io-ts](#io-ts)
  - [Runtypes](#runtypes)
  - [Ow](#ow)
- [变更日志](#变更日志)

<br/>

## 简介

Zod 是一个 TypeScript 优先的模式声明与验证库。我使用“模式”这个词来广泛指代任何数据类型，从简单的 `string` 到复杂的嵌套对象。

Zod 的设计目标是尽可能方便开发者使用。其目标是消除重复的类型声明。使用 Zod 时，你只需声明一次验证器，Zod 就会自动推断静态 TypeScript 类型。将更简单的类型组合成复杂的数据结构也很容易。

其他一些优秀特性：

- 零依赖
- 支持 Node.js 和所有现代浏览器
- 体积小：压缩并打包后仅 8kb
- 不可变：方法（例如 `.optional()`）会返回新实例
- 简洁、可链式调用的接口
- 函数式方法：[解析，而不是验证](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)
- 同样支持普通 JavaScript！你不必使用 TypeScript

<br/>

## 赞助商

我们感谢并鼓励任何级别的赞助。如果你使用 Zod 构建了付费产品，可以考虑[企业赞助层级](https://github.com/sponsors/colinhacks)。

<br/>

<h3 align="center">白金级</h3>

<table align="center" style="justify-content: center;align-items: center;display: flex;">
  <tr>
    <td align="center">
      <p></p>
      <p>
      <a href="https://www.coderabbit.ai/">
        <picture height="80px">
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/eea24edb-ff20-4532-b57c-e8719f455d6d">
          <img alt="CodeRabbit logo" height="80px" src="https://github.com/user-attachments/assets/d791bc7d-dc60-4d55-9c31-97779839cb74">
        </picture>
      </a>
      <br  />
      将代码审查时间和漏洞减少一半
      <br/>
      <a href="https://www.coderabbit.ai/" style="text-decoration:none;">coderabbit.ai</a>
      </p>
      <p></p>
    </td>
  </tr>
</table>

<br/>

<h3 align="center">黄金级</h3>

<table align="center" style="justify-content: center;align-items: center;display: flex;">
  <tr>
    <td align="center">
      <p></p>
      <p>
      <a href="https://www.courier.com/?utm_source=zod&utm_campaign=osssponsors">
        <picture height="62px">
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/6b09506a-78de-47e8-a8c1-792efe31910a">
          <img alt="Courier logo" height="62px" src="https://github.com/user-attachments/assets/6b09506a-78de-47e8-a8c1-792efe31910a">
        </picture>
      </a>
      <br  />
      用于发送通知的 API 平台
      <br/>
      <a href="https://www.courier.com/?utm_source=zod&utm_campaign=osssponsors" style="text-decoration:none;">courier.com</a>
      </p>
      <p></p>
    </td>
    <td align="center">
      <p></p>
      <p>
      <a href="https://liblab.com/?utm_source=zod">
        <picture height="62px">
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/34dfa1a2-ce94-46f4-8902-fbfac3e1a9bc">
          <img alt="LibLab" height="62px" src="https://github.com/user-attachments/assets/3de0b617-5137-49c4-b72d-a033cbe602d8">
        </picture>
      </a>
      <br  />
      为你的 API 生成更好的 SDK
      <br/>
      <a href="https://liblab.com/?utm_source=zod" style="text-decoration:none;">liblab.com</a>
      </p>
      <p></p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <p></p>
      <p>
      <a href="https://neon.tech">
        <picture height="68px">
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/83b4b1b1-a9ab-4ae5-a632-56d282f0c444">
          <img alt="Neon" height="68px" src="https://github.com/user-attachments/assets/b5799fc8-81ff-4053-a1c3-b29adf85e7a1">
        </picture>
      </a>
      <br  />
      无服务器 Postgres — 更快交付
      <br/>
      <a href="https://neon.tech" style="text-decoration:none;">neon.tech</a>
      </p>
      <p></p>
    </td>
    <td align="center">
      <p></p>
      <p>
      <a href="https://retool.com/?utm_source=github&utm_medium=referral&utm_campaign=zod">
        <picture height="45px">
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/colinhacks/zod/assets/3084745/ac65013f-aeb4-48dd-a2ee-41040b69cbe6">
          <img alt="Retool" height="45px" src="https://github.com/colinhacks/zod/assets/3084745/5ef4c11b-efeb-4495-90a8-41b83f798600">
        </picture>
      </a>
      <br  />
      使用 <a href="https://retool.com/products/ai?utm_source=github&utm_medium=referral&utm_campaign=zod">Retool AI</a> 构建 AI 应用和工作流
      <br/>
      <a href="https://retool.com/?utm_source=github&utm_medium=referral&utm_campaign=zod" style="text-decoration:none;">retool.com</a>
      </p>
      <p></p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <p></p>
      <p>
      <a href="https://stainless.com">
        <picture height="45px">
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/colinhacks/zod/assets/3084745/f20759c1-3e51-49d0-a31e-bbc43abec665">
          <img alt="stainless" height="45px" src="https://github.com/colinhacks/zod/assets/3084745/e9444e44-d991-4bba-a697-dbcfad608e47">
        </picture>
      </a>
      <br  />
      生成同类最佳的 SDK
      <br/>
      <a href="https://stainless.com" style="text-decoration:none;">stainless.com</a>
      </p>
      <p></p>
    </td>
    <td align="center">
      <p></p>
      <p>
      <a href="https://speakeasy.com/editor?utm_source=zod+docs">
        <picture height="40px">
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/colinhacks/zod/assets/3084745/b1d86601-c7fb-483c-9927-5dc24ce8b737">
          <img alt="speakeasy" height="40px" src="https://github.com/colinhacks/zod/assets/3084745/647524a4-22bb-4199-be70-404207a5a2b5">
        </picture>
      </a>
      <br  />
      为你的 API 提供 SDK 和 Terraform provider
      <br/>
      <a href="https://speakeasy.com/?utm_source=zod+docs" style="text-decoration:none;">speakeasy.com</a>
      </p>
      <p></p>
    </td>
  </tr>
</table>

<br/>

<h3 align="center">白银级</h3>

<table align="center" style="justify-content: center;align-items: center;display: flex;">
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/72055470?s=200&v=4" height="50px;" alt="Nitric" />
      <br />
      <a style="text-decoration:none;" href="https://nitric.io/" target="_blank">Nitric</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/89474619?s=200&v=4" height="50px;" alt="PropelAuth" />
      <br />
      <a style="text-decoration:none;" href="https://www.propelauth.com/" target="_blank">PropelAuth</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/80861386?s=200&v=4" height="50px;" alt="Cerbos" />
      <br />
      <a style="text-decoration:none;" href="https://cerbos.dev/" target="_blank">Cerbos</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/301879?s=200&v=4" height="50px;" alt="Scalar.com logo" />
      <br />
      <a style="text-decoration:none;" href="https://scalar.com/" target="_blank">Scalar</a>
    </td>
    </tr><tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/95297378?s=200&v=4" height="50px;" alt="Trigger.dev logo" />
      <br />
      <a style="text-decoration:none;" href="https://trigger.dev" target="_blank">Trigger.dev</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/125754?s=200&v=4" height="50px;" alt="Transloadit logo" />
      <br />
      <a style="text-decoration:none;" href="https://transloadit.com/?utm_source=zod&utm_medium=refe
    rral&utm_campaign=sponsorship&utm_content=github" target="_blank">Transloadit</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/107880645?s=200&v=4" height="50px;" alt="Infisical logo" />
      <br />
      <a style="text-decoration:none;" href="https://infisical.com" target="_blank">Infisical</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/91036480?s=200&v=4" height="50px;" alt="Whop logo" />
      <br />
      <a style="text-decoration:none;" href="https://whop.com/" target="_blank">Whop</a>
    </td>
    </tr><tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/36402888?s=200&v=4" height="50px;" alt="CryptoJobsList logo" />
      <br />
      <a style="text-decoration:none;" href="https://cryptojobslist.com/" target="_blank">CryptoJobsList</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/70170949?s=200&v=4" height="50px;" alt="Plain logo" />
      <br />
      <a style="text-decoration:none;" href="https://plain.com/" target="_blank">Plain.</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/78935958?s=200&v=4" height="50px;" alt="Inngest logo" />
      <br />
      <a style="text-decoration:none;" href="https://inngest.com/" target="_blank">Inngest</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/13880908?s=200&v=4" height="50px;" alt="Storyblok CMS" />
      <br />
      <a style="text-decoration:none;" href="https://storyblok.com/" target="_blank">Storyblok</a>
    </td>
    </tr><tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/16199997?s=200&v=4" height="50px;" alt="Mux logo" />
      <br />
      <a style="text-decoration:none;" href="https://mux.link/zod" target="_blank">Mux</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/76428554?s=200&v=4" height="50px;" alt="Cybozu logo" />
      <br />
      <a style="text-decoration:none;" href="https://cybozu.co.jp/index.html" target="_blank">Cybozu</a>
    </td>
  </tr>
</table>

<br/>

<h3 align="center">青铜级</h3>

<table align="center" style="justify-content: center;align-items: center;display: flex;">
  <tr>
    <td align="center">
      <a href="https://www.val.town/">
        <picture width="100%" height="40px">
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/36961d2e-d92e-42af-9031-a41885ece5f4">
          <img alt="val town logo" src="https://github.com/user-attachments/assets/95305fc4-4da6-4bf8-aea4-bae8f5893e5d" height="40px">
        </picture>
      </a>
    </td>
    <td align="center">
      <a href="https://www.route4me.com/">
        <img src="https://avatars.githubusercontent.com/u/7936820?s=200&v=4" height="40px;" alt="route4me logo" />
      </a>
    </td>
    <td align="center">
      <a href="https://encore.dev">
        <img src="https://github.com/colinhacks/zod/assets/3084745/5ad94e73-cd34-4957-9979-37da85fcf9cd" height="40px;" alt="Encore.dev logo" />
      </a>
    </td>
    <td align="center">
      <a href="https://www.replay.io/">
        <img src="https://avatars.githubusercontent.com/u/60818315?s=200&v=4" height="40px;" alt="Replay.io logo" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.numeric.io">
        <img src="https://i.imgur.com/kTiLtZt.png" height="40px;" alt="Numeric logo" />
      </a>
    </td>
    <td align="center">
      <a href="https://marcatopartners.com">
        <img src="https://avatars.githubusercontent.com/u/84106192?s=200&v=4" height="40px;" alt="Marcato Partners" />
      </a>
    </td>
    <td align="center">
      <a href="https://interval.com">
        <img src="https://avatars.githubusercontent.com/u/67802063?s=200&v=4" height="40px;" alt="" />
      </a>
    </td>
    <td align="center">
      <a href="https://seasoned.cc">
        <img src="https://avatars.githubusercontent.com/u/33913103?s=200&v=4" height="40px;" alt="" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.bamboocreative.nz/">
        <img src="https://avatars.githubusercontent.com/u/41406870?v=4" height="40px;" alt="Bamboo Creative logo" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/jasonLaster">
        <img src="https://avatars.githubusercontent.com/u/254562?v=4" height="40px;" alt="Jason Laster" />
      </a>
    </td>
  </tr>
</table>

<!-- <h3 align="center">Bronze</h3>

<table align="center" style="justify-content: center;align-items: center;display: flex;">
  <tr>
    <td>Brandon Bayer</td>
    <td>Jiří Brabec</td>
    <td>Alex Johansson</td>
    <td>Fungible Systems</td>
  </tr>
  <tr>
    <td>Adaptable</td>
    <td>Avana Wallet</td>
    <td>Jason Lengstorf</td>
    <td>Global Illumination, Inc.</td>
  </tr>
  <tr>
    <td>MasterBorn</td>
    <td>Ryan Palmer</td>
    <td>Michael Sweeney</td>
    <td>Nextbase</td>
  </tr>
  <tr>
    <td>Remotion</td>
    <td>Connor Sinnott</td>
    <td>Mohammad-Ali A'râbi</td>
    <td>Supatool</td>
  </tr>
</table> -->

### 生态系统

越来越多的工具构建于 Zod 之上，或原生支持 Zod！如果你基于 Zod 构建了工具或库，请在 [Twitter](https://twitter.com/colinhacks) 上告诉我，或[发起讨论](https://github.com/colinhacks/zod/discussions)。我会将其添加到下面并发推文介绍。

#### 资源

- [Total TypeScript Zod 教程](https://www.totaltypescript.com/tutorials/zod)，作者：[@mattpocockuk](https://twitter.com/mattpocockuk)
- [修复 TypeScript 的盲点：运行时类型检查](https://www.youtube.com/watch?v=rY_XqfSHock)，作者：[@jherr](https://twitter.com/jherr)

#### API 库

- [`tRPC`](https://github.com/trpc/trpc)：无需 GraphQL 即可构建端到端类型安全的 API
- [`@anatine/zod-nestjs`](https://github.com/anatine/zod-plugins/tree/main/packages/zod-nestjs)：在 NestJS 项目中使用 Zod 的辅助方法
- [`zod-endpoints`](https://github.com/flock-community/zod-endpoints)：契约优先、严格类型化的 Zod 端点。兼容 OpenAPI
- [`zhttp`](https://github.com/evertdespiegeleer/zhttp)：兼容 OpenAPI、严格类型化的 HTTP 库，使用 Zod 验证输入和响应
- [`domain-functions`](https://github.com/SeasonedSoftware/domain-functions/)：使用可组合函数将业务逻辑与框架解耦。由 Zod 模式提供端到端的一流类型推断
- [`@zodios/core`](https://github.com/ecyrbe/zodios)：基于 axios 和 zod 的 TypeScript API 客户端，支持运行时和编译时验证
- [`express-zod-api`](https://github.com/RobinTail/express-zod-api)：使用 I/O 模式验证和自定义中间件构建基于 Express 的 API
- [`tapiduck`](https://github.com/sumukhbarve/monoduck/blob/main/src/tapiduck/README.md)：使用 Zod 和 Express 构建端到端类型安全的 JSON API；有点像 tRPC，但更简单
- [`koa-zod-router`](https://github.com/JakeFenley/koa-zod-router)：在 Koa 中使用 Zod 进行 I/O 验证，创建类型安全的路由
- [`zod-sockets`](https://github.com/RobinTail/zod-sockets)：由 Zod 驱动的 Socket.IO 微框架，支持 I/O 验证和内置 AsyncAPI 规范
- [`oas-tszod-gen`](https://github.com/inkognitro/oas-tszod-gen)：客户端 SDK 代码生成器，可将 OpenAPI v3 规范转换为带有 Zod 类型的 TS 端点调用函数
- [`GQLoom`](https://github.com/modevol-com/gqloom)：使用 Zod 编织 GraphQL 模式和解析器
- [`oRPC`](https://github.com/unnoq/orpc)：让类型安全的 API 变得简单

#### 表单集成

- [`react-hook-form`](https://github.com/react-hook-form/resolvers#zod)：React Hook Form 的官方 Zod 解析器
- [`TanStack Form`](https://github.com/TanStack/form)：面向 TS/JS、React、Vue、Angular、Solid 和 Lit 的无头、高性能、类型安全表单状态管理
- [`zod-validation-error`](https://github.com/causaly/zod-validation-error)：从 `ZodError` 生成用户友好的错误消息
- [`zod-formik-adapter`](https://github.com/robertLichtnow/zod-formik-adapter)：由社区维护的 Zod Formik 适配器
- [`react-zorm`](https://github.com/esamattis/react-zorm)：使用 Zod 为 React 独立生成并验证 `<form>`
- [`zodix`](https://github.com/rileytomasek/zodix)：Remix loaders 和 actions 中用于 FormData 与 URLSearchParams 的 Zod 工具
- [`conform`](https://conform.guide/api/zod/parseWithZod)：用于渐进增强 HTML 表单的类型安全表单验证库。支持 Remix 和 Next.js
- [`remix-params-helper`](https://github.com/kiliman/remix-params-helper)：简化 Remix 应用中 Zod 与标准 URLSearchParams 和 FormData 的集成
- [`formik-validator-zod`](https://github.com/glazy/formik-validator-zod)：符合 Formik 规范的验证器库，简化 Zod 与 Formik 的使用
- [`zod-i18n-map`](https://github.com/aiji42/zod-i18n)：用于翻译 Zod 错误消息
- [`@modular-forms/solid`](https://github.com/fabian-hiller/modular-forms)：支持使用 Zod 进行验证的 SolidJS 模块化表单库
- [`houseform`](https://github.com/crutchcorn/houseform/)：使用 Zod 进行验证的 React 表单库
- [`sveltekit-superforms`](https://github.com/ciscoheat/sveltekit-superforms)：支持 Zod 验证的增强型 SvelteKit 表单库
- [`mobx-zod-form`](https://github.com/MonoidDev/mobx-zod-form)：基于 MobX 和 Zod、数据优先的表单构建器
- [`@vee-validate/zod`](https://github.com/logaretm/vee-validate/tree/main/packages/zod)：使用 Zod 模式验证的 Vue.js 表单库
- [`zod-form-renderer`](https://github.com/thepeaklab/zod-form-renderer)：从 zod 模式自动推断表单字段，并使用 react-hook-form 渲染，同时提供端到端类型安全
- [`antd-zod`](https://github.com/MrBr/antd-zod)：用于 Ant Design 表单字段验证的 Zod 适配器
- [`frrm`](https://github.com/schalkventer/frrm)：仅 0.5kb、基于 Zod 的小型 HTML 表单抽象，运行速度飞快

#### Zod 到 X

- [`zod-to-ts`](https://github.com/sachinraja/zod-to-ts)：从 Zod 模式生成 TypeScript 定义
- [`zod-to-json-schema`](https://github.com/StefanTerdell/zod-to-json-schema)：将 Zod 模式转换为 [JSON Schema](https://json-schema.org/)
- [`@anatine/zod-openapi`](https://github.com/anatine/zod-plugins/tree/main/packages/zod-openapi)：将 Zod 模式转换为 OpenAPI v3.x `SchemaObject`
- [`zod-fast-check`](https://github.com/DavidTimms/zod-fast-check)：从 Zod 模式生成 `fast-check` 任意值
- [`zod-dto`](https://github.com/kbkk/abitia/tree/master/packages/zod-dto)：从 Zod 模式生成 Nest.js DTO
- [`fastify-type-provider-zod`](https://github.com/turkerdev/fastify-type-provider-zod)：从 Zod 模式创建 Fastify 类型提供器
- [`zod-to-openapi`](https://github.com/asteasolutions/zod-to-openapi)：从 Zod 生成完整的 OpenAPI（Swagger）文档，包括模式、端点和参数
- [`nestjs-graphql-zod`](https://github.com/incetarik/nestjs-graphql-zod)：从 Zod 模式生成 NestJS GraphQL 模型类，并提供适用于 Zod 模式的 GraphQL 方法装饰器
- [`zod-openapi`](https://github.com/samchungy/zod-openapi)：从 Zod 模式创建完整的 OpenAPI v3.x 文档
- [`fastify-zod-openapi`](https://github.com/samchungy/fastify-zod-openapi)：用于 Zod 模式的 Fastify 类型提供器、验证、序列化以及 @fastify/swagger 支持
- [`typeschema`](https://typeschema.com/)：通用模式验证适配器
- [`zodex`](https://github.com/commonbaseapp/zodex)：zod 模式的（反）序列化
- [`convex-helpers`](https://github.com/get-convex/convex-helpers/blob/main/packages/convex-helpers/README.md#zod-validation)：使用 Zod 验证 Convex 函数的参数和返回值，并创建 Convex 数据库模式

#### X 到 Zod

- [`ts-to-zod`](https://github.com/fabien0102/ts-to-zod)：将 TypeScript 定义转换为 Zod 模式
- [`@runtyping/zod`](https://github.com/johngeorgewright/runtyping)：从静态类型和 JSON schema 生成 Zod
- [`json-schema-to-zod`](https://github.com/StefanTerdell/json-schema-to-zod)：将你的 [JSON Schema](https://json-schema.org/) 转换为 Zod 模式。[在线演示](https://StefanTerdell.github.io/json-schema-to-zod-react/)
- [`json-to-zod`](https://github.com/rsinohara/json-to-zod)：将 JSON 对象转换为 Zod 模式。[在线演示](https://rsinohara.github.io/json-to-zod-react/)
- [`graphql-codegen-typescript-validation-schema`](https://github.com/Code-Hex/graphql-codegen-typescript-validation-schema)：GraphQL Code Generator 插件，可从 GraphQL 模式生成表单验证模式
- [`zod-prisma`](https://github.com/CarterGrimmeisen/zod-prisma)：从 Prisma 模式生成 Zod 模式
- [`Supervillain`](https://github.com/Southclaws/supervillain)：从 Go 结构体生成 Zod 模式
- [`prisma-zod-generator`](https://github.com/omar-dulaimi/prisma-zod-generator)：从 Prisma 模式生成 Zod 模式
- [`drizzle-zod`](https://orm.drizzle.team/docs/zod)：从 Drizzle 模式生成 Zod 模式
- [`prisma-trpc-generator`](https://github.com/omar-dulaimi/prisma-trpc-generator)：使用 Zod 生成完整实现的 tRPC 路由器及其验证模式
- [`zod-prisma-types`](https://github.com/chrishoermann/zod-prisma-types) 从 Prisma 模型创建 Zod 类型
- [`quicktype`](https://app.quicktype.io/)：将 JSON 对象和 JSON 模式转换为 Zod 模式
- [`@sanity-typed/zod`](https://github.com/saiichihashimoto/sanity-typed/tree/main/packages/zod)：从 [Sanity 模式](https://www.sanity.io/docs/schema-types)生成 Zod 模式
- [`java-to-zod`](https://github.com/ivangreene/java-to-zod)：将 POJO 转换为 Zod 模式
- [`Orval`](https://github.com/anymaniax/orval)：从 OpenAPI 模式生成 Zod 模式
- [`Kubb`](https://github.com/kubb-labs/kubb)：从 OpenAPI 模式生成 SDK 和 Zod 模式
- [`convex-helpers`](https://github.com/get-convex/convex-helpers/blob/main/packages/convex-helpers/README.md#zod-validation)：从 Convex 验证器生成 Zod 模式

#### 模拟

- [`@anatine/zod-mock`](https://github.com/anatine/zod-plugins/tree/main/packages/zod-mock)：从 Zod 模式生成模拟数据。由 [faker.js](https://github.com/faker-js/faker) 驱动
- [`zod-mocking`](https://github.com/dipasqualew/zod-mocking)：从 Zod 模式生成模拟数据
- [`zod-fixture`](https://github.com/timdeschryver/zod-fixture)：使用 zod 模式以确定性的方式自动生成非相关测试 fixture
- [`zocker`](https://zocker.sigrist.dev)：从你的模式生成合理的模拟数据
- [`zodock`](https://github.com/ItMaga/zodock) 基于 Zod 模式生成模拟数据
- [`zod-schema-faker`](https://github.com/soc221b/zod-schema-faker) 从 Zod 模式生成模拟数据。由 [@faker-js/faker](https://github.com/faker-js/faker) 和 [randexp.js](https://github.com/fent/randexp.js) 驱动

#### 由 Zod 驱动

- [`freerstore`](https://github.com/JacobWeisenburger/freerstore)：Firestore 成本优化器
- [`slonik`](https://github.com/gajus/slonik/tree/gajus/add-zod-validation-backwards-compatible#runtime-validation-and-static-type-inference)：具有强大 Zod 集成的 Node.js Postgres 客户端
- [`schemql`](https://github.com/a2lix/schemql)：通过将原始 SQL 与针对性的类型安全和模式验证相结合，增强 SQL 工作流
- [`soly`](https://github.com/mdbetancourt/soly)：使用 zod 创建 CLI 应用
- [`pastel`](https://github.com/vadimdemedes/pastel)：使用 react、zod 和 ink 创建 CLI 应用
- [`zod-xlsx`](https://github.com/sidwebworks/zod-xlsx)：使用基于 xlsx 的资源验证器和 Zod 模式
- [`znv`](https://github.com/lostfictions/znv)：使用 Zod 模式为 Node.js 提供类型安全的环境变量解析和验证
- [`zod-config`](https://github.com/alexmarqs/zod-config)：通过灵活的适配器从多个来源加载配置，并使用 Zod 确保类型安全
- [`unplugin-environment`](https://github.com/r17x/js/tree/main/packages/unplugin-environment#readme)：安全加载环境变量的插件，使用模式验证；通过虚拟模块实现简单易用，通过智能提示实现类型安全，并提供更好的开发体验 🔥 🚀 👷。由 Zod 驱动
- [`zod-struct`](https://codeberg.org/reesericci/zod-struct)：使用 Zod 创建运行时检查的结构体
- [`zod-csv`](https://github.com/bartoszgolebiowski/zod-csv)：用于解析 CSV 数据的 zod 验证辅助工具
- [`fullproduct.dev`](https://fullproduct.dev?identity=freelancers&v=z3)：通用 Expo + Next.js 应用启动器，使用 Zod 模式作为唯一事实来源，使生成的 MDX 文档、GraphQL、数据库模型、表单和 fetcher 函数保持同步

#### Zod 工具

- [`zod_utilz`](https://github.com/JacobWeisenburger/zod_utilz)：与框架无关的 Zod 工具
- [`zod-playground`](https://github.com/marilari88/zod-playground)：用于学习和测试 Zod 模式验证功能的工具。[链接](https://zod-playground.vercel.app/)
- [`zod-sandbox`](https://github.com/nereumelo/zod-sandbox)：用于测试 zod 模式的受控环境。[在线演示](https://zod-sandbox.vercel.app/)
- [`zod-dev`](https://github.com/schalkventer/zod-dev)：有条件地禁用生产环境中的 Zod 运行时解析
- [`zod-accelerator`](https://github.com/duplojs/duplojs-zod-accelerator)：将 Zod 的吞吐量提升至约 100 倍
- [`zod-ir`](https://github.com/Reza-kh80/zod-ir)：全面验证伊朗数据结构（国家代码、银行卡、Sheba、加密货币等），并支持**智能元数据提取**（银行名称、Logo）。零依赖

<br/>

## 安装

### 要求

- TypeScript 4.5+！
- 必须在 `tsconfig.json` 中启用 `strict` 模式。这是所有 TypeScript 项目的最佳实践

  ```ts
  // tsconfig.json
  {
    // ...
    "compilerOptions": {
      // ...
      "strict": true
    }
  }
  ```

### 从 `npm` 安装

```sh
npm install zod       # npm
deno add npm:zod      # deno
yarn add zod          # yarn
bun add zod           # bun
pnpm add zod          # pnpm
```

> 本 README 的其余部分假设你使用 npm，并直接从 `"zod"` 包导入。

<br/>

## 基本用法

创建一个简单的字符串模式

```ts
import { z } from "zod";

// creating a schema for strings
const mySchema = z.string();

// parsing
mySchema.parse("tuna"); // => "tuna"
mySchema.parse(12); // => throws ZodError

// "safe" parsing (doesn't throw error if validation fails)
mySchema.safeParse("tuna"); // => { success: true; data: "tuna" }
mySchema.safeParse(12); // => { success: false; error: ZodError }
```

创建对象模式

```ts
import { z } from "zod";

const User = z.object({
  username: z.string(),
});

User.parse({ username: "Ludwig" });

// extract the inferred type
type User = z.infer<typeof User>;
// { username: string }
```

<br/>

## 原始类型

```ts
import { z } from "zod";

// primitive values
z.string();
z.number();
z.bigint();
z.boolean();
z.date();
z.symbol();

// empty types
z.undefined();
z.null();
z.void(); // accepts undefined

// catch-all types
// allows any value
z.any();
z.unknown();

// never type
// allows no values
z.never();
```

<br/>

## 原始类型的强制转换

Zod 现在提供了更方便的原始值强制转换方式。

```ts
const schema = z.coerce.string();
schema.parse("tuna"); // => "tuna"
schema.parse(12); // => "12"
```

在解析步骤中，输入会经过 `String()` 函数。该函数是 JavaScript 内置的、用于将数据强制转换为字符串的函数。

```ts
schema.parse(12); // => "12"
schema.parse(true); // => "true"
schema.parse(undefined); // => "undefined"
schema.parse(null); // => "null"
```

返回的模式是一个普通的 `ZodString` 实例，因此你可以使用所有字符串方法。

```ts
z.coerce.string().email().min(5);
```

**强制转换的工作方式**

所有原始类型都支持强制转换。Zod 使用内置构造函数对所有输入进行强制转换：`String(input)`、`Number(input)`、`new Date(input)` 等。

```ts
z.coerce.string(); // String(input)
z.coerce.number(); // Number(input)
z.coerce.boolean(); // Boolean(input)
z.coerce.bigint(); // BigInt(input)
z.coerce.date(); // new Date(input)
```

**注意** — 使用 `z.coerce.boolean()` 进行布尔值强制转换时，结果可能与你预期不同。任何[真值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)都会被强制转换为 `true`，任何[假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)都会被强制转换为 `false`。

```ts
const schema = z.coerce.boolean(); // Boolean(input)

schema.parse("tuna"); // => true
schema.parse("true"); // => true
schema.parse("false"); // => true
schema.parse(1); // => true
schema.parse([]); // => true

schema.parse(0); // => false
schema.parse(""); // => false
schema.parse(undefined); // => false
schema.parse(null); // => false
```

如需更好地控制强制转换逻辑，可以考虑使用 [`z.preprocess`](#preprocess) 或 [`z.pipe()`](#pipe)。

<br/>

## 字面量

字面量 schema 表示一种[字面量类型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)，例如 `"hello world"` 或 `5`。

```ts
const tuna = z.literal("tuna");
const twelve = z.literal(12);
const twobig = z.literal(2n); // bigint literal
const tru = z.literal(true);

const terrificSymbol = Symbol("terrific");
const terrific = z.literal(terrificSymbol);

// retrieve literal value
tuna.value; // "tuna"
```

> 目前 Zod 不支持 Date 字面量。如果你有此功能的使用场景，请提交 issue。

<br/>

## 字符串

Zod 包含一些针对字符串的专用验证。

```ts
// validations
z.string().max(5);
z.string().min(5);
z.string().length(5);
z.string().email();
z.string().url();
z.string().emoji();
z.string().uuid();
z.string().nanoid();
z.string().cuid();
z.string().cuid2();
z.string().ulid();
z.string().regex(regex);
z.string().includes(string);
z.string().startsWith(string);
z.string().endsWith(string);
z.string().datetime(); // ISO 8601; by default only `Z` timezone allowed
z.string().ip(); // defaults to allow both IPv4 and IPv6
z.string().cidr(); // defaults to allow both IPv4 and IPv6

// transforms
z.string().trim(); // trim whitespace
z.string().toLowerCase(); // toLowerCase
z.string().toUpperCase(); // toUpperCase

// added in Zod 3.23
z.string().date(); // ISO date format (YYYY-MM-DD)
z.string().time(); // ISO time format (HH:mm:ss[.SSSSSS] or HH:mm)
z.string().duration(); // ISO 8601 duration
z.string().base64();
```

> 查看 [validator.js](https://github.com/validatorjs/validator.js)，其中包含许多其他实用的字符串验证函数，可以与[细化](#refine)结合使用。

创建字符串 schema 时，可以自定义一些常见的错误消息。

```ts
const name = z.string({
  required_error: "Name is required",
  invalid_type_error: "Name must be a string",
});
```

使用验证方法时，可以传入额外的参数来提供自定义错误消息。

```ts
z.string().min(5, { message: "Must be 5 or more characters long" });
z.string().max(5, { message: "Must be 5 or fewer characters long" });
z.string().length(5, { message: "Must be exactly 5 characters long" });
z.string().email({ message: "Invalid email address" });
z.string().url({ message: "Invalid url" });
z.string().emoji({ message: "Contains non-emoji characters" });
z.string().uuid({ message: "Invalid UUID" });
z.string().includes("tuna", { message: "Must include tuna" });
z.string().startsWith("https://", { message: "Must provide secure URL" });
z.string().endsWith(".com", { message: "Only .com domains allowed" });
z.string().datetime({ message: "Invalid datetime string! Must be UTC." });
z.string().date({ message: "Invalid date string!" });
z.string().time({ message: "Invalid time string!" });
z.string().ip({ message: "Invalid IP address" });
z.string().cidr({ message: "Invalid CIDR" });
```

### 日期时间

如你所见，Zod 字符串包含一些与日期／时间相关的验证。这些验证基于正则表达式，因此不如完整的日期／时间库严格。不过，它们非常适合验证用户输入。

`z.string().datetime()` 方法强制使用 ISO 8601；默认不允许时区偏移，并支持任意的小数秒精度。如果未设置精度，可以省略秒。

```ts
const datetime = z.string().datetime();

datetime.parse("2020-01-01T00:00:00Z"); // pass
datetime.parse("2020-01-01T00:00:00.123Z"); // pass
datetime.parse("2020-01-01T00:00:00.123456Z"); // pass (arbitrary precision)
datetime.parse("2020-01-01T00:00Z"); // pass (hours and minutes only)
datetime.parse("2020-01-01T00:00:00+02:00"); // fail (no offsets allowed)
```

将 `offset` 选项设置为 `true`，即可允许时区偏移。

```ts
const datetime = z.string().datetime({ offset: true });

datetime.parse("2020-01-01T00:00:00+02:00"); // pass
datetime.parse("2020-01-01T00:00+02:00"); // pass
datetime.parse("2020-01-01T00:00:00.123+02:00"); // pass (millis optional)
datetime.parse("2020-01-01T00:00:00.123+0200"); // pass (millis optional)
datetime.parse("2020-01-01T00:00:00.123+02"); // pass (only offset hours)
datetime.parse("2020-01-01T00:00:00Z"); // pass (Z still supported)
```

使用 `local` 标志允许无限定的（不带时区的）日期时间。

```ts
const schema = z.string().datetime({ local: true });
schema.parse("2020-01-01T00:00:00"); // pass
schema.parse("2020-01-01T00:00"); // pass
```

你还可以进一步限制允许的 `precision`。默认支持任意的小数秒精度（但该部分可选）。

```ts
const datetime = z.string().datetime({ precision: 3 });

datetime.parse("2020-01-01T00:00:00.123Z"); // pass
datetime.parse("2020-01-01T00:00:00Z"); // fail
datetime.parse("2020-01-01T00:00Z"); // fail
datetime.parse("2020-01-01T00:00:00.123456Z"); // fail
```

### 日期

> 在 Zod 3.23 中新增

`z.string().date()` 方法验证格式为 `YYYY-MM-DD` 的字符串。

```ts
const date = z.string().date();

date.parse("2020-01-01"); // pass
date.parse("2020-1-1"); // fail
date.parse("2020-01-32"); // fail
```

### 时间

> 在 Zod 3.23 中新增

`z.string().time()` 方法验证格式为 `HH:MM` 或 `HH:MM:SS[.s+]` 的字符串。秒可以包含任意的小数精度。不允许任何形式的时区偏移。

```ts
const time = z.string().time();

time.parse("00:00:00"); // pass
time.parse("09:52:31"); // pass
time.parse("09:52"); // pass
time.parse("23:59:59.9999999"); // pass (arbitrary precision)

time.parse("00:00:00.123Z"); // fail (no `Z` allowed)
time.parse("00:00:00.123+02:00"); // fail (no offsets allowed)
```

你可以设置 `precision` 选项来限制允许的小数精度。

```ts
const time = z.string().time({ precision: 3 });

time.parse("00:00:00.123"); // pass
time.parse("00:00:00.123456"); // fail
time.parse("00:00:00"); // fail
time.parse("00:00"); // fail
```

### IP 地址

默认情况下，`.ip()` 同时允许 IPv4 和 IPv6。

```ts
const ip = z.string().ip();

ip.parse("192.168.1.1"); // pass
ip.parse("84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003"); // pass
ip.parse("84d5:51a0:9114:1855:4cfa:f2d7:1f12:192.168.1.1"); // pass

ip.parse("256.1.1.1"); // fail
ip.parse("84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003"); // fail
```

你还可以设置 IP `version`。

```ts
const ipv4 = z.string().ip({ version: "v4" });
ipv4.parse("84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003"); // fail

const ipv6 = z.string().ip({ version: "v6" });
ipv6.parse("192.168.1.1"); // fail
```

### IP 范围（CIDR）

验证使用 [CIDR 表示法](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)指定的 IP 地址范围。默认情况下，`.cidr()` 同时允许 IPv4 和 IPv6。

```ts
const cidr = z.string().cidr();
cidr.parse("192.168.0.0/24"); // pass
cidr.parse("2001:db8::/32"); // pass
```

你可以通过 `version` 参数指定版本。

```ts
const ipv4Cidr = z.string().cidr({ version: "v4" });
ipv4Cidr.parse("84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003"); // fail

const ipv6Cidr = z.string().cidr({ version: "v6" });
ipv6Cidr.parse("192.168.1.1"); // fail
```

<br/>

## 数字

创建数字 schema 时，可以自定义某些错误消息。

```ts
const age = z.number({
  required_error: "Age is required",
  invalid_type_error: "Age must be a number",
});
```

Zod 包含一些针对数字的专用验证。

```ts
z.number().gt(5);
z.number().gte(5); // alias .min(5)
z.number().lt(5);
z.number().lte(5); // alias .max(5)

z.number().int(); // value must be an integer

z.number().positive(); //     > 0
z.number().nonnegative(); //  >= 0
z.number().negative(); //     < 0
z.number().nonpositive(); //  <= 0

z.number().multipleOf(5); // Evenly divisible by 5. Alias .step(5)

z.number().finite(); // value must be finite, not Infinity or -Infinity
z.number().safe(); // value must be between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER
```

你还可以传入第二个参数来提供自定义错误消息。

```ts
z.number().lte(5, { message: "this👏is👏too👏big" });
```

<br/>

## BigInt

Zod 包含一些针对 bigint 的专用验证。

```ts
z.bigint().gt(5n);
z.bigint().gte(5n); // alias `.min(5n)`
z.bigint().lt(5n);
z.bigint().lte(5n); // alias `.max(5n)`

z.bigint().positive(); // > 0n
z.bigint().nonnegative(); // >= 0n
z.bigint().negative(); // < 0n
z.bigint().nonpositive(); // <= 0n

z.bigint().multipleOf(5n); // Evenly divisible by 5n.
```

<br/>

## NaN

创建 nan schema 时，可以自定义某些错误消息。

```ts
const isNaN = z.nan({
  required_error: "isNaN is required",
  invalid_type_error: "isNaN must be 'not a number'",
});
```

<br/>

## 布尔值

创建布尔值 schema 时，可以自定义某些错误消息。

```ts
const isActive = z.boolean({
  required_error: "isActive is required",
  invalid_type_error: "isActive must be a boolean",
});
```

<br/>

## 日期

使用 z.date() 验证 `Date` 实例。

```ts
z.date().safeParse(new Date()); // success: true
z.date().safeParse("2022-01-12T00:00:00.000Z"); // success: false
```

创建日期 schema 时，可以自定义某些错误消息。

```ts
const myDateSchema = z.date({
  required_error: "Please select a date and time",
  invalid_type_error: "That's not a date!",
});
```

Zod 提供了一些针对日期的专用验证。

```ts
z.date().min(new Date("1900-01-01"), { message: "Too old" });
z.date().max(new Date(), { message: "Too young!" });
```

**转换为 Date**

从 [zod 3.20](https://github.com/colinhacks/zod/releases/tag/v3.20) 开始，使用 [`z.coerce.date()`](#coercion-for-primitives) 将输入传递给 `new Date(input)`。

```ts
const dateSchema = z.coerce.date();
type DateSchema = z.infer<typeof dateSchema>;
// type DateSchema = Date

/* valid dates */
console.log(dateSchema.safeParse("2023-01-10T00:00:00.000Z").success); // true
console.log(dateSchema.safeParse("2023-01-10").success); // true
console.log(dateSchema.safeParse("1/10/23").success); // true
console.log(dateSchema.safeParse(new Date("1/10/23")).success); // true

/* invalid dates */
console.log(dateSchema.safeParse("2023-13-10").success); // false
console.log(dateSchema.safeParse("0000-00-00").success); // false
```

对于较旧版本的 zod，请使用 [`z.preprocess`](#preprocess)，具体请参阅[此讨论串中的说明](https://github.com/colinhacks/zod/discussions/879#discussioncomment-2036276)。

<br/>

## Zod 枚举

```ts
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);
type FishEnum = z.infer<typeof FishEnum>;
// 'Salmon' | 'Tuna' | 'Trout'
```

`z.enum` 是一种原生于 Zod 的方式，用于声明包含固定可用_字符串_值集合的 schema。将值数组直接传入 `z.enum()`。或者，使用 `as const` 将枚举值定义为字符串元组。详情请参阅 [const 断言文档](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)。

```ts
const VALUES = ["Salmon", "Tuna", "Trout"] as const;
const FishEnum = z.enum(VALUES);
```

以下方式不被允许，因为 Zod 无法推断每个元素的确切值。

```ts
const fish = ["Salmon", "Tuna", "Trout"];
const FishEnum = z.enum(fish);
```

**`.enum`**

若要在 Zod 枚举中获得自动补全，请使用 schema 的 `.enum` 属性：

```ts
FishEnum.enum.Salmon; // => autocompletes

FishEnum.enum;
/*
=> {
  Salmon: "Salmon",
  Tuna: "Tuna",
  Trout: "Trout",
}
*/
```

你还可以通过 `.options` 属性将选项列表作为元组获取：

```ts
FishEnum.options; // ["Salmon", "Tuna", "Trout"];
```

**`.exclude/.extract()`**

你可以使用 `.exclude` 和 `.extract` 方法创建 Zod 枚举的子集。

```ts
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);
const SalmonAndTrout = FishEnum.extract(["Salmon", "Trout"]);
const TunaOnly = FishEnum.exclude(["Salmon", "Trout"]);
```

<br/>

## 原生枚举

Zod 枚举是定义和验证枚举的推荐方式。但如果你需要针对第三方库中的枚举进行验证（或者不想重写已有枚举），可以使用 `z.nativeEnum()`。

**数字枚举**

```ts
enum Fruits {
  Apple,
  Banana,
}

const FruitEnum = z.nativeEnum(Fruits);
type FruitEnum = z.infer<typeof FruitEnum>; // Fruits

FruitEnum.parse(Fruits.Apple); // passes
FruitEnum.parse(Fruits.Banana); // passes
FruitEnum.parse(0); // passes
FruitEnum.parse(1); // passes
FruitEnum.parse(3); // fails
```

**字符串枚举**

```ts
enum Fruits {
  Apple = "apple",
  Banana = "banana",
  Cantaloupe, // you can mix numerical and string enums
}

const FruitEnum = z.nativeEnum(Fruits);
type FruitEnum = z.infer<typeof FruitEnum>; // Fruits

FruitEnum.parse(Fruits.Apple); // passes
FruitEnum.parse(Fruits.Cantaloupe); // passes
FruitEnum.parse("apple"); // passes
FruitEnum.parse("banana"); // passes
FruitEnum.parse(0); // passes
FruitEnum.parse("Cantaloupe"); // fails
```

**Const 枚举**

`.nativeEnum()` 函数同样适用于 `as const` 对象。⚠️ `as const` 要求 TypeScript 3.4+！

```ts
const Fruits = {
  Apple: "apple",
  Banana: "banana",
  Cantaloupe: 3,
} as const;

const FruitEnum = z.nativeEnum(Fruits);
type FruitEnum = z.infer<typeof FruitEnum>; // "apple" | "banana" | 3

FruitEnum.parse("apple"); // passes
FruitEnum.parse("banana"); // passes
FruitEnum.parse(3); // passes
FruitEnum.parse("Cantaloupe"); // fails
```

你可以通过 `.enum` 属性访问底层对象：

```ts
FruitEnum.enum.Apple; // "apple"
```

<br/>

## 可选类型

你可以使用 `z.optional()` 将任意 schema 设为可选。它会将 schema 包装在一个 `ZodOptional` 实例中，并返回结果。

```ts
const schema = z.optional(z.string());

schema.parse(undefined); // => returns undefined
type A = z.infer<typeof schema>; // string | undefined
```

为方便起见，你也可以在现有 schema 上调用 `.optional()` 方法。

```ts
const user = z.object({
  username: z.string().optional(),
});
type C = z.infer<typeof user>; // { username?: string | undefined };
```

你可以通过 `.unwrap()` 从 `ZodOptional` 实例中提取被包装的 schema。

```ts
const stringSchema = z.string();
const optionalString = stringSchema.optional();
optionalString.unwrap() === stringSchema; // true
```

<br/>

## 可空类型

同样，你可以使用 `z.nullable()` 创建可空类型。

```ts
const nullableString = z.nullable(z.string());
nullableString.parse("asdf"); // => "asdf"
nullableString.parse(null); // => null
```

或者使用 `.nullable()` 方法。

```ts
const E = z.string().nullable(); // equivalent to nullableString
type E = z.infer<typeof E>; // string | null
```

使用 `.unwrap()` 提取内部 schema。

```ts
const stringSchema = z.string();
const nullableString = stringSchema.nullable();
nullableString.unwrap() === stringSchema; // true
```

<br/>

## 对象

```ts
// all properties are required by default
const Dog = z.object({
  name: z.string(),
  age: z.number(),
});

// extract the inferred type like this
type Dog = z.infer<typeof Dog>;

// equivalent to:
type Dog = {
  name: string;
  age: number;
};
```

### `.shape`

使用 `.shape` 访问特定键对应的 schema。

```ts
Dog.shape.name; // => string schema
Dog.shape.age; // => number schema
```

### `.keyof`

使用 `.keyof` 根据对象 schema 的键创建一个 `ZodEnum` schema。

```ts
const keySchema = Dog.keyof();
keySchema; // ZodEnum<["name", "age"]>
```

### `.extend`

你可以使用 `.extend` 方法向对象 schema 添加其他字段。

```ts
const DogWithBreed = Dog.extend({
  breed: z.string(),
});
```

你可以使用 `.extend` 覆盖字段！请谨慎使用这一能力！

### `.merge`

等价于 `A.extend(B.shape)`。

```ts
const BaseTeacher = z.object({ students: z.array(z.string()) });
const HasID = z.object({ id: z.string() });

const Teacher = BaseTeacher.merge(HasID);
type Teacher = z.infer<typeof Teacher>; // => { students: string[], id: string }
```

> 如果两个 schema 共享键，B 的属性会覆盖 A 的属性。返回的 schema 还会继承 B 的 `"unknownKeys"` 策略（strip／strict／passthrough）以及 catchall schema。

### `.pick/.omit`

受 TypeScript 内置 `Pick` 和 `Omit` 工具类型的启发，所有 Zod 对象 schema 都有 `.pick` 和 `.omit` 方法，可以返回一个修改后的版本。考虑以下 Recipe schema：

```ts
const Recipe = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: z.array(z.string()),
});
```

若只保留特定的键，请使用 `.pick`。

```ts
const JustTheName = Recipe.pick({ name: true });
type JustTheName = z.infer<typeof JustTheName>;
// => { name: string }
```

若要移除特定的键，请使用 `.omit`。

```ts
const NoIDRecipe = Recipe.omit({ id: true });

type NoIDRecipe = z.infer<typeof NoIDRecipe>;
// => { name: string, ingredients: string[] }
```

### `.partial`

受内置 TypeScript 工具类型 [Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) 的启发，`.partial` 方法会将所有属性设为可选。

从以下对象开始：

```ts
const user = z.object({
  email: z.string(),
  username: z.string(),
});
// { email: string; username: string }
```

我们可以创建一个 partial 版本：

```ts
const partialUser = user.partial();
// { email?: string | undefined; username?: string | undefined }
```

你还可以指定要设为可选的属性：

```ts
const optionalEmail = user.partial({
  email: true,
});
/*
{
  email?: string | undefined;
  username: string
}
*/
```

### `.deepPartial`

`.partial` 方法是浅层的——它只应用于一层。还有一个“深层”版本：

```ts
const user = z.object({
  username: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  strings: z.array(z.object({ value: z.string() })),
});

const deepPartialUser = user.deepPartial();

/*
{
  username?: string | undefined,
  location?: {
    latitude?: number | undefined;
    longitude?: number | undefined;
  } | undefined,
  strings?: { value?: string}[]
}
*/
```

> 重要限制：深层 partial 只适用于由对象、数组和元组构成的层级结构。

### `.required`

与 `.partial` 方法相反，`.required` 方法会将所有属性设为必需。

从以下对象开始：

```ts
const user = z
  .object({
    email: z.string(),
    username: z.string(),
  })
  .partial();
// { email?: string | undefined; username?: string | undefined }
```

我们可以创建一个 required 版本：

```ts
const requiredUser = user.required();
// { email: string; username: string }
```

你还可以指定要设为必需的属性：

```ts
const requiredEmail = user.required({
  email: true,
});
/*
{
  email: string;
  username?: string | undefined;
}
*/
```

### `.passthrough`

默认情况下，Zod 对象 schema 在解析过程中会移除无法识别的键。

```ts
const person = z.object({
  name: z.string(),
});

person.parse({
  name: "bob dylan",
  extraKey: 61,
});
// => { name: "bob dylan" }
// extraKey has been stripped
```

相反，如果你希望保留未知键，请使用 `.passthrough()`。

```ts
person.passthrough().parse({
  name: "bob dylan",
  extraKey: 61,
});
// => { name: "bob dylan", extraKey: 61 }
```

### `.strict`

默认情况下，Zod 对象 schema 在解析过程中会移除无法识别的键。你可以使用 `.strict()` 来_禁止_未知键。如果输入中存在任何未知键，Zod 将抛出错误。

```ts
const person = z
  .object({
    name: z.string(),
  })
  .strict();

person.parse({
  name: "bob dylan",
  extraKey: 61,
});
// => throws ZodError
```

### `.strip`

你可以使用 `.strip` 方法将对象 schema 重置为默认行为（移除无法识别的键）。

### `.catchall`

你可以将一个“catchall” schema 传入对象 schema。所有未知键都会根据它进行验证。

```ts
const person = z
  .object({
    name: z.string(),
  })
  .catchall(z.number());

person.parse({
  name: "bob dylan",
  validExtraKey: 61, // works fine
});

person.parse({
  name: "bob dylan",
  validExtraKey: false, // fails
});
// => throws ZodError
```

使用 `.catchall()` 后，`.passthrough()`、`.strip()` 或 `.strict()` 都不再需要。现在所有键都会被视为“已知”。

<br/>

## 数组

```ts
const stringArray = z.array(z.string());

// equivalent
const stringArray = z.string().array();
```

使用 `.array()` 方法时要小心。它会返回一个新的 `ZodArray` 实例。这意味着调用方法的_顺序_很重要。例如：

```ts
z.string().optional().array(); // (string | undefined)[]
z.string().array().optional(); // string[] | undefined
```

### `.element`

使用 `.element` 访问数组元素对应的 schema。

```ts
stringArray.element; // => string schema
```

### `.nonempty`

如果你希望确保数组至少包含一个元素，请使用 `.nonempty()`。

```ts
const nonEmptyStrings = z.string().array().nonempty();
// the inferred type is now
// [string, ...string[]]

nonEmptyStrings.parse([]); // throws: "Array cannot be empty"
nonEmptyStrings.parse(["Ariana Grande"]); // passes
```

你可以选择指定自定义错误消息：

```ts
// optional custom error message
const nonEmptyStrings = z.string().array().nonempty({
  message: "Can't be empty!",
});
```

### `.min/.max/.length`

```ts
z.string().array().min(5); // must contain 5 or more items
z.string().array().max(5); // must contain 5 or fewer items
z.string().array().length(5); // must contain 5 items exactly
```

与 `.nonempty()` 不同，这些方法不会改变推断出的类型。

<br/>

## 元组

与数组不同，元组具有固定数量的元素，并且每个元素可以拥有不同的类型。

```ts
const athleteSchema = z.tuple([
  z.string(), // name
  z.number(), // jersey number
  z.object({
    pointsScored: z.number(),
  }), // statistics
]);

type Athlete = z.infer<typeof athleteSchema>;
// type Athlete = [string, number, { pointsScored: number }]
```

可以使用 `.rest` 方法添加可变参数（“剩余”）参数。

```ts
const variadicTuple = z.tuple([z.string()]).rest(z.number());
const result = variadicTuple.parse(["hello", 1, 2, 3]);
// => [string, ...number[]];
```

<br/>

## 联合

Zod 提供了内置的 `z.union` 方法，用于组合“或”类型。

```ts
const stringOrNumber = z.union([z.string(), z.number()]);

stringOrNumber.parse("foo"); // passes
stringOrNumber.parse(14); // passes
```

Zod 会按顺序使用每个“选项”测试输入，并返回第一个成功验证的值。

为方便起见，你也可以使用[`.or` 方法](#or)：

```ts
const stringOrNumber = z.string().or(z.number());
```

**可选字符串验证：**

若要验证可选的表单输入，可以将所需的字符串验证与空字符串[字面量](#literals)进行联合。

以下示例验证一个可选输入，但该输入必须包含一个[有效 URL](#strings)：

```ts
const optionalUrl = z.union([z.string().url().nullish(), z.literal("")]);

console.log(optionalUrl.safeParse(undefined).success); // true
console.log(optionalUrl.safeParse(null).success); // true
console.log(optionalUrl.safeParse("").success); // true
console.log(optionalUrl.safeParse("https://zod.dev").success); // true
console.log(optionalUrl.safeParse("not a valid url").success); // false
```

<br/>

## 可辨识联合

可辨识联合是由多个对象 schema 组成的联合，并且这些 schema 都共享某个特定键。

```ts
type MyUnion =
  | { status: "success"; data: string }
  | { status: "failed"; error: Error };
```

这样的联合可以使用 `z.discriminatedUnion` 方法表示。这可以实现更快的求值，因为 Zod 可以检查_辨识键_（上例中的 `status`），以确定应该使用哪个 schema 来解析输入。这使解析更加高效，也让 Zod 能够报告更友好的错误。

使用基本的联合方法时，输入会针对每个给定的“选项”进行测试；如果无效，zod 错误中会显示所有“选项”的问题。另一方面，可辨识联合只选择一个“选项”进行测试，并且只显示与该“选项”相关的问题。

```ts
const myUnion = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("failed"), error: z.instanceof(Error) }),
]);

myUnion.parse({ status: "success", data: "yippie ki yay" });
```

你可以通过 `.options` 属性提取 schema 数组的引用。

```ts
myUnion.options; // [ZodObject<...>, ZodObject<...>]
```

若要合并两个或更多可辨识联合，请结合解构使用 `.options`。

```ts
const A = z.discriminatedUnion("status", [
  /* options */
]);
const B = z.discriminatedUnion("status", [
  /* options */
]);

const AB = z.discriminatedUnion("status", [...A.options, ...B.options]);
```

<br/>

## Record

Record schema 用于验证诸如 `Record<string, number>` 的类型。这对于按 ID 存储或缓存条目尤其有用。

<!-- If you want to validate the _values_ of an object against some schema but don't care about the keys, use `z.record(valueType)`:

```ts
const NumberCache = z.record(z.number());

type NumberCache = z.infer<typeof NumberCache>;
// => { [k: string]: number }
``` -->

```ts
const User = z.object({ name: z.string() });

const UserStore = z.record(z.string(), User);
type UserStore = z.infer<typeof UserStore>;
// => Record<string, { name: string }>
```

schema 和推断出的类型可以这样使用：

```ts
const userStore: UserStore = {};

userStore["77d2586b-9e8e-4ecf-8b21-ea7e0530eadd"] = {
  name: "Carlotta",
}; // passes

userStore["77d2586b-9e8e-4ecf-8b21-ea7e0530eadd"] = {
  whatever: "Ice cream sundae",
}; // TypeError
```

**关于数字键的说明**

虽然 `z.record(keyType, valueType)` 能够接受数字键类型，且 TypeScript 内置的 Record 类型是 `Record<KeyType, ValueType>`，但很难在 Zod 中表示 TypeScript 类型 `Record<number, any>`。

事实证明，TypeScript 围绕 `[k: number]` 的行为有些不直观：

```ts
const testMap: { [k: number]: string } = {
  1: "one",
};

for (const key in testMap) {
  console.log(`${key}: ${typeof key}`);
}
// prints: `1: string`
```

如你所见，JavaScript 会在底层自动将所有对象键转换为字符串。由于 Zod 试图弥合静态类型与运行时类型之间的差距，因此没有必要提供创建数字键 Record schema 的方式，因为在运行时 JavaScript 中不存在数字键。

<br/>

## Map

```ts
const stringNumberMap = z.map(z.string(), z.number());

type StringNumberMap = z.infer<typeof stringNumberMap>;
// type StringNumberMap = Map<string, number>
```

<br/>

## Set

```ts
const numberSet = z.set(z.number());
type NumberSet = z.infer<typeof numberSet>;
// type NumberSet = Set<number>
```

Set schema 还可以使用以下工具方法进一步限制。

```ts
z.set(z.string()).nonempty(); // must contain at least one item
z.set(z.string()).min(5); // must contain 5 or more items
z.set(z.string()).max(5); // must contain 5 or fewer items
z.set(z.string()).size(5); // must contain 5 items exactly
```

<br/>

## 交集

交集适合创建“逻辑与”类型。这对于交集两个对象类型很有用。

```ts
const Person = z.object({
  name: z.string(),
});

const Employee = z.object({
  role: z.string(),
});

const EmployedPerson = z.intersection(Person, Employee);

// equivalent to:
const EmployedPerson = Person.and(Employee);
```

不过在许多情况下，建议使用 `A.merge(B)` 来合并两个对象。`.merge` 方法会返回一个新的 `ZodObject` 实例，而 `A.and(B)` 返回的是不太实用的 `ZodIntersection` 实例，后者缺少 `pick` 和 `omit` 等常见对象方法。

```ts
const a = z.union([z.number(), z.string()]);
const b = z.union([z.number(), z.boolean()]);
const c = z.intersection(a, b);

type c = z.infer<typeof c>; // => number
```

<!-- Intersections in Zod are not smart. Whatever data you pass into `.parse()` gets passed into the two intersected schemas. Because Zod object schemas don't allow any unknown keys by default, there are some unintuitive behavior surrounding intersections of object schemas. -->

<!--

``` ts
const A = z.object({
  a: z.string(),
});

const B = z.object({
  b: z.string(),
});

const AB = z.intersection(A, B);

type Teacher = z.infer<typeof Teacher>;
// { id:string; name:string };
```  -->

<br/>

## 递归类型

你可以在 Zod 中定义递归 schema，但由于 TypeScript 的限制，其类型无法被静态推断。相反，你需要手动定义类型，并将其作为“类型提示”提供给 Zod。

```ts
const baseCategorySchema = z.object({
  name: z.string(),
});

type Category = z.infer<typeof baseCategorySchema> & {
  subcategories: Category[];
};

const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
  subcategories: z.lazy(() => categorySchema.array()),
});

categorySchema.parse({
  name: "People",
  subcategories: [
    {
      name: "Politicians",
      subcategories: [
        {
          name: "Presidents",
          subcategories: [],
        },
      ],
    },
  ],
}); // passes
```

感谢 [crasite](https://github.com/crasite) 提供此示例。

### 包含 ZodEffects 的 ZodType

当 `z.ZodType` 与 `z.ZodEffects`（
[`.refine`](https://github.com/colinhacks/zod#refine)、
[`.transform`](https://github.com/colinhacks/zod#transform)、
[`preprocess`](https://github.com/colinhacks/zod#preprocess)、
等等……
）一起使用时，你需要定义 schema 的输入和输出类型。`z.ZodType<Output, z.ZodTypeDef, Input>`

```ts
const isValidId = (id: string): id is `${string}/${string}` =>
  id.split("/").length === 2;

const baseSchema = z.object({
  id: z.string().refine(isValidId),
});

type Input = z.input<typeof baseSchema> & {
  children: Input[];
};

type Output = z.output<typeof baseSchema> & {
  children: Output[];
};

const schema: z.ZodType<Output, z.ZodTypeDef, Input> = baseSchema.extend({
  children: z.lazy(() => schema.array()),
});
```

感谢 [marcus13371337](https://github.com/marcus13371337) 和 [JoelBeeldi](https://github.com/JoelBeeldi) 提供此示例。

### JSON 类型

如果你希望验证任意 JSON 值，可以使用下面的代码片段。

```ts
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

jsonSchema.parse(data);
```

感谢 [ggoodman](https://github.com/ggoodman) 提出这一建议。

### 循环对象

尽管支持递归 schema，但将循环数据传入 Zod 在某些情况下会导致无限循环。

> 为了在循环对象造成问题之前检测它们，可以考虑[此方法](https://gist.github.com/colinhacks/d35825e505e635df27cc950776c5500b)。

<br/>

## Promise

```ts
const numberPromise = z.promise(z.number());
```

使用 Promise schema 时，“解析”的工作方式略有不同。验证分为两部分：

1. Zod 会同步检查输入是否为 Promise 的实例（即一个具有 `.then` 和 `.catch` 方法的对象。）。
2. Zod 使用 `.then` 将额外的验证步骤附加到现有 Promise 上。你必须在返回的 Promise 上使用 `.catch` 来处理验证失败。

```ts
numberPromise.parse("tuna");
// ZodError: Non-Promise type: string

numberPromise.parse(Promise.resolve("tuna"));
// => Promise<number>

const test = async () => {
  await numberPromise.parse(Promise.resolve("tuna"));
  // ZodError: Non-number type: string

  await numberPromise.parse(Promise.resolve(3.14));
  // => 3.14
};
```

<!-- #### Non-native promise implementations

When "parsing" a promise, Zod checks that the passed value is an object with `.then` and `.catch` methods — that's it. So you should be able to pass non-native Promises (Bluebird, etc) into `z.promise(...).parse` with no trouble. One gotcha: the return type of the parse function will be a _native_ `Promise` , so if you have downstream logic that uses non-standard Promise methods, this won't work. -->

<br/>

## Instanceof

你可以使用 `z.instanceof` 检查输入是否为某个类的实例。这对于根据第三方库导出的类验证输入很有用。

```ts
class Test {
  name: string;
}

const TestSchema = z.instanceof(Test);

const blob: any = "whatever";
TestSchema.parse(new Test()); // passes
TestSchema.parse(blob); // throws
```

<br/>

## 函数

Zod 还允许你定义“函数 schema”。这使得验证函数的输入和输出变得简单，同时无需将验证代码与“业务逻辑”混在一起。

你可以使用 `z.function(args, returnType)` 创建函数 schema。

```ts
const myFunction = z.function();

type myFunction = z.infer<typeof myFunction>;
// => ()=>unknown
```

定义输入和输出。

```ts
const myFunction = z
  .function()
  .args(z.string(), z.number()) // accepts an arbitrary number of arguments
  .returns(z.boolean());

type myFunction = z.infer<typeof myFunction>;
// => (arg0: string, arg1: number)=>boolean
```

<!--

``` ts
const args = z.tuple([z.string()]);

const returnType = z.number();

const myFunction = z.function(args, returnType);
type myFunction = z.infer<typeof myFunction>;
// => (arg0: string)=>number
``` -->

函数 schema 具有 `.implement()` 方法，该方法接受一个函数，并返回一个会自动验证其输入和输出的新函数。

```ts
const trimmedLength = z
  .function()
  .args(z.string()) // accepts an arbitrary number of arguments
  .returns(z.number())
  .implement((x) => {
    // TypeScript knows x is a string!
    return x.trim().length;
  });

trimmedLength("sandwich"); // => 8
trimmedLength(" asdf "); // => 4
```

如果你只关心验证输入，就不要调用 `.returns()` 方法。输出类型将根据实现进行推断。

> 如果函数不返回任何内容，可以使用特殊的 `z.void()` 选项。这会让 Zod 正确推断返回 void 的函数类型。（返回 void 的函数实际上会返回 undefined。）

```ts
const myFunction = z
  .function()
  .args(z.string())
  .implement((arg) => {
    return [arg.length];
  });

myFunction; // (arg: string)=>number[]
```

从函数 schema 中提取输入和输出 schema。

```ts
myFunction.parameters();
// => ZodTuple<[ZodString, ZodNumber]>

myFunction.returnType();
// => ZodBoolean
```

<!-- `z.function()` accepts two arguments:

* `args: ZodTuple` The first argument is a tuple (created with `z.tuple([...])` and defines the schema of the arguments to your function. If the function doesn't accept arguments, you can pass an empty tuple (`z.tuple([])`).
* `returnType: any Zod schema` The second argument is the function's return type. This can be any Zod schema. -->

<br/>

## Preprocess

> Zod 现在支持原始类型强制转换，无需使用 `.preprocess()`。详情请参阅[强制转换文档](#coercion-for-primitives)。

通常，Zod 遵循“先解析，再转换”的范式。Zod 会先验证输入，然后将其传递给一系列转换函数。（有关转换的更多信息，请阅读[`.transform` 文档](#transform)。）

但有时你希望在解析发生_之前_对输入应用某种转换。一个常见的使用场景是：类型强制转换。Zod 通过 `z.preprocess()` 提供了这一能力。

```ts
const castToString = z.preprocess((val) => String(val), z.string());
```

这会返回一个 `ZodEffects` 实例。`ZodEffects` 是一个包装类，包含与预处理、细化和转换有关的全部逻辑。

<br/>

## 自定义 schema

你可以使用 `z.custom()` 为任意 TypeScript 类型创建 Zod schema。这对于创建 Zod 默认不支持的类型 schema 很有用，例如模板字符串字面量。

```ts
const px = z.custom<`${number}px`>((val) => {
  return typeof val === "string" ? /^\d+px$/.test(val) : false;
});

type px = z.infer<typeof px>; // `${number}px`

px.parse("42px"); // "42px"
px.parse("42vw"); // throws;
```

如果不提供验证函数，Zod 将允许任何值。这可能会带来危险！

```ts
z.custom<{ arg: string }>(); // performs no validation
```

你可以通过传入第二个参数自定义错误消息和其他选项。此参数的工作方式与[`.refine`](#refine) 的 params 参数相同。

```ts
z.custom<...>((val) => ..., "custom error message");
```

<br/>

## Schema 方法

所有 Zod schema 都包含一些方法。

### `.parse`

`.parse(data: unknown): T`

给定任意 Zod schema，你可以调用其 `.parse` 方法来检查 `data` 是否有效。如果有效，则会返回一个具有完整类型信息的值！否则会抛出错误。

> 重要：`.parse` 返回的值是你传入变量的_深拷贝_。

```ts
const stringSchema = z.string();

stringSchema.parse("fish"); // => returns "fish"
stringSchema.parse(12); // throws error
```

### `.parseAsync`

`.parseAsync(data:unknown): Promise<T>`

如果使用异步[细化](#refine)或[转换](#transform)（稍后会详细介绍），则需要使用 `.parseAsync`

```ts
const stringSchema = z.string().refine(async (val) => val.length <= 8);

await stringSchema.parseAsync("hello"); // => returns "hello"
await stringSchema.parseAsync("hello world"); // => throws error
```

### `.safeParse`

`.safeParse(data:unknown): { success: true; data: T; } | { success: false; error: ZodError; }`

如果不希望 Zod 在验证失败时抛出错误，请使用 `.safeParse`。此方法返回一个对象，其中包含成功解析的数据，或包含验证问题详细信息的 ZodError 实例

```ts
stringSchema.safeParse(12);
// => { success: false; error: ZodError }

stringSchema.safeParse("billie");
// => { success: true; data: 'billie' }
```

结果是一个_可辨识联合_，因此可以非常方便地处理错误：

```ts
const result = stringSchema.safeParse("billie");
if (!result.success) {
  // handle error then return
  result.error;
} else {
  // do something
  result.data;
}
```

### `.safeParseAsync`

> 别名：`.spa`

`safeParse` 的异步版本

```ts
await stringSchema.safeParseAsync("billie");
```

为方便起见，它被设置了别名 `.spa`：

```ts
await stringSchema.spa("billie");
```

### `.refine`

`.refine(validator: (data:T)=>any, params?: RefineParams)`

Zod 允许通过_细化_提供自定义验证逻辑。（有关创建多个问题和自定义错误代码等高级功能，请参阅[`.superRefine`](#superrefine)）

Zod 的设计目标是尽可能贴近 TypeScript。但有许多所谓的“细化类型”是你可能希望检查的，却无法在 TypeScript 的类型系统中表示。例如：检查一个数字是否为整数，或一个字符串是否为有效的电子邮件地址

例如，你可以使用 `.refine` 在_任意_ Zod schema 上定义自定义验证检查：

```ts
const myString = z.string().refine((val) => val.length <= 255, {
  message: "String can't be more than 255 characters",
});
```

> ⚠️ 细化函数不应抛出错误。相反，它们应返回一个假值来表示失败

#### 参数

如你所见，`.refine` 接受两个参数

1. 第一个是验证函数。此函数接收一个输入（类型为 `T`——schema 的推断类型），并返回 `any`。任何真值都会通过验证。（在 zod@1.6.2 之前，验证函数必须返回布尔值。）
2. 第二个参数接受一些选项。你可以使用它来自定义某些错误处理行为：

```ts
type RefineParams = {
  // override error message
  message?: string;

  // appended to error path
  path?: (string | number)[];

  // params object you can use to customize message
  // in error map
  params?: object;
};
```

对于高级场景，第二个参数也可以是一个返回 `RefineParams` 的函数

```ts
const longString = z.string().refine(
  (val) => val.length > 10,
  (val) => ({ message: `${val} is not more than 10 characters` }),
);
```

#### 自定义错误路径

```ts
const passwordForm = z
  .object({
    password: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  });

passwordForm.parse({ password: "asdf", confirm: "qwer" });
```

由于提供了 `path` 参数，生成的错误将是：

```ts
ZodError {
  issues: [{
    "code": "custom",
    "path": [ "confirm" ],
    "message": "Passwords don't match"
  }]
}
```

#### 异步细化

细化也可以是异步的：

```ts
const userId = z.string().refine(async (id) => {
  // verify that ID exists in database
  return true;
});
```

> ⚠️ 如果使用异步细化，则必须使用 `.parseAsync` 方法解析数据！否则 Zod 将抛出错误

#### 与转换的关系

转换和细化可以交错使用：

```ts
z.string()
  .transform((val) => val.length)
  .refine((val) => val > 25);
```

<!-- 注意，`path` 被设置为 `["confirm"]`，因此你可以轻松地将此错误显示在“确认密码”文本框下方

```ts
const allForms = z.object({ passwordForm }).parse({
  passwordForm: {
    password: "asdf",
    confirm: "qwer",
  },
});
```

结果将是

```

ZodError {
  issues: [{
    "code": "custom",
    "path": [ "passwordForm", "confirm" ],
    "message": "Passwords don't match"
  }]
}
``` -->

### `.superRefine`

`.refine` 方法实际上是一个更灵活（也更冗长）的方法 `superRefine` 的语法糖。下面是一个示例：

```ts
const Strings = z.array(z.string()).superRefine((val, ctx) => {
  if (val.length > 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 3,
      type: "array",
      inclusive: true,
      message: "Too many items 😡",
    });
  }

  if (val.length !== new Set(val).size) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `No duplicates allowed.`,
    });
  }
});
```

你可以添加任意数量的问题。如果函数执行期间没有调用 `ctx.addIssue`，验证就会通过

通常，细化总是使用 `ZodIssueCode.custom` 错误代码创建问题，但使用 `superRefine` 可以抛出任意 `ZodIssueCode` 的问题。每种问题代码都在错误处理指南中进行了详细说明：[ERROR_HANDLING.md](ERROR_HANDLING.md)

#### 提前中止

默认情况下，即使细化检查失败，解析也会继续进行。例如，如果串联了多个细化，它们都会被执行。不过，有时可能希望_提前中止_，以防止执行后续细化。为此，请将 `fatal` 标志传递给 `ctx.addIssue`，并返回 `z.NEVER`

```ts
const schema = z.number().superRefine((val, ctx) => {
  if (val < 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "should be >= 10",
      fatal: true,
    });

    return z.NEVER;
  }

  if (val !== 12) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "should be twelve",
    });
  }
});
```

#### 类型细化

如果向 `.refine()` 或 `.superRefine()` 提供[类型谓词](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)，则生成的类型会缩小为谓词的类型。当混合使用多个串联的细化和转换时，这非常有用：

```ts
const schema = z
  .object({
    first: z.string(),
    second: z.number(),
  })
  .nullable()
  .superRefine((arg, ctx): arg is { first: string; second: number } => {
    if (!arg) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // customize your issue
        message: "object should exist",
      });
    }

    return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
  })
  // here, TS knows that arg is not null
  .refine((arg) => arg.first === "bob", "`first` is not `bob`!");
```

> ⚠️ **必须**使用 `ctx.addIssue()`，而不是返回布尔值，来表示验证是否通过。如果函数执行期间没有调用 `ctx.addIssue`，验证就会通过

### `.transform`

要在解析后转换数据，请使用 `transform` 方法

```ts
const stringToNumber = z.string().transform((val) => val.length);

stringToNumber.parse("string"); // => 6
```

#### 链接顺序

请注意，上面的 `stringToNumber` 是 `ZodEffects` 子类的实例，而不是 `ZodString` 的实例。如果想使用 `ZodString` 的内置方法（例如 `.email()`），必须在任何转换之前应用这些方法

```ts
const emailToDomain = z
  .string()
  .email()
  .transform((val) => val.split("@")[1]);

emailToDomain.parse("colinhacks@example.com"); // => example.com
```

#### 在转换期间进行验证

`.transform` 方法可以同时验证和转换值。这通常比串联使用 `transform` 和 `refine` 更简单，也更不重复

与 `.superRefine` 一样，转换函数接收一个带有 `addIssue` 方法的 `ctx` 对象，可用于注册验证问题

```ts
const numberInString = z.string().transform((val, ctx) => {
  const parsed = parseInt(val);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Not a number",
    });

    // This is a special symbol you can use to
    // return early from the transform function.
    // It has type `never` so it does not affect the
    // inferred return type.
    return z.NEVER;
  }
  return parsed;
});
```

#### 与细化的关系

转换和细化可以交错使用。它们将按照声明顺序执行

```ts
const nameToGreeting = z
  .string()
  .transform((val) => val.toUpperCase())
  .refine((val) => val.length > 15)
  .transform((val) => `Hello ${val}`)
  .refine((val) => val.indexOf("!") === -1);
```

#### 异步转换

转换也可以是异步的

```ts
const IdToUser = z
  .string()
  .uuid()
  .transform(async (id) => {
    return await getUserById(id);
  });
```

> ⚠️ 如果 schema 包含异步转换，则必须使用 .parseAsync() 或 .safeParseAsync() 解析数据。否则 Zod 将抛出错误

### `.default`

你可以使用转换在 Zod 中实现“默认值”的概念

```ts
const stringWithDefault = z.string().default("tuna");

stringWithDefault.parse(undefined); // => "tuna"
```

你也可以选择将一个函数传递给 `.default`，每当需要生成默认值时，该函数都会重新执行：

```ts
const numberWithRandomDefault = z.number().default(Math.random);

numberWithRandomDefault.parse(undefined); // => 0.4413456736055323
numberWithRandomDefault.parse(undefined); // => 0.1871840107401901
numberWithRandomDefault.parse(undefined); // => 0.7223408162401552
```

从概念上讲，这就是 Zod 处理默认值的方式：

1. 如果输入是 `undefined`，则替换为默认值
2. 然后使用基础 schema 解析数据。你的默认值也会由 schema 解析（包括任何可能的转换）

### `.describe`

使用 `.describe()` 为生成的 schema 添加 `description` 属性

```ts
const documentedString = z
  .string()
  .describe("A useful bit of text, if you know what to do with it.");
documentedString.description; // A useful bit of text…
```

例如，使用 [`zod-to-json-schema`](https://github.com/StefanTerdell/zod-to-json-schema) 这样的库在 JSON Schema 中记录字段时，这会很有用

### `.catch`

使用 `.catch()` 提供一个“捕获值”，在解析错误发生时返回该值

```ts
const numberWithCatch = z.number().catch(42);

numberWithCatch.parse(5); // => 5
numberWithCatch.parse("tuna"); // => 42
```

你也可以选择将一个函数传递给 `.catch`，每当需要生成默认值时，该函数都会重新执行。一个包含捕获错误的 `ctx` 对象会被传递给此函数

```ts
const numberWithRandomCatch = z.number().catch((ctx) => {
  ctx.error; // the caught ZodError
  return Math.random();
});

numberWithRandomCatch.parse("sup"); // => 0.4413456736055323
numberWithRandomCatch.parse("sup"); // => 0.1871840107401901
numberWithRandomCatch.parse("sup"); // => 0.7223408162401552
```

从概念上讲，这就是 Zod 处理“捕获值”的方式：

1. 使用基础 schema 解析数据
2. 如果解析失败，则返回“捕获值”

### `.optional`

返回 schema 可选版本的便捷方法

```ts
const optionalString = z.string().optional(); // string | undefined

// equivalent to
z.optional(z.string());
```

### `.nullable`

返回 schema 可空版本的便捷方法

```ts
const nullableString = z.string().nullable(); // string | null

// equivalent to
z.nullable(z.string());
```

### `.nullish`

返回 schema “nullish”版本的便捷方法。Nullish schema 将同时接受 `undefined` 和 `null`。有关“nullish”概念的更多信息，请参阅 [TypeScript 3.7 发布说明](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing)

```ts
const nullishString = z.string().nullish(); // string | null | undefined

// equivalent to
z.string().nullable().optional();
```

### `.array`

为给定类型返回数组 schema 的便捷方法：

```ts
const stringArray = z.string().array(); // string[]

// equivalent to
z.array(z.string());
```

### `.promise`

用于 Promise 类型的便捷方法：

```ts
const stringPromise = z.string().promise(); // Promise<string>

// equivalent to
z.promise(z.string());
```

### `.or`

用于[联合类型](#unions)的便捷方法

```ts
const stringOrNumber = z.string().or(z.number()); // string | number

// equivalent to
z.union([z.string(), z.number()]);
```

### `.and`

用于创建交叉类型的便捷方法

```ts
const nameAndAge = z
  .object({ name: z.string() })
  .and(z.object({ age: z.number() })); // { name: string } & { age: number }

// equivalent to
z.intersection(z.object({ name: z.string() }), z.object({ age: z.number() }));
```

### `.brand`

`.brand<T>() => ZodBranded<this, B>`

TypeScript 的类型系统是结构化的，这意味着任何两个结构等价的类型都会被视为相同类型

```ts
type Cat = { name: string };
type Dog = { name: string };

const petCat = (cat: Cat) => {};
const fido: Dog = { name: "fido" };
petCat(fido); // works fine
```

在某些情况下，可能希望在 TypeScript 中模拟_名义类型_。例如，你可能希望编写一个只接受经过 Zod 验证的输入的函数。这可以通过_品牌类型_（也称为_不透明类型_）实现

```ts
const Cat = z.object({ name: z.string() }).brand<"Cat">();
type Cat = z.infer<typeof Cat>;

const petCat = (cat: Cat) => {};

// this works
const simba = Cat.parse({ name: "simba" });
petCat(simba);

// this doesn't
petCat({ name: "fido" });
```

在底层，此功能通过使用交叉类型为推断类型附加“品牌”来实现。这样一来，普通／无品牌的数据结构就不能再赋值给 schema 的推断类型

```ts
const Cat = z.object({ name: z.string() }).brand<"Cat">();
type Cat = z.infer<typeof Cat>;
// {name: string} & {[symbol]: "Cat"}
```

请注意，品牌类型不会影响 `.parse` 的运行时结果。这是一个仅限静态类型的构造

### `.readonly`

`.readonly() => ZodReadonly<this>`

此方法返回一个 `ZodReadonly` schema 实例，该实例使用基础 schema 解析输入，然后对结果调用 `Object.freeze()`。推断出的类型也会被标记为 `readonly`

```ts
const schema = z.object({ name: z.string() }).readonly();
type schema = z.infer<typeof schema>;
// Readonly<{name: string}>

const result = schema.parse({ name: "fido" });
result.name = "simba"; // error
```

在适用的情况下，推断类型会使用 TypeScript 内置的 readonly 类型

```ts
z.array(z.string()).readonly();
// readonly string[]

z.tuple([z.string(), z.number()]).readonly();
// readonly [string, number]

z.map(z.string(), z.date()).readonly();
// ReadonlyMap<string, Date>

z.set(z.string()).readonly();
// ReadonlySet<string>
```

### `.pipe`

Schema 可以串联成验证“管道”。它对于轻松验证 `.transform()` 的结果很有用：

```ts
z.string()
  .transform((val) => val.length)
  .pipe(z.number().min(5));
```

`.pipe()` 方法返回一个 `ZodPipeline` 实例

<br/>

## 指南和概念

### 类型推断

你可以使用 `z.infer<typeof mySchema>` 提取任意 schema 的 TypeScript 类型

```ts
const A = z.string();
type A = z.infer<typeof A>; // string

const u: A = 12; // TypeError
const u: A = "asdf"; // compiles
```

**转换怎么办？**

实际上，每个 Zod schema 在内部都会跟踪**两种**类型：输入类型和输出类型。对于大多数 schema（例如 `z.string()`），这两者是相同的。但当加入转换后，这两个值可能会出现差异。例如，`z.string().transform(val => val.length)` 的输入类型是 `string`，输出类型是 `number`

你可以像下面这样分别提取输入类型和输出类型：

```ts
const stringToNumber = z.string().transform((val) => val.length);

// ⚠️ Important: z.infer returns the OUTPUT type!
type input = z.input<typeof stringToNumber>; // string
type output = z.output<typeof stringToNumber>; // number

// equivalent to z.output!
type inferred = z.infer<typeof stringToNumber>; // number
```

### 编写泛型函数

借助 TypeScript 泛型，你可以编写接受 Zod schema 作为参数的可复用函数。这使你能够创建自定义验证逻辑、schema 转换等，同时保持类型安全和类型推断能力

当尝试编写一个接受 Zod schema 作为输入的函数时，很容易想到这样写：

```ts
function inferSchema<T>(schema: z.ZodType<T>) {
  return schema;
}
```

这种方式是不正确的，并且限制了 TypeScript 正确推断参数的能力。无论传入什么，`schema` 的类型都会是 `ZodType` 的实例

```ts
inferSchema(z.string());
// => ZodType<string>
```

这种方式会丢失类型信息，具体来说，是丢失输入实际所属的_子类_（此处为 `ZodString`）。这意味着你无法在 `inferSchema` 的结果上调用 `.min()` 等字符串专用方法

更好的方式是推断_整个 schema_，而不仅仅是它的推断类型。你可以使用名为 `z.ZodTypeAny` 的工具类型来实现这一点

```ts
function inferSchema<T extends z.ZodTypeAny>(schema: T) {
  return schema;
}

inferSchema(z.string());
// => ZodString
```

> `ZodTypeAny` 只是 `ZodType<any, any, any>` 的简写，这是一种足够宽泛、能够匹配任何 Zod schema 的类型

现在，结果具备完整且正确的类型，类型系统也能够推断出 schema 的具体子类

#### 推断推断类型

如果遵循最佳实践，将 `z.ZodTypeAny` 用作 schema 的泛型参数，可能会遇到解析数据被标记为 `any` 而不是 schema 的推断类型的问题

```ts
function parseData<T extends z.ZodTypeAny>(data: unknown, schema: T) {
  return schema.parse(data);
}

parseData("sup", z.string());
// => any
```

由于 TypeScript 推断的工作方式，它会将 `schema` 视为 `ZodTypeAny`，而不是推断出的类型。你可以使用 `z.infer` 进行类型断言来修复此问题

```ts
function parseData<T extends z.ZodTypeAny>(data: unknown, schema: T) {
  return schema.parse(data) as z.infer<T>;
  //                        ^^^^^^^^^^^^^^ <- add this
}

parseData("sup", z.string());
// => string
```

#### 限制允许的输入

`ZodType` 类有三个泛型参数

```ts
class ZodType<
  Output = any,
  Def extends ZodTypeDef = ZodTypeDef,
  Input = Output
> { ... }
```

通过在泛型输入中约束这些参数，可以限制函数允许接受的 schema：

```ts
function makeSchemaOptional<T extends z.ZodType<string>>(schema: T) {
  return schema.optional();
}

makeSchemaOptional(z.string());
// works fine

makeSchemaOptional(z.number());
// Error: 'ZodNumber' is not assignable to parameter of type 'ZodType<string, ZodTypeDef, string>'
```

### 错误处理

Zod 提供了一个名为 `ZodError` 的 Error 子类。ZodError 包含一个 `issues` 数组，其中包含验证问题的详细信息

```ts
const result = z
  .object({
    name: z.string(),
  })
  .safeParse({ name: 12 });

if (!result.success) {
  result.error.issues;
  /* [
      {
        "code": "invalid_type",
        "expected": "string",
        "received": "number",
        "path": [ "name" ],
        "message": "Expected string, received number"
      }
  ] */
}
```

> 有关可能的错误代码以及如何自定义错误消息的详细信息，请参阅专门的错误处理指南：[ERROR_HANDLING.md](ERROR_HANDLING.md)

Zod 的错误报告强调_完整性_和_正确性_。如果想向最终用户呈现有用的错误消息，则应使用错误映射覆盖 Zod 的错误消息（错误处理指南中对此有详细介绍），或使用 [`zod-validation-error`](https://github.com/causaly/zod-validation-error) 等第三方库

### 错误格式化

你可以使用 `.format()` 方法将此错误转换为嵌套对象

```ts
const result = z
  .object({
    name: z.string(),
  })
  .safeParse({ name: 12 });

if (!result.success) {
  const formatted = result.error.format();
  /* {
    name: { _errors: [ 'Expected string, received number' ] }
  } */

  formatted.name?._errors;
  // => ["Expected string, received number"]
}
```

<br/>

## 对比

还有一些其他广泛使用的验证库，但它们都有一些设计限制，导致开发者体验不够理想

<!-- 下表总结了功能差异。表格下方还会在必要时更深入地讨论某些替代方案。 -->

<!-- | 功能                                                                                                                | [Zod](https://github.com/colinhacks) | [Joi](https://github.com/hapijs/joi) | [Yup](https://github.com/jquense/yup) | [io-ts](https://github.com/gcanti/io-ts) | [Runtypes](https://github.com/pelotom/runtypes) | [ow](https://github.com/sindresorhus/ow) | [class-validator](https://github.com/typestack/class-validator) |
| ---------------------------------------------------------------------------------------------------------------------- | :-----------------------------: | :----------------------------------: | :-----------------------------------: | :--------------------------------------: | :---------------------------------------------: | :--------------------------------------: | :-------------------------------------------------------------: |
| <abbr title='从验证器实例中提取任何 TypeScript 类型的能力都算作支持。'>类型推断</abbr>         |               🟢                |                  🔴                  |                  🟢                   |                    🟢                    |                       🟢                        |                    🟢                    |                               🟢                                |
| <abbr title="Yup 的推断类型在某些情况下不正确，详见下文讨论。">正确的类型推断</abbr> |               🟢                |                  🔴                  |                  🔴                   |                    🟢                    |                       🟢                        |                    🟢                    |                               🟢                                |

<abbr title="number、string、boolean、null、undefined">原始类型</abbr>
<abbr title="包括超出“这是字符串吗？”之外的所有检查，例如最小／最大长度、isEmail、isURL、大小写检查等。">字符串验证</abbr>
<abbr title="包括超出“这是数字吗？”之外的所有检查，例如最小／最大值、isPositive、整数与浮点数等。">数字验证</abbr>
日期

原始字面量
对象字面量
元组字面量
对象
数组
非空数组
联合类型
可选类型
可空类型
枚举
枚举自动补全
交叉类型
对象合并
元组
递归类型
函数 schema

<abbr title="例如，Yup 允许使用 yup.number().min(5, 'Number must be more than 5!') 这样的语法自定义错误消息">验证消息</abbr>
不可变实例
类型守卫
有效性检查
类型转换
默认值
丰富的错误信息
品牌 -->

<!-- - 缺少对象方法：（pick、omit、partial、deepPartial、merge、extend）

* 缺少具备正确类型的非空数组（`[T, ...T[]]`）
* 缺少惰性／递归类型
* 缺少 Promise schema
* 缺少函数 schema
* 缺少联合与交叉 schema
* 缺少对解析循环数据的支持（可能）
* 缺少错误自定义 -->

### Joi

[https://github.com/hapijs/joi](https://github.com/hapijs/joi)

不支持静态类型推断 😕

### Yup

[https://github.com/jquense/yup](https://github.com/jquense/yup)

Yup 是一个功能完整的库，最初使用原生 JS 实现，之后又使用 TypeScript 重写

- 支持类型转换和转换函数
- 默认情况下所有对象字段都是可选的
<!-- - 缺少具备正确类型的非空数组（`[T, ...T[]]`） -->
- 缺少 Promise schema
- 缺少函数 schema
- 缺少联合与交叉 schema

<!-- ¹Yup 对 `required` 一词有着奇怪的解释。它不是表示“非 undefined”，而是表示“非空”。因此，`yup.string().required()` 不接受空字符串，`yup.array(yup.string()).required()` 也不接受空数组。相反，在 Zod 数组中有专门的 `.nonempty()` 方法来表示这一点，也可以使用自定义细化来实现。 -->

### io-ts

[https://github.com/gcanti/io-ts](https://github.com/gcanti/io-ts)

io-ts 是 gcanti 编写的优秀库。io-ts 的 API 深刻影响了 Zod 的设计

根据我们的经验，io-ts 在许多情况下更重视函数式编程的纯粹性，而不是开发者体验。这是一个合理且令人钦佩的设计目标，但它使 io-ts 很难集成到更偏向过程式或面向对象的现有代码库中。例如，考虑如何在 io-ts 中定义带有可选属性的对象：

```ts
import * as t from "io-ts";

const A = t.type({
  foo: t.string,
});

const B = t.partial({
  bar: t.number(),
});

const C = t.intersection([A, B]);

type C = t.TypeOf<typeof C>;
// returns { foo: string; bar?: number | undefined }
```

你必须在单独的对象验证器中定义必需属性和可选属性，通过 `t.partial` 传递可选属性（它会将所有属性标记为可选），然后使用 `t.intersection` 将它们组合起来

下面是 Zod 中的等效写法：

```ts
const C = z.object({
  foo: z.string(),
  bar: z.number().optional(),
});

type C = z.infer<typeof C>;
// returns { foo: string; bar?: number | undefined }
```

这种更加声明式的 API 使 schema 定义简洁得多

`io-ts` 还要求使用 gcanti 的函数式编程库 `fp-ts` 来解析结果和处理错误。对于希望让代码库严格保持函数式风格的开发者来说，这也是另一个优秀的资源。但依赖 `fp-ts` 必然会带来大量认知负担；开发者必须熟悉函数式编程概念和 `fp-ts` 的术语，才能使用该库

- 支持带有序列化和反序列化转换的 codec
- 支持品牌类型
- 支持高级函数式编程、高阶类型以及 `fp-ts` 兼容性
- 缺少对象方法：（pick、omit、partial、deepPartial、merge、extend）
- 缺少具备正确类型的非空数组（`[T, ...T[]]`）
- 缺少 Promise schema
- 缺少函数 schema

### Runtypes

[https://github.com/runtypes/runtypes](https://github.com/runtypes/runtypes)

Runtypes 专注于易用性，并且对类型推断提供了良好支持

- 支持“模式匹配”：可以分发到联合类型中的计算属性
- 支持品牌类型
- 支持模板字面量
- 支持符合预定义的静态类型
- 缺少对象方法：（deepPartial、merge）
- 缺少 Promise schema
- 缺少错误自定义

### Ow

[https://github.com/sindresorhus/ow](https://github.com/sindresorhus/ow)

Ow 专注于函数输入验证。它让表达复杂的断言语句变得容易，但不允许你解析无类型数据。它们支持更多种类的类型；Zod 几乎与 TypeScript 的类型系统一一对应，而 ow 则允许你直接验证多种高度特定的类型（例如 `int32Array`，完整列表请参阅其 README）

如果想验证函数输入，请使用 Zod 中的函数 schema！这是一种更加简单的方法，可以让你复用函数类型声明而无需重复自己（也就是不必在每个函数开头复制粘贴一堆 ow 断言）。此外，Zod 还允许你验证返回类型，因此可以确保不会有意外数据传递到下游

<br/>

## 更新日志

请在 [CHANGELOG.md](CHANGELOG.md) 中查看更新日志。
