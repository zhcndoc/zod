<p align="center">
  <img src="logo.svg" width="200px" align="center" alt="Zod 徽标" />
  <h1 align="center">Zod</h1>
  <p align="center">
    ✨ <a href="https://zod.dev">https://zod.dev</a> ✨
    <br/>
    支持静态类型推断的 TypeScript 模式验证库
  </p>
</p>
<br/>
<p align="center">
<a href="https://github.com/colinhacks/zod/actions?query=branch%3Amain"><img src="https://github.com/colinhacks/zod/actions/workflows/test.yml/badge.svg?event=push&branch=main" alt="Zod CI 状态" /></a>
<a href="https://twitter.com/colinhacks" rel="nofollow"><img src="https://img.shields.io/badge/created%20by-@colinhacks-4BBAAB.svg" alt="由 Colin McDonnell 创建"></a>
<a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/colinhacks/zod" alt="许可证"></a>
<a href="https://www.npmjs.com/package/zod" rel="nofollow"><img src="https://img.shields.io/npm/dw/zod.svg" alt="npm"></a>
<a href="https://github.com/colinhacks/zod" rel="nofollow"><img src="https://img.shields.io/github/stars/colinhacks/zod" alt="星标"></a>
</p>

<div align="center">
  <a href="https://zod.dev">文档</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://discord.gg/RcG33DQJdf">Discord</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.npmjs.com/package/zod">npm</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://deno.land/x/zod">deno</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/colinhacks/zod/issues/new">问题</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/colinhacks">@colinhacks</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://trpc.io">tRPC</a>
  <br />
</div>

<br/>
<br/>

<!-- <p><strong>公告 ✨</strong> Zod 获得了 <a href="https://go.clerk.com/zod-clerk">Clerk</a> OSS Fellowship！<br/>阅读公告文章 👉 <a href="https://go.clerk.com/zod-clerk">clerk.com/blog/zod-fellowship</a></p> -->

