---
name: dsh-furina-theme
description: Install, configure, verify, or remove the 芙宁娜 (Furina) theme for DeepSeek Harness from the dsh-furina-theme repository. Use when a user asks to install, apply, enable, update, troubleshoot, or uninstall this theme in their DeepSeek Harness (dsh web / DSH desktop app), or pastes this file's URL and asks for the theme.
---

# 芙宁娜主题 · DeepSeek Harness 安装与配置

把本仓库的客户端主题插件装进用户的 DeepSeek Harness，让它生效、并验证结果。
仓库：<https://github.com/xiangshangya/dsh-furina-theme>

## 这是什么

一个 **DSH 客户端主题插件**，由两半组成：

- **宿主半**（`lib/index.js`）：空实现，只为让 Loader 行与 `./client` 解析成立；
- **浏览器半**（`lib/client.js`）：注入两样东西 ——
  1. 115 个 `--dsw-alias-*` / `--dsw-specific-*` 令牌覆盖（浅色 + 深色成对），
  2. 一份插件自有的全局样式表（插画画布、面纱材质、侧边栏透视、装饰层）。

它**不修改 DSH 本体**、不写用户偏好、不碰其他插件；插件卸载或禁用即完全回滚。

## 前置检查

1. 确认目标是 DSH：`$DSH_HOME`（默认 `~/.dsh`）存在，web profile 在 `$DSH_HOME/profiles/web`（桌面版与 `dsh web` 都用这个 profile）。
2. 确认 profile 里**没有**同名 insert 行：`$DSH_HOME/profiles/web/cordis.patch.yml` 中不应已存在 `name: 'dsh-theme-misty-morning'`。已存在就跳过安装，直接进入「验证」。
3. 插件包名以仓库 `package.json` 的 `name` 字段为准（当前为 `dsh-theme-misty-morning`，沿用最初适配来源的标识）。

## 安装步骤

1. **取得源码**（任选其一）
   - `git clone https://github.com/xiangshangya/dsh-furina-theme.git`
   - 直连 GitHub 受限时，用镜像前缀，例如 `https://gh-proxy.com/https://github.com/xiangshangya/dsh-furina-theme/archive/refs/heads/main.zip`（下载 zip 后解压）
2. **（可跳过）重建构建产物**：仓库已包含 `lib/client.js`
   ```bash
   cd dsh-furina-theme
   node scripts/build.mjs                    # 首页 + 会话页都有插画（默认）
   node scripts/build.mjs --background-scope home   # 只在首页显示插画
   node scripts/build.mjs --no-motes         # 去掉首页光点装饰
   ```
3. **放入 profile 的 node_modules**：把整个目录复制成
   `$DSH_HOME/profiles/web/node_modules/dsh-theme-misty-morning/`
   （目录名必须与 `package.json` 的 `name` 完全一致，Node 才能解析）
4. **挂载到 Loader**：在 `$DSH_HOME/profiles/web/cordis.patch.yml` 末尾追加
   ```yaml
   # 芙宁娜主题（dsh-furina-theme）
   - insert:
       - id: theme-furina
         name: 'dsh-theme-misty-morning'
   ```
   只追加这一段；不要改动文件里已有的其他条目。
5. **重启 DSH**：Loader 不监听配置文件，新增插件行必须重启才挂载
   - 桌面版：完全退出后重新打开
   - 命令行版：重启 `dsh web`
6. **验证**（必须做，不要只凭"文件已就位"就说完成）
   - 界面里 `document.querySelector('style[data-plugin="dsh-theme-misty-morning"]')` 存在；
   - `getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base')` ≈ `rgba(241, 244, 248, 0.58)`；
   - `body` 的 `background-image` 含 `data:image`（内联插画）；
   - 肉眼可见：整窗插画 + 淡蓝雾面文字、左侧边栏半透明能透出插画、首页与会话页一致；
   - 深色偏好下同样成立（两套令牌都在）。

## 关闭 / 回滚

- **临时关闭**：给那段 insert 行加 `disabled: true`，重启 DSH。
- **彻底移除**：删除 `$DSH_HOME/profiles/web/node_modules/dsh-theme-misty-morning/` 与上文那段 insert，重启 DSH。
- 回滚不需要动 `~/.dsh` 的其他内容；主题从未改写用户设置。

## 排查

| 现象 | 多半原因 | 处理 |
| --- | --- | --- |
| 重启后界面没变化 | insert 的 `name` 与实际包名不一致 | 对照 `package.json` 的 `name` 修正后重启 |
| 界面报插件加载失败 | 目录层级不对（多套了一层文件夹） | 确认路径是 `node_modules/dsh-theme-misty-morning/package.json` |
| 只有首页有插画 | 之前用 `--background-scope home` 构建过 | 重新 `node scripts/build.mjs` |
| 首页有小光点觉得晃眼 | 装饰层默认保留 | `node scripts/build.mjs --no-motes` 后重新部署并重启 |
| 桌面版看不到报错 | 桌面版从资源管理器启动时没有控制台 | 看 `%APPDATA%\DeepSeek Harness Desktop\logs\dsh-server.log` |

## 边界

- 只操作本主题相关的一个目录与一段 insert 行；**不要**改动用户的其他插件、模型配置、会话数据或 `~/.dsh` 之外的文件。
- 不要为了本主题运行任何安装程序或请求管理员权限。
- 用户只想"看看效果"时，可以先按上面的步骤装好、验证，并明确告诉对方如何回滚。
