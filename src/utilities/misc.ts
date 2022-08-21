/**
 * Check if the two arrays contains the same elements. The order of the elements is not important.
 */
export function arraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (const elem of arr1) {
    if (!arr2.includes(elem)) {
      return false
    }
  }

  return true
}
