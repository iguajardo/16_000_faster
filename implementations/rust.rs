fn solution(input: &[u8]) -> Option<usize> {
    let mut filter = 0u32;
    input
        .iter() 
        .take(14 - 1) 
        .for_each(|c| filter ^= 1 << (c % 32)); 
    
    input.windows(14).position(|w| { 
        let first = w[0];
        let last = w[w.len() - 1]; 
        
        filter ^= 1 << (last % 32); 
        let res = filter.count_ones() == 14 as u32; 
        filter ^= 1 << (first % 32); 
        res
    })
