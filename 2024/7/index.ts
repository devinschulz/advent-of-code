import { assertEquals } from "jsr:@std/assert";

const data = await Deno.readTextFile("./input.txt");

function evaluate(
  numbers: number[],
  operators: string[],
  supportsConcatenation = false,
) {
  let result = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === "+") {
      result += numbers[i + 1];
    } else if (operators[i] === "*") {
      result *= numbers[i + 1];
    } else if (supportsConcatenation && operators[i] === "||") {
      result = parseInt(result.toString() + numbers[i + 1].toString());
    }
  }
  return result;
}

function isValidEquation(
  target: number,
  numbers: number[],
  supportsConcatenation = false,
) {
  const operators = ["+", "*"];

  if (supportsConcatenation) {
    operators.push("||");
  }

  const generateCombinations = (
    n: number,
    prefix: string[] = [],
  ): string[][] => {
    if (prefix.length === n) {
      return [prefix];
    }
    return operators.flatMap((op) => generateCombinations(n, [...prefix, op]));
  };

  for (const combination of generateCombinations(numbers.length - 1)) {
    if (evaluate(numbers, combination, supportsConcatenation) === target) {
      return true;
    }
  }
  return false;
}

function iterateOverData(data: string, supportsConcatenation = false) {
  let total = 0;

  const lines = data.trim().split("\n");
  for (const line of lines) {
    const [targetStr, numbersStr] = line.split(": ");
    const target = parseInt(targetStr);
    const numbers = numbersStr.split(" ").map(Number);

    if (isValidEquation(target, numbers, supportsConcatenation)) {
      total += target;
    }
  }

  return total;
}

function partOne(data: string) {
  return iterateOverData(data);
}

function partTwo(data: string) {
  return iterateOverData(data, true);
}

const testInput = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

Deno.test("2024/7 part one", () => {
  assertEquals(partOne(testInput), 3749);
  assertEquals(partOne(data), 1038838357795);
});

Deno.test("2024/7 part two", () => {
  assertEquals(partTwo(testInput), 11387);
  assertEquals(partTwo(data), 254136560217241);
});
