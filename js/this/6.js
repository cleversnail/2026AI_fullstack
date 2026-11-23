// function foo() {
//   let bar = () => {
//     this.a = 2
//   }
//   bar()
// }

// let obj = {
  
//   baz: foo
// }
// obj.baz()
// console.log(obj);



let foo = () => {
  let bar = () => {
    let baz = () => {
      console.log(this);
    }
    baz()
  }
  bar()
}
foo()