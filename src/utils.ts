export function replaceAt<T>(list: T[], index: number, elem: T) {
  return Object.assign([], list, {[index]: elem});
}
