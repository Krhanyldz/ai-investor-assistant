const DEFAULT_REDIRECT_PATH = "/";
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001F\u007F]/;

export function getSafeLocalRedirectPath(value: FormDataEntryValue | string | null | undefined, fallback = DEFAULT_REDIRECT_PATH) {
  const path = String(value ?? "");
  let decodedPath = path;

  try {
    decodedPath = decodeURIComponent(path);
  } catch {
    return fallback;
  }

  if (
    !path ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    decodedPath.startsWith("//") ||
    decodedPath.includes("\\") ||
    CONTROL_CHARACTER_PATTERN.test(decodedPath)
  ) {
    return fallback;
  }

  return path;
}
