function bar() {
  console.log(myname);
}
function foo() {
  var myname = '曹老板'
  bar()
}
var myname = '刘少'
foo()