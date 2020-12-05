use regex::Regex;
use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
    let contents = fs::read_to_string("src/input.txt").expect("Failed to open input.txt");
    part1(&contents)?;
    part2(&contents)?;
    Ok(())
}

fn part1(input: &str) -> Result<()> {
    let result = input
        .split("\n\n")
        .map(parse_line)
        .filter(|x| is_valid_passport_length(x.to_vec()))
        .collect::<Vec<_>>();
    println!("part one: {}", result.iter().count());
    Ok(())
}

fn part2(input: &str) -> Result<()> {
    let result = input
        .split("\n\n")
        .map(parse_line)
        .filter(|x| is_valid_passport_length(x.to_vec()))
        .filter(|x| is_valid_passport_data(x.to_vec()))
        .collect::<Vec<_>>();
    println!("part two: {}", result.iter().count());
    Ok(())
}

fn parse_line(input: &str) -> Vec<Vec<&str>> {
    let pairs: Vec<Vec<&str>> = input
        .split_whitespace()
        .map(|x| x.split(':').collect())
        .collect();
    pairs
}

fn is_valid_passport_length(x: Vec<Vec<&str>>) -> bool {
    let result: Vec<_> = x.iter().map(|x| x.into_iter().take(1)).flatten().collect();
    match result.len() {
        8 => true,
        7 => !result.contains(&&"cid"),
        _ => false,
    }
}

fn str_to_int(s: &str) -> i32 {
    s.to_string().parse::<i32>().unwrap()
}

fn is_valid_passport_data(x: Vec<Vec<&str>>) -> bool {
    let eye_colors: Vec<&str> = vec!["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
    let pid_re = Regex::new(r"^\d{9}$").unwrap();
    let hcl_re = Regex::new(r"#[0-9a-f]{6}$").unwrap();

    x.iter().all(|x| match (x[0], x[1]) {
        (a, b) => match a {
            // byr (Birth Year) - four digits; at least 1920 and at most 2002.
            "byr" => match str_to_int(b) {
                1920..=2002 => true,
                _ => false,
            },
            // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
            "iyr" => match str_to_int(b) {
                2010..=2020 => true,
                _ => false,
            },
            // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
            "eyr" => match str_to_int(b) {
                2020..=2030 => true,
                _ => false,
            },
            // hgt (Height) - a number followed by either cm or in:
            // If cm, the number must be at least 150 and at most 193.
            // If in, the number must be at least 59 and at most 76.
            "hgt" => match b {
                x if x.ends_with("cm") => match str_to_int(&b.replace("cm", "")) {
                    150..=193 => true,
                    _ => false,
                },
                x if x.ends_with("in") => match str_to_int(&b.replace("in", "")) {
                    59..=76 => true,
                    _ => false,
                },
                _ => false,
            },
            // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
            "hcl" => hcl_re.is_match(b),
            // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
            "ecl" => eye_colors.contains(&b),
            // pid (Passport ID) - a nine-digit number, including leading zeroes.
            "pid" => pid_re.is_match(b),
            // cid (Country ID) - ignored, missing or not.
            "cid" => true,
            _ => false,
        },
    })
}
