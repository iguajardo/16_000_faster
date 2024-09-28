# Problem
Your device's communication system is correctly detecting packets, but still isn't working. It looks like it also needs to look messages.

A start-of-message marker is just like a start-of-packet marker, except it consists of 14 distinct characters rather than 4.

Here are the first positions of start-of-message markers for all of the above examples:

- mjqjpqmgbljsphdztnvjfqwrcgsmlb: first marker after character 19
- bvwbjplbgvbhsrlpgdmjqwftvncz: first marker after character 23
- nppdvjthqldpwncqszvftbrmjlhg: first marker after character 23
- nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg: first marker after character 29
- zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw: first marker after character 26

How many characters need to be processed before the first start-of-message marker is detected?

## Solution
There are many ways to solve this problem. The easiest is to use a HashSet to store all the window of 14 elements. Then check if the length is equal to 14.
Improving this would be starting since the duplicated element is found.
A better approach is to use a dynamic array of length 14 instead of a HashSet, because the lookup for that small number of elements is faster than the set.
Using a static array is way better becuase it's stored in the Stack instead of the Heap. Meaning that can be cached.
If we use an static array of boolean, is faster. But can be improved using an int32 to store the elements from 'a' to 'z'. This is called bit mask.
This way is preferred using a bit mask, which is faster because CPU works better with bits. With the basics operations XOR AND and OR.


Implementation in Rust:
```rust
fn solution(input: &[u8]) -> Option<usize> {
    let mut filter = 0u32;
    input
        .iter() // Generate an iterator
        .take(14 - 1) // limits the iter from 0 to 12
        .for_each(|c| filter ^= 1 << (c % 32)); // for each character, push 1 to the windows of 14. If repeated a char, it will be 0

    // windows generate an iterator with a windows, in this case, iter in a windows of 14. Position searchs in an Iter and returns the index of that value.
    // return true or false if found or not
    input.windows(14).position(|w| { 
        let first = w[0];
        let last = w[w.len() - 1]; // the last one is yet to be inserted
        // this can be done substracting last - 'a'. Instead of using module 32, maybe is more faster
        filter ^= 1 << (last % 32); // add last to filter, if exists, it will be 0, else 1
        let res = filter.count_ones() == 14 as u32; // count_ones() return the number of ones in a binary representation of self (filter u32 in this case)
        filter ^= 1 << (first % 32); // remove first added, if the removed one was 0, it will be 1 again, meaning the duplicated was removed

        res
    })
}
```

### Algorithm Revision
The first step is to go from 0 to 12, and turn the bits from every character found. In this algorithm we are using a 32 unsigned integer, instead of an array.
And the letters of the alphabets from 'a' to 'z' in english are 26. So a few bits will be always 0.
If there is any duplicated, the bit will be 1. So is there a problem with that? Is that a break in the algorithm?

#### Triple or more of the same character
Let's say we are working with the first input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`. This input has 3 j on the start, so is a perfect example.\n
We start with a set of 0 bits (32 bits):\n
00000000000000000000000000000000\n
m equals 109. 109 % 32 = 13\n
So 13 from right to left is ( filter ^= 1 << 13 ):\n
00000000000000000010000000000000\n
It should be a position more on the right, because we are starting at the first position, but it doesn't matter. If the assignation is consistent it works.\n
Let's continue, j = 106 => 106 % 32 = 10 => filter ^= 1 << 10:\n
00000000000000000010010000000000\n
Adding 'q' now => 'q' = 113 => 113 % 32 = 17 => filter ^= 1 << 17:\n
00000000000000100010010000000000\n
Adding 'j' again => 'j' = 106:\n
00000000000000100000010000000000\n
We are added 4 characters so far, but the duplicated is found. We only count two 1 at this moment. That means that if a third one is added, the count will be 3,\n
but we are across the fifth character. If we check the condition validating if the count is 14, it will be not.\n
If we pick the first 14 characters, the final filter will have less characters because of duplicates or triplicates (or more). And the condition will be not be met.\n
In this case, because the count always will be less than 14, the only way to go back to 14, is to removing duplicates, that means, transforming 0 to 1 at the moment that the last element is XORed (new word :P)\n
