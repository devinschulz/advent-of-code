import { assert, path } from "../deps.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const text = await Deno.readTextFile(path.join(__dirname, "./input.txt"));

const OPPONENT_ROCK = "A";
const OPPONENT_PAPER = "B";
const OPPONENT_SCISSORS = "C";

const ME_ROCK = "X";
const ME_PAPER = "Y";
const ME_SCISSORS = "Z";

const DRAW_SCORE = 3;
const WIN_SCORE = 6;
const ROCK_SCORE = 1;
const PAPER_SCORE = 2;
const SCISSORS_SCORE = 3;

const part1 = text.split("\n").reduce<number>((acc, current) => {
  const [opponent, me] = current.split(" ");

  if (
    (opponent === OPPONENT_ROCK && me === ME_ROCK) ||
    (opponent === OPPONENT_PAPER && me === ME_PAPER) ||
    (opponent === OPPONENT_SCISSORS && me === ME_SCISSORS)
  ) {
    if (me === ME_ROCK) {
      acc += ROCK_SCORE;
    }
    if (me === ME_PAPER) {
      acc += PAPER_SCORE;
    }
    if (me === ME_SCISSORS) {
      acc += SCISSORS_SCORE;
    }
    acc += DRAW_SCORE;
    return acc;
  }

  if (opponent === OPPONENT_ROCK && me === ME_SCISSORS) {
    acc += SCISSORS_SCORE;
  } else if (opponent === OPPONENT_PAPER && me === ME_ROCK) {
    acc += ROCK_SCORE;
  } else if (opponent === OPPONENT_SCISSORS && me === ME_PAPER) {
    acc += PAPER_SCORE;
  } else if (opponent === OPPONENT_SCISSORS && me === ME_ROCK) {
    acc += ROCK_SCORE + WIN_SCORE;
  } else if (opponent === OPPONENT_ROCK && me === ME_PAPER) {
    acc += PAPER_SCORE + WIN_SCORE;
  } else if (opponent === OPPONENT_PAPER && me === ME_SCISSORS) {
    acc += SCISSORS_SCORE + WIN_SCORE;
  }
  return acc;
}, 0);

const LOSE = "X";
const DRAW = "Y";
const WIN = "Z";

const part2 = text.split("\n").reduce<number>((acc, current) => {
  const [opponent, outcome] = current.split(" ");

  if (outcome === DRAW) {
    if (opponent === OPPONENT_ROCK) {
      acc += ROCK_SCORE;
    }
    if (opponent === OPPONENT_PAPER) {
      acc += PAPER_SCORE;
    }
    if (opponent === OPPONENT_SCISSORS) {
      acc += SCISSORS_SCORE;
    }
    acc += DRAW_SCORE;
  }

  if (outcome === WIN) {
    if (opponent === OPPONENT_ROCK) {
      acc += PAPER_SCORE + WIN_SCORE;
    }
    if (opponent === OPPONENT_PAPER) {
      acc += SCISSORS_SCORE + WIN_SCORE;
    }
    if (opponent === OPPONENT_SCISSORS) {
      acc += ROCK_SCORE + WIN_SCORE;
    }
  }

  if (outcome === LOSE) {
    if (opponent === OPPONENT_ROCK) {
      acc += SCISSORS_SCORE;
    }
    if (opponent === OPPONENT_PAPER) {
      acc += ROCK_SCORE;
    }
    if (opponent === OPPONENT_SCISSORS) {
      acc += PAPER_SCORE;
    }
  }

  return acc;
}, 0);

Deno.test("Day 2 part 1", () => {
  assert.equal(part1, 10994);
});

Deno.test("Day 2 part 2", () => {
  assert.equal(part2, 12526);
});
