export function sanitizeReturnTo(
  origin: string,
  candidate: string | null,
): string {
  if (!candidate) {
    return "/";
  }

  try {
    const url = candidate.startsWith("http://") || candidate.startsWith("https://")
      ? new URL(candidate)
      : new URL(candidate, origin);

    if (url.origin !== origin) {
      return "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}
