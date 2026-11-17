let obj = {
  name: '张三',
  age: 18,
  sex: '男'
}

function showInfo(o) {
  let res = `姓名：${o.name}, 年龄：${o.age}, 性别：${o.sex}`
  console.log(res);
}


showInfo(obj)

// 姓名： 张三 ，年龄： 18 ，性别： 男