![clerk 公告](https://github.com/colinhacks/zod/assets/3084745/6327cf99-8d82-4b44-a5b1-ba2b5c2ff6ad)

<br/>

## 目录

> 本文档也已翻译成[中文](./README_ZH.md)

- [Zod](#zod)
  - [目录](#목차)
  - [介绍](#소개)
  - [赞助商](#스폰서)
    - [生态系统](#생태계)
      - [资源](#리소스)
      - [API 库](#api-라이브러리)
      - [表单集成库](#폼-통합-라이브러리)
      - [使用 Zod 的各种工具](#zod를-활용한-다양한-도구들)
      - [X to Zod](#x-to-zod)
      - [模拟（Mocking）](#목킹mocking)
      - [由 Zod 驱动的项目](#zod로-구동되는-프로젝트들)
      - [Zod 实用工具集合](#zod-유틸리티-모음)
  - [安装](#설치)
    - [要求](#요구사항)
    - [从 `npm` 安装](#npm에서-설치하기)
  - [基本用法](#기본-사용법)
    - [创建简单的字符串模式](#간단한-문자열-스키마-생성하기)
    - [创建对象模式](#객체-스키마-생성하기)
  - [基本类型（Primitives）](#기본-타입primitives)
  - [基本类型强制转换（Coercion）](#기본-타입-강제-변환coercion)
  - [字面量（Literals）](#리터럴literals)
  - [字符串](#문자열)
    - [日期和时间](#날짜와-시간)
    - [日期](#날짜)
    - [时间格式验证](#시간-형식-검증)
    - [IP 地址](#ip-주소)
    - [IP 范围（CIDR）](#ip-범위-cidr)
  - [数字](#숫자)
  - [BigInts](#bigints)
  - [NaN（Not a Number）](#nan-not-a-number)
  - [布尔值（Booleans）](#불리언booleans)
  - [日期](#날짜)
  - [Zod 枚举（enum）](#zod-열거형enum)
  - [原生枚举（Native Enums）](#네이티브-열거형native-enums)
  - [可选（Optional）](#옵셔널optional)
  - [Nullable 类型](#nullable-타입)
  - [对象](#객체)
    - [`.shape`](#shape)
    - [`.keyof`](#keyof)
    - [`.extend`](#extend)
    - [`.merge`](#merge)
    - [`.pick` / `.omit`](#pick--omit)
    - [`.partial`](#partial)
    - [`.deepPartial`](#deeppartial)
    - [`.required`](#required)
    - [`.passthrough`](#passthrough)
    - [`.strict`](#strict)
    - [`.strip` 方法](#strip-메서드)
    - [`.catchall`](#catchall)
  - [数组](#배열)
    - [`.element`](#element)
    - [`.nonempty`](#nonempty)
    - [`.min` / `.max` / `.length`](#min--max--length)
  - [元组（Tuples）](#튜플tuples)
  - [联合类型](#유니온-타입)
  - [可辨识联合（Discriminated Unions）](#구별된-유니온discriminated-unions)
  - [记录（Records）](#레코드records)
  - [映射（Map）](#맵map)
  - [Set（集合）](#set집합)
  - [交叉类型（Intersections）](#교차-타입intersections)
  - [递归类型](#재귀-타입)
    - [结合使用 ZodType 和 ZodEffects](#zodtype과-zodeffects-함께-사용하기)
    - [验证 JSON 类型](#json-타입-검증)
    - [循环对象](#순환-객체)
  - [Promise](#promise)
  - [Instanceof](#instanceof)
  - [函数](#함수)
  - [预处理（Preprocess）](#전처리preprocess)
  - [自定义模式](#커스텀-스키마)
  - [模式方法](#스키마-메서드)
    - [`.parse`](#parse)
    - [`.parseAsync`](#parseasync)
    - [`.safeParse`](#safeparse)
    - [`.safeParseAsync`](#safeparseasync)
    - [`.refine`](#refine)
      - [参数](#인자)
      - [自定义错误路径](#에러-경로-커스텀하기)
      - [异步细化（Refinements）](#비동기-정제refinements)
      - [transform 与 refine 的关系](#transform과-refine의-관계)
    - [`.superRefine`](#superrefine)
      - [提前中止](#조기-중단)
      - [类型细化](#타입-정제)
    - [`.transform`](#transform)
      - [链式调用顺序](#체이닝-순서)
      - [在转换过程中进行验证](#변환-중에-유효성-검사하기)
      - [转换与细化的关系](#변환과-정제의-관계)
      - [异步转换（Async Transforms）](#비동기-변환async-transforms)
    - [`.default`](#default)
    - [`.describe`](#describe)
    - [`.catch`](#catch)
    - [`.optional`](#optional)
    - [`.nullable`](#nullable)
    - [`.nullish`](#nullish)
    - [`.array()`](#array)
    - [`.promise`](#promise)
    - [`.or`](#or)
    - [`.and`](#and)
    - [`.brand`](#brand)
    - [`.readonly`](#readonly)
    - [`.pipe`](#pipe)
      - [使用 `.pipe()` 解决 `z.coerce` 的常见问题](#pipe를-사용하여-zcoerce의-일반적인-문제를-해결할-수-있습니다)
  - [指南和概念](#guides-and-concepts)
    - [类型推断](#타입-추론)
    - [编写泛型函数](#제네릭-함수-작성하기)
      - [推断推导出的类型](#추론된-타입-유추하기)
      - [限制可接受的输入](#허용-가능한-입력-제한하기)
    - [错误处理](#에러-처리)
    - [错误格式化](#에러-포맷팅)
  - [比较](#비교)
    - [Joi](#joi)
    - [Yup](#yup)
    - [io-ts](#io-ts)
    - [Runtypes](#runtypes)
    - [Ow](#ow)
  - [变更记录](#변경-내역)

## 介绍

Zod 是一个 TypeScript 优先的模式声明与验证库。其中，“模式”一词泛指所有数据类型，从简单的 `string` 到复杂的嵌套对象。

Zod 的设计注重开发者体验。其目标是消除重复的类型声明。使用 Zod 时，只需**一次**声明验证器，Zod 就会自动推断静态 TypeScript 类型。将简单类型合成为复杂数据结构也非常容易。

Zod 的主要特点如下：

- **零依赖**：不依赖外部库
- **通用性**：可在 Node.js 和所有现代浏览器中运行
- **轻量化**：压缩后仅 8KB，非常小
- **不可变性**：`.optional()` 等方法会返回新的实例
- **简洁的链式接口**：通过方法链可以编写简洁的代码
- **函数式方法**：遵循["不要验证，而要解析"](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)的理念
- **支持 JavaScript**：无需使用 TypeScript，普通 JavaScript 也可以运行

## 赞助商

我们欢迎并鼓励任何级别的赞助。如果你使用 Zod 开发了付费产品，请考虑选择[企业级套餐](https://github.com/sponsors/colinhacks)之一。

<br/>
<h3 align="center">钻石级</h3>

<br/>

<div align="center">
  <a href="https://go.clerk.com/PKHrcwh">
    <picture width="100%">
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/colinhacks/zod/assets/3084745/15c8c8be-189d-44ed-b3db-59bf2a21cbe3">
      <img alt="clerk 徽标" src="https://github.com/colinhacks/zod/assets/3084745/15c8c8be-189d-44ed-b3db-59bf2a21cbe3">
    </picture>
  </a>
  <br/>
  <br/>
  <p>
    最全面的用户管理平台
    <br/>
    <a style="text-decoration:none;" href="https://go.clerk.com/PKHrcwh" target="_blank">clerk.com</a>
  </p>
</div>

<br/>
<br/>

<h3 align="center">铂金级</h3>

<table align="center" style="justify-content: center;align-items: center;display: flex;">
  <tr>
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
      为 API 创建更好的 SDK
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
      无服务器 Postgres — 更快部署
      <br/>
      <a href="https://neon.tech" style="text-decoration:none;">neon.tech</a>
      </p>
      <p></p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <p></p>
      <p>
      <a href="https://retool.com/?utm_source=github&utm_medium=referral&utm_campaign=zod">
        <picture height="45px">
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/colinhacks/zod/assets/3084745/ac65013f-aeb4-48dd-a2ee-41040b69cbe6">
          <img alt="stainless" height="45px" src="https://github.com/colinhacks/zod/assets/3084745/5ef4c11b-efeb-4495-90a8-41b83f798600">
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
      <a href="https://stainlessapi.com">
        <picture height="45px">
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/colinhacks/zod/assets/3084745/f20759c1-3e51-49d0-a31e-bbc43abec665">
          <img alt="stainless" height="45px" src="https://github.com/colinhacks/zod/assets/3084745/e9444e44-d991-4bba-a697-dbcfad608e47">
        </picture>
      </a>
      <br  />   
      创建顶级 SDK
      <br/>
      <a href="https://stainlessapi.com" style="text-decoration:none;">stainlessapi.com</a>
      </p>
      <p></p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <p></p>
      <p>
      <a href="https://speakeasy.com/?utm_source=zod+docs">
        <picture height="40px">
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/colinhacks/zod/assets/3084745/b1d86601-c7fb-483c-9927-5dc24ce8b737">
          <img alt="speakeasy" height="40px" src="https://github.com/colinhacks/zod/assets/3084745/647524a4-22bb-4199-be70-404207a5a2b5">
        </picture>
      </a>
      <br  />   
      面向 API 的 SDK 和 Terraform 提供商
      <br/>
      <a href="https://speakeasy.com/?utm_source=zod+docs" style="text-decoration:none;">speakeasy.com</a>
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
      <img src="https://avatars.githubusercontent.com/u/301879?s=200&v=4" height="50px;" alt="Scalar.com 徽标" />
      <br />
      <a style="text-decoration:none;" href="https://scalar.com/" target="_blank">Scalar</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/95297378?s=200&v=4" height="50px;" alt="Trigger.dev 徽标" />
      <br />
      <a style="text-decoration:none;" href="https://trigger.dev" target="_blank">Trigger.dev</a>
    </td>
    </tr><tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/125754?s=200&v=4" height="50px;" alt="Transloadit 徽标" />
      <br />
      <a style="text-decoration:none;" href="https://transloadit.com/?utm_source=zod&utm_medium=referral&utm_campaign=sponsorship&utm_content=github" target="_blank">Transloadit</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/107880645?s=200&v=4" height="50px;" alt="Infisical 徽标" />
      <br />
      <a style="text-decoration:none;" href="https://infisical.com" target="_blank">Infisical</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/91036480?s=200&v=4" height="50px;" alt="Whop 徽标" />
      <br />
      <a style="text-decoration:none;" href="https://whop.com/" target="_blank">Whop</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/36402888?s=200&v=4" height="50px;" alt="CryptoJobsList 徽标" />
      <br />
      <a style="text-decoration:none;" href="https://cryptojobslist.com/" target="_blank">CryptoJobsList</a>
    </td>
    </tr><tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/70170949?s=200&v=4" height="50px;" alt="Plain 徽标" />
      <br />
      <a style="text-decoration:none;" href="https://plain.com/" target="_blank">Plain.</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/78935958?s=200&v=4" height="50px;" alt="Inngest 徽标" />
      <br />
      <a style="text-decoration:none;" href="https://inngest.com/" target="_blank">Inngest</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/13880908?s=200&v=4" height="50px;" alt="Storyblok CMS" />
      <br />
      <a style="text-decoration:none;" href="https://storyblok.com/" target="_blank">Storyblok</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/16199997?s=200&v=4" height="50px;" alt="Mux 徽标" />
      <br />
      <a style="text-decoration:none;" href="https://mux.link/zod" target="_blank">Mux</a>
    </td>
  </tr>
</table>

<br/>

<h3 align="center">白银级</h3>

<table align="center" style="justify-content: center;align-items: center;display: flex;">
  <tr>
    <td align="center">
      <a href="https://www.val.town/">
        <picture width="100%" height="40px">
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/36961d2e-d92e-42af-9031-a41885ece5f4">
          <img alt="val town 徽标" src="https://github.com/user-attachments/assets/95305fc4-4da6-4bf8-aea4-bae8f5893e5d" height="40px">
        </picture>
      </a>
    </td>
    <td align="center">
      <a href="https://www.route4me.com/">
        <img src="https://avatars.githubusercontent.com/u/7936820?s=200&v=4" height="40px;" alt="route4me 徽标" />
      </a>
    </td>
    <td align="center">
      <a href="https://encore.dev">
        <img src="https://github.com/colinhacks/zod/assets/3084745/5ad94e73-cd34-4957-9979-37da85fcf9cd" height="40px;" alt="Encore.dev 徽标" />
      </a>
    </td>
    <td align="center">
      <a href="https://www.replay.io/">
        <img src="https://avatars.githubusercontent.com/u/60818315?s=200&v=4" height="40px;" alt="Replay.io 徽标" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.numeric.io">
        <img src="https://i.imgur.com/kTiLtZt.png" height="40px;" alt="Numeric 徽标" />
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
        <img src="https://avatars.githubusercontent.com/u/41406870?v=4" height="40px;" alt="Bamboo Creative 徽标" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/jasonLaster">
        <img src="https://avatars.githubusercontent.com/u/254562?v=4" height="40px;" alt="Jason Laster" />
      </a>
    </td>
  </tr>
</table>

<h3 align="center">青铜级</h3>

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
</table>

### 生态系统

基于 Zod 构建或原生支持 Zod 的工具越来越多了！如果你基于 Zod 创建了工具或库，请通过[推特](https://twitter.com/colinhacks)告知我们，或在 [GitHub Discussions](https://github.com/colinhacks/zod/discussions) 中发帖。我们会将其添加到下方并发布推文。

#### 资源

- [Total TypeScript Zod 教程](https://www.totaltypescript.com/tutorials/zod)，作者：[[@mattpocockuk](https://twitter.com/mattpocockuk)]
- [解决 TypeScript 的弱点：运行时类型检查](https://www.youtube.com/watch?v=rY_XqfSHock)，作者：[[@jherr](https://twitter.com/jherr)]

#### API 库

- [`tRPC`](https://github.com/trpc/trpc)：无需 GraphQL 即可构建类型安全 API 的库
- [`@anatine/zod-nestjs`](https://github.com/anatine/zod-plugins/tree/main/packages/zod-nestjs)：提供在 NestJS 项目中使用 Zod 的辅助方法
- [`zod-endpoints`](https://github.com/flock-community/zod-endpoints)：使用 Zod 构建严格类型化的端点。兼容 OpenAPI
- [`zhttp`](https://github.com/evertdespiegeleer/zhttp)：兼容 OpenAPI、严格类型化的 HTTP 库。支持使用 Zod 进行输入和响应验证
- [`domain-functions`](https://github.com/SeasonedSoftware/domain-functions/)：提供可组合的函数，使业务逻辑能够与框架分离。通过 Zod 模式以一等公民的方式支持类型推断
- [`@zodios/core`](https://github.com/ecyrbe/zodios)：基于 axios 和 Zod 的 TypeScript API 客户端。支持运行时和编译时验证
- [`express-zod-api`](https://github.com/RobinTail/express-zod-api)：使用 Express 构建 API 时提供 I/O 模式验证和自定义中间件
- [`tapiduck`](https://github.com/sumukhbarve/monoduck/blob/main/src/tapiduck/README.md)：使用 Zod 和 Express 的端到端类型安全 JSON API。类似 tRPC，但结构更简单
- [`koa-zod-router`](https://github.com/JakeFenley/koa-zod-router)：在 Koa 中使用 Zod 创建包含 I/O 验证的类型安全路由
- [`zod-sockets`](https://github.com/RobinTail/zod-sockets)：基于 Zod 的 Socket.IO 微型框架。支持 I/O 验证和内置 AsyncAPI 规范
- [`oas-tszod-gen`](https://github.com/inkognitro/oas-tszod-gen)：将 OpenAPI v3 规范转换为包含 Zod 类型的 TS 端点调用函数的客户端 SDK 代码生成器
- [`GQLoom`](https://github.com/modevol-com/gqloom)：使用 Zod 将 GraphQL 模式与解析器连接起来

#### 表单集成库

- [`react-hook-form`](https://github.com/react-hook-form/resolvers#zod)：适用于 React Hook Form 的官方 Zod 解析器
- [`zod-validation-error`](https://github.com/causaly/zod-validation-error)：从 `ZodError` 生成用户友好的错误消息
- [`zod-formik-adapter`](https://github.com/robertLichtnow/zod-formik-adapter)：由社区维护的 Formik Zod 适配器
- [`react-zorm`](https://github.com/esamattis/react-zorm)：使用 Zod 在 React 中创建并验证独立的 `<form>`
- [`zodix`](https://github.com/rileytomasek/zodix)：用于 Remix loader 和 action 中 FormData 及 URLSearchParams 的 Zod 实用工具
- [`conform`](https://conform.guide/api/zod/parseWithZod)：用于 HTML 表单渐进式增强的类型安全表单验证库。可用于 Remix 和 Next.js
- [`remix-params-helper`](https://github.com/kiliman/remix-params-helper)：简化 Remix 应用中 Zod 与标准 URLSearchParams 和 FormData 的集成
- [`formik-validator-zod`](https://github.com/glazy/formik-validator-zod)：兼容 Formik 的验证库，让 Zod 更易与 Formik 一起使用
- [`zod-i18n-map`](https://github.com/aiji42/zod-i18n)：可用于翻译 Zod 错误消息
- [`@modular-forms/solid`](https://github.com/fabian-hiller/modular-forms)：适用于 SolidJS 的模块化表单库，使用 Zod 进行验证
- [`houseform`](https://github.com/crutchcorn/houseform/)：使用 Zod 进行验证的 React 表单库
- [`sveltekit-superforms`](https://github.com/ciscoheat/sveltekit-superforms)：适用于 SvelteKit 的强大表单库，支持 Zod 验证
- [`mobx-zod-form`](https://github.com/MonoidDev/mobx-zod-form)：基于 MobX 和 Zod 的数据驱动表单构建器
- [`@vee-validate/zod`](https://github.com/logaretm/vee-validate/tree/main/packages/zod)：适用于 Vue.js 的表单库，支持 Zod 模式验证
- [`zod-form-renderer`](https://github.com/thepeaklab/zod-form-renderer)：从 Zod 模式自动推断表单字段，并使用 react-hook-form 确保端到端类型安全
- [`antd-zod`](https://github.com/MrBr/antd-zod)：用于 Ant Design 表单字段验证的 Zod 适配器
- [`frrm`](https://github.com/schalkventer/frrm)：大小为 0.5kb 的基于 Zod 的 HTML 表单抽象库

#### 使用 Zod 的各种工具

- **[`zod-to-ts`](https://github.com/sachinraja/zod-to-ts)**：将 Zod 模式转换为 TypeScript 类型定义的工具
- **[`zod-to-json-schema`](https://github.com/StefanTerdell/zod-to-json-schema)**：将 Zod 模式转换为 [JSON 模式](https://json-schema.org/)
- **[`@anatine/zod-openapi`](https://github.com/anatine/zod-plugins/tree/main/packages/zod-openapi)**：将 Zod 模式转换为 OpenAPI v3.x `SchemaObject`
- **[`zod-fast-check`](https://github.com/DavidTimms/zod-fast-check)**：基于 Zod 模式创建 `fast-check` 的随机数据生成器
- **[`zod-dto`](https://github.com/kbkk/abitia/tree/main/packages/zod-dto)**：将 Zod 模式转换为 Nest.js 的 DTO（Data Transfer Object）
- **[`fastify-type-provider-zod`](https://github.com/turkerdev/fastify-type-provider-zod)**：使用 Zod 模式生成 Fastify 的类型提供程序
- **[`zod-to-openapi`](https://github.com/asteasolutions/zod-to-openapi)**：基于 Zod 模式生成 OpenAPI（Swagger）文档。包含模式、端点、参数等
- **[`nestjs-graphql-zod`](https://github.com/incetarik/nestjs-graphql-zod)**：将 Zod 模式转换为 NestJS GraphQL 模型类。提供可与 Zod 模式协同工作的 GraphQL 方法装饰器
- **[`zod-openapi`](https://github.com/samchungy/zod-openapi)**：使用 Zod 模式生成完整的 OpenAPI v3.x 文档
- **[`fastify-zod-openapi`](https://github.com/samchungy/fastify-zod-openapi)**：为 Fastify 提供类型提供程序、验证、序列化以及 `@fastify/swagger` 支持，并与 Zod 模式配合使用
- **[`typeschema`](https://typeschema.com/)**：用于模式验证的通用适配器
- **[`zodex`](https://github.com/commonbaseapp/zodex)**：支持 Zod 模式的（反）序列化

这些工具可用于将 Zod 模式转换为各种格式，或与其他框架集成。

#### X to Zod

- [`ts-to-zod`](https://github.com/fabien0102/ts-to-zod)：将 TypeScript 定义转换为 Zod 模式
- [`@runtyping/zod`](https://github.com/johngeorgewright/runtyping/tree/main/packages/zod)：从静态类型和 JSON 模式生成 Zod
- [`json-schema-to-zod`](https://github.com/StefanTerdell/json-schema-to-zod)：将 [JSON 模式](https://json-schema.org/)转换为 Zod 模式。[在线演示](https://StefanTerdell.github.io/json-schema-to-zod-react/)
- [`json-to-zod`](https://github.com/rsinohara/json-to-zod)：将 JSON 对象转换为 Zod 模式。[在线演示](https://rsinohara.github.io/json-to-zod-react/)
- [`graphql-codegen-typescript-validation-schema`](https://github.com/Code-Hex/graphql-codegen-typescript-validation-schema)：从 GraphQL 模式生成表单验证模式的 GraphQL Code Generator 插件
- [`zod-prisma`](https://github.com/CarterGrimmeisen/zod-prisma)：从 Prisma 模式生成 Zod 模式
- [`Supervillain`](https://github.com/Southclaws/supervillain)：从 Go 结构体生成 Zod 模式
- [`prisma-zod-generator`](https://github.com/omar-dulaimi/prisma-zod-generator)：从 Prisma 模式生成 Zod 模式
- [`drizzle-zod`](https://orm.drizzle.team/docs/zod)：从 Drizzle 模式生成 Zod 模式
- [`prisma-trpc-generator`](https://github.com/omar-dulaimi/prisma-trpc-generator)：使用 Zod 生成完整实现的 tRPC 路由器和验证模式
- [`zod-prisma-types`](https://github.com/chrishoermann/zod-prisma-types)：从 Prisma 模型生成 Zod 类型
- [`quicktype`](https://app.quicktype.io/)：将 JSON 对象和 JSON 模式转换为 Zod 模式
- [`@sanity-typed/zod`](https://github.com/saiichihashimoto/sanity-typed/tree/main/packages/zod)：从 [Sanity 模式](https://www.sanity.io/docs/schema-types)生成 Zod 模式
- [`java-to-zod`](https://github.com/ivangreene/java-to-zod)：将 POJO 转换为 Zod 模式
- [`Orval`](https://github.com/anymaniax/orval)：从 OpenAPI 模式生成 Zod 模式
- [`Kubb`](https://github.com/kubb-labs/kubb)：从 OpenAPI 模式生成 SDK 和 Zod 模式

#### 模拟（Mocking）

- [`@anatine/zod-mock`](https://github.com/anatine/zod-plugins/tree/main/packages/zod-mock)：从 Zod 模式生成模拟数据。基于 [faker.js](https://github.com/faker-js/faker) 运行
- [`zod-mocking`](https://github.com/dipasqualew/zod-mocking)：使用 Zod 模式生成模拟数据
- [`zod-fixture`](https://github.com/timdeschryver/zod-fixture)：利用 Zod 模式以确定性方式自动生成测试用 fixture
- [`zocker`](https://zocker.sigrist.dev)：基于模式生成逼真的模拟数据
- [`zodock`](https://github.com/ItMaga/zodock)：基于 Zod 模式生成模拟数据
- [`zod-schema-faker`](https://github.com/soc221b/zod-schema-faker)：从 Zod 模式生成模拟数据。使用 [@faker-js/faker](https://github.com/faker-js/faker) 和 [randexp.js](https://github.com/fent/randexp.js)

#### 由 Zod 驱动的项目

- [`freerstore`](https://github.com/JacobWeisenburger/freerstore)：Firestore 成本优化工具
- [`slonik`](https://github.com/gajus/slonik/tree/gajus/add-zod-validation-backwards-compatible#runtime-validation-and-static-type-inference)：支持强大 Zod 集成的 Node.js Postgres 客户端
- [`schemql`](https://github.com/a2lix/schemql)：将类型安全与模式验证结合到原始 SQL 中，强化 SQL 工作流
- [`soly`](https://github.com/mdbetancourt/soly)：使用 Zod 创建 CLI 应用
- [`pastel`](https://github.com/vadimdemedes/pastel)：使用 React、Zod 和 Ink 创建 CLI 应用
- [`zod-xlsx`](https://github.com/sidwebworks/zod-xlsx)：使用 Zod 模式的基于 XLSX 的资源验证工具
- [`znv`](https://github.com/lostfictions/znv)：使用 Zod 模式对 Node.js 环境变量进行类型安全的解析和验证
- [`zod-config`](https://github.com/alexmarqs/zod-config)：通过灵活的适配器从多个来源加载配置，并使用 Zod 确保类型安全
- [`unplugin-environment`](https://github.com/r17x/js/tree/main/packages/unplugin-environment#readme)：通过模式验证安全地加载环境变量的插件。使用虚拟模块，简单易用，通过智能感知提供类型安全，并带来更好的开发者体验（DX）。由 Zod 驱动

#### Zod 实用工具集合

- [`zod_utilz`](https://github.com/JacobWeisenburger/zod_utilz)：与框架无关的 Zod 工具集合
- [`zod-playground`](https://github.com/marilari88/zod-playground)：用于学习和测试 Zod 模式验证功能的工具。[链接](https://zod-playground.vercel.app/)
- [`zod-sandbox`](https://github.com/nereumelo/zod-sandbox)：用于测试 Zod 模式的受控环境。[在线演示](https://zod-sandbox.vercel.app/)
- [`zod-dev`](https://github.com/schalkventer/zod-dev)：有条件地禁用生产环境中的 Zod 运行时解析
- [`zod-accelerator`](https://github.com/duplojs/duplojs-zod-accelerator)：将 Zod 的处理速度提升至最高约 100 倍

## 安装

### 要求

- 需要 **TypeScript 4.5 或更高版本**！
- 必须在 `tsconfig.json` 中启用 `strict` 模式。这是所有 TypeScript 项目推荐的最佳实践。

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

> 本 README 的其余部分假设你使用 npm，并直接从 `"zod"` 包中导入。

## 基本用法

### 创建简单的字符串模式

```ts
import { z } from "zod";

// 문자열을 위한 스키마 생성
const mySchema = z.string();

// 파싱
mySchema.parse("tuna"); // => "tuna"
mySchema.parse(12); // => ZodError 발생

// "안전한" 파싱 (검증 실패 시 에러를 던지지 않음)
mySchema.safeParse("tuna"); // => { success: true; data: "tuna" }
mySchema.safeParse(12); // => { success: false; error: ZodError }
```

### 创建对象模式

```ts
import { z } from "zod";

const User = z.object({
  username: z.string(),
});

User.parse({ username: "Ludwig" });

// 추론된 타입 추출
type User = z.infer<typeof User>;
// { username: string }
```

## 基本类型（Primitives）

```ts
import { z } from "zod";

// 기본 값
z.string();
z.number();
z.bigint();
z.boolean();
z.date();
z.symbol();

// 빈 타입
z.undefined();
z.null();
z.void(); // undefined를 허용

// 모든 타입 허용
// 어떤 값이든 허용
z.any();
z.unknown();

// never 타입
// 어떤 값도 허용하지 않음
z.never();
```

## 基本类型强制转换（Coercion）

Zod 现在提供了一种更方便地强制转换基本类型值的方法。

```ts
const schema = z.coerce.string();
schema.parse("tuna"); // => "tuna"
schema.parse(12); // => "12"
```

在解析阶段，输入值会通过 `String()` 函数传递。这是一个将数据强制转换为字符串的 JavaScript 内置函数。

```ts
schema.parse(12); // => "12"
schema.parse(true); // => "true"
schema.parse(undefined); // => "undefined"
schema.parse(null); // => "null"
```

返回的模式是一个普通的 `ZodString` 实例，因此可以使用所有字符串方法。

```ts
z.coerce.string().email().min(5);
```

**强制转换的工作方式**

所有基本类型都支持强制转换。Zod 使用内置构造函数强制转换所有输入值：`String(input)`、`Number(input)`、`new Date(input)` 等。

```ts
z.coerce.string(); // String(input)
z.coerce.number(); // Number(input)
z.coerce.boolean(); // Boolean(input)
z.coerce.bigint(); // BigInt(input)
z.coerce.date(); // new Date(input)
```

**注意** — 使用 `z.coerce.boolean()` 进行布尔值强制转换时，行为可能与你的预期不同。所有 [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) 值都会转换为 `true`，所有 [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) 值都会转换为 `false`。

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

若要更细致地控制强制转换逻辑，可以考虑使用 [`z.preprocess`](#전처리preprocess) 或 [`z.pipe()`](#pipe)。

## 字面量（Literals）

字面量模式表示 `"hello world"` 或 `5` 之类的[字面量类型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)。

```ts
const tuna = z.literal("tuna");
const twelve = z.literal(12);
const twobig = z.literal(2n); // bigint 리터럴
const tru = z.literal(true);

const terrificSymbol = Symbol("terrific");
const terrific = z.literal(terrificSymbol);

// 리터럴 값 가져오기
tuna.value; // "tuna"
```

> Zod 目前不支持 Date 字面量。如果需要此功能，请提交 issue。

## 字符串

Zod 提供了多种专用于字符串的验证。

```ts
// 유효성 검사
z.string().max(5); // 최대 5자
z.string().min(5); // 최소 5자
z.string().length(5); // 정확히 5자
z.string().email(); // 이메일 형식
z.string().url(); // URL 형식
z.string().emoji(); // 이모지 포함
z.string().uuid(); // UUID 형식
z.string().nanoid(); // Nano ID 형식
z.string().cuid(); // CUID 형식
z.string().cuid2(); // CUID2 형식
z.string().ulid(); // ULID 형식
z.string().regex(regex); // 정규식 검사
z.string().includes(string); // 특정 문자열 포함
z.string().startsWith(string); // 특정 문자열로 시작
z.string().endsWith(string); // 특정 문자열로 끝남
z.string().datetime(); // ISO 8601 형식 (기본적으로 'Z' 시간대만 허용)
z.string().ip(); // IPv4 및 IPv6 허용 (기본값)
z.string().cidr(); // IPv4 및 IPv6 CIDR 허용 (기본값)

// 변환
z.string().trim(); // 공백 제거
z.string().toLowerCase(); // 소문자로 변환
z.string().toUpperCase(); // 대문자로 변환

// Zod 3.23에서 추가됨
z.string().date(); // ISO 날짜 형식 (YYYY-MM-DD)
z.string().time(); // ISO 시간 형식 (HH:mm:ss[.SSSSSS])
z.string().duration(); // ISO 8601 기간 형식
z.string().base64(); // Base64 형식
```

> 可以在 [validator.js](https://github.com/validatorjs/validator.js) 中找到许多可与 [Refinements](#refine) 结合使用的实用字符串验证函数。

创建字符串模式时，可以自定义通用错误消息。

```ts
const name = z.string({
  required_error: "이름은 필수입니다",
  invalid_type_error: "이름은 문자열이어야 합니다",
});
```

使用验证方法时，可以通过额外参数提供自定义错误消息。

```ts
z.string().min(5, { message: "5자 이상이어야 합니다" });
z.string().max(5, { message: "5자 이하여야 합니다" });
z.string().length(5, { message: "정확히 5자여야 합니다" });
z.string().email({ message: "유효하지 않은 이메일 주소입니다" });
z.string().url({ message: "유효하지 않은 URL입니다" });
z.string().emoji({ message: "이모지가 아닌 문자가 포함되어 있습니다" });
z.string().uuid({ message: "유효하지 않은 UUID입니다" });
z.string().includes("tuna", { message: "'tuna'가 포함되어야 합니다" });
z.string().startsWith("https://", { message: "보안 URL이어야 합니다" });
z.string().endsWith(".com", { message: ".com 도메인만 허용됩니다" });
z.string().datetime({
  message: "유효하지 않은 날짜/시간 문자열입니다! UTC여야 합니다.",
});
z.string().date({ message: "유효하지 않은 날짜 문자열입니다!" });
z.string().time({ message: "유효하지 않은 시간 문자열입니다!" });
z.string().ip({ message: "유효하지 않은 IP 주소입니다" });
z.string().cidr({ message: "유효하지 않은 CIDR입니다" });
```

### 日期和时间

Zod 字符串包含一些与日期/时间相关的验证。这些验证基于正则表达式，因此不如完整的日期/时间库严格。但它们非常适合验证用户输入。

`z.string().datetime()` 方法强制使用 ISO 8601。默认情况下不允许使用时区偏移，并支持小数秒的任意精度。

```ts
const datetime = z.string().datetime();

datetime.parse("2020-01-01T00:00:00Z"); // 통과
datetime.parse("2020-01-01T00:00:00.123Z"); // 통과
datetime.parse("2020-01-01T00:00:00.123456Z"); // 통과 (임의 정밀도)
datetime.parse("2020-01-01T00:00:00+02:00"); // 실패 (오프셋 허용 안 됨)
```

将 `offset` 选项设置为 `true` 后，可以允许时区偏移。

```ts
const datetime = z.string().datetime({ offset: true });

datetime.parse("2020-01-01T00:00:00+02:00"); // 통과
datetime.parse("2020-01-01T00:00:00.123+02:00"); // 통과 (밀리초 선택적)
datetime.parse("2020-01-01T00:00:00.123+0200"); // 통과 (밀리초 선택적)
datetime.parse("2020-01-01T00:00:00.123+02"); // 통과 (시간 오프셋만)
datetime.parse("2020-01-01T00:00:00Z"); // 통과 (Z 지원)
```

使用 `local` 标志可以允许不带时区的日期/时间。

```ts
const schema = z.string().datetime({ local: true });
schema.parse("2020-01-01T00:00:00"); // 통과
```

此外，还可以限制允许的 `precision`。默认支持任意的小数秒精度，但该精度是可选的。

```ts
const datetime = z.string().datetime({ precision: 3 });

datetime.parse("2020-01-01T00:00:00.123Z"); // 통과
datetime.parse("2020-01-01T00:00:00Z"); // 실패
datetime.parse("2020-01-01T00:00:00.123456Z"); // 실패
```

### 日期

> Zod 3.23 中新增

`z.string().date()` 方法验证 `YYYY-MM-DD` 格式的字符串。

```ts
const date = z.string().date();

date.parse("2020-01-01"); // 통과
date.parse("2020-1-1"); // 실패
date.parse("2020-01-32"); // 실패
```

### 时间格式验证

> Zod 3.23 中新增

`z.string().time()` 方法验证 `HH:MM:SS[.s+]` 格式的字符串。秒可以包含小数点后任意精度的数值，但不允许时区偏移。

```ts
const time = z.string().time();

time.parse("00:00:00"); // 통과
time.parse("09:52:31"); // 통과
time.parse("23:59:59.9999999"); // 통과 (임의의 정밀도 허용)

time.parse("00:00:00.123Z"); // 실패 (`Z` 허용 안 됨)
time.parse("00:00:00.123+02:00"); // 실패 (오프셋 허용 안 됨)
```

可以设置 `precision` 选项来限制允许的小数精度。

```ts
const time = z.string().time({ precision: 3 });

time.parse("00:00:00.123"); // 통과
time.parse("00:00:00.123456"); // 실패
time.parse("00:00:00"); // 실패
```

### IP 地址

默认情况下，`.ip()` 同时允许 IPv4 和 IPv6。

```ts
const ip = z.string().ip();

ip.parse("192.168.1.1"); // 통과
ip.parse("84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003"); // 통과
ip.parse("84d5:51a0:9114:1855:4cfa:f2d7:1f12:192.168.1.1"); // 통과

ip.parse("256.1.1.1"); // 실패
ip.parse("84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003"); // 실패
```

还可以设置 IP `version`。

```ts
const ipv4 = z.string().ip({ version: "v4" });
ipv4.parse("84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003"); // 실패

const ipv6 = z.string().ip({ version: "v6" });
ipv6.parse("192.168.1.1"); // 실패
```

### IP 范围（CIDR）

验证以 [CIDR 表示法](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)指定的 IP 地址范围。默认情况下，`.cidr()` 同时允许 IPv4 和 IPv6。

```ts
const cidr = z.string().cidr();
cidr.parse("192.168.0.0/24"); // 통과
cidr.parse("2001:db8::/32"); // 통과
```

可以使用 `version` 参数指定特定版本。

```ts
const ipv4Cidr = z.string().cidr({ version: "v4" });
ipv4Cidr.parse("84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003"); // 실패

const ipv6Cidr = z.string().cidr({ version: "v6" });
ipv6Cidr.parse("192.168.1.1"); // 실패
```

## 数字

创建数字模式时，可以自定义特定的错误消息。

```ts
const age = z.number({
  required_error: "나이는 필수입니다",
  invalid_type_error: "나이는 숫자여야 합니다",
});
```

Zod 提供了多种专用于数字的验证。

```ts
z.number().gt(5); // 5보다 커야 함
z.number().gte(5); // 5보다 크거나 같아야 함 (.min(5)와 동일)
z.number().lt(5); // 5보다 작아야 함
z.number().lte(5); // 5보다 작거나 같아야 함 (.max(5)와 동일)

z.number().int(); // 정수여야 함

z.number().positive(); // 0보다 커야 함
z.number().nonnegative(); // 0보다 크거나 같아야 함
z.number().negative(); // 0보다 작아야 함
z.number().nonpositive(); // 0보다 작거나 같아야 함

z.number().multipleOf(5); // 5로 나누어 떨어져야 함 (.step(5)와 동일)

z.number().finite(); // 유한한 값이어야 함 (Infinity 또는 -Infinity 불가)
z.number().safe(); // Number.MIN_SAFE_INTEGER와 Number.MAX_SAFE_INTEGER 사이의 값이어야 함
```

也可以选择通过第二个参数提供自定义错误消息。

```ts
z.number().lte(5, { message: "이👏값은👏너무👏큽니다" });
```

## BigInts

Zod 为 BigInt 类型提供了几种验证。

```ts
z.bigint().gt(5n); // 5n보다 큰지 확인
z.bigint().gte(5n); // 5n보다 크거나 같은지 확인 (`.min(5n)`과 동일)
z.bigint().lt(5n); // 5n보다 작은지 확인
z.bigint().lte(5n); // 5n보다 작거나 같은지 확인 (`.max(5n)`과 동일)

z.bigint().positive(); // 0n보다 큰지 확인
z.bigint().nonnegative(); // 0n보다 크거나 같은지 확인
z.bigint().negative(); // 0n보다 작은지 확인
z.bigint().nonpositive(); // 0n보다 작거나 같은지 확인

z.bigint().multipleOf(5n); // 5n으로 나누어 떨어지는지 확인
```

## NaN（Not a Number）

创建 NaN 模式时，可以自定义特定的错误消息。

```ts
const isNaN = z.nan({
  required_error: "isNaN은 필수입니다",
  invalid_type_error: "isNaN은 '숫자가 아님'이어야 합니다",
});
```

## 布尔值（Booleans）

创建布尔值模式时，可以自定义特定的错误消息。

```ts
const isActive = z.boolean({
  required_error: "isActive는 필수 항목입니다",
  invalid_type_error: "isActive는 불리언 타입이어야 합니다",
});
```

## 日期

要验证 `Date` 实例，请使用 `z.date()`。

```ts
z.date().safeParse(new Date()); // 성공: true
z.date().safeParse("2022-01-12T00:00:00.000Z"); // 성공: false
```

创建日期模式时，可以自定义特定的错误消息。

```ts
const myDateSchema = z.date({
  required_error: "날짜와 시간을 선택해 주세요",
  invalid_type_error: "날짜 형식이 아닙니다!",
});
```

Zod 提供了几种与日期相关的验证。

```ts
z.date().min(new Date("1900-01-01"), { message: "너무 오래된 날짜입니다" });
z.date().max(new Date(), { message: "너무 미래의 날짜입니다!" });
```

**强制转换为 Date**

从 [zod 3.20](https://github.com/colinhacks/zod/releases/tag/v3.20) 开始，可以使用 [`z.coerce.date()`](#coercion-for-primitives) 将输入转换为 `new Date(input)`。

```ts
const dateSchema = z.coerce.date();
type DateSchema = z.infer<typeof dateSchema>;
// 타입 DateSchema = Date

/* 유효한 날짜 */
console.log(dateSchema.safeParse("2023-01-10T00:00:00.000Z").success); // true
console.log(dateSchema.safeParse("2023-01-10").success); // true
console.log(dateSchema.safeParse("1/10/23").success); // true
console.log(dateSchema.safeParse(new Date("1/10/23")).success); // true

/* 유효하지 않은 날짜 */
console.log(dateSchema.safeParse("2023-13-10").success); // false
console.log(dateSchema.safeParse("0000-00-00").success); // false
```

如果使用的是旧版本的 zod，请按照[此讨论](https://github.com/colinhacks/zod/discussions/879#discussioncomment-2036276)中的说明，使用 [`z.preprocess`](#전처리preprocess)。

## Zod 枚举（enum）

```ts
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);
type FishEnum = z.infer<typeof FishEnum>;
// 'Salmon' | 'Tuna' | 'Trout'
```

`z.enum` 是在 Zod 中声明一组允许的固定字符串值的方法。将值数组直接传递给 `z.enum()`。也可以使用 `as const` 将枚举值定义为字符串元组。详情请参阅 [const assertion 文档](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)。

```ts
const VALUES = ["Salmon", "Tuna", "Trout"] as const;
const FishEnum = z.enum(VALUES);
```

以下写法不被允许，因为 Zod 无法推断每个元素的确切值。

```ts
const fish = ["Salmon", "Tuna", "Trout"];
const FishEnum = z.enum(fish);
```

**`.enum`**

要在 Zod 枚举中使用自动补全，请使用模式的 `.enum` 属性。

```ts
FishEnum.enum.Salmon; // => 자동 완성

FishEnum.enum;
/*
=> {
  Salmon: "Salmon",
  Tuna: "Tuna",
  Trout: "Trout",
}
*/
```

也可以使用 `.options` 属性将选项列表作为元组获取。

```ts
FishEnum.options; // ["Salmon", "Tuna", "Trout"];
```

**`.exclude/.extract()`**

可以使用 `.exclude` 和 `.extract` 方法创建 Zod 枚举的子集。

```ts
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);
const SalmonAndTrout = FishEnum.extract(["Salmon", "Trout"]);
const TunaOnly = FishEnum.exclude(["Salmon", "Trout"]);
```

## 原生枚举（Native Enums）

Zod 枚举是定义和验证枚举的推荐方式。但如果需要验证第三方库中的枚举，或者不想重新编写现有枚举，可以使用 `z.nativeEnum()`。

**数字枚举（Numeric Enums）**

```ts
enum Fruits {
  Apple,
  Banana,
}

const FruitEnum = z.nativeEnum(Fruits);
type FruitEnum = z.infer<typeof FruitEnum>; // Fruits

FruitEnum.parse(Fruits.Apple); // 통과
FruitEnum.parse(Fruits.Banana); // 통과
FruitEnum.parse(0); // 통과
FruitEnum.parse(1); // 통과
FruitEnum.parse(3); // 실패
```

**字符串枚举（String Enums）**

```ts
enum Fruits {
  Apple = "apple",
  Banana = "banana",
  Cantaloupe, // 숫자와 문자열 열거형을 혼합할 수 있음
}

const FruitEnum = z.nativeEnum(Fruits);
type FruitEnum = z.infer<typeof FruitEnum>; // Fruits

FruitEnum.parse(Fruits.Apple); // 통과
FruitEnum.parse(Fruits.Cantaloupe); // 통과
FruitEnum.parse("apple"); // 통과
FruitEnum.parse("banana"); // 통과
FruitEnum.parse(0); // 통과
FruitEnum.parse("Cantaloupe"); // 실패
```

**常量枚举（Const Enums）**

`.nativeEnum()` 函数也适用于 `as const` 对象。⚠️ `as const` 需要 TypeScript 3.4 或更高版本！

```ts
const Fruits = {
  Apple: "apple",
  Banana: "banana",
  Cantaloupe: 3,
} as const;

const FruitEnum = z.nativeEnum(Fruits);
type FruitEnum = z.infer<typeof FruitEnum>; // "apple" | "banana" | 3

FruitEnum.parse("apple"); // 통과
FruitEnum.parse("banana"); // 통과
FruitEnum.parse(3); // 통과
FruitEnum.parse("Cantaloupe"); // 실패
```

可以使用 `.enum` 属性访问底层对象：

```ts
FruitEnum.enum.Apple; // "apple"
```

## 可选（Optional）

如果想将 `schema` 设为可选，可以使用 `z.optional()`。此函数会将模式包装为 `ZodOptional` 实例，然后返回结果。

```ts
const schema = z.optional(z.string());

schema.parse(undefined); // => undefined 반환
type A = z.infer<typeof schema>; // string | undefined
```

为方便起见，也可以直接在现有模式上调用 `.optional()` 方法。

```ts
const user = z.object({
  username: z.string().optional(),
});
type C = z.infer<typeof user>; // { username?: string | undefined };
```

要从 `ZodOptional` 实例中提取被包装的模式，可以使用 `.unwrap()`。

```ts
const stringSchema = z.string();
const optionalString = stringSchema.optional();
optionalString.unwrap() === stringSchema; // true
```

## Nullable 类型

使用 `z.nullable()` 可以创建 nullable 类型。

```ts
const nullableString = z.nullable(z.string());
nullableString.parse("asdf"); // => "asdf"
nullableString.parse(null); // => null
```

也可以使用 `.nullable()` 方法。

```ts
const E = z.string().nullable(); // nullableString과 동일
type E = z.infer<typeof E>; // string | null
```

使用 `.unwrap()` 可以提取内部模式。

```ts
const stringSchema = z.string();
const nullableString = stringSchema.nullable();
nullableString.unwrap() === stringSchema; // true
```

## 对象

```ts
// 기본적으로 모든 속성은 필수입니다.
const Dog = z.object({
  name: z.string(),
  age: z.number(),
});

// 추론된 타입을 이렇게 추출할 수 있습니다.
type Dog = z.infer<typeof Dog>;

// 이는 다음과 동일합니다:
type Dog = {
  name: string;
  age: number;
};
```

### `.shape`

要访问特定键的模式，请使用 `.shape`。

```ts
Dog.shape.name; // => 문자열 스키마
Dog.shape.age; // => 숫자 스키마
```

### `.keyof`

使用 `.keyof` 可以根据对象模式的键创建 `ZodEnum` 模式。

```ts
const keySchema = Dog.keyof();
keySchema; // ZodEnum
```

此代码根据 `Dog` 对象模式的键创建 `ZodEnum` 模式。`keySchema` 的类型将是 `ZodEnum` 类型。

### `.extend`

使用 `.extend` 方法可以向对象模式中添加字段。

```ts
const DogWithBreed = Dog.extend({
  breed: z.string(),
});
```

`.extend` 也可以用于覆盖现有字段。使用此功能时需要谨慎！

### `.merge`

`.merge` 与 `A.extend(B.shape)` 功能相同。

```ts
const BaseTeacher = z.object({ students: z.array(z.string()) });
const HasID = z.object({ id: z.string() });

const Teacher = BaseTeacher.merge(HasID);
type Teacher = z.infer<typeof Teacher>; // => { students: string[], id: string }
```

> 如果两个模式共享相同的键，B 的属性会覆盖 A 的属性。返回的模式会继承 B 的“unknownKeys”策略（strip/strict/passthrough）和 catchall 模式。

### `.pick` / `.omit`

受 TypeScript 内置 `Pick` 和 `Omit` 工具类型的启发，所有 Zod 对象模式都提供 `.pick` 和 `.omit` 方法。这些方法会返回修改后的模式。以下是 Recipe 模式示例：

```ts
const Recipe = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: z.array(z.string()),
});
```

要仅保留特定键，请使用 `.pick`。

```ts
const JustTheName = Recipe.pick({ name: true });
type JustTheName = z.infer<typeof JustTheName>;
// => { name: string }
```

要移除特定键，请使用 `.omit`。

```ts
const NoIDRecipe = Recipe.omit({ id: true });

type NoIDRecipe = z.infer<typeof NoIDRecipe>;
// => { name: string, ingredients: string[] }
```

### `.partial`

受 TypeScript 内置工具类型 [Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) 的启发，`.partial` 方法会将所有属性设为可选。

从以下对象开始：

```ts
const user = z.object({
  email: z.string(),
  username: z.string(),
});
// { email: string; username: string }
```

可以将此对象设为部分对象：

```ts
const partialUser = user.partial();
// { email?: string | undefined; username?: string | undefined }
```

也可以只将特定属性设为可选：

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

`.partial` 方法只执行浅层（shallow）操作，也就是说只应用一层深度。此外还存在“深层（deep）”版本：

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

> **重要限制**：深层部分应用（deep partials）仅在由对象、数组和元组组成的层次结构中按预期工作。

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

现在可以创建必需版本：

```ts
const requiredUser = user.required();
// { email: string; username: string }
```

也可以只将特定属性设为必需：

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

默认情况下，Zod 对象模式会在解析过程中移除无法识别的键。

```ts
const person = z.object({
  name: z.string(),
});

person.parse({
  name: "bob dylan",
  extraKey: 61,
});
// => { name: "bob dylan" }
// extraKey가 제거됨
```

如果想保留未知键，请使用 `.passthrough()`。

```ts
person.passthrough().parse({
  name: "bob dylan",
  extraKey: 61,
});
// => { name: "bob dylan", extraKey: 61 }
```

### `.strict`

默认情况下，Zod 对象模式会在解析过程中移除无法识别的键。使用 `.strict()` 可以禁止未知键。如果输入中存在未知键，Zod 会产生错误。

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
// => ZodError 발생
```

### `.strip` 方法

使用 `.strip` 方法可以将对象模式重置为默认行为。此时，无法识别的键会被移除。

### `.catchall`

可以向对象模式传入一个“catchall”模式。此时，所有未知键都会根据该模式进行验证。

```ts
const person = z
  .object({
    name: z.string(),
  })
  .catchall(z.number());

person.parse({
  name: "bob dylan",
  validExtraKey: 61, // 정상 동작
});

person.parse({
  name: "bob dylan",
  validExtraKey: false, // 실패
});
// => ZodError 발생
```

使用 `.catchall()` 后，就不再需要 `.passthrough()`、`.strip()` 和 `.strict()`。所有键都会被视为“已知”键。

## 数组

```ts
const stringArray = z.array(z.string());

// 동일한 표현
const stringArray = z.string().array();
```

使用 `.array()` 方法时需要注意。此方法会返回一个新的 `ZodArray` 实例。因此，调用方法的**顺序**很重要。例如：

```ts
z.string().optional().array(); // (string | undefined)[]
z.string().array().optional(); // string[] | undefined
```

在上面的示例中，第一行创建了一个数组，其每个元素都可以是 `string` 或 `undefined`。而第二行表示 `string` 数组本身可以是 `undefined`。

### `.element`

要访问数组元素的模式，请使用 `.element`。

```ts
stringArray.element; // => string 스키마
```

### `.nonempty`

要确认数组至少包含一个元素，请使用 `.nonempty()`。

```ts
const nonEmptyStrings = z.string().array().nonempty();
// 추론된 타입은 이제 다음과 같습니다.
// [string, ...string[]]

nonEmptyStrings.parse([]); // 오류 발생: "배열이 비어 있을 수 없습니다"
nonEmptyStrings.parse(["Ariana Grande"]); // 통과
```

如有需要，也可以指定自定义错误消息：

```ts
// 커스텀 오류 메시지 지정
const nonEmptyStrings = z.string().array().nonempty({
  message: "비어 있을 수 없습니다!",
});
```

### `.min` / `.max` / `.length`

```ts
z.string().array().min(5); // 배열은 5개 이상의 항목을 포함해야 함
z.string().array().max(5); // 배열은 5개 이하의 항목을 포함해야 함
z.string().array().length(5); // 배열은 정확히 5개의 항목을 포함해야 함
```

与 `.nonempty()` 不同，这些方法不会影响类型推断。

## 元组（Tuples）

与数组不同，元组具有固定数量的元素，并且每个元素可以拥有不同的类型。

```ts
const athleteSchema = z.tuple([
  z.string(), // 이름
  z.number(), // 등번호
  z.object({
    pointsScored: z.number(),
  }), // 통계
]);

type Athlete = z.infer<typeof athleteSchema>;
// type Athlete = [string, number, { pointsScored: number }]
```

使用 `.rest` 方法可以添加可变参数（“rest”）。

```ts
const variadicTuple = z.tuple([z.string()]).rest(z.number());
const result = variadicTuple.parse(["hello", 1, 2, 3]);
// => [string, ...number[]];
```

## 联合类型

Zod 提供了内置的 `z.union` 方法，用于构建“OR”类型。

```ts
const stringOrNumber = z.union([z.string(), z.number()]);

stringOrNumber.parse("foo"); // 통과
stringOrNumber.parse(14); // 통과
```

Zod 会依次针对每个“选项”测试输入值，并返回第一个通过验证的值。

为方便起见，也可以使用 [`.or` 方法](#or)。

```ts
const stringOrNumber = z.string().or(z.number());
```

**可选字符串验证：**

为了验证可选的表单输入，可以将所需的字符串验证与空字符串[字面量](#리터럴literals)联合起来。

以下示例验证一个可选的输入，但如果提供值，则必须包含[有效 URL](#문자열)。

```ts
const optionalUrl = z.union([z.string().url().nullish(), z.literal("")]);

console.log(optionalUrl.safeParse(undefined).success); // true
console.log(optionalUrl.safeParse(null).success); // true
console.log(optionalUrl.safeParse("").success); // true
console.log(optionalUrl.safeParse("https://zod.dev").success); // true
console.log(optionalUrl.safeParse("not a valid url").success); // false
```

## 判别联合（Discriminated Unions）

判别联合是多个共享特定键的对象模式的联合。

```ts
type MyUnion =
  | { status: "success"; data: string }
  | { status: "failed"; error: Error };
```

可以使用 `z.discriminatedUnion` 方法表示此类联合。由于这种方式允许 Zod 检查 `discriminator key`（上例中的 `status`），从而决定使用哪个模式解析输入，因此可以实现更快的评估。这使解析更加高效，也让 Zod 能够报告更友好的错误。

使用基本联合方法时，输入会针对每个提供的“选项”进行测试；如果无效，Zod 错误中会显示所有“选项”的问题。相比之下，判别联合只选择并测试一个“选项”，并且只显示与该“选项”相关的问题。

```ts
const myUnion = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("failed"), error: z.instanceof(Error) }),
]);

myUnion.parse({ status: "success", data: "yippie ki yay" });
```

可以使用 `.options` 属性提取对模式数组的引用。

```ts
myUnion.options; // [ZodObject, ZodObject]
```

要合并两个或更多判别联合，请使用 `.options` 和解构赋值。

```ts
const A = z.discriminatedUnion("status", [
  /* options */
]);
const B = z.discriminatedUnion("status", [
  /* options */
]);

const AB = z.discriminatedUnion("status", [...A.options, ...B.options]);
```

## 记录（Records）

记录模式用于验证 `Record<string, number>` 等类型。在使用 ID 存储或缓存项目时尤其有用。

```ts
const User = z.object({ name: z.string() });

const UserStore = z.record(z.string(), User);
type UserStore = z.infer<typeof UserStore>;
// => Record
```

可以按如下方式使用该模式和推断出的类型：

```ts
const userStore: UserStore = {};

userStore["77d2586b-9e8e-4ecf-8b21-ea7e0530eadd"] = {
  name: "Carlotta",
}; // 통과

userStore["77d2586b-9e8e-4ecf-8b21-ea7e0530eadd"] = {
  whatever: "Ice cream sundae",
}; // TypeError 발생
```

**关于数字键的注意事项**

`z.record(keyType, valueType)` 可以接受数字键类型，而 TypeScript 内置的 `Record` 类型是 `Record<KeyType, ValueType>`。但是，在 Zod 中表示 TypeScript 的 `Record<number, any>` 类型比较困难。

TypeScript 中 `[k: number]` 的行为不太直观：

```ts
const testMap: { [k: number]: string } = {
  1: "one",
};

for (const key in testMap) {
  console.log(`${key}: ${typeof key}`);
}
// 출력: `1: string`
```

如你所见，JavaScript 会在内部将所有对象键转换为字符串。由于 Zod 试图弥合静态类型与运行时类型之间的差距，而在运行时 JavaScript 中不存在数字键，因此没有必要提供创建带有数字键的记录模式的方法。

## Map

```ts
const stringNumberMap = z.map(z.string(), z.number());

type StringNumberMap = z.infer<typeof stringNumberMap>;
// type StringNumberMap = Map<string, number>
```

上面的代码示例使用 `zod` 库定义了一个以字符串为键、数字为值的 Map。`z.map()` 函数的第一个参数是键的类型，第二个参数是值的类型。这样定义的 Map 类型将是 `Map<string, number>`。

## Set（集合）

```ts
const numberSet = z.set(z.number());
type NumberSet = z.infer<typeof numberSet>;
// type NumberSet = Set<number>
```

Set 模式可以通过以下实用方法添加额外约束。

```ts
z.set(z.string()).nonempty(); // 최소 하나 이상의 항목을 포함해야 함
z.set(z.string()).min(5); // 5개 이상의 항목을 포함해야 함
z.set(z.string()).max(5); // 5개 이하의 항목을 포함해야 함
z.set(z.string()).size(5); // 정확히 5개의 항목을 포함해야 함
```

## 交叉类型（Intersections）

交叉类型适用于生成“逻辑 AND”类型。可以用于交叉两个对象类型。

```ts
const Person = z.object({
  name: z.string(),
});

const Employee = z.object({
  role: z.string(),
});

const EmployedPerson = z.intersection(Person, Employee);

// 与以下代码相同：
const EmployedPerson = Person.and(Employee);
```

不过，在许多情况下，合并两个对象时建议使用 `A.merge(B)`。`.merge` 方法会返回一个新的 `ZodObject` 实例，而 `A.and(B)` 会返回一个没有 `pick` 或 `omit` 等常用对象方法的 `ZodIntersection` 实例。

```ts
const a = z.union([z.number(), z.string()]);
const b = z.union([z.number(), z.boolean()]);
const c = z.intersection(a, b);

type c = z.infer<typeof c>; // => number
```

<!-- Zod 中的交叉类型并不智能。传递给 `.parse()` 的数据会原样传递给两个相交的 schema。由于 Zod 对象 schema 默认不允许未知键，因此与对象 schema 交叉相关的行为有一些不符合直觉。 -->

<!--

``` ts
const A = z.object({
  a: z.string(),
});

const B = z.object({
  b: z.string(),
});

const AB = z.intersection(A, B);

type Teacher = z.infer<typeof AB>;
// { id:string; name:string };
```  -->

## 递归类型

虽然可以在 Zod 中定义递归 schema，但由于 TypeScript 的限制，无法静态推断出相应的类型。相反，需要手动编写类型定义，并将其作为“类型提示”提供给 Zod。

```ts
const baseCategorySchema = z.object({
  name: z.string(),
});

type Category = z.infer<typeof baseCategorySchema> & {
  subcategories: Category[];
};

const categorySchema: z.ZodType = baseCategorySchema.extend({
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
}); // 통과
```

感谢 [crasite](https://github.com/crasite) 提供此示例。

### 一起使用 ZodType 和 ZodEffects

将 `z.ZodType` 与 `z.ZodEffects` 一起使用时（
[`.refine`](https://github.com/colinhacks/zod#refine)、
[`.transform`](https://github.com/colinhacks/zod#transform)、
[`preprocess`](https://github.com/colinhacks/zod#preprocess)、
等……），需要定义 schema 的输入和输出类型。`z.ZodType<Output, z.ZodTypeDef, Input>`

```ts
const isValidId = (id: string): id is `${string}/${string}` =>
  id.split("/").length === 2;

const baseSchema = z.object({
  id: z.string().refine(isValidId),
});

type Input = z.input & {
  children: Input[];
};

type Output = z.output & {
  children: Output[];
};

const schema: z.ZodType = baseSchema.extend({
  children: z.lazy(() => schema.array()),
});
```

感谢 [marcus13371337](https://github.com/marcus13371337) 和 [JoelBeeldi](https://github.com/JoelBeeldi) 提供此示例。

### 验证 JSON 类型

如果想验证 JSON 值，可以使用下面的代码片段。

```ts
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

jsonSchema.parse(data);
```

此代码基于 [ggoodman](https://github.com/ggoodman) 提出的内容编写。

### 循环对象

Zod 支持递归 schema，但如果传入循环数据，在某些情况下可能会导致无限循环。

> 如果想在出现问题前检测循环对象，可以考虑[这种方法](https://gist.github.com/colinhacks/d35825e505e635df27cc950776c5500b)。

## Promise

```ts
const numberPromise = z.promise(z.number());
```

使用 Promise schema 时，“解析”的行为略有不同。验证分为两个步骤：

1. Zod 会同步检查输入值是否为 Promise 的实例。也就是说，会检查它是否为具有 `.then` 和 `.catch` 方法的对象。
2. Zod 使用 `.then` 将额外的验证步骤连接到现有 Promise 上。需要在返回的 Promise 上使用 `.catch` 来处理验证失败。

```ts
numberPromise.parse("tuna");
// ZodError: Non-Promise type: string

numberPromise.parse(Promise.resolve("tuna"));
// => Promise

const test = async () => {
  await numberPromise.parse(Promise.resolve("tuna"));
  // ZodError: Non-number type: string

  await numberPromise.parse(Promise.resolve(3.14));
  // => 3.14
};
```

<!-- #### 非原生 Promise 实现

在“解析” Promise 时，Zod 会检查传入的值是否为具有 `.then` 和 `.catch` 方法的对象。因此，即使将 Bluebird 等非原生 Promise 传递给 `z.promise(...).parse`，也可以正常工作。但需要注意的是，解析函数的返回类型会变成`原生` `Promise`，因此如果下层逻辑使用了非标准 Promise 方法，可能无法正常工作。 -->

## Instanceof

使用 `z.instanceof` 可以检查输入值是否为特定类的实例。这对于验证由外部库导出的类的输入值非常有用。

```ts
class Test {
  name: string;
}

const TestSchema = z.instanceof(Test);

const blob: any = "whatever";
TestSchema.parse(new Test()); // 통과
TestSchema.parse(blob); // 오류 발생
```

在上面的示例中，`TestSchema` 会验证输入值是否为 `Test` 类的实例。`new Test()` 可以通过验证，但 `blob` 是字符串，因此会发生错误。

## 函数

Zod 支持定义“函数 schema”。这样可以轻松验证函数的输入和输出，而无需将验证代码与“业务逻辑”混合在一起。

可以使用 `z.function(args, returnType)` 创建函数 schema。

```ts
const myFunction = z.function();

type myFunction = z.infer<typeof myFunction>;
// => ()=>unknown
```

接下来定义输入和输出。

```ts
const myFunction = z
  .function()
  .args(z.string(), z.number()) // 임의의 수의 인자를 받음
  .returns(z.boolean());

type myFunction = z.infer<typeof myFunction>;
// => (arg0: string, arg1: number)=>boolean
```

函数 schema 具有 `.implement()` 方法。该方法接收一个函数作为参数，并返回一个会自动验证输入和输出的新函数。

```ts
const trimmedLength = z
  .function()
  .args(z.string()) // 임의의 수의 인자를 받음
  .returns(z.number())
  .implement((x) => {
    // TypeScript는 x가 문자열임을 알고 있습니다!
    return x.trim().length;
  });

trimmedLength("sandwich"); // => 8
trimmedLength(" asdf "); // => 4
```

如果只想验证输入，可以不调用 `.returns()` 方法。输出类型会从实现中推断出来。

> 如果函数不返回任何内容，可以使用特殊的 `z.void()` 选项。这样 Zod 就能正确推断返回 void 的函数类型。（返回 void 的函数实际上会返回 undefined。）

```ts
const myFunction = z
  .function()
  .args(z.string())
  .implement((arg) => {
    return [arg.length];
  });

myFunction; // (arg: string)=>number[]
```

可以从函数 schema 中提取输入和输出 schema。

```ts
myFunction.parameters();
// => ZodTuple

myFunction.returnType();
// => ZodBoolean
```

## 预处理（Preprocess）

> Zod 现在无需 `.preprocess()` 即可支持基本类型强制转换。详情请参考[强制转换文档](#基本类型强制转换coercion)。

通常，Zod 遵循“解析后转换”的范式。Zod 会先验证输入值，然后将其传递给转换函数链。（有关转换的详细信息，请参考[.transform 文档](#transform)。）

但有时，你可能希望在解析发生`之前`对输入值应用某种转换。常见的使用场景是类型强制转换。Zod 通过 `z.preprocess()` 支持这一点。

```ts
const castToString = z.preprocess((val) => String(val), z.string());
```

这段代码会返回一个 `ZodEffects` 实例。`ZodEffects` 是一个包装类，包含与预处理、改进（refinements）和转换相关的所有逻辑。

## 自定义 schema

在 Zod 中，可以使用 `z.custom()` 将 TypeScript 中的任意类型创建为 schema。这对于 Zod 默认不支持的类型非常有用，例如模板字符串字面量。

```ts
const px = z.custom((val) => {
  return typeof val === "string" ? /^\d+px$/.test(val) : false;
});

type px = z.infer<typeof px>; // `${number}px`

px.parse("42px"); // "42px"
px.parse("42vw"); // 에러 발생
```

如果不提供验证函数，Zod 将接受所有值。这可能会有危险！

```ts
z.custom(); // 검증을 수행하지 않음
```

可以通过第二个参数自定义错误消息或其他选项。此参数的工作方式与 [`.refine`](#refine) 的 params 参数相同。

```ts
z.custom((val) => ..., "커스텀 에러 메시지");
```

## Schema 方法

所有 Zod schema 都包含特定的方法。

### `.parse`

`.parse(data: unknown): T`

给定一个 Zod schema，可以调用 `.parse` 方法检查 `data` 是否有效。如果有效，将返回带有完整类型信息的值！否则会发生错误。

> 重要：`.parse` 返回的值是你传入变量的**深拷贝（deep clone）**。

```ts
const stringSchema = z.string();

stringSchema.parse("fish"); // => "fish" 반환
stringSchema.parse(12); // 오류 발생
```

### `.parseAsync`

`.parseAsync(data:unknown): Promise<T>`

使用异步[验证](#refine)或[转换](#transform)时，必须使用 `.parseAsync`。

```ts
const stringSchema = z.string().refine(async (val) => val.length <= 8);

await stringSchema.parseAsync("hello"); // => "hello" 반환
await stringSchema.parseAsync("hello world"); // => 에러 발생
```

### `.safeParse`

`.safeParse(data:unknown): { success: true; data: T; } | { success: false; error: ZodError; }`

如果不希望 Zod 在验证失败时抛出错误，请使用 `.safeParse`。该方法会返回一个对象，其中包含成功解析的数据，或包含验证问题详细信息的 ZodError 实例。

```ts
stringSchema.safeParse(12);
// => { success: false; error: ZodError }

stringSchema.safeParse("billie");
// => { success: true; data: 'billie' }
```

结果是一个**判别联合（discriminated union）**，因此可以非常方便地处理错误：

```ts
const result = stringSchema.safeParse("billie");
if (!result.success) {
  // 에러 처리 후 반환
  result.error;
} else {
  // 작업 수행
  result.data;
}
```

### `.safeParseAsync`

> 别名：`.spa`

这是 `safeParse` 的异步版本。

```ts
await stringSchema.safeParseAsync("billie");
```

为方便起见，它被设置了 `.spa` 别名：

```ts
await stringSchema.spa("billie");
```

### `.refine`

`.refine(validator: (data:T)=>any, params?: RefineParams)`

Zod 支持 `refinements` 功能，用于提供**自定义验证逻辑**。（如果想了解创建多个 issue 或自定义错误代码等高级功能，请参考 [`.superRefine`](#superrefine)。）

Zod 的设计目标是尽可能接近 TypeScript 的行为。不过，存在许多 TypeScript 类型系统无法表达的**细化类型**。例如，检查数字是否为整数，或检查字符串是否为有效的电子邮件地址。

例如，可以使用 `.refine` 为**任意 Zod schema**添加自定义验证：

```ts
const myString = z.string().refine((val) => val.length <= 255, {
  message: "문자열은 255자를 초과할 수 없습니다.",
});
```

> ⚠️ refinements 函数**不应抛出错误**。相反，验证失败时应返回 `falsy` 值。

#### 参数

`.refine` 接收两个参数。

1. 第一个是验证函数。该函数接收一个输入（`T` 类型——从 schema 推断出的类型），并返回 `any`。如果返回 truthy value，则验证通过。（在 zod@1.6.2 之前的版本中，验证函数必须返回布尔值。）
2. 第二个接收一些选项。可以使用这些选项自定义特定的错误处理行为：

```ts
type RefineParams = {
  // 오류 메시지 재정의
  message?: string;

  // 오류 경로에 추가
  path?: (string | number)[];

  // 오류 맵에서 메시지를 커스터마이징할 때 사용할 수 있는 파라미터 객체
  params?: object;
};
```

在高级使用场景中，第二个参数也可以是返回 `RefineParams` 的函数。

```ts
const longString = z.string().refine(
  (val) => val.length > 10,
  (val) => ({ message: `${val}은 10자를 초과하지 않습니다.` }),
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
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirm"], // 에러 경로
  });

passwordForm.parse({ password: "asdf", confirm: "qwer" });
```

由于提供了 `path` 参数，产生的错误如下：

```ts
ZodError {
  issues: [{
    "code": "custom",
    "path": [ "confirm" ],
    "message": "비밀번호가 일치하지 않습니다"
  }]
}
```

#### 异步 refinements

refinements 也可以异步使用：

```ts
const userId = z.string().refine(async (id) => {
  // 데이터베이스에서 ID가 존재하는지 확인
  return true;
});
```

> ⚠️ 使用异步 refinements 时，解析数据必须使用 `.parseAsync` 方法！否则 Zod 会发生错误。

#### transform 与 refine 的关系

transform 和 refine 可以交替使用：

```ts
z.string()
  .transform((val) => val.length) // 문자열을 길이로 변환
  .refine((val) => val > 25); // 길이가 25보다 큰지 검증
```

<!-- `path`가 `["confirm"]`로 설정되어 있으므로, "Confirm password" 텍스트박스 아래에 이 오류를 쉽게 표시할 수 있습니다.

```ts
const allForms = z.object({ passwordForm }).parse({
  passwordForm: {
    password: "asdf",
    confirm: "qwer",
  },
});
```

위 코드는 다음과 같은 결과를 반환합니다:

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

`.refine` 方法实际上是构建在更强大（也更冗长）的 `superRefine` 方法之上的语法糖（syntactic sugar）。示例如下：

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

可以添加任意数量的 issue。如果函数执行期间没有调用 `ctx.addIssue`，验证就会通过。

通常，refinements 始终会创建错误代码为 `ZodIssueCode.custom` 的 issue，但使用 `superRefine` 时，可以抛出任意 `ZodIssueCode` 的 issue。每个 issue code 都在 [ERROR_HANDLING.md](ERROR_HANDLING.md) 文档中进行了详细说明。

#### 提前中止

默认情况下，即使验证检查失败，解析也会继续进行。例如，将多个验证串联起来时，所有验证都会执行。不过，有时最好**提前中止**，避免执行后续验证。为此，可以向 `ctx.addIssue` 传递 `fatal` 标志，并返回 `z.NEVER`。

```ts
const schema = z.number().superRefine((val, ctx) => {
  if (val < 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "10 이상이어야 합니다",
      fatal: true,
    });

    return z.NEVER;
  }

  if (val !== 12) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "12여야 합니다",
    });
  }
});
```

#### 类型 refinements

如果向 `.refine()` 或 `.superRefine()` 提供[类型谓词（type predicate）](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)，结果类型会缩小为该谓词的类型。这在混合使用多个链式 refinements 和转换时很有用：

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
        code: z.ZodIssueCode.custom, // 이슈 커스터마이징
        message: "객체가 존재해야 합니다.",
      });
    }

    return z.NEVER; // 반환값은 사용되지 않지만, 타입을 만족시키기 위해 반환해야 함
  })
  // 여기서 TS는 arg가 null이 아니라는 것을 알고 있음
  .refine((arg) => arg.first === "bob", "`first`가 `bob`이 아닙니다!");
```

> ⚠️ 必须使用 `ctx.addIssue()` 来表示验证是否通过，而不是返回表示验证结果的布尔值。如果函数执行期间没有调用 `ctx.addIssue`，验证就会通过。

### `.transform`

要在解析数据后进行转换，请使用 `transform` 方法。

```ts
const stringToNumber = z.string().transform((val) => val.length);

stringToNumber.parse("string"); // => 6
```

在此示例中，应用了一个返回字符串长度的转换函数。解析字符串 `"string"` 后，会返回其长度 `6`。

#### 链式调用顺序

上面的 `stringToNumber` 是 `ZodEffects` 子类的实例，而不是 `ZodString` 的实例。如果想使用 `ZodString` 的内置方法（例如 `.email()`），必须在应用**转换（transform）之前**先调用这些方法。

```ts
const emailToDomain = z
  .string()
  .email()
  .transform((val) => val.split("@")[1]);

emailToDomain.parse("colinhacks@example.com"); // => example.com
```

#### 在转换期间进行验证

`.transform` 方法可以在转换值的同时进行验证。这比将 `transform` 和 `refine` 链式调用在一起更简单，也能减少重复。

与 `.superRefine` 一样，转换函数会接收包含 `addIssue` 方法的 `ctx` 对象。可以使用该方法注册验证问题。

```ts
const numberInString = z.string().transform((val, ctx) => {
  const parsed = parseInt(val);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "숫자가 아닙니다.",
    });

    // 이는 변환 함수에서 조기에 반환하기 위해 사용할 수 있는
    // 특별한 심볼입니다. `never` 타입을 가지므로 반환 타입에
    // 영향을 미치지 않습니다.
    return z.NEVER;
  }
  return parsed;
});
```

#### transform 与 refinements 的关系

转换（transform）和 refinements（refine）可以交替使用，并会按照声明顺序执行。

```ts
const nameToGreeting = z
  .string()
  .transform((val) => val.toUpperCase()) // 값을 대문자로 변환
  .refine((val) => val.length > 15) // 길이가 15를 초과하는지 검증
  .transform((val) => `Hello ${val}`) // 값 앞에 "Hello"를 추가
  .refine((val) => val.indexOf("!") === -1); // 값에 "!"가 포함되지 않았는지 검증
```

在上面的示例中，各个步骤会依次执行。首先将字符串转换为大写，然后验证长度，再次转换字符串，最后验证是否包含特定字符。

#### 异步转换（Async Transforms）

转换（transform）也可以异步执行。

```ts
const IdToUser = z
  .string()
  .uuid()
  .transform(async (id) => {
    return await getUserById(id);
  });
```

> ⚠️ 如果 schema 包含异步转换，解析数据时必须使用 `.parseAsync()` 或 `.safeParseAsync()`。否则 Zod 会抛出错误。

### `.default`

可以使用转换（transforms）在 Zod 中实现“默认值”概念。

```ts
const stringWithDefault = z.string().default("tuna");

stringWithDefault.parse(undefined); // => "tuna"
```

也可以选择将函数传递给 `.default`。每次需要默认值时，都会重新执行该函数。

```ts
const numberWithRandomDefault = z.number().default(Math.random);

numberWithRandomDefault.parse(undefined); // => 0.4413456736055323
numberWithRandomDefault.parse(undefined); // => 0.1871840107401901
numberWithRandomDefault.parse(undefined); // => 0.7223408162401552
```

从概念上说，Zod 会按以下方式处理默认值：

1. 如果输入值为 `undefined`，则返回默认值。
2. 否则，使用基础 schema 解析数据。

### `.describe`

使用 `.describe()` 可以向结果 schema 添加 `description` 属性。

```ts
const documentedString = z
  .string()
  .describe("유용한 텍스트 조각입니다. 어떻게 사용할지 알고 있다면 말이죠.");
documentedString.description; // 유용한 텍스트 조각…
```

此功能在记录字段时很有用。例如，可以在使用 [`zod-to-json-schema`](https://github.com/StefanTerdell/zod-to-json-schema) 等库生成 JSON schema 时使用它。

### `.catch`

使用 `.catch()` 可以指定发生解析错误时要返回的“默认值”。

```ts
const numberWithCatch = z.number().catch(42);

numberWithCatch.parse(5); // => 5
numberWithCatch.parse("tuna"); // => 42
```

也可以选择将函数传递给 `.catch`。每次需要默认值时，都会重新执行该函数。此时，函数会接收包含所发生错误的 `ctx` 对象。

```ts
const numberWithRandomCatch = z.number().catch((ctx) => {
  ctx.error; // 발생한 ZodError
  return Math.random();
});

numberWithRandomCatch.parse("sup"); // => 0.4413456736055323
numberWithRandomCatch.parse("sup"); // => 0.1871840107401901
numberWithRandomCatch.parse("sup"); // => 0.7223408162401552
```

Zod 按以下方式处理“默认值”：

1. 使用基础 schema 解析数据。
2. 如果解析失败，则返回“默认值”。

### `.optional`

这是一个返回 schema 可选版本的便捷方法。

```ts
const optionalString = z.string().optional(); // string | undefined

// 아래와 동일합니다
z.optional(z.string());
```

### `.nullable`

这是一个返回 schema nullable 版本的便捷方法。

```ts
const nullableString = z.string().nullable(); // string | null

// 위 코드는 아래와 동일합니다.
z.nullable(z.string());
```

使用此方法可以轻松定义允许特定类型为 `null` 的 schema。例如，`z.string().nullable()` 会创建一个允许字符串或 `null` 值的 schema。它与 `z.nullable(z.string())` 的结果相同。

### `.nullish`

这是一个返回 schema “nullish”版本的便捷方法。Nullish schema 同时允许 `undefined` 和 `null`。如需进一步了解“nullish”概念，请参考 [TypeScript 3.7 发布说明](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing)。

```ts
const nullishString = z.string().nullish(); // string | null | undefined

// 위 코드는 아래와 동일합니다.
z.string().nullable().optional();
```

### `.array()`

这是一个返回给定类型数组 schema 的便捷方法。

```ts
const stringArray = z.string().array(); // string[]

// 위 코드는 아래와 동일합니다
z.array(z.string());
```

使用此方法可以简单地定义特定类型的数组。例如，如果想创建字符串数组，可以使用 `z.string().array()`。它与 `z.array(z.string())` 的结果相同。

### `.promise`

这是用于 Promise 类型的便捷方法：

```ts
const stringPromise = z.string().promise(); // Promise<string>

// 위 코드는 아래와 동일합니다
z.promise(z.string());
```

此方法用于将给定 schema 包装为 Promise。例如，`z.string().promise()` 会返回 `Promise<string>` 类型。它与 `z.promise(z.string())` 的结果相同。

### `.or`

这是便捷使用[联合类型](#联合类型)的方法。

```ts
const stringOrNumber = z.string().or(z.number()); // string | number

// 위 코드는 아래와 동일합니다.
z.union([z.string(), z.number()]);
```

- `z.string().or(z.number())` 会创建一个允许字符串或数字类型的联合类型
- 此方法提供与 `z.union([z.string(), z.number()])` 相同的功能，但写法更加简洁

### `.and`

这是用于轻松创建交叉类型（intersection type）的便捷方法。

```ts
const nameAndAge = z
  .object({ name: z.string() })
  .and(z.object({ age: z.number() })); // { name: string } & { age: number }

// 위 코드는 아래와 동일합니다.
z.intersection(z.object({ name: z.string() }), z.object({ age: z.number() }));
```

### `.brand`

`.brand<T>() => ZodBranded<this, B>`

TypeScript 的类型系统是结构化的（structural）。这意味着结构相同的两个类型会被视为相同类型。

```ts
type Cat = { name: string };
type Dog = { name: string };

const petCat = (cat: Cat) => {};
const fido: Dog = { name: "fido" };
petCat(fido); // 문제 없이 동작
```

有时，你可能希望在 TypeScript 中模拟**名义类型（nominal typing）**。例如，可能希望编写一个只接收经过 Zod 验证的输入的函数。这可以通过使用**品牌类型（branded types）**（或**不透明类型（opaque types）**）实现。

```ts
const Cat = z.object({ name: z.string() }).brand();
type Cat = z.infer<typeof Cat>;

const petCat = (cat: Cat) => {};

// 이 코드는 동작
const simba = Cat.parse({ name: "simba" });
petCat(simba);

// 이 코드는 동작하지 않음
petCat({ name: "fido" });
```

在内部，它通过使用交叉类型（intersection type）为推断出的类型添加“品牌”来实现。这样，普通的／没有品牌的数据结构就无法再赋值给 schema 的推断类型。

```ts
const Cat = z.object({ name: z.string() }).brand();
type Cat = z.infer<typeof Cat>;
// {name: string} & {[symbol]: "Cat"}
```

请注意，品牌类型不会影响 `.parse` 的运行时结果。它只是一种静态（static）结构。

### `.readonly`

`.readonly() => ZodReadonly<this>`

此方法会返回一个 `ZodReadonly` schema 实例：它使用基础 schema 解析输入，然后对结果调用 `Object.freeze()`。推断出的类型也会标记为 `readonly`。

```ts
const schema = z.object({ name: z.string() }).readonly();
type schema = z.infer<typeof schema>;
// Readonly

const result = schema.parse({ name: "fido" });
result.name = "simba"; // 오류 발생
```

在适用的情况下，推断出的类型会使用 TypeScript 内置的 `readonly` 类型。

```ts
z.array(z.string()).readonly();
// readonly string[]

z.tuple([z.string(), z.number()]).readonly();
// readonly [string, number]

z.map(z.string(), z.date()).readonly();
// ReadonlyMap

z.set(z.string()).readonly();
// ReadonlySet
```

### `.pipe`

可以将 schema 连接成验证“管道”。这对于轻松验证 `.transform()` 之后的结果很有用：

```ts
z.string()
  .transform((val) => val.length) // 문자열을 길이로 변환
  .pipe(z.number().min(5)); // 길이가 5 이상인지 검증
```

`.pipe()` 方法会返回一个 `ZodPipeline` 实例。

#### 使用 `.pipe()` 解决 `z.coerce` 的常见问题

可以先将输入限制为所需类型，再使用 `.pipe()` 应用强制转换。

**输入未受限制时：**

```ts
const toDate = z.coerce.date();

// 직관적으로 동작
console.log(toDate.safeParse("2023-01-01").success); // true

// 원하지 않는 결과가 나올 수 있음
console.log(toDate.safeParse(null).success); // true
```

**输入受限时：**

```ts
const datelike = z.union([z.number(), z.string(), z.date()]);
const datelikeToDate = datelike.pipe(z.coerce.date());

// 여전히 직관적으로 동작
console.log(datelikeToDate.safeParse("2023-01-01").success); // true

// 더 원하는 결과를 얻을 수 있음
console.log(datelikeToDate.safeParse(null).success); // false
```

使用此技术还可以避免强制转换抛出无法捕获的错误。

**输入未受限制时：**

```ts
const toBigInt = z.coerce.bigint();

// 직관적으로 동작
console.log(toBigInt.safeParse("42")); // true

// 원하지 않는 결과가 나올 수 있음
console.log(toBigInt.safeParse(null)); // 잡히지 않는 오류 발생
```

**输入受限时：**

```ts
const toNumber = z.number().or(z.string()).pipe(z.coerce.number());
const toBigInt = z.bigint().or(toNumber).pipe(z.coerce.bigint());

// 여전히 직관적으로 동작
console.log(toBigInt.safeParse("42").success); // true

// Zod가 오류를 처리하며, 더 원하는 결과를 얻을 수 있음
console.log(toBigInt.safeParse(null).success); // false
```

通过这种方式使用 `.pipe()`，可以限制输入并安全地将其转换为所需类型。

## 指南与概念

### 类型推断

可以使用 `z.infer<typeof mySchema>` 提取任意 schema 的 TypeScript 类型。

```ts
const A = z.string();
type A = z.infer<typeof A>; // string

const u: A = 12; // TypeError
const u: A = "asdf"; // 컴파일 성공
```

**转换（transform）会怎样？**

实际上，每个 Zod schema 在内部都会追踪**两种**类型：输入类型和输出类型。对于大多数 schema（例如 `z.string()`），这两种类型相同。但添加转换后，这两个类型可能会不同。例如，`z.string().transform(val => val.length)` 的输入类型是 `string`，输出类型是 `number`。

可以分别提取输入类型和输出类型：

```ts
const stringToNumber = z.string().transform((val) => val.length);

// ⚠️ 중요: z.infer는 출력 타입을 반환합니다!
type input = z.input; // string
type output = z.output; // number

// z.output와 동일합니다!
type inferred = z.infer<typeof stringToNumber>; // number
```

### 编写泛型函数

使用 TypeScript 的泛型，可以编写接收 Zod schema 作为参数的可复用函数。这样可以在保持类型安全和类型推断的同时，创建自定义验证逻辑或 schema 转换。

在尝试编写一个接收 Zod schema 作为输入的函数时，可能会写出如下代码：

```ts
function inferSchema(schema: z.ZodType) {
  return schema;
}
```

但这种方式并不正确，并且会限制 TypeScript 正确推断参数类型。无论传入什么内容，`schema` 的类型都会固定为 `ZodType` 的实例。

```ts
inferSchema(z.string());
// => ZodType
```

这种方式会丢失类型信息。尤其是由于无法知道输入实际上属于哪个子类（如 `ZodString`），因此无法在结果值上调用 `.min()` 等字符串专用方法。

更好的方法是不仅推断 schema 的类型，还要**推断整个 schema**。为此，可以使用 `z.ZodTypeAny` 工具类型。

```ts
function inferSchema<T extends z.ZodTypeAny>(schema: T) {
  return schema;
}

inferSchema(z.string());
// => ZodString
```

> `ZodTypeAny` 是 `ZodType<any, any, any>` 的缩写，是一个足够宽泛、可以匹配所有 Zod schema 的类型。

现在，结果具有完整的类型定义，类型系统可以准确推断 schema 的具体子类。

#### 推断推断出的类型

虽然建议将 `z.ZodTypeAny` 用作 schema 的泛型参数，但这种方式可能导致解析后的数据被指定为 `any`，而不是 schema 推断出的类型。

```ts
function parseData(data: unknown, schema: T) {
  return schema.parse(data);
}

parseData("sup", z.string());
// => any
```

由于 TypeScript 的类型推断方式，`schema` 会被当作 `ZodTypeAny` 处理，而不是推断出的类型。可以使用 `z.infer` 进行类型转换来解决此问题。

```ts
function parseData(data: unknown, schema: T) {
  return schema.parse(data) as z.infer<T>;
  //                        ^^^^^^^^^^^^^^ <- 이 부분 추가
}

parseData("sup", z.string());
// => string
```

#### 限制可接受的输入

`ZodType` 类具有三个泛型参数。

```ts
class ZodType<
  Output = any,
  Def extends ZodTypeDef = ZodTypeDef,
  Input = Output
> { ... }
```

通过限制这些泛型参数，可以限制函数所接受的 schema 输入：

```ts
function makeSchemaOptional<T extends ZodType>(schema: T) {
  return schema.optional();
}

makeSchemaOptional(z.string());
// 정상적으로 동작

makeSchemaOptional(z.number());
// 오류: 'ZodNumber'는 'ZodType' 타입의 매개변수에 할당할 수 없음
```

### 错误处理

Zod 提供了一个名为 `ZodError` 的 Error 子类。ZodError 包含一个 `issues` 数组，其中包含验证问题的详细信息。

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

> 有关可能的错误代码以及自定义错误消息的方法，请参考专门的错误处理指南：[ERROR_HANDLING.md](ERROR_HANDLING.md)

Zod 的错误报告强调**完整性**和**准确性**。为了向最终用户提供有用的错误消息，建议使用错误映射重写 Zod 的错误消息，或使用 [`zod-validation-error`](https://github.com/causaly/zod-validation-error) 等第三方库。

### 错误格式化

可以使用 `.format()` 方法将此错误转换为嵌套对象。

```ts
const result = z
  .object({
    name: z.string(),
  })
  .safeParse({ name: 12 });

if (!result.success) {
  const formatted = result.error.format();
  /* {
    name: { _errors: [ '문자열이어야 하는데, 숫자가 입력되었습니다' ] }
  } */

  formatted.name?._errors;
  // => ["문자열이어야 하는데, 숫자가 입력되었습니다"]
}
```

这段代码展示了如何使用 `zod` 库验证对象，并在发生错误时对错误进行格式化。`name` 字段应输入字符串而不是数字，如果输入数字，就会返回错误消息。

## 比较

虽然各种验证库被广泛使用，但大多数都存在会损害开发者体验的设计限制。

<!-- 아래 표는 주요 기능 차이를 요약한 것입니다. 필요한 경우, 표 아래에서 특정 대안에 대해 더 자세히 논의합니다. -->

<!-- | 功能                                                                                                                | [Zod](https://github.com/colinhacks) | [Joi](https://github.com/hapijs/joi) | [Yup](https://github.com/jquense/yup) | [io-ts](https://github.com/gcanti/io-ts) | [Runtypes](https://github.com/pelotom/runtypes) | [ow](https://github.com/sindresorhus/ow) | [class-validator](https://github.com/typestack/class-validator) |
| ---------------------------------------------------------------------------------------------------------------------- | :-----------------------------: | :----------------------------------: | :-----------------------------------: | :--------------------------------------: | :---------------------------------------------: | :--------------------------------------: | :-------------------------------------------------------------: |
| <abbr title='包含可以从验证器实例中提取 TypeScript 类型的所有功能'>类型推断</abbr>         |               🟢                |                  🔴                  |                  🟢                   |                    🟢                    |                       🟢                        |                    🟢                    |                               🟢                                |
| <abbr title="Yup 在特定情况下的类型推断并不准确。下文将对此进行详细讨论。">准确的类型推断</abbr> |               🟢                |                  🔴                  |                  🔴                   |                    🟢                    |                       🟢                        |                    🟢                    |                               🟢                                |

<abbr title="数字、字符串、布尔值、null、undefined">基本类型</abbr>
<abbr title="除了“这是字符串吗？”这样的基本检查外，还包括最小/最大长度、电子邮件格式、URL 格式、大小写检查等。">字符串验证</abbr>
<abbr title="除了“这是数字吗？”这样的基本检查外，还包括最小/最大值、是否为正数、整数 vs 浮点数等。">数字验证</abbr>
日期

基本字面量
对象字面量
元组字面量
对象
数组
非空数组
联合
可选
可空
枚举
枚举自动补全
交叉类型
对象合并
元组
递归类型
函数 schema

<abbr title="例如，Yup 允许使用类似 `yup.number().min(5, '数字必须大于 5！')` 的语法来自定义错误消息。">验证消息</abbr>
不可变实例
类型守卫
有效性验证
类型转换
默认值
丰富的错误信息
品牌 -->

<!-- - 缺少的对象方法：（pick、omit、partial、deepPartial、merge、extend）

* 缺少具有适当类型的非空数组（`[T, ...T[]]`）
* 缺少延迟/递归类型
* 缺少 Promise schema
* 缺少函数 schema
* 缺少联合及交叉类型 schema
* 缺少对循环数据解析的支持（可能）
* 缺少对错误自定义的支持 -->

此表格和说明比较了各个库的功能，帮助开发者选择适合项目的工具。了解各个库的优势和劣势后，可以做出更好的决定。

### Joi

[https://github.com/hapijs/joi](https://github.com/hapijs/joi)

不支持静态类型追踪 😕

### Yup

[https://github.com/jquense/yup](https://github.com/jquense/yup)

Yup 是一个功能丰富的库，最初使用原生 JavaScript 实现，之后又使用 TypeScript 重写。

- 支持类型转换（casting）和转换（transforms）。
- 默认情况下，所有对象字段都是可选的（optional）。
<!-- - 不支持具有适当类型的非空数组（`[T, ...T[]]`）。 -->
- 不支持 Promise schema。
- 不支持函数 schema。
- 不支持联合（union）和交叉（intersection）schema。

<!-- ¹Yup 对 `required` 一词有独特的解释。Yup 并不将其理解为“不是 undefined”，而是将其用于表示“不为空”。因此，`yup.string().required()` 不允许空字符串，而 `yup.array(yup.string()).required()` 不允许空数组。相反，在 Yup 中，可以像 Zod 数组一样使用专用的 `.nonempty()` 方法，或通过自定义细化（custom refinement）来实现这一点。 -->

### io-ts

[https://github.com/gcanti/io-ts](https://github.com/gcanti/io-ts)

io-ts 是由 gcanti 创建的优秀库。io-ts 的 API 为 Zod 的设计提供了很大启发。

根据我们的经验，io-ts 在许多情况下优先考虑函数式编程的纯粹性，而不是开发者体验。这是合理且值得尊敬的设计目标，但也使得 io-ts 难以集成到现有的过程式或面向对象代码库中。例如，让我们看看如何在 io-ts 中定义带有可选属性的对象。

```ts
import * as t from "io-ts";

const A = t.type({
  foo: t.string,
});

const B = t.partial({
  bar: t.number(),
});

const C = t.intersection([A, B]);

type C = t.TypeOf;
// 반환 타입: { foo: string; bar?: number | undefined }
```

必须将必需属性和可选属性定义在单独的对象验证器中，通过 `t.partial` 标记可选属性，然后使用 `t.intersection` 将它们合并。

以下是在 Zod 中执行相同操作的方法：

```ts
const C = z.object({
  foo: z.string(),
  bar: z.number().optional(),
});

type C = z.infer<typeof C>;
// 반환 타입: { foo: string; bar?: number | undefined }
```

这种声明式 API 使 schema 定义更加简洁。

`io-ts` 还必须使用 gcanti 的函数式编程库 `fp-ts` 来解析结果并处理错误。对于希望严格保持代码库函数式的开发者来说，这是一个很好的资源。但是，依赖 `fp-ts` 不可避免地会带来大量认知负担。开发者必须熟悉函数式编程概念和 `fp-ts` 的命名法，才能使用该库。

- 支持序列化和反序列化转换的 codec
- 支持品牌类型
- 支持高级函数式编程、高阶类型和 `fp-ts` 兼容性
- 缺少对象方法：（pick、omit、partial、deepPartial、merge、extend）
- 缺少具有适当类型的非空数组（`[T, ...T[]]`）
- 缺少 Promise schema
- 缺少函数 schema

### Runtypes

[Runtypes GitHub 页面](https://github.com/pelotom/runtypes)

Runtypes 支持**良好的类型推断**。

- 支持**模式匹配**：针对联合类型进行分发的计算属性
- **缺少的对象方法**：没有 `deepPartial`、`merge` 等功能
- 缺少对**非空数组**的适当类型支持（`[T, ...T[]]` 形式）
- **Promise schema** 支持不足
- 缺少**错误自定义**功能

Runtypes 在类型推断方面具有优势，但仍有一些功能尚未实现。尤其是，如果增加对象方法和非空数组的类型支持、Promise schema 以及错误自定义功能，它将成为更加完善的库。

### Ow

[https://github.com/sindresorhus/ow](https://github.com/sindresorhus/ow)

Ow 是一个专注于验证函数输入值的库。它可以轻松表达复杂条件，但不提供解析无类型数据的功能。Ow 支持多种类型，与 Zod 几乎一一对应到 TypeScript 的类型系统不同，Ow 可以直接使用 `int32Array` 等非常具体的类型。（详细列表请参阅 README。）

如果你想验证函数输入值，请尝试使用 Zod 的函数 schema。这种方法可以复用函数类型声明，减少每次在函数开头复制粘贴 Ow 验证语句的麻烦。此外，Zod 还可以验证返回类型，因此可以确保不会传入意外的数据。

## 变更记录

变更记录可以在 [CHANGELOG.md](CHANGELOG.md) 中查看。
