// 数组深度克隆
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}