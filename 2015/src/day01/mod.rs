fn input() -> &'static str {
    include_str!("input.txt")
}

fn part1(input: &str) -> i32 {
    input.chars().fold(0, |acc, x| match x {
        ')' => acc - 1,
        '(' => acc + 1,
        _ => acc,
    })
}

fn part2(input: &str) -> usize {
    let mut pos = 0i32;
    for (index, char) in input.chars().enumerate() {
        if char.eq(&')') {
            pos -= 1;
        } else if char.eq(&'(') {
            pos += 1;
        }
        if pos < 0 {
            return index + 1;
        }
    }
    panic!("Failed to enter the basement");
}

#[test]
fn test_day01_part1() {
    assert_eq!(part1(input()), 138);
}

#[test]
fn test_day01_part2() {
    assert_eq!(part2(input()), 1771);
}
