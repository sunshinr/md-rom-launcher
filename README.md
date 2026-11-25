# MD ROM 启动器

基于 Electron + EmulatorJS 的 Mega Drive / Genesis ROM 启动器。默认内置《梦幻模拟战2 帝国之路·暗灭》中文改版 ROM；支持切换任意本地 MD/Genesis ROM。

> 这是模拟器封装，不是原生复刻。游戏逻辑仍由原 ROM 在 Genesis Plus GX（WASM）中运行。
> 仅限已获授权的个人 / 内部使用，请勿对外分发 ROM。

## 功能

- 内置 ROM 开箱即玩
- 「换 ROM」按钮选择本地任意 ROM 文件
- 拖入 ROM 文件到窗口直接启动
- 命令行指定 ROM：`应用.exe --rom="file:///D:/game.bin"`
- 即时存档 / 读档，存档保存在本机
- Windows x64 与 macOS Intel x64 双平台支持

## 内置 ROM 信息

| 项目 | 内容 |
|---|---|
| 文件 | `games/game.bin` |
| 平台 | Sega Mega Drive / Genesis（非 32X） |
| 大小 | 2 MB |
| 内部标题 | `ラングリッサー２` |
| 改版 | `楓児_恋姬 帝国之路·暗灭` |
| 产品号 | `GM T-025143-01` |
| 地区 | J6（日本） |

## 下载

前往 [Releases](https://github.com/sunshinr/md-rom-launcher/releases) 下载：

- Windows：`MD.ROM.Setup.1.0.0.exe`（NSIS 安装包）
- macOS：`MD.ROM.-1.0.0.dmg`（Intel x64，未签名）

macOS 首次打开：右键 DMG 中的 App → 打开；若被 Gatekeeper 拦截，前往「系统设置 → 隐私与安全性」手动允许。

## 操作

| 功能 | 键盘 |
|---|---|
| 方向键 | `↑` `↓` `←` `→` |
| A / 确认 | `S` |
| B / 取消 | `X` |
| C | `Z` |
| Start | `Enter` |
| Mode / Select | `V` |

模拟器菜单内可重新映射按键。ROM 自带的秘籍 / 隐藏商店保存在 ROM 逻辑中，原样运行可保留。

## 本地开发

环境：Node.js 20+，npm。

```bash
npm install
npm start
```

打包：

```bash
npm run dist:win    # Windows x64 NSIS
npm run dist:mac    # macOS x64 dmg + zip
```

注意：当前开发环境全局设置了 `ELECTRON_RUN_AS_NODE=1`，直接 `npm start` 会以 Node 模式运行导致 `app` 为 `undefined`。启动前需清除：

```bash
env -u ELECTRON_RUN_AS_NODE npm start
```

## 目录结构

```text
rom-win-app/
├── main.js                 # Electron 主进程、ROM 文件对话框、--rom 参数
├── preload.js              # contextBridge 暴露 ROM 选择接口
├── index.html              # 启动器界面与 EmulatorJS 配置
├── games/game.bin          # 内置 ROM
├── vendor/ejs/             # 本地化 EmulatorJS 与 Genesis Plus GX 核心
├── .github/workflows/      # 双平台构建 + Release 工作流
└── dist/                   # 构建产物（已 gitignore）
```

## CI / Release

`.github/workflows/build-mac.yml`：

- `windows-latest` 构建 Windows exe
- `macos-latest` 构建 macOS dmg + zip
- `release` 任务创建 / 更新 `v0.1.0` Release 并上传 exe 与 dmg

触发方式：

- 推送 `v*` 标签
- 手动运行：`gh workflow run build-mac.yml --repo sunshinr/md-rom-launcher`

## 已知问题

- CI 中 electron-builder 会过滤中文 `productName`，因此 Release 资产名为点号形式（`MD.ROM.Setup...`），文件可用。
- `emulator.min.js` 是 ESM，classic script 加载会报 `Unexpected token 'export'`；项目已设置 `EJS_DEBUG_XX = true` 走非精简源码，可正常启动。
- macOS 产物未签名，需手动允许运行。
