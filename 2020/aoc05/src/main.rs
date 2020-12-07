use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
    let contents = fs::read_to_string("src/input.txt").expect("Failed to open input.txt");
    part1(&contents)?;
    part2(&contents)?;
    Ok(())
}

fn part1(input: &str) -> Result<()> {
    let result = get_ids(input);
    let answer = result.iter().max().unwrap();
    println!("part one: {}", answer);
    assert_eq!(890, *answer);
    Ok(())
}

fn part2(input: &str) -> Result<()> {
    let mut result = get_ids(input);
    result.sort();
    for line in result.iter() {
        if !result.contains(&(line + 1)) && result.contains(&(line + 2)) {
            println!("part two: {}", line + 1);
            break;
        }
    }
    Ok(())
}

fn get_ids(input: &str) -> Vec<u16> {
    input
        .lines()
        .map(|line| {
            line.chars().fold(0u16, |acc, char| {
                acc * 2
                    + match char {
                        'B' | 'R' => 1,
                        _ => 0,
                    }
            })
        })
        .collect::<Vec<u16>>()
}
