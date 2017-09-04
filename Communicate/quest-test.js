//动态规划 实现最小编辑距离问题
function min(word1, word2) {
  var m = word1.length;
  var n = word2.length;

  var dp = [];
  var i = 0;
  var j = 1;


  // 初始化空字符串的情况
  for (i = 0; i <= m; i++) {
      dp[i] = [];
  }

  dp[0][0] = {
      index: 0,
      last: null,
      type: 'NOTHING',
      target: 0
  };

  for (i = 1; i <= m; i++) {
      dp[i][0] = {
          index: i + 1,
          last: dp[i - 1][0],
          type: 'REMOVE',
          target: i - 1
      };
  }

  for (; j <= n; j++) {
      dp[0][j] = {
          index: j + 1,
          last: dp[0][j - 1],
          type: 'ADD',
          target: j - 1
      };
  }

  // 所以，算法的时间复杂度为：O(M*N)
  for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
          // +1是为了比后面replace值相同时index值大
          var insertion = {
              last: dp[i][j - 1],
              index: dp[i][j - 1].index + 1,
              type: 'ADD',
              target: j - 1
          };

          var deletion = {
              last: dp[i - 1][j],
              index: dp[i - 1][j].index + 1, // 从新的字符串中获取的位置
              type: 'REMOVE',
              target: i - 1 // 移动到旧的字符串中的位置
          };

          var isEqual = word1.charAt(i - 1) === word2.charAt(j - 1);

          var replace = {
              last: dp[i - 1][j - 1],
              index: dp[i - 1][j - 1].index + (isEqual ? 0 : 1),
              type: isEqual ? 'NOTHING' : 'REPLACE',
              oldEl: {
                  val: word1.charAt(i - 1),
                  index: i - 1
              },
              newEl: {
                  val: word2.charAt(j - 1),
                  index: j - 1
              },
              target: j - 1
          };

          // 三者取最小
          dp[i][j] = [replace, insertion, deletion].sort(function(x, y) {
              return x.index > y.index;
          })[0];
      }
  }

  var diffs = [];

  var cur = dp[m][n];

  while (cur) {
      if (cur.type !== 'NOTHING') {
          diffs.unshift(cur);
      }

      cur = cur.last;
  }

  var olds = [];
  var news = [];
  var adjusts = [];

  diffs.forEach(function(diff) {
      if (diff.type === 'REMOVE') {
          adjusts.unshift(diff); // 移除
      } else if (diff.type === 'REPLACE') {
          olds.push(diff.oldEl);
          news.push(diff.newEl);
      } else {
          adjusts.push(diff); // ADD
      }
  });

  return {
      diffs: adjusts,
      olds: olds,
      news: news
  };
}

function patch(str1, str2) {
  var patches = min(str1, str2);
  var diffs = patches.diffs;
  var olds = patches.olds;
  var news = patches.news;

  console.log(patches);

  var str3 = str1;

  olds.forEach(function(item, index) {
      str3 = replaceIndex(str3, item.index, ' ');
  });

  diffs.forEach(function(item) {
      if (item.type === 'ADD') {
          str3 = addIndex(str3, str2, item.target);
      }

      if (item.type === 'REMOVE') {
          str3 = removeIndex(str3, item.target);
      }
  });

  news.forEach(function(item, index) {
      str3 = replaceIndex(str3, item.index, item.val);
  });

  str3 = str3.replace(/\s+/g, '');

  return str3;
}

// ****** helpers ******

function replaceIndex(str, index, newVal) {
  return str.substring(0, index) + newVal + str.substring(index + 1);
}

function addIndex(str1, str2, index) {
  return str1.substring(0, index) + str2.charAt(index) + str1.substring(index);
}

function removeIndex(str, index) {
  return str.substring(0, index) + str.substring(index + 1);
}


// ****** 测试代码 ******
var str1 = 'aaas';
var str2 = 'anbgs';

var newStr = patch(str1, str2);

console.log(newStr, newStr === str2); // true