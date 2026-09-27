# dsh-芙宁娜主题 · DeepSeek Harness 主题插件

> GitHub 仓库：**dsh-furina-theme**（仓库名不支持中文，故用英文）｜插件包名：`dsh-theme-misty-morning`（沿用最初的适配来源标识，功能与安装方式不受影响）

一套**芙宁娜主题**（浅色蓝雾、全窗插画、半透明侧边栏）的 DSH 客户端主题插件：宿主半 + 浏览器半，向页面注入 115 个 `--dsw-*` 令牌覆盖（浅色 + 深色伴随方案）与一份插件自有的全局样式表。

- 适配来源：codexthemes.ai 的 Codex 主题包 `misty-morning`（<https://codexthemes.ai/themes/misty-morning>）—— 令牌契约与插画素材取自该包（`theme.css`、`assets/artwork.jpg`）
- 本插件：**不修改 DSH 本体、不写用户偏好、不碰其他插件**，禁用或卸载即完全回滚
- 给 agent 的完整安装/验证说明：[`SKILL.md`](./SKILL.md)

## 想用这个主题？把下面这段发给你自己的 DeepSeek Harness

> 请按 https://github.com/xiangshangya/dsh-furina-theme 的 SKILL.md，为我当前的 DeepSeek Harness 安装并配置「芙宁娜主题」：
>
> 1. 先读取安装说明：直连用 `https://raw.githubusercontent.com/xiangshangya/dsh-furina-theme/main/SKILL.md`；如果超时或被重置，改用镜像 `https://gh-proxy.com/https://raw.githubusercontent.com/xiangshangya/dsh-furina-theme/main/SKILL.md`（源码整包同理：`https://gh-proxy.com/https://github.com/xiangshangya/dsh-furina-theme/archive/refs/heads/main.zip`）；
> 2. 严格按 SKILL.md 的「安装步骤」执行：把主题作为本地包放进 `$DSH_HOME/profiles/web/node_modules/`，并在 `cordis.patch.yml` 追加那段 insert（若已存在同名列就跳过安装）；
> 3. 完成后告诉我需要重启 DSH，并在重启后按 SKILL.md 的「验证」清单确认主题真的生效（不要只看文件是否就位）；
> 4. 任何异常按「排查 / 关闭 / 回滚」小节处理；不要改动我的其他插件、模型配置与会话数据。

把上面这段整段复制发给你的 DSH 即可。想只让首页有插画、或想去掉首页小光点，在提示词后追加一句就行（对应 `--background-scope home` / `--no-motes`）。

## 变更

- **0.1.6**（2026-09-27）：行背景**彻底去掉**（导航、会话行、区块标题、底部操作全部透明，只有插画在文字后面），改成把次要/三级文字压深到能直接压在插画上仍然达标 —— 次要 `#566A7C` → `#405365`、三级 `#506372` → `#435668`；审计仍为 0 失败，原先最差的一条从 3.82 升到 4.64。
- **0.1.5**（2026-09-27）：把列表材质从「整个列表容器」改成「只在每一行 / 区块标题 / 底部操作上」——会话少的时候「工作区」下方不再是一大块发白，空白处恢复为完整插画（`mean(236,242,247)` → `mean(210,224,235)`），行与标题仍有 0.44 的轻材质保证小字可读。
- **0.1.4**（2026-09-27）：去掉侧边栏模糊，并整体「提浓」——全窗口面纱 0.70 → 0.58、首页面纱 0.34 → 0.28、方向光梯度 0.58 → 0.46，侧边栏列面纱 0.40 → 0.30。主内容区色彩浓度 chroma 15.1 → **19.6**（Codex 18.0）、均值 `rgb(231,236,242)` → `rgb(219,230,239)`（Codex `rgb(222,232,240)`）；侧边栏保持**清晰无模糊**。
- **0.1.3**（2026-09-27）：左侧导航栏改成与 Codex 一致的**透视**效果 —— 侧边栏列自己重绘同一张插画（同一焦点、`fixed` 对齐）并叠加轻面纱 + 柔化提亮，插画直接透出（同区域均值 `rgb(215,228,239)`，Codex 为 `rgb(219,228,235)`），同时把三级文字压深以保证 AA。
- **0.1.2**（2026-09-27）：光点装饰按 DSH 的铺法重新定标（透明度降到约 1/3，并新增 `--no-motes` 开关）；左侧导航栏改为与插画同材质（填充不透明度 0.86 → 0.74、`新会话` 按钮由纯白改为半透明主题白）。
- **0.1.1**（2026-09-27）：浅色三级 / 说明文字与强调色文字各压深一档，真机（1440×900）首页与会话页的对比度审计从 11/29、9/71 项失败收敛到 **0 项**；新增真机取证工具 `tools/attach-shot.cjs`。
- **0.1.0**：首个适配版本 —— 115 个 `--dsw-*` 令牌层（浅色 + 深色伴随方案）、插画画布与面纱材质、装饰层、终端与选区跟进。

