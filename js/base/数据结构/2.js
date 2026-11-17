// let obj = {
//   name: '张三',
//   age: 18,
//   sex: '男',
//   like: {
//     sport: '篮球',
//     music: '摇滚'
//   }
// }

// console.log(obj.like.sport);



let arr = [ 18, '张三', true, {a: 1}]   // new Array()
// console.log(arr[0]);

arr.push(undefined)  // 往数组的尾部添加一个元素 undefined
arr.unshift('hello')  // 往数组的头部添加一个元素 hello

arr.pop() // 删除数组的最后一个元素
arr.shift() // 删除数组的第一个元素


console.log(arr);
