function xq() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('刘少相亲圆满');
      resolve()
    }, 3000)
  })
}

function marry() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('刘少结婚了');
      resolve()
    }, 2000)
  })
}

function baby() {
  setTimeout(() => {
    console.log('小刘出生了');
  }, 1000)
}



xq()
  .then(() => {  // then的源码也会返回一个Promise实例对象，他的状态是继承前面的Promise实例对象的状态
    return marry() // 如果我们人为在then里面返回一个Promise实例对象，那么then就不会启用自己的那个返回，而是会采用我们人为返回的那个Promise实例对象
  })
  .then(() => {
    baby()
  })

