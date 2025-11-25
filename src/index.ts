/**
 * Clipboard utility library
 */

export interface ClipboardOptions {
  timeout?: number;
}

/**
 * Copy text to clipboard
 * @param text - The text to copy
 * @param options - Optional configuration
 * @returns Promise that resolves when text is copied
 */
export async function copyToClipboard(
  text: string,
  options: ClipboardOptions = {}
): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('Copy command failed');
    }
  } finally {
    document.body.removeChild(textArea);
  }
}

/**
 * Read text from clipboard
 * @returns Promise that resolves with the clipboard text
 */
export async function readFromClipboard(): Promise<string> {
  if (navigator.clipboard && window.isSecureContext) {
    return await navigator.clipboard.readText();
  }

  throw new Error('Clipboard API not available');
}

/**
 * Copy image to clipboard
 * @param image - The image to copy (File, Blob, ImageData, or image URL string)
 * @returns Promise that resolves when image is copied
 */
export async function copyImageToClipboard(
  image: File | Blob | ImageData | string
): Promise<void> {
  if (!navigator.clipboard || !window.isSecureContext) {
    throw new Error('Clipboard API not available or not in secure context');
  }

  let blob: Blob;

  if (typeof image === 'string') {
    // If it's a URL, fetch the image
    const response = await fetch(image);
    blob = await response.blob();
  } else if (image instanceof ImageData) {
    // Convert ImageData to Blob
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    ctx.putImageData(image, 0, 0);
    blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert ImageData to Blob'));
        }
      }, 'image/png');
    });
  } else {
    // File or Blob
    blob = image;
  }

  // Ensure it's an image blob
  if (!blob.type.startsWith('image/')) {
    throw new Error('Provided file is not an image');
  }

  const clipboardItem = new ClipboardItem({
    [blob.type]: blob
  });

  await navigator.clipboard.write([clipboardItem]);
}

/**
 * Read image from clipboard
 * @returns Promise that resolves with the image Blob, or null if clipboard doesn't contain an image
 */
export async function readImageFromClipboard(): Promise<Blob | null> {
  if (!navigator.clipboard || !window.isSecureContext) {
    throw new Error('Clipboard API not available or not in secure context');
  }

  try {
    const clipboardItems = await navigator.clipboard.read();
    
    for (const item of clipboardItems) {
      // Check if the item contains image types
      const imageTypes = item.types.filter(type => type.startsWith('image/'));
      
      if (imageTypes.length > 0) {
        // Get the first image type
        const imageType = imageTypes[0];
        const blob = await item.getType(imageType);
        return blob;
      }
    }
    
    return null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read image from clipboard: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Check if clipboard API is available
 * @returns boolean indicating if clipboard API is supported
 */
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard || document.execCommand);
}

// Default export
export default {
  copyToClipboard,
  readFromClipboard,
  copyImageToClipboard,
  readImageFromClipboard,
  isClipboardSupported
};

