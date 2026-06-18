import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const LOCAL_UPLOAD_PREFIX = "local://";

export function uploadRoot() {
  return process.env.LOCAL_UPLOAD_DIR ?? path.join(process.cwd(), ".local-uploads");
}

export function isLocalStoragePath(storagePath: string) {
  return storagePath.startsWith(LOCAL_UPLOAD_PREFIX);
}

export function toLocalStoragePath(relativePath: string) {
  return `${LOCAL_UPLOAD_PREFIX}${relativePath.replace(/\\/g, "/")}`;
}

export function fromLocalStoragePath(storagePath: string) {
  return storagePath.slice(LOCAL_UPLOAD_PREFIX.length);
}

export function localUploadUrl(pdfId: string, req: Request) {
  return new URL(`/api/notes/pdf/${pdfId}/file`, req.url).toString();
}

export async function writeLocalUpload(relativePath: string, bytes: Buffer) {
  const target = path.join(uploadRoot(), relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
}

export async function readLocalUpload(storagePath: string) {
  const relativePath = fromLocalStoragePath(storagePath);
  const root = uploadRoot();
  const target = path.resolve(root, relativePath);
  const resolvedRoot = path.resolve(root);

  if (!target.startsWith(resolvedRoot + path.sep) && target !== resolvedRoot) {
    throw new Error("Invalid local upload path");
  }

  return readFile(target);
}
