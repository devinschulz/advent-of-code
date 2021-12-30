use std::str;

fn input() -> &'static str {
    include_str!("input.txt")
}

fn is_word_nice(word: &str) -> bool {
    // contains 3 vowels
    word.chars().filter(|&c| c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u').count() >= 3
        // contains a double letter
        && word.chars().zip(word.chars().skip(1)).any(|(a, b)| a == b)
        // does not contain the strings ab, cd, pq, or xy
        && !word.contains("ab") && !word.contains("cd") && !word.contains("pq") && !word.contains("xy")
}

fn is_word_nicer(word: &str) -> bool {
    // contains same character when skipping over a character aba
    word.chars().zip(word.chars().skip(2)).any(|(a, b)| a == b)
        // Credit to HeroesGrave on Reddit
        && word.as_bytes().windows(2).enumerate().any(|(i, pair)| {
            word.rfind(str::from_utf8(pair).unwrap())
                .map(|index| index > i + 1)
                .unwrap_or(false)
        })
}

fn part1(input: &str) -> usize {
    input.lines().filter(|line| is_word_nice(line)).count()
}

fn part2(input: &str) -> usize {
    input.lines().filter(|line| is_word_nicer(line)).count()
}

#[test]
fn test_part1() {
    assert_eq!(part1(input()), 255);
}

#[test]
fn test_part2() {
    assert_eq!(part2(input()), 55);
}

#[test]
fn test_day05_example1() {
    assert_eq!(is_word_nice("ugknbfddgicrmopn"), true);
}

#[test]
fn test_day05_example2() {
    assert_eq!(is_word_nice("aaa"), true);
}

#[test]
fn test_day05_example3() {
    assert_eq!(is_word_nice("jchzalrnumimnmhp"), false);
}

#[test]
fn test_day05_example4() {
    assert_eq!(is_word_nice("dvszwmarrgswjxmb"), false);
}

#[test]
fn test_day05_example5() {
    assert_eq!(is_word_nicer("qjhvhtzxzqqjkmpb"), true);
}

#[test]
fn test_day05_example6() {
    assert_eq!(is_word_nicer("xxyxx"), true);
}

#[test]
fn test_day05_example7() {
    assert_eq!(is_word_nicer("uurcxstgmygtbstg"), false);
}

#[test]
fn test_day05_example8() {
    assert_eq!(is_word_nicer("ieodomkazucvgmuy"), false);
}

#[test]
fn test_day05_example9() {
    assert_eq!(is_word_nicer("aaa"), false);
    assert_eq!(is_word_nicer("aaaa"), true);
}
