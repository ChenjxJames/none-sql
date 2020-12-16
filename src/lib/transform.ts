// 下划线转换驼峰
export const toCamelCase = (str: string): string => {
  return str.replace(/\_(\w)/g, (all: string, letter: string) => letter.toUpperCase());
}

// 驼峰转换下划线
export const toMapUnderscore = (str: string): string => {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}