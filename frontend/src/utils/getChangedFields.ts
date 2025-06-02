export function getChangedFields<T>(
  original: T,
  current: Partial<T>
): Partial<T> {
  const changed: Partial<T> = {};
  for (const key in current) {
    if (typeof current[key] === "object" && current[key] !== null) {
      if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) {
        changed[key] = current[key] as T[Extract<keyof T, string>];
      }
    } else {
      if (current[key] !== original[key]) {
        changed[key] = current[key];
      }
    }
  }
  return changed;
}