## 适配思路：Codex 契约 → DSH 契约

Codex 主题与 DSH 主题的扩展点完全不同，适配做的是等价映射，而不是照抄 CSS：

| Codex 主题（`.codex-theme`） | DeepSeek Harness 对应物 |
| --- | --- |
| `--color-token-*` / `--color-background-*` 覆盖 | `ctx.theme.overrideTokens()` 注入的 `--dsw-alias-*` / `--dsw-specific-*` 语义令牌（115 个，浅色 + 深色成对） |
| 注入一份 `theme.css` 到 `<head>` | 插件自有的全局样式表 `style[data-plugin="dsh-theme-misty-morning"]`，随插件 fiber 卸载一并移除 |
| `:root[data-codexthemes-theme]` 选择器 | 令牌层写在 `<body>` 内联自定义属性上，由 `ui-layout` 的 ThemePresenter 应用 |
| `data-codexthemes-page="home" / "conversation"` | DSH 稳定的 `data-phase="hero" / "active" / "settling"` 与 `[data-dsh-center-col]` |
| `--ct-art` + `backgroundScope` | 同一张 1920×1080 插画，以 data URI 内联进插件样式表，固定在 `<body>` 上 |
| 终端 / xterm 主题 | DSH 终端从宿主的 computed `background`/`color` 读取 xterm 调色板，令牌层自动带动它 |

**色彩模式**：源主题是 light 模式。DSH 的主题契约要求每个令牌同时给出 light 与 dark 两个值，因此这里以源调色板为浅色面（misty morning），并派生一套同源的深色面（misty night：深海军蓝材质 + 压暗的插画遮罩），保证用户在深色偏好下同样可读。

## 设计契约

| 项 | 值 |
| --- | --- |
| layoutMode | `native-immersive`（DSH 布局、控件、命中区域、键盘焦点全部保留） |
| backgroundScope | `workspace`（首页 + 会话页都有插画，与源主题一致；可改为 `home`） |
| decorDensity | `rich`（插画、面纱、侧栏渐变、首页光尘、滚动条/选区/插入符统一） |
| 插画焦点 | `68% 18%`，`cover` + `fixed` |
| 文字安全区 | 居中内容列；会话正文与代码使用更强的阅读面纱 |
| 不允许改动 | 几何、状态、hover-only 操作、焦点环宽度 |

## 安装

插件已经安装进本机 web profile：

- 包体：`%USERPROFILE%\.dsh\profiles\web\node_modules\dsh-theme-misty-morning\`
- 挂载行（profile 补丁层）：`%USERPROFILE%\.dsh\profiles\web\cordis.patch.yml`

```yaml
- insert:
    - id: theme-misty-morning
      name: 'dsh-theme-misty-morning'
```

DSH 的 Loader 不监听配置文件，**新增插件行需要重启 DSH 才会挂载**。重启后主题立即生效，不需要在设置里切换；插件被禁用/卸载时主题整体回退（不写用户偏好，不动原生亮/暗选择）。

关闭或移除：

```yaml
# 临时关闭：给该行加 disabled
- insert:
    - id: theme-misty-morning
      name: 'dsh-theme-misty-morning'
      disabled: true
```

或删除 `node_modules\dsh-theme-misty-morning` 与上面这段 insert。

### 从源码重建

```powershell
cd dsh-theme-misty-morning
node scripts/build.mjs                                  # 首页 + 会话页插画（默认）
node scripts/build.mjs --background-scope home          # 只在首页出现插画
```

`scripts/build.mjs` 把 `src/palette.mjs`（两套方案 + 115 个令牌）与 `src/theme.css` 编译成
`lib/client.js`（`window.__ModuleLoader__.load({...})` 形态的浏览器半包，内联插画 data URI）。

## 目录

```
package.json          dsh.client 声明（platform: web）与 bundle 补丁入口
cordis.patch.yml      dsh.bundle.patch：一行 insert，供 dsh plugin add 自动挂载
SKILL.md              给 agent 的安装/配置/验证/回滚说明（复制提示词走的就是它）
lib/index.js          宿主半（空实现，只为让 Loader 行与 ./client 解析成立）
lib/client.js         浏览器半（构建产物：令牌表 + 样式表 + apply/inject）
src/palette.mjs       浅色 / 深色调色板与 --dsw-* 令牌表
src/theme.css         材质、插画、面纱与装饰（引用 --dmm-* 变量）
src/client-body.js    浏览器半源码
src/index.js          宿主半源码
assets/artwork.jpg    源插画（1920×1080）
assets/source-theme.css   源主题的 theme.css（对照用）
previews/             真实 DSH 截图（浅色/深色、首页/会话/设置/工作台/终端、980×760）
tools/                验证工具：capture.cjs（无头 Chrome 截图/取 DOM）、contrast-audit.cjs（像素级对比度审计）、
                      attach-shot.cjs（连真机 Electron 的调试端口取证）、probe-state.js（令牌/插画状态）、
                      click-session.js + describe-session-row.js（打开会话页）、report-location.js
