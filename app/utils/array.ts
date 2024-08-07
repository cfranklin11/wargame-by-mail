export function wrap<T>(object: T | T[]): T[] {
  if (Array.isArray(object)) return object;

  return [object];
}
