import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import JSZip from "jszip";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[а-яёА-ЯЁ]/g, (char) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
        ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
        н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
        ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
        ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
      };
      return map[char.toLowerCase()] || "";
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    + "-" + Date.now().toString(36);
}

export async function downloadGalleryAsZip(
  photos: Array<{ storage_path: string }>,
  weddingTitle: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(weddingTitle.replace(/[^a-zA-Zа-яА-Я0-9]+/g, "_"));
  
  if (!folder) return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    try {
      const response = await fetch(
        `${supabaseUrl}/storage/v1/object/public/photos/${photo.storage_path}`,
        {
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      
      if (response.ok) {
        const blob = await response.blob();
        const fileName = `${i + 1}.jpg`;
        folder.file(fileName, blob);
      }
    } catch (error) {
      console.error(`Failed to download photo ${photo.storage_path}:`, error);
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / photos.length) * 100));
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${weddingTitle.replace(/[^a-zA-Zа-яА-Я0-9]+/g, "_")}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function compressImage(
  file: File,
  options: { maxWidth: number; quality: number }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > options.maxWidth) {
        height = Math.round((height * options.maxWidth) / width);
        width = options.maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to compress image"));
        },
        "image/jpeg",
        options.quality
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}
