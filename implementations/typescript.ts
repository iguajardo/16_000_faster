// In TS we prefer to use an integer, because, lowest integer number are one of the only types stored in the stack

function solution(input: string) {
  function countOnes(n: number) {
    // Brian Kernighan's algorithm
    // removes 1 one by one, until the number is 0
    let count = 0;
    while (n) {
      // easy to understand with an example: 42 (101010). 42 - 1 (101001).
      // 42 101010 &
      // 41 101001 =
      //    101000
      //
      //    101000 - 1 =
      //    100111 &
      //    100000
      //
      //    100000 - 1 =
      //    011111 &
      //    000000
      n &= (n - 1);
      count++;
    }
    return count;
  }

  let filter = 0;
  const aCode: number = 'a'.charCodeAt(0);
  // initialize the filter with the first 13 elements. From 0 to 12
  for (let i = 0; i < 13; i++) {
    const charCode: number = input.charCodeAt(i);
    filter ^= 1 << charCode - aCode;
  }

  for (let i = 0, j = 13; j < input.length; i++, j++) {
    const first = input.charCodeAt(i);
    const last = input.charCodeAt(j);
    filter ^= 1 << last;

    const count = countOnes(filter);
    if (count === 14) return last + 1;

    filter ^= 1 << first;
  }
}

