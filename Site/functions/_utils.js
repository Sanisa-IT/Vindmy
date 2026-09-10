const MAX_IMAGES = 3;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // 20MB
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
]);

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function requireEnv(env, keys) {
  const missing = keys.filter((key) => !env[key]);
  if (missing.length > 0) {
    return Response.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
  return null;
}

function fileExtension(name) {
  const match = String(name || "").toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? match[0] : "";
}

function isAllowedImage(file) {
  const type = (file.type || "").toLowerCase();
  const ext = fileExtension(file.name);
  if (type && ALLOWED_IMAGE_TYPES.has(type)) return true;
  // Some browsers omit type for HEIC; fall back to extension
  return ALLOWED_EXTENSIONS.has(ext);
}

/** Filter empty inputs, then enforce max 3 images / 20MB total. */
export function collectImages(formData, { required = false } = {}) {
  const files = formData
    .getAll("documents")
    .filter((file) => file && typeof file === "object" && file.size > 0);

  if (required && files.length === 0) {
    return {
      error: Response.json(
        { error: "Please upload at least one picture (max 3, 20MB total)." },
        { status: 400 }
      ),
    };
  }

  if (files.length > MAX_IMAGES) {
    return {
      error: Response.json(
        { error: "You can upload a maximum of 3 pictures." },
        { status: 400 }
      ),
    };
  }

  for (const file of files) {
    if (!isAllowedImage(file)) {
      return {
        error: Response.json(
          { error: "Only image files are allowed (JPG, PNG, WEBP, HEIC)." },
          { status: 400 }
        ),
      };
    }
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > MAX_TOTAL_BYTES) {
    return {
      error: Response.json(
        { error: "Total picture size exceeds 20MB. Please reduce the size or number of pictures." },
        { status: 400 }
      ),
    };
  }

  return { files };
}

/** Cloudflare Workers: chunked Uint8Array + btoa (no Buffer). */
export async function filesToAttachments(files) {
  return Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const chunkSize = 8192;
      let binary = "";
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
      }
      return {
        filename: file.name,
        content: btoa(binary),
      };
    })
  );
}
