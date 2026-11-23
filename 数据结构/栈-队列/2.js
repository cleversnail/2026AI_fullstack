const stack = []  // 栈   

stack.push('巧乐兹')
stack.push('老冰棍')
stack.push('可爱多')
stack.push('梦龙')

// console.log(stack[stack.length - 1]);

// for (let i = stack.length - 1; i >= 0; i--) {
//   let item = stack.pop()
//   console.log(item);
// }

while (stack.length > 0) {
  let item = stack.pop()
  console.log(item);
}




