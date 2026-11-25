# 基本类型（原始类型）
1. string
2. number
3. boolean
4. null
5. undefined
6. symbol
7. bigint

# 引用类型（对象类型、复杂类型）
1. object
2. array
3. function
4. date

# v8 是怎么存储不同的类型的
1. 基本类型：值直接存储栈中
2. 引用类型：值存在堆空间，但是会暴露引用地址，引用地址存储栈中


# const
1. const 声明的变量如果值是原始类型，不能重新给变量赋值
2. const 声明的变量如果值是引用类型，只要保证变量对应的引用地址不改变