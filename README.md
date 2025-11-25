# Clipboard

面向现代浏览器的轻量级剪贴板工具库。此文档为中文默认版本，如需英文说明请查看 [English Version](README.en.md)。

## 特性

- ✅ 文本复制 / 读取，内置回退方案
- 🖼️ 支持复制与读取图片（File / Blob / ImageData / URL）
- 🔐 仅在安全上下文（HTTPS / localhost）中启用 Clipboard API
- 📦 TypeScript 类型声明与 ES2015 构建产物，适合 npm 发布

## 安装

```bash
npm install clipboard-utils
```

## 使用示例

```typescript
import { 
  copyToClipboard, 
  readFromClipboard, 
  copyImageToClipboard,
  readImageFromClipboard,
  isClipboardSupported 
} from 'clipboard-utils';

// 检查当前环境是否支持 Clipboard API
if (isClipboardSupported()) {
  // 复制文本
  await copyToClipboard('Hello, World!');
  
  // 读取文本
  const text = await readFromClipboard();
  console.log(text);
  
  // 复制图片（支持 File、Blob、ImageData 或 URL）
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput.files && fileInput.files[0]) {
    await copyImageToClipboard(fileInput.files[0]);
  }
  
  // 或通过 URL 复制图片
  await copyImageToClipboard('https://example.com/image.png');
  
  // 读取图片
  const imageBlob = await readImageFromClipboard();
  if (imageBlob) {
    const imageUrl = URL.createObjectURL(imageBlob);
    // 使用 imageUrl 渲染或下载图片
  }
}
```

## API 说明

### `copyToClipboard(text: string, options?: ClipboardOptions): Promise<void>`

复制文本到剪贴板。

- `text`：要复制的文本内容
- `options.timeout`：预留的超时参数（目前未使用）

### `readFromClipboard(): Promise<string>`

从剪贴板读取文本。

### `copyImageToClipboard(image: File | Blob | ImageData | string): Promise<void>`

复制图片到剪贴板。

- `image`：待复制的图片，可以是
  - `File`：文件输入获取的图片
  - `Blob`：包含图片数据的 Blob
  - `ImageData`：Canvas 的像素数据
  - `string`：图片 URL，内部会自动下载

### `readImageFromClipboard(): Promise<Blob | null>`

从剪贴板读取图片数据。

- 返回值：若存在图片则为 `Blob`，否则为 `null`

### `isClipboardSupported(): boolean`

判断当前环境是否支持 Clipboard API。

## 开发说明

```bash
# 安装依赖
npm install

# 构建
npm run build

# 开发模式（监听文件变更）
npm run dev

# 类型检查
npm run type-check
```

## 许可证

MIT

