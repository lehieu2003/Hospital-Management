export function camelCaseToPascalCase(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}