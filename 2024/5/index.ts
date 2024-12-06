import { assertEquals } from "jsr:@std/assert";

const data = await Deno.readTextFile("./input.txt");

type Rule = [number, number];

function parseInput(input: string) {
  const [ruleSection, updateSection] = input.split("\n\n");
  const rules = ruleSection.split("\n").map((line) => {
    const [x, y] = line.split("|").map(Number);
    return [x, y] as Rule;
  });
  const updates = updateSection
    .split("\n")
    .map((line) => line.split(",").map(Number));
  return { rules, updates };
}

function isUpdateValid(update: number[], rules: Rule[]) {
  const indexMap = new Map<number, number>();
  update.forEach((page, index) => indexMap.set(page, index));

  for (const [x, y] of rules) {
    if (
      indexMap.has(x) &&
      indexMap.has(y) &&
      indexMap.get(x)! >= indexMap.get(y)!
    ) {
      return false;
    }
  }
  return true;
}

function findMiddlePage(update: number[]) {
  const middleIndex = Math.floor(update.length / 2);
  return update[middleIndex];
}

function partOne(data: string): number {
  const { rules, updates } = parseInput(data);

  const middlePagesSum = updates.reduce((sum, update) => {
    if (isUpdateValid(update, rules)) {
      return sum + findMiddlePage(update);
    }
    return sum;
  }, 0);

  return middlePagesSum;
}

function sortUpdate(update: number[], rules: Rule[]) {
  const graph = new Map<number, Set<number>>();
  const inDegree = new Map<number, number>();

  update.forEach((page) => {
    graph.set(page, new Set());
    inDegree.set(page, 0);
  });

  for (const [x, y] of rules) {
    if (update.includes(x) && update.includes(y)) {
      graph.get(x)!.add(y);
      inDegree.set(y, (inDegree.get(y) || 0) + 1);
    }
  }

  const sorted: number[] = [];
  const queue: number[] = [];

  for (const [page, degree] of inDegree.entries()) {
    if (degree === 0) queue.push(page);
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    for (const neighbor of graph.get(current)!) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor)! === 0) queue.push(neighbor);
    }
  }

  return sorted;
}

function partTwo(data: string) {
  const { rules, updates } = parseInput(data);

  const middlePagesSum = updates.reduce((sum, update) => {
    if (!isUpdateValid(update, rules)) {
      const sortedUpdate = sortUpdate(update, rules);
      return sum + findMiddlePage(sortedUpdate);
    }
    return sum;
  }, 0);

  return middlePagesSum;
}

const testInput = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

Deno.test("2024/5 part one", () => {
  assertEquals(partOne(testInput), 143);
  assertEquals(partOne(data), 5713);
});

Deno.test("2024/5 part two", () => {
  assertEquals(partTwo(testInput), 123);
  assertEquals(partTwo(data), 5180);
});
