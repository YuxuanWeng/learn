# OMS 前端项目(electron)

--

## ⚛︎ 项目准备

- pnpm config set auto-install-peers true
- sqlite3 需要全局安装 node-gyp 'npm install -g node-gyp'，并且需要安装 Python v3.7, v3.8, v3.9, 或 v3.10，否则 electron-builder 会 build 失败

### 安装依赖

#### 私有仓库鉴权

> 个人的 GITLAB_TOKEN 可以从 https://git.zoople.cn/-/profile/personal_access_tokens 获取

- `npm config set -- '//git.zoople.cn/api/v4/packages/npm/:_authToken' "GITLAB_TOKEN"` 整体仓库
- `npm config set -- '//git.zoople.cn/api/v4/projects/290/packages/npm/:_authToken' "GITLAB_TOKEN"` eslint库
- `npm config set -- '//git.zoople.cn/api/v4/projects/297/packages/npm/:_authToken' "GITLAB_TOKEN"` common库
- `npm config set -- '//git.zoople.cn/api/v4/projects/284/packages/npm/:_authToken' "GITLAB_TOKEN"` icon库

#### [可选]全局加速

- `NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node`
- `npm config set registry https://registry.npmmirror.com`
- `pnpm config set registry https://registry.npmmirror.com`
- `set ELECTRON_MIRROR=https://mirrors.huaweicloud.com/electron/` (或 `pnpm config set ELECTRON_MIRROR https://mirrors.huaweicloud.com/electron/`)

> 如果出现镜像上没有较新版本依赖包的情况，可以去 npmmirror.com 搜索包名后点击 `SYNC` , 等待其从官方仓库同步成功再安装即可
> 如果 pnpm i 时出现 electron postinstall 时 404 的情况，可以 `cd node_modules/electron/` 后 `node install.js` 后再回来安装
> 如果出现 sentry-cli 拉取失败的情况，可将 sentry-cli 的源切换为 `https://npmmirror.com/mirrors/sentry-cli/`, 具体可执行 `npm config set sentrycli_cndurl="https://npmmirror.com/mirrors/sentry-cli"`

