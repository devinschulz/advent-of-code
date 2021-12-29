extern crate md5;

use std::fmt;

fn input() -> &'static str {
    "iwrupvqb"
}

fn compute(input: &str, prefix: &str) -> u32 {
    for i in 1.. {
        let key = fmt::format(format_args!("{}{}", input, i));
        let digest = md5::compute(key.as_bytes());
        if format!("{:x}", digest).starts_with(prefix) {
            return i;
        }
    }
    panic!("unable to find a matching hash")
}

fn part1(input: &str) -> u32 {
    compute(input, "00000")
}

fn part2(input: &str) -> u32 {
    compute(input, "000000")
}

#[test]
fn test_part1() {
    assert_eq!(part1(input()), 346386);
}

#[test]
fn test_part2() {
    assert_eq!(part2(input()), 9958218);
}
