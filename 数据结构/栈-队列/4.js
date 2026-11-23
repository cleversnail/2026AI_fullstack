// 用栈实现队列

const MyQueue = function() {
  this.stack1 = []
  this.stack2 = []
}

// 入队
MyQueue.prototype.push = function(x) {
  this.stack1.push(x)
}
MyQueue.prototype.pop = function() {
  if (this.stack2.length == 0) {
    while(this.stack1.length) {
      this.stack2.push(this.stack1.pop())
    }
  }
  return this.stack2.pop()
}



const queue = new MyQueue()  // 得到一个队列 
queue.push(1)
queue.push(2)
console.log(queue.pop());  // 1 从队列中取出来
queue.push(3)
console.log(queue.pop());  // 2 从队列中取出来
