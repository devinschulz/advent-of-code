export const groupBy = <T>(arr: Array<T>, amount: number): T[][] =>
  Array.from(
    { length: Math.ceil(arr.length / amount) },
    (_v, i) => arr.slice(i * amount, i * amount + amount),
  );
