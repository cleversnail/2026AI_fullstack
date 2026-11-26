// let a = 1
// console.log(a);    // 不耗时  同步代码

// for(let i = 0; i < 100000; i++) {   // 不耗时  同步代码

// }


// setTimeout(() => {  // 回调函数
//   console.log('执行了');
// }, 3000)

// setInterval(() => {  // 回调函数
//   console.log('执行了');
// }, 3000)


fetch('https://mock.mengxuegu.com/mock/66585c4db462b81cb3916d3e/songer/songer')  // 专门用来发送请求
.then(res => {
  return res.json()
})
.then(data => {
  console.log(data);
})
