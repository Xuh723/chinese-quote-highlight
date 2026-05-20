# Chinese Quote Highlight

一个 Obsidian 插件，自动将编辑器中由中文双引号 `“”` 或直角双引号 `「」` 包裹的文字高亮显示为特定颜色，方便在长文中快速定位引文内容。

## 功能

- 自动识别中文双引号 `“...”` 包裹的文本，默认高亮色 `#BFDBFE`
- 可选识别直角双引号 `「...」` 包裹的文本，默认高亮色 `#FECACA`
- 支持在设置面板中分别自定义两种引号的高亮颜色
- 编辑模式和阅读模式均支持高亮显示
- 实时生效，无需重载 Obsidian

## 安装

### 手动安装

1. 下载本仓库的 `main.js`、`manifest.json` 和 `styles.css`
2. 在你的 Obsidian 仓库中创建文件夹：`<Vault>/.obsidian/plugins/chinese-quote-highlight/`
3. 将三个文件复制到该文件夹
4. 在 Obsidian 中打开 **设置 → 社区插件**，关闭安全模式
5. 启用 **Chinese Quote Highlight**

## 使用

启用插件后，编辑器中所有被中文双引号包裹的文字会自动显示为高亮色（默认 `#BFDBFE`）。

### 启用直角双引号高亮

进入 **设置 → 社区插件 → Chinese Quote Highlight → Options**，打开 **Highlight corner quotes** 开关，即可高亮 `「...」` 包裹的文本。

### 修改颜色

进入 **设置 → 社区插件 → Chinese Quote Highlight → Options**，使用颜色选择器分别调整中文双引号和直角双引号的高亮颜色，修改后立即生效。

## 开发

```bash
npm install
npm run dev      # 开发模式（监听文件变化）
npm run build    # 生产构建
npm run lint     # 代码检查
```

## 技术说明

- 编辑模式基于 CodeMirror 6 的 `MatchDecorator` 和 `ViewPlugin` 实现文本装饰
- 阅读模式基于 Obsidian `MarkdownPostProcessor` 实现 DOM 高亮
- 颜色通过 CSS 变量动态控制，结合 Obsidian `SettingTab` 提供设置面板