```

## 验证记录

在**独立 DSH 实例**（`DSH_HOME` 指向临时目录、profile 通过 junction 复用本机 web profile、复用真实会话数据）中，用无头 Chrome + CDP 真实渲染验证：

| 场景 | 结果 |
| --- | --- |
| 首页 1440×900（浅色） | 插画主导、副标题/时间戳可读；`previews/home-light-1440x900.png` |
| 会话页 1440×900（浅色） | 用户气泡、工具行、左侧栏、输入区材质统一；`previews/conversation-light-1440x900.png` |
| 设置弹窗（浅色 / 深色） | 卡片、下拉、开关、字号行全部跟随主题 |
| 首页 / 会话 / 设置（深色） | misty night 变体成立，插画压暗但保留氛围 |
| 980×760 窄窗 | 首页光尘关闭、插画重新定位，无溢出 |
| 右侧工作台（better-sidebar） | dockkit 面板、引导卡片正常，0 项对比度失败 |
| 终端（xterm） | 画布背景取自主题令牌 `rgb(20,27,37)`，文字可读 |

像素级对比度审计（`tools/contrast-audit.cjs`：取可见文本的 computed color，与截图中文字框的中位背景色计算 WCAG 对比度）。0.1.1 在**真机**（本机 `DeepSeek Harness Desktop` 窗口，`--remote-debugging-port` 取证）复测：

| 页面（浅色 1440×900） | 0.1.0 | 0.1.1 | 0.1.2 | 0.1.3 | 0.1.4 | 0.1.5 | 0.1.6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 首页 | 11 / 29 低于 4.5:1，最差 3.07 | **0 / 71**，最差 4.69 | **0 / 71**，最差 4.62 | **0 / 71**，最差 4.59 | **0 / 71**，最差 4.51 | **0 / 71**，最差 4.51 | **0 / 71**，最差 4.51 |
| 会话页 | 9 / 71，最差 4.13 | **0 / 71**，最差 4.50 | **0 / 71**，最差 4.62 | **0 / 71**，最差 4.59 | **0 / 71**，最差 4.51 | **0 / 71**，最差 4.51 | **0 / 71**，最差 4.51 |

修复前的失败项全部是「三级 / 说明文字」层级（时间戳、快捷键提示、区块标签、输入框占位符、用量统计）与选中态强调色文字，对应 DSH 原生同位置的 2.13 / 3.19 / 3.55。深色表未改动，0.1.0 的深色结论仍然成立：

| 页面（深色） | 结果 |
| --- | --- |
| 会话页 | **0 / 417**，最差 5.29 |
| 首页（980×760） | **0 / 8**，最差 5.08 |
| 右侧工作台 | **0 / 34**，最差 5.22 |

### 与源调色板的四处有意偏差

1. `muted #5F7183` → `#566A7C`（次要文字）：源值在本主题面纱上只有 4.40:1，低于 AA 正文阈值。
2. 三级文字 → `#576B7D`、说明文字 → `#61758A`：源主题的次要/三级/说明三档同用 `#5F7183`，在 DSH 的浅色卡片、侧栏、会话面上只有 3.07–4.48:1，故各压深一档，落到 4.5:1 以上。
3. `danger #C25B63` → `#A9454E`：源值 3.73:1。
4. 填充型强调色与**强调色文字**统一用 `#3A7199`（白字 5.25:1、作为文字 4.62:1），而不是 `#4C87B4`（白字 3.86:1）或 `#3C749C`（作为文字 4.43:1）；`#4C87B4` 仍作为装饰强调色（`--dmm-accent`、插入符、色块）。

### 装饰与侧边栏材质（0.1.2 – 0.1.3）

源主题把「光尘」写成 0.14–0.20 透明度的一层，并且**整层再乘 0.45 不透明度**，铺在 1440px 的首页上。DSH 会把同一份图案平铺到更大的舞台且按全透明度绘制，于是同样的配方看上去像麻点。0.1.2 的处置：

