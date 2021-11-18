import { replaceAt } from "../utils";

describe('replaceAt', () => {
  test('it works correctly', () => {
    const input = [10,11,12,13,14];

    const result = replaceAt(input, 2, 22);

    expect(result[0]).toBe(10)
    expect(result[1]).toBe(11)
    expect(result[2]).toBe(22)
    expect(result[3]).toBe(13)
    expect(result[4]).toBe(14)

    expect(input[2]).toBe(12)
  })
})
