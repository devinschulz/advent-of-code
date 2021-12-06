use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
    let contents = fs::read_to_string("src/input.txt").expect("Failed to read input.txt");
    part1(&contents)?;
    part2(&contents)?;
    Ok(())
}

fn part1(input: &str) -> Result<()> {
    let trees = calculate_by_slope(input, 3, 1);
    println!("part one: {}", trees);
    Ok(())
}

fn part2(input: &str) -> Result<()> {
    let sum = vec![
        calculate_by_slope(input, 1, 1),
        calculate_by_slope(input, 3, 1),
        calculate_by_slope(input, 5, 1),
        calculate_by_slope(input, 7, 1),
        calculate_by_slope(input, 1, 2),
    ]
    .iter()
    .fold(1, |acc, x| acc * x);
    println!("part two: {}", sum);
    Ok(())
}

fn calculate_by_slope(input: &str, right: usize, down: usize) -> usize {
    let lines = input.lines();
    let max_x = lines.clone().take(1).map(|l| l.len()).nth(0).unwrap();
    let max_y = lines.clone().count();

    let mut x = 1usize;
    let mut y = 1usize;
    let mut trees = 0usize;

    loop {
        x += right;
        y += down;

        if y > max_y {
            break;
        }
        if x > max_x {
            x -= max_x;
        }
        let line = lines.clone().nth(y - 1).unwrap();
        if line.chars().nth(x - 1).unwrap().eq(&'#') {
            trees += 1;
        }
    }
    trees
}
