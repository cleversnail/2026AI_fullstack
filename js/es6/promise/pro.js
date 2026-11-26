Promise.prototype.then = function (thenCB) {
  this.arr.push(thenCB)
}
function Promise(fn) {
  this.status = 'pending'   // 状态
  this.arr = [thenCB]
  this.catchArr = []

  const resolve = () => {
    this.status = 'fulfilled'  // 成功
    for (let i = 0; i < this.arr.length; i++) {  // 执行的是then当初存起来的函数
      this.arr[i]()
    }
  }
  const reject = () => {
    this.status = 'rejected'  // 失败
    for (let i = 0; i < this.catchArr.length; i++) {  // 执行的是catch当初存起来的函数
      this.catchArr[i]()
    }
  }

  fn(resolve, reject)
}

let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 3000)
})

p.then(() => {   // then里面的代码想要执行，必须保证then前面的那个Promise实例对象中的状态是fulfilled成功
  foo()
})
.catch(() => {
  bar()
})