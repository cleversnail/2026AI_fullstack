// // let arr = [1, 2, 3, 4 ,5]

// // // let res = [arr[0]**2, arr[1]**2, arr[2]**2, arr[3]**2, arr[4]**2]

// // let res = []
// // for (let i = 0; i < arr.length; i++) {   // i++  ==>  i = i + 1  
// //   let val = arr[i] ** 2
// //   res.push(val)
// // }

// // console.log(res);



// let arr = ['a', 'b', 'c', 'd']    // 'a' + 'o' == 'ao'

// let res = [];
// for (let i = 0; i < arr.length; i++) {
//   res.push(arr[i] + 'o');
// }
// console.log(res);


let arr = [1, 4, 70, 2, 49, 9, 32, 100, 54, 76,98, 12]
// for (let i = 0; i < arr.length; i++) {
//   if (arr[i] === 100) {
//     console.log(`找到了，它的下标是${i}`);
//     break
//   }
// }

let i = 0
while(arr[i] !== 100) {
  i++
}
console.log(`找到了，它的下标是${i}`);
