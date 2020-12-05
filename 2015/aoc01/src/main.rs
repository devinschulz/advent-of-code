use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
    let contents = fs::read_to_string("src/input.txt").expect("Failed to read input.txt");
    part1(&contents)?;
    part2(&contents)?;
    Ok(())
}

fn part1(input: &str) -> Result<()> {
    let result = input.chars().fold(0, |acc, x| match x {
        ')' => acc - 1,
        '(' => acc + 1,
        _ => acc,
    });
    println!("part one: {}", result);
    Ok(())
}

fn part2(input: &str) -> Result<()> {
    let mut position = 0i32;
    for (index, char) in input.chars().enumerate() {
        if char.eq(&')') {
            position -= 1;
        } else if char.eq(&'(') {
            position += 1;
        }
        if position < 0 {
            println!("part two: {}", index + 1);
            break;
        }
    }
    Ok(())
}
