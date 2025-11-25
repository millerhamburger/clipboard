# Clipboard

A lightweight clipboard utility library for modern browsers.

## Features

- ✅ Text copy/read with graceful fallback
- 🖼️ Image copy/read for File, Blob, ImageData, or remote URL
- 🔐 Clipboard API guarded by secure-context detection (HTTPS / localhost)
- 📦 Ships ES2015 builds and TypeScript typings for npm distribution

## Installation

```bash
npm install clipboard-utils
```

## Usage

```typescript
import { 
  copyToClipboard, 
  readFromClipboard, 
  copyImageToClipboard,
  readImageFromClipboard,
  isClipboardSupported 
} from 'clipboard-utils';

// Check if clipboard API is supported
if (isClipboardSupported()) {
  // Copy text to clipboard
  await copyToClipboard('Hello, World!');
  
  // Read text from clipboard
  const text = await readFromClipboard();
  console.log(text);
  
  // Copy image to clipboard (from File, Blob, ImageData, or URL)
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput.files && fileInput.files[0]) {
    await copyImageToClipboard(fileInput.files[0]);
  }
  
  // Or from URL
  await copyImageToClipboard('https://example.com/image.png');
  
  // Read image from clipboard
  const imageBlob = await readImageFromClipboard();
  if (imageBlob) {
    const imageUrl = URL.createObjectURL(imageBlob);
    // Use the image URL
  }
}
```

## API

### `copyToClipboard(text: string, options?: ClipboardOptions): Promise<void>`

Copies text to the clipboard.

- `text`: The text to copy
- `options`: Optional configuration
  - `timeout`: Timeout in milliseconds (not currently used)

### `readFromClipboard(): Promise<string>`

Reads text from the clipboard.

### `copyImageToClipboard(image: File | Blob | ImageData | string): Promise<void>`

Copies an image to the clipboard.

- `image`: The image to copy. Can be:
  - `File`: A file object from file input
  - `Blob`: A blob containing image data
  - `ImageData`: Canvas ImageData object
  - `string`: URL of an image (will be fetched)

### `readImageFromClipboard(): Promise<Blob | null>`

Reads an image from the clipboard.

- Returns: A `Blob` containing the image data, or `null` if clipboard doesn't contain an image

### `isClipboardSupported(): boolean`

Checks if the clipboard API is available in the current environment.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode with watch
npm run dev

# Type checking
npm run type-check
```

## License

MIT

