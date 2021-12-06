use regex::{Regex, Captures};
use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

struct Row {
    start: usize,
    end: usize,
    password: String,
    letter: char
}

fn main() -> Result<()> {
    let contents = fs::read_to_string("src/input.txt").expect("Failed to read input.txt");
    let re = Regex::new(r"(?P<start>\d+)-(?P<end>\d+)\s(?P<letter>\w):\s(?P<password>.+)").unwrap();

    part1(&contents, &re)?;
    part2(&contents, &re)?;
    Ok(())
}

fn part1(input: &str, re: &Regex) -> Result<()> {
    let mut frequencies = 0;
    for line in input.lines() {
        let caps = re.captures(line).unwrap();
        let row = caps_to_row(caps);
        let count = row.password.matches(row.letter).count();
        if count <= row.end && count >= row.start {
            frequencies += 1;
        }
    }
    println!("part one: {}", frequencies);
    Ok(())
}

fn part2(input: &str, re: &Regex) -> Result<()> {
    let mut frequencies = 0;
    for line in input.lines() {
        let caps = re.captures(line).unwrap();
        let row = caps_to_row(caps);
        let first_occ = &row.password.chars().nth(row.start - 1).unwrap();
        let second_occ = &row.password.chars().nth(row.end - 1).unwrap();

        let count = match (*first_occ, *second_occ) {
            // Both indexes are equal, fail
            (x, y) if row.letter == x && row.letter == y => 0,
            // Only the first char is equal, pass
            (x, y) if row.letter == x && row.letter != y => 1,
            // Only the second char is equal, pass
            (x, y) if row.letter != x && row.letter == y => 1,
            // Any other comparison, fail
            _ => 0,
        };
        frequencies += count;
    }
    println!("part two: {}", frequencies);
    Ok(())
}

fn caps_to_row(caps: Captures) -> Row {
    return Row {
        start: (&caps["start"].to_string()).parse::<usize>().unwrap(),
        end: (&caps["end"].to_string()).parse::<usize>().unwrap(),
        password: caps["password"].to_string(),
        letter: caps["letter"].to_string().chars().nth(0).unwrap(),
    };
}
