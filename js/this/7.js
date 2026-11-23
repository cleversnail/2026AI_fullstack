
// Child.prototype.__proto__  === Object.prototype  // new Object()
// Object.prototype.__proto__ === null
function Child() {
  this.lastName = '张'
}
let c = new Child()
console.log(c.toString());  '[object Object]'

// c.__proto__ === Child.prototype

