fn input() -> Vec<Vec<i32>> {
    let string = include_str!("input.txt");
    string
        .split("\n")
        .filter(|l| !l.is_empty())
        .map(|l| l.split("x").map(|s| s.parse().unwrap()).collect())
        .collect()
}

fn calculate_square_footage(l: i32, w: i32, h: i32) -> i32 {
    let sides = [l * w, w * h, h * l];
    let min = sides.iter().min().unwrap();
    let sum = sides.iter().fold(0, |acc, &x| acc + x * 2);
    sum + min
}

fn part1(input: Vec<Vec<i32>>) -> i32 {
    input.iter().fold(0, |acc, row| {
        acc + calculate_square_footage(row[0], row[1], row[2])
    })
}

fn calculate_ribbon_length(l: i32, w: i32, h: i32) -> i32 {
    let mut sides = vec![l, w, h];
    let max = sides.iter().max().unwrap();
    let index = sides.iter().position(|&x| x == *max).unwrap();
    sides.remove(index);
    let dimensions = sides.iter().fold(0, |acc, &x| acc + x * 2);
    l * w * h + dimensions
}

fn part2(input: Vec<Vec<i32>>) -> i32 {
    input.iter().fold(0, |acc, row| {
        acc + calculate_ribbon_length(row[0], row[1], row[2])
    })
}

#[test]
fn test_day02_part1_example1() {
    assert_eq!(calculate_square_footage(2, 3, 4), 58);
}

#[test]
fn test_day02_part1_example2() {
    assert_eq!(calculate_square_footage(1, 1, 10), 43);
}

#[test]
fn test_day02_part2_example1() {
    assert_eq!(calculate_ribbon_length(2, 3, 4), 34)
}

#[test]
fn test_day02_part2_example2() {
    assert_eq!(calculate_ribbon_length(1, 1, 10), 14)
}

#[test]
fn test_day02_part1() {
    assert_eq!(part1(input()), 1606483)
}

#[test]
fn test_day02_part2() {
    assert_eq!(part2(input()), 3842356)
}
