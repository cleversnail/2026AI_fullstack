let nums = [2, 7, 11, 15], target = 9

var twoSum = function(nums, target) {
  for (let i = 0; i < nums.length; i++) {  // 左手 2
    // nums[i]
    for (let j = i + 1; j < nums.length; j++) {  // 右手 7
      if (nums[i] + nums[j] == target) {
        return [i, j]
      }
    }
  }
};

console.log(twoSum(nums, target));


// O(n^2)
// 常量