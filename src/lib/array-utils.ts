/**
 * Generates a random array of numbers
 * @param size The size of the array
 * @param min The minimum value (inclusive)
 * @param max The maximum value (inclusive)
 * @returns A random array of numbers
 */
export function generateRandomArray(size: number, min: number, max: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

/**
 * Swaps two elements in an array
 * @param array The array
 * @param i The first index
 * @param j The second index
 */
export function swap(array: number[], i: number, j: number): void {
  const temp = array[i]
  array[i] = array[j]
  array[j] = temp
}

/**
 * Delays execution for a specified amount of time
 * @param ms The delay in milliseconds
 * @returns A promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

