let str = '([{}])'   // [ (, [, { ]       {      }  ])

// 123321

var isValid = function(s) {
  const obj = {
    '(': ')',
    '[': ']',
    '{': '}',
  }
  const stack = []
  for (let i = 0; i < s.length; i++) {
    let item = s[i]  // '}'
    if (item in obj) {  // 是对象中的一个key 
      stack.push(item)
    } else {  // 右括号
      if (obj[stack.pop()]  !== item) {
        return false
      }  
    }
  }

  return stack.length === 0
};

console.log(isValid(str));  // true
