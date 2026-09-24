/**
 * Checks whether an array of numbers is sorted in ascending order.
 * @param numbers Array of numbers to check
 * @returns true if each number is greater than or equal to the previous one
 */
export function isAscending(numbers: number[]): boolean {
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] < numbers[i - 1]) return false;
  }
  return true;
}
