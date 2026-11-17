import { convertAmount } from "../convertAmount";

test("converts USD to crypto and crypto to crypto", () => {
  expect(convertAmount("100", 1, 50000)).toBe(0.002);
  expect(convertAmount("2", 50000, 2500)).toBe(40);
  expect(convertAmount("0", 1, 50000)).toBe(0);
});

test("rejects missing prices and invalid amounts", () => {
  for (const amount of ["", "bad", "-1", "Infinity"]) {
    expect(convertAmount(amount, 1, 2)).toBeNull();
  }
  expect(convertAmount("1", 1, 0)).toBeNull();
  expect(convertAmount("1", NaN, 2)).toBeNull();
});