> 工具版本管理器
>
> - [nvm - Node Version Manager](https://github.com/nvm-sh/nvm)
> - [nrm - NPM registry manager](https://github.com/Pana/nrm)

- 保证已安装过 `npm i -g pnpm@7`
- `pnpm i`

#### 如果运行时 sqlite3 报错

方法 1(下载官方 sqlite 包到本地):

- 尝试运行如下命令覆盖
- 注意命令中的版本等信息，或许要根据 _本机规格_ 或 _依赖版本_ 找到[镜像版本列表](https://registry.npmmirror.com/binary.html?path=sqlite3/)手动调整

```bash
curl https://cdn.npmmirror.com/binaries/sqlite3/v5.1.6/napi-v6-darwin-unknown-arm64.tar.gz | tar -zx -C ./node_modules/.pnpm/sqlite3@5.1.6/node_modules/sqlite3/lib/binding/
```

方法 2(配置为自有 oss @kaiyuan.hu):

```
npm config set node_sqlite3_binary_host_mirror https://bdm-fe-zp.oss-cn-shanghai.aliyuncs.com/binaries/sqlite3
```

---

## ⚛︎ 项目开发

### 命令

- 开发oms `pnpm dev`
- 开发dtm `pnpm dtm-dev`
- 开发odm `pnpm odm-dev`
- oms构建mac包 `pnpm pack:mac`
- oms构建线上包 `pnpm pack4xintang-uat` 或者 `pnpm pack4xintang`
- dtm构建包 `pnpm dtm-build`
- odm构建包 `pnpm odm-build`
- 清理打包产物 `pnpm clean`
- 类型检查 `pnpm type-check`
- 检查oms项目lint `pnpm lint`
- 检查dtm项目lint `pnpm dtm-lint`
- 检查odm项目lint `pnpm odm-lint`
- 检查代码重复率 `pnpm jscpd` 需要本地全局安装jscpd
- 查看组件用例 `pnpm storybook`
- 执行单测 `pnpm test`
- 生成接口idl `pnpm scripts:gen-services-types`
- 生成权限代码 `pnpm scripts:gen-services-access-code`
- 生成odm数据页表格配置 `pnpm scripts:gen-odm-column-fields`

### 变量注入

- electron 主进程不能通过和 web 项目相同的方法注入变量
- 在 app-config 中添加对应的 key 后，可以将同名环境变量注入
- 在主进程中引用 getAppConfig() 使用，渲染进程内使用 window.appConfig

### 组件化和 storybook

> 所有字体、颜色、组件等标准化交互都应该可以在 storybook 中看到 demo

- 运行组件开发环境：`pnpm storybook`
- _组件的交互式测试见文档下方[测试]章节_

**基础组件**:

- 指直接按照 AntD 的标准组件 API 使用的组件
- 可在 storybook 预览效果，一般用例代码和组件放在一起，比如组件 `@packages-mono/components/Input/Input.tsx` 预览文件就在 `packages-mono/components/Input/Input.stories.tsx`

**业务组件**：

- 这里可认为是 _基于基础组件组合的复杂 UI 组件_ 及 _包含特定业务数据接口请求的组件_ 的通称，其共同点是在项目中具有 **可复用性**
- 放置于 `packages-mono/business/components` 中，用独立目录管理
- 每个组件目录中应包含对应的 storybook 用例(`.stories.(jsx,tsx)`) 和单测用例(`.spec.(jsx,tsx)`)

#### 交互式测试

- 在 `*.stories.tsx` 中为相应的用例添加 `play函数`
- 开发过程可复用单元测试的经验和工具库编写交互动作和断言，**用例可被两种测试复用**

#### 常见问题

- 如遇到 `Failed to fetch dynamically imported module: http://localhost:6006/.storybook/preview.js` 报错
  > 在保证代码正确、依赖可靠（如 svgr 和 storybook 存在兼容性问题）的情况下，可尝试关闭浏览器页签并重启 pnpm storybook 进程
- 默认启动在 `Docs` 页签，并且看不到左侧树状菜单
  > 切换到 `Canvas`, **刷新浏览器**
- 用例页面处于 `Docs` 页签，并且控制台报错 `Uncaught TypeError: Cannot read properties of undefined (reading 'content')`
  > 切换到 `Canvas`, 保证 Logo 右侧的下拉菜单中选中 `Show toolbar` 和 `Show addons`，**刷新浏览器**
- 菜单中不小心取消勾选了 `Show sidebar` 后页面空白
  > 在开发者工具中清除 localStorage 和 sessionStorage 后刷新
- 只有用例展示，没有展示侧栏菜单
  > 可能是误触了 storybook 的快捷键，单击 s 或者 f 就可以将侧栏菜单重新打开
- 更新分支或版本后无法正确运行 storybook
  > `rm pnpm-lock.json`、 `rm -rf node_modules`、`pnpm i`，
  > 检查若 `public/mockServiceWorker.js` 中的版本和 `package.json` 中 msw 的不符，还需运行下方 `msw` 章节中的 init 命令

### **_Service_**

#### 目录结构

- **_service_** 与 **_mock_** 涉及的文件较多（因需与后端接口一一对应，方便对应业务的对接），以下为两个模块在项目根目录下的结构：

  ```bash
  --- apps # 网页端项目
  --- electron # 主进程相关代码，包括本地服务之类
  --- packages # 日志相关通用代码
  --- packages-mono # 复用能力较高的一些代码
    |--- business # 业务能力较强的代码
    |--- centrifuge-client
    |--- components # 基础组件，将来稳定后会抽离出来单独一个仓库维护
    |--- mock
      |--- api # 与 src/common/services/api 中的 bds 各模块 api 一一对应，一个目录对应一个  模块
        |--- ... # bds 各模块 api mock 服务相应接口的处理者
        |--- index.ts # bds api 相应接口的处理者入口列表
      |--- browser.ts # 使用浏览器时开启 msw 的 mock 服务提供
      |--- handlers.ts # msw 的 mock 服务相应接口的处理者入口列表
      |--- server.ts # 使用 node 时开启 msw 的 mock 服务提供
    |--- request # 封装好的axios模版，方便各端二次封装复用
    |--- services # electron 层 与 web 层通用的 service 服务相关内容存放目录
          |--- types # bds 各模块 api proto 文件对应的 TypeScript 类型定义
            |--- ...
            |--- bdm-common.ts # bdm idl 中的 common.proto 对应的 TypeScript 类型定义
            |--- bdm-enum.ts # bdm idl 中的 enum.proto 对应的 TypeScript 类型定义
            |--- bds-common.ts # bdm idl 中的 bdm_bds_common.proto 对应的 TypeScript 类型定义
            |--- bds-enum.ts # bdm idl 中的 bdm_bds_enum.proto 对应的 TypeScript 类型定义
            |--- common.ts # 合并导出 bdm-common.ts 与 bds-common.ts 方便外部引用
            |--- enum.ts # 合并导出 bdm-enum.ts 与 bds-enum.ts 方便外部引用
          |--- proto # 使用 pb 协议接口的 json 类型定义
  --- scripts
  --- src
    |--- common # 项目通用模块存放目录
      |--- request # 基于 axios 的二次封装
      |--- services # web 层 service 服务相关内容存放目录
        |--- api # bds 各模块 api service 服务
          |--- ...
        |--- apis.ts # 后端 api 路由地址统一管理
  ```

- **_bdm idl_** 各模块 **_api_** 对应规则

  - **_api_** 的**模块名**（**_文件夹名_**）对应 **_bdm idl_** 中 **_api proto_** 定义文件内的 `@api.url` 注释项紧跟在 `bdm_api` 后第一个反斜杠内的内容
    - 如：`@api.url` 为 `/api/v1/bdm/bds/bds_api/user/info/get` 的 **_api_** 对应的模块为 **_user_**，每个模块在 `packages/services/types` 用一个文件夹单独存放与模块相关的内容
  - **_api_** 的**文件名**对应 **_bdm idl_** 中 **_api proto_** 定义文件内的结构体 `message bdm_bds_bds_api_xxx_request` 中 `xxx` 除所处**模块名**外的内容
    - 如： 结构体为 `message bdm_bds_bds_api_user_get_info_request` 的 **_proto_** 文件对应 `packages/services/types/user/get-info.d.ts`，其中 **_user_** 为 **_get-info.d.ts_** 所处的模块名

- 更新 `packages-mono/services/types` 内容

  目前在 **_bdm_** 或 **_bds_** 的 **_idl_** 中部分 **_proto_** 定义文件更新后（即这个仓库：https://git.zoople.cn/common/idl 有更新) ，需要手动根据以下步骤跑一遍脚本对应生成新的 `packages-mono/services/types` 的 **_TypeScript_** 类型定义，相应步骤如下：

  1. 如本地环境没有 [`idl`](https://git.zoople.cn/common/idl.git) 项目，则将 [`idl`](https://git.zoople.cn/common/idl.git) **_clone_** 至与本项目平级的目录中：`git clone https://git.zoople.cn/common/idl idl`（注意：文件名必须为 `idl`)
  2. 如本地环境有 [`idl`](https://git.zoople.cn/common/idl.git) 项目，则拉取项目最新的代码至本地仓库
  3. 在本项目中执行 `pnpm scripts:gen-services-types` 生成对应的类型文件
  4. 该命令会同时更新common和enum，如果有需要单独更新common、enum或者idl，可以进到目录 `packages-mono/services/` 下单独执行命令 `pnpm gen-common-types`、 `pnpm gen-enum`、 `pnpm gen-api-types`来更新对应的common、enum和idl

  如有更好的方式更新相关 **_TypeScript_** 定义请提交 **_MR_** 并更新文档～

#### AccessCode 维护指南

详见飞书文档 [**_AccessCode_** 维护指南](https://shihetech.feishu.cn/wiki/AQdYwjepBi7e5Ik66gocWjdtndF)

#### **_mock_**

- 调研后根据 **_MVP_** 原则还是直接采用了 [**_msw_**](https://mswjs.io/) 结合 [**_faker.js_**](https://fakerjs.dev/) 作为基本 **_mock_** 服务提供依赖库，后续如果有需求再逐步使用其他依赖库
- **_msw_** 优点是无需复杂配置（基本配置已完成，整个项目的开发周期基本不需要调整）与启动操作，直接使用 `pnpm dev` 命令就可一起启动服务，且易于上手，基本操作看十分钟官方文档就能掌握
- 在对应接口的 **_msw_** **_handler_** 配置好后(`packages-mono/mock/api/xxx.ts`、`packages-mono/mock/handlers.ts`)，修改 `request` 中 `config` 的 `isMock` 为 `true`（默认为 `false`）即可调用对应的 **_mock_** 服务

### msw

目前 package.json 中配置了如下两个版本的 msw：

```
    "msw-latest": "npm:msw@^0.47.3", // for vitest/dev(mock/server.ts)
    "msw": "0.42.3", // for vitest/storybook
```

> 这样的版本约束，旨在保证 `pnpm dev`、`pnpm test`、`pnpm storybook` 几种命令的最大兼容，涉及此处的版本更新要极为谨慎。

比如初始化 storybook 的 mock 插件时，要运行 `sudo node_modules/msw/cli/index.js init public/` 命令以代替官方文档中的 <del>`npx msw init public/`</del> 命令

### 样式管理

#### tailwind/less 分工

- tailwindcss 用于定义 **常见通用样式**，在不用 import 额外模块的情况下，直接作用于业务逻辑的 className 上
- tailwind 通过插件也支持了有限度的子元素写法，参考文档尾部链接；可搜索代码关键字`child:`、`heir:`、`twin:`参考
- less 一方面承接 antd 的样式自定义；另外主要以 css modules 的形式实现 **精细化自定义样式**
- 两者可以共享 css variables，less 也可以用 theme() 调用 tw 样式；参考下方 “颜色” 章节
- css modules 在 electron 中引用顺序问题参考文档尾部说明

#### 颜色

> 设计稿中定义的标准主题色等，放在 `src/assets/styles/global.less` 中用 CSS variables 管理

- 对于不同的代码编辑器，可以自行搜索 Color Highlight 方面的插件，便于直观分辨颜色
- 原则上应用中用到的绝大部分颜色都从主题色中拾取

  比如对于 `--color-auxiliary-200: #de8c39;` ，具体用法如下：

  - 在 less 代码中，可以用 `color: var(--color-auxiliary-200)` 或 `color: theme('colors.auxiliary.200')` 取值
  - tailwindcss 会 **自动映射** global.less 中的变量；比如对于背景色样式名，用法为 `<div className="bg-auxiliary-200"></div>`

#### 字体

- 可以参考 _storybook 用例中的样式名_ 直接在 className 中引用
- css module 用法中还需要先 `@import '@/assets/styles/fonts.less'`

#### 业务样式

- 其他一些 UI 规范中常用的样式可以放置在 `src/assets/styles/business.less` 中管理

#### 定制 antd 组件样式

> 修改 `src/assets/styles/antd-reset.less`

- step1: 参考 [文档](https://ant.design/docs/react/customize-theme-cn)，对照 `node_modules/antd/lib/style/themes/default.less` 找到 less 变量名称，并在 antd-reset.less 中覆盖
- step2: 无法通过 step1 解决的，直接用样式覆盖

#### 日志采集

- 项目中集成了日志采集相关功能，具体见 storybook 中 文档/日志工具使用

### Electron 能力

#### 公用弹窗组件

> 通过 preload 中间层对 window 注入了一个 Dialog 对象属性，目前暴露的只有一个 openDialogWindow 方法，返回值为 Promise，通过 then、catch 分别接收弹窗的【确定】、【取消】按扭回调。

方法接收两种类型的参数：
**参数一：** DialogTypes 枚举，为一些预设参数的窗体，如快捷键、系统设置等拥有固定属性的窗体
**参数二：** config 对象，类型为 DialogWindowConfig，拥有两个属性：params、browserWindowParams。
其中，params 为自定义配置对象，支持配置的属性有：

- width、height 必填，宽、高；
- route 必填，弹出窗体后需要加载的路由页；
- isLightWindow 非必填，是否为无边框窗体，默认为 true；
- context 非必填，需要传递给弹窗的上下文对象，any 类型；

browserWindowParams 参数为 Electron-BrowserWindow 的原生配置对象，支持的属性可参照官文：[BrowserWindow](https://www.electronjs.org/zh/docs/latest/api/browser-window)

##### 如何使用：

1、添加路由
由于采用的是母子路由的设计，弹窗的操作、拖拽等 一些公共逻辑会在母版页中，所以添加路由需要在 `./src/routes/index.tsx/path=/dialog` 的 children 中添加。

2、获取母版页上下文数据：

```javascript
import { useEffect, useContext } from 'react';
import { useDialogLayout } from '@/layouts/Dialog/hooks';

const {
  confirm, // 确定按扭回调
  cancel // 取消按扭回调
} = useDialogLayout();
const context = useContext(Context);

// 确定按扭事件
const handleConfirm = () => {
  confirm({ name, gender }, '参数2', '参数3')
};
// 取消按扭事件
const handleCancel = () => {
  cancel([5, 6, 7], 8, 9);
};
// 给父窗口发送消息
const sendMsg () => void;
```

3、在需要使用弹窗的父级窗体中：

```javascript
import { openDialogWindow } from '@/common/utils/dialog';
const config: DialogWindowConfig = {
  params: {
    name: '',
    route: '/dialog/shortcut',
    width: 333,
    height: 475,
    isLightWindow: true,
    context: { // 示例上下文数据
      name: 'shihe',
      age: 20
    }
  },
  browserWindowParams: {
    resizable: false // 是否为无边框窗体
    // 注意：小尺寸窗口在win中若不定义最小宽度，多显示器且缩放尺寸不同时，会出现窗口按照小屏幕尺寸最大化现象，因此尽量为每个窗口定义最小尺寸
    minWidth: 333,
    minHeight: 475
  }
};
openDialogWindow(config).then(({ type, args }) => {
  if (type === DialogResponseType.success)
    console.log(`确定了，参数一：${args[0]}, 参数二：${args[1]}`);
  else console.log(`取消了，参数一：${args[0]}, 参数二：${args[1]}`);
});
```

4.设置 Dialog 的标题

```jsx
import { Dialog } from '@/components/common/Dialog';
import { DialogLayout } from '@/layouts/Dialog';

<DialogLayout.Header>
  <Dialog.Header>标题设置</Dialog.Header>
</DialogLayout.Header>;
```

##### Electron 弹窗如何与父窗口通信：

为了方便父子窗口进行通信，目前加入了“信道”机制。
基本原理：子窗口创建完成后，主进程创建 MessageChannel 信道对象，并将信道两端分别传递给父子窗口的 preload（窗口预加载脚本），再由 preload 传递给前端。前端通过 window.addEventListener('message', event => {}) 的方式接收信道对象，并保存。

MessageChannelMain 对象：
基于 EventEmitter，点对点，返回两个 port 对象。
每个 port 都可通过 postMessage 向另一端发送任意类型的消息，通过 port.addEventListener('message', event => {}) 的事件对象的 data 属性（event.data）接收来自另一端的消息。
MessageChannelMain 是 Electron 对 [MessageChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel) 的重新封装，可通过 window.postMessage 的方式将信道两端传递给父子窗口。

```javascript
const { port1, port2 } = new MessageChannelMain();
```

**_使用方式_**：
子窗口接收来自父窗口的消息：

```javascript
import { useParentChannel } from '@/common/atoms';

const { channel } = useParentChannel();
useEffect(() => {
  const channelEvent = event => {
    // event.data.type 为 父子窗口约定的 MessageType 任意类型（最好使用 TS-Enum）
    if (event && event.data && event.data.type === DialogChannelTypes.updateContext) {
      setContext(event.data.context);
    }
  };
  // ..接收来自父窗口的信道消息
  channel?.addEventListener('message', channelEvent);
  return () => channel?.removeEventListener('message', channelEvent);
}, [channel]);
```

子窗口向父窗口发送消息

```javascript
import { useParentPort } from '@/common/atoms';

const { port } = useParentPort();
const submitEvent = () => {
  // ..其他业务代码
  port?.postMessage({ ... });
};
```

父窗口接收来自子窗口的消息：

```javascript
import { useChildPort } from '@/common/atoms';

// ..其他代码
const { port } = useChildPort(WindowTypes.SingleQuoteV2);
useEffect(() => {
  const handleMessage = event => {
    // event.data 为 子窗口 postMessage 来的数据
  };
  port?.addEventListener('message', handleMessage);
  return () => childChannel?.removeEventListener('message', handleMessage);
}, [port]);
```

父窗口向子窗口发送消息

```javascript
import { useChildPort } from '@/common/atoms';

// ..其他代码
const { port } = useChildPort(WindowTypes.SingleQuoteV2);
useEffect(() => {
  port?.postMessage('你好，子窗口');
}, [channel]);
```

---

### Git Commit

#### commit 钩子

每次 git commit 之前，会自动依次执行以下检查项； **只有全部成功才会完成提交**，请加以注意：

- pnpm type-check 检查类型规范
- pnpm lint-staged 检查当前提交代码的lint规范
- 检查 commit message 规范

#### commit message 规范

- 每次提交 Git 的 commit 时，message 部分应以 'feature'、'bugfix' 等开头，如 `[feature] 增加业务组件 XXX`
- 可选的前缀和对应的解释可参考 `.cz-changelog/types.js` 中的配置

## ⚛︎ 测试

### 单元测试

- 执行一次模式 `pnpm test`

### 交互式测试

- 参考文档上方 storybook 相关章节
  > 需要切换到 Canvas 页签、勾选上 `show addons` 并刷新；如仍无 Interactions 面板，参考文档 storybook 常见问题章节

## ⚛︎ 项目交付

### CI/CD

- ci 使用手动触发，在 run pipeline 中选择分支后手动进行打包
- 允许指定参数，包括：
  - env：环境 'dev' | 'test'
  - version：版本号，覆盖默认行为（dev/test 环境为提交哈希，其余为 package.json 内的版本号）
  - SUB_APPS_NAME：web端打包项目名
  - SUB_APPS_DEPLOY_ENV：web端打包环境
  - AUTO_DEPLOY：web端打包后是否自动部署

electron 版本建议使用固定版本，相关说明如下：

- electron 相关依赖使用了华为云镜像，某些小版本包华为云上没有，GitHub 上有，会导致打包失败
- 升级版本的时候不建议使用自动升级工具，基于上边的原因可能会导致失败，除非服务器
- 建议升级的时候先查看华为云有没有相关的版本再固定版本

### 部署

- .uploadoss.js 将打包结果上传至阿里云

### 生产环境打包

- !!!请使用 windows 设备进行打包!!!不然可能被错误检出病毒
- 生产环境需要为包添加 ev 签名，签名储存在硬件 u 盘内
- 插入 u 盘，在 "https://knowledge.digicert.com/generalinformation/INFO1982.html" 下载 SafeNet Authentication Client，并打开 SafeNet Authentication Client
- （可选）在 SAC 的 高级视图 -> 客户端设置 -> 高级 中打开“启用单点登录”，不打开的话在打包时会需要反复输入密码。之后需要登出电脑用户再登录方可生效。 参考 "https://www.digicert.com/kb/code-signing/ev-authenticode-certificates.htm#:~:text=How%20to%20Enable%20Single%20Logon%20for%20a%20SafeNet,off%20from%20the%20computer%20and%20log%20on%20again."
- 运行 pnpm pack4xintang-uat
- SAC 可能会弹出提示输入密码（若未打开单点登录则会弹出很多次），输入即可
- !!!五次输入密码错误会导致证书锁定!!!
- 打包成功后脚本会上传至生产环境
- 证书和密码请联系@刘欣彪

---

## ⚛︎ 其他

### 代码编辑器设置

- 对于部分 环境/编辑器/IDE（如 Gitlab / IDEA），理论上 **不需要额外设置**
- 其他如 VSCode / Vim 等，需要安装 [editorconfig 插件](https://editorconfig.org/#download)

### CSS Modules 样式优先级问题

- 在 Storybook 和 Electron 环境中，样式表现可能不同 -- 后者可能出现局部样式被全局覆盖的情况；参考[帖子](https://github.com/vitejs/vite/issues/3924#issuecomment-997694591)
- 解决办法为在 router 中统一使用 `React.lazy(() => import('@/pages/demo1'))` 写法

## 部分依赖文档

- [模版](https://github.com/maxstue/vite-reactts-electron-starter)
- [路由](https://reactrouterdotcom.fly.dev/)
- [状态管理-zustand](https://github.com/pmndrs/zustand)
- [数据持久化-dexie](https://dexie.org/docs/)
- 组件化
  - [基础库-ant design](https://ant.design/index-cn)
  - [开发环境-storybook](https://storybook.js.org/docs/react/writing-stories/introduction)
- 样式
  - [样式-less](https://lesscss.org/) (和 antd 保持一致)
  - [样式-tailwindcss](https://tailwindcss.com/)
  - [样式-tailwind-children](https://github.com/SamGoody/tailwind-children)
- 单元测试
  - [vitest](https://vitest.dev/)
  - [testing library](https://testing-library.com/docs/react-testing-library/intro)
  - [queries](https://testing-library.com/docs/queries/about#priority)
  - [官方示例](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib)
- storybook 交互式测试
  - [play 函数](https://storybook.js.org/docs/react/writing-stories/play-function)
  - [交互式测试](https://storybook.js.org/docs/react/writing-tests/interaction-testing#api-for-user-events)
- [提交信息-commitlint](https://commitlint.js.org/)