- 光尘梯度透明度降到 0.05–0.08（约原来的 1/3），保留缓慢漂移；`node scripts/build.mjs --no-motes` 可整层关闭。深浅两套同步调整。
- 左侧导航栏改为 Codex 式透视。0.1.2 只调填充透明度时插画仍看不见，原因是 DSH 的真实层级：

  ```
  body（插画 + 方向光梯度）
    └─ .pI_x6G_frame      ← --dsw-alias-bg-base，全窗口 70% 面纱
        └─ .pI_x6G_sidebarCol   ← --dsw-specific-sidebar-fill
            └─ .hHd-Xa_root     ← 同一份 fill 再画一次 + 水洗 + 柔化
  ```

  三层叠起来约 94% 不透明，插画在到达侧边栏前就被洗掉了。0.1.3 让**侧边栏列自己重绘同一张插画**（同样的 `68% 18%` 焦点与 `fixed` 对齐，与 body 上那张像素对齐），并在列内叠加 `--dmm-sidebar-veil` 轻面纱，再保留列的 fill、顶部水洗与一层柔化提亮（`--dmm-sidebar-frost`）。同区域像素均值因此从 `rgb(235,240,246)` 变成 `rgb(215,228,239)`，与 Codex 的 `rgb(219,228,235)` 基本一致。
- `新会话` 按钮原先落在 `--dsw-alias-button-elevated-fill` 上，被映成纯白 `#FFFFFF`；现在改为 `rgba(255,255,255,0.66)`，与侧边栏材质一致（深色侧同理）。
- 插画透出后，侧边栏里坐在插画上的三级小字（时间戳、区块标签、行操作）会掉到 4.0 上下，因此三级文字色压深到 `#506372`；列表本身**没有**另加不透明 surface（那样侧边栏又会变成白板），保持与 Codex 相同的「文字直接落在被面纱覆盖的插画上」。

区域统计与对比度用 `tools/measure-decoration.cjs` 和 `tools/contrast-audit.cjs` 复算：侧边栏区域均值 `rgb(243,245,248)` → `rgb(235,240,245)`（0.1.2）→ `rgb(215,228,239)`（0.1.3），两页对比度审计在每一步都是 0 失败。

### 清晰度与色彩浓度（0.1.4）

DSH 的面纱是「全窗口一层 + 舞台再一层」叠加的，所以照搬源主题的 0.70 会让插画被洗得比 Codex 更白。0.1.4 把三层一起收：

| 层 | 0.1.3 | 0.1.4 |
| --- | --- | --- |
| 全窗口面纱 `--dsw-alias-bg-base` | 0.70 | **0.58** |
| 首页舞台面纱 `--dmm-veil-hero` | 0.34 | **0.28** |
| 方向光梯度 `--dmm-art-gradient` | 0.58 / 0.38 / 0.12 / 0.03 | **0.46 / 0.30 / 0.10 / 0.02** |
| 侧边栏列面纱 `--dmm-sidebar-veil` | 0.40 | **0.30** |
| 侧边栏柔化 `--dmm-sidebar-frost` | `blur(9px) … brightness(1.10)` | **`none`**（清晰，不模糊） |

实测（1440×900 截图，`tools/measure-decoration.cjs` 同款算法）：

| 区域 | Codex 原版 | DSH 0.1.3 | DSH 0.1.4 |
| --- | --- | --- | --- |
| 主内容区 | mean(222,232,240) chroma 18.0 | mean(231,236,242) chroma 15.1 | mean(219,230,239) chroma **19.6** |
| 侧边栏列表 | mean(219,228,235) chroma 15.6 | mean(215,228,239) chroma 23.8（带模糊） | mean(226,232,237) chroma 13.7（清晰） |
| 侧边栏顶部 | mean(214,218,222) chroma 8.7 | 未测 | mean(221,225,230) chroma 9.8 |

插画变浓之后，坐在插画上的三级小字（区块标题、时间戳）在最暗处会掉到 4.0 左右。中途试过两版底色都放弃了：0.1.4 把材质刷在**整个列表容器**上，会话少时「工作区」下方留下一大块发白（`mean(236,242,247)`）；0.1.5 把材质挪到**每一行**上，空白处恢复正常但每行各有一条底边，看着很怪。0.1.6 干脆**全部透明**——导航、会话行、区块标题、底部操作都没有自己的底色，只有插画在文字后面（行区域 `mean(188,200,211) chroma 25.6`），代价是次要/三级文字必须自己压深：`muted #566A7C → #405365`（4.86:1）、`faint #506372 → #435668`。最暗处（`rgb(191,204,217)`）的那条时间戳由 3.82 升到 4.64，两页审计保持 0 失败；`caption #61758A` 只落在输入框/卡片这类浅色面上，保持源调色板取值。

## 素材来源

插画来自源主题包 `assets/artwork.jpg`（其 manifest 注明取自 哲风壁纸 <https://haowallpaper.com>）。
本插件只做技术适配，不对素材权利作任何判断。
