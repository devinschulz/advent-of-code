use std::collections::HashSet;
use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
    let contents = fs::read_to_string("src/input.txt").expect("Failed to open input.txt");
    part1(&contents)?;
    part2(&contents)?;
    Ok(())
}

fn part1(input: &str) -> Result<()> {
    let result: usize = input
        .split("\n\n")
        .map(|l| l.replace("\n", "").chars().collect::<HashSet<_>>().len())
        .sum();
    println!("part one: {}", result);
    Ok(())
}

fn part2(input: &str) -> Result<()> {
    let result: usize = input
        .split("\n\n")
        .map(|i| {
            i.lines()
                .map(|i| i.chars().collect::<HashSet<char>>())
                .collect::<Vec<HashSet<char>>>()
        })
        .map(|x| {
            x.iter()
                .skip(1)
                .fold(x[0].clone(), |acc, h| {
                    acc.intersection(h).cloned().collect()
                })
                .len()
        })
        .sum();
    println!("two one: {}", result);
    Ok(())
}
