use std::collections::HashSet;

fn input() -> &'static [u8] {
    include_bytes!("input.txt")
}

fn calculate_unique_houses(input: &[u8], part2: bool) -> usize {
    let mut x = 0;
    let mut y = 0;
    let mut x2 = 0;
    let mut y2 = 0;
    let mut locations: HashSet<String> = HashSet::from(["0x0".to_string()]);
    for (i, char) in input.iter().enumerate() {
        let is_even = i % 2 == 0 && part2;
        match char {
            b'^' => match is_even {
                true => y -= 1,
                false => y2 -= 1,
            },
            b'v' => match is_even {
                true => y += 1,
                false => y2 += 1,
            },
            b'<' => match is_even {
                true => x -= 1,
                false => x2 -= 1,
            },
            b'>' => match is_even {
                true => x += 1,
                false => x2 += 1,
            },
            _ => println!("unknown character {}", char),
        };
        locations.insert(format!("{}x{}", x, y).to_string());
        locations.insert(format!("{}x{}", x2, y2).to_string());
    }
    return locations.len();
}

fn part1(input: &[u8]) -> usize {
    calculate_unique_houses(input, false)
}

fn part2(input: &[u8]) -> usize {
    calculate_unique_houses(input, true)
}

#[test]
fn test_day03_example1() {
    assert_eq!(calculate_unique_houses(&[b'>'], false), 2)
}

#[test]
fn test_day03_example2() {
    assert_eq!(calculate_unique_houses(&[b'^', b'>', b'v', b'<'], false), 4)
}

#[test]
fn test_day03_example3() {
    assert_eq!(calculate_unique_houses(&[b'^', b'v'], true), 3)
}

#[test]
fn test_day03_example4() {
    assert_eq!(calculate_unique_houses(&[b'^', b'>', b'v', b'<'], true), 3)
}

#[test]
fn test_day03_example5() {
    assert_eq!(
        calculate_unique_houses(
            &[b'^', b'v', b'^', b'v', b'^', b'v', b'^', b'v', b'^', b'v'],
            true
        ),
        11
    )
}

#[test]
fn test_day03_part1() {
    assert_eq!(part1(input()), 2565)
}

#[test]
fn test_day02_part2() {
    assert_eq!(part2(input()), 2639);
}
