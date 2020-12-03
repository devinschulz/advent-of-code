use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
    let contents = fs::read_to_string("src/input.txt").expect("Failed to read input.txt");
    part1(&contents)?;
    part2(&contents)?;
    Ok(())
}

fn part1(input: &str) -> Result<()> {
    let lines: Vec<i32> = input
        .split_whitespace()
        .filter_map(|w| w.parse().ok())
        .collect();
    for (index, value) in lines.iter().enumerate() {
        for (i, v) in lines.iter().enumerate() {
            if i == index {
                continue;
            }
            if v + value == 2020 {
                println!("part one: {}", v * value);
                return Ok(());
            }
        }
    }
    Err(From::from("part1 failed to find match"))
}

fn part2(input: &str) -> Result<()> {
    let lines: Vec<i32> = input
        .split_whitespace()
        .filter_map(|w| w.parse().ok())
        .collect();
    for (i, x) in lines.iter().enumerate() {
        for (j, y) in lines.iter().enumerate() {
            for (k, z) in lines.iter().enumerate() {
                if i == j || i == k {
                    continue;
                }
                if x + y + z == 2020 {
                    println!("part two: {}", x * y * z);
                    return Ok(());
                }
            }
        }
    }
    Err(From::from("part2 failed to find a match"))
}
