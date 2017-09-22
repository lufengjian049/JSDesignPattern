//BinarySearch 二分查找
//list sortedlist
function BinarySearch(list,value){
  var start = 0
  var stop = list.length - 1
  var middle = Math.floor((start + stop) / 2)
  while(list[middle] != value && start < stop){
    if(list[middle] > value){
      stop = middle - 1
    }else{
      start = middle + 1
    }
    middle = Math.floor((start + stop) / 2)
  }
  return list[middle] != value ? -1 : middle
}
console.log(BinarySearch([3,5,1,2,7,2,9,0,4].sort(),5))
//Merge Sort 归并排序
function mergeSort (arr) {
  if (arr.length === 1) {
    // return once we hit an array with a single item
    return arr
  }
  const middle = Math.floor(arr.length / 2)
  const left = arr.slice(0, middle)
  const right = arr.slice(middle)

  return merge(
    mergeSort(left),
    mergeSort(right)
  )
}
function merge (left, right) {
  let result = []
  let indexLeft = 0
  let indexRight = 0

  while (indexLeft < left.length && indexRight < right.length) {
    if (left[indexLeft] < right[indexRight]) {
      result.push(left[indexLeft])
      indexLeft++
    } else {
      result.push(right[indexRight])
      indexRight++
    }
  }

  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight))
}

const list2 = [2, 5, 1, 3, 7, 2, 3, 8, 6, 3]
console.log("merge sort")
console.log(mergeSort(list2))
//insertionSort 插入排序
function insertionSort(items){
  for(var i=0;i<items.length;i++){
    var value = items[i]
    for(var j = i -1;j> -1 && items[j] > value ; j--){
      items[j + 1] = items[j]
    }
    items[j + 1] = value
  }
  return items
}
const list = [54, 26, 93, 17, 77, 31, 44, 55, 20]
console.log("insertionSort")
console.log(insertionSort(list))

const arrangeCategories = (categories, parent = null) => {
   let result = {}
   categories
     .filter(category => category.parent === parent)
     .forEach(category => {
       result[category.name] = arrangeCategories(categories, category.name)
     })
   return result
 }
//桶排序
 function sort(sarr){
    //常规方法
    for(var a=[],n=0;n<100;a[n++] = 0);
    // Array.apply(null,Array(100)).map(_ => 0);
    // Array(101).join(0).split("").map(n=>+n);
    // //es6
    // Array.from({length:100}, _ => 0);
    // [...Array(100)].map(_ => 0);
    // [].fill.call(Array(100),0); //Array(100).fill(0)

    sarr.forEach(function(sitem){
      a[sitem]++;
    })
    for(var ret=[],i=0;i<100;i++){
      // if(a[i] > 0)
      //   ret[ret.length] = i;
      var count = a[i];
      while(count--){
        ret[ret.length] = i;
      }
    }
    return ret;
 }
 const slist = [54, 26, 93, 17, 77, 31, 44, 55, 20,26];
 console.log("sort");
 console.log(sort(slist));
//冒泡排序
 function bubbleSort(sarr){
   for(var i=0,len=sarr.length;i<len;i++){
     for(var j=0;j<len-i-1;j++){
       if(sarr[j] > sarr[j+1]){
         var tmp = sarr[j];
         sarr[j] = sarr[j+1];
         sarr[j+1] = tmp;
       }
     }
   }
   return sarr;
 }
 console.log("bsort");
 console.log(bubbleSort([54, 26, 93, 17, 77, 31, 44, 55, 20,26]));

//  function quickSort(sarr){
//   if(sarr.length == 0)
//       return [];
//   var i = 0;
//   var j = sarr.length - 1;
//   var base = sarr[i];//基准值在左，右边先动找< 基准的值
//   while(i<j){
//     while(sarr[j] >= base && i < j){
//       j--;
//     }
//     while(sarr[i] <= base && i < j){
//       i++;
//     }
//     var tmp = sarr[i];
//     sarr[i] = sarr[j];
//     sarr[j] = tmp;
//   }
//   sarr[0] = sarr[j];
//   sarr[j] = base;
//   return [].concat(quickSort(sarr.slice(0,j)),sarr[j],quickSort(sarr.slice(j+1)));
//   // quickSort(sarr,0,j-1);
//   // quickSort(sarr,j+1,right);
//   // return sarr;
//  }
//快速排序
function quickSort(sarr,left,right){
  if(left > right){
      return;
  }
  left = left || 0;
  right = right || (sarr.length - 1);
  var i = left;
  var j = right;
  var base = sarr[left];
  while(i<j){
      while(sarr[j] >= base && i < j){
          j--;
      }
      while(sarr[i] <= base && i < j){
          i++;
      }
      var tmp = sarr[j];
      sarr[j] = sarr[i];
      sarr[i] = tmp;
  }
  sarr[left] = sarr[j];
  sarr[j] = base;
  arguments.callee(sarr,left,j - 1);
  arguments.callee(sarr,j+1,right);
  return sarr;
}
 console.log("quickSort");
 console.log(quickSort([54, 26, 93, 17, 77, 31, 44, 55, 20,26,88,3,89]));

 //队列 queue
// {
//   data:[],
//   head:0,
//   tail:0
// }
var queue = {
  data:[],
  head:0,
  tail:0,
}
queue.data = [6,4,9,7,1,8,0,7,7];
queue.tail = queue.data.length - 1;
var outedqueue = []
while(queue.head != queue.tail){
  outedqueue.push(queue.data[queue.head]);
  queue.head++;
  if(queue.head ==  queue.tail){
    outedqueue.push(queue.data[queue.head]);
    break;
  }
  var addtail = queue.data[queue.head];
  queue.data[++queue.tail] = addtail;
  queue.head++;
  console.log('data:',queue.data,'head:',queue.head,'tail:',queue.tail);
}
console.log('queue:',outedqueue);

//队列tail指向 末尾下一位，当head = tail 时队列为空
function queueFunc(queue){
  if(Object.prototype.toString.call(queue) == '[object Array]'){
    this.data = queue;
  }else{
    this.data = [queue];
  }
  this.head = 1;
  this.tail = this.data.length;
  this.isEmpty = this.head == this.tail ? true : false;
}
queueFunc.prototype.enqueue = function(val){
  this.isEmpty = false;
  this.data[this.tail++] = val;
}
queueFunc.prototype.dequeue = function(){
  if(this.isEmpty)
    return;
  if(this.head == this.tail){
    this.isEmpty = true;
    return this.data[this.head]
  }
  return this.data[this.head++];
}
var queuetest = new queueFunc([6,4,9,7,1,8,0,7,7]);
var outedqueue2 = [];
while(!queuetest.isEmpty){
  outedqueue2.push(queuetest.dequeue());
  !queuetest.isEmpty && queuetest.enqueue(queuetest.data[queuetest.head++]);
}
console.log('queue2',outedqueue2);
 //栈-回文 stack

 //栈 初始top=0  从1 开始计
function stackFunc(stack){
  if(Object.prototype.toString.call(stack) == '[object Array]'){
    this.data = stack;
  }else{
    this.data = stack == void 0 ? [] : [stack];
  }
  this.top = this.data.length;
  this.isEmpty = this.top == 0 ? true : false;
}
stackFunc.prototype.instack = function(val){
  this.isEmpty = false;
  this.data[++this.top] = val;
}
stackFunc.prototype.outstack = function(){
  if(this.isEmpty) return;
  var outVal = this.data[this.top--];
  if(this.top == -1){
    this.isEmpty = true;
  }
  return outVal;
}
//haah xyzyx
function isHuiWen(str){
  var len = str.length,
      iseven = len % 2 == 0,
      mid = ~~(len / 2);
  var astack = new stackFunc();
  for(var i=0;i<len;i++){
    if(i < mid){
      astack.instack(str[i]);
    }else{
      if((iseven || (!iseven && i != mid)) && str[i] != astack.outstack()){
        return false
      }
    }
  }
  return true;
}
console.log("haah:",isHuiWen("haah"))
console.log("xyzyx:",isHuiWen("xyzyx"))
console.log("xyzyxw:",isHuiWen("xyzyxw"))

//出牌

//模拟链表-有序的数组中插入一个数
function insert(sortarr,val){
  var right = [];
  for(var i=0,len=sortarr.length;i<len;i++){
    if(sortarr[i+1] != void 0){
      right.push(i+1);
    }else{
      right.push(-1);
    }
  }
  console.log('right',right)
  sortarr.push(val);
  // len++
  var t = 0;
  while(t != -1){
    if(sortarr[t] > val){
      right[len] = right[t-1];
      right[t-1] = len;
      break;
    }
    t = right[t];
  }
  t = 0;
  var retval = [];
  while(t != -1){
    retval.push(sortarr[t]);
    t = right[t];
  }
  console.log('right',right)
  return retval;
}
console.log("insert",insert([5,6,7,9,10],8));

//枚举
//1. 1-9  _ _ _ + _ _ _ = _ _ _ ; 用book 标记 简化

function getPlusEqual(){
  var a = Array(10),book = Array(10);
  for(a[1] = 1;a[1] < 10;a[1]++){
    for(a[2] = 1;a[2] < 10;a[2]++){
      for(a[3] = 1;a[3] < 10;a[3]++){
        for(a[4] = 1;a[4] < 10;a[4]++){
          for(a[5] = 1;a[5] < 10;a[5]++){
            for(a[6] = 1;a[6] < 10;a[6]++){
              for(a[7] = 1;a[7] < 10;a[7]++){
                for(a[8] = 1;a[8] < 10;a[8]++){
                  for(a[9] = 1;a[9] < 10;a[9]++){
                    //标记重置
                    for(var i = 1;i< 10;i++){
                      book[i] = 0;
                    }
                    //在初始化book
                    for(var j = 1;j< 10;j++){
                      book[a[j]] = 1;
                    }
                    var sum = book.reduce(function(acc,item){
                      return acc + item;
                    },0);
                    if(sum == 9 && ((a[1]*100+a[2]*10+a[3]) + (a[4]*100 + a[5]*10+a[6])) == (a[7]*100 + a[8]*10+a[9]) ){
                      count++;
                      console.log(`${a[1]}${a[2]}${a[3]} + ${a[4]}${a[5]}${a[6]} = ${a[7]}${a[8]}${a[9]}`);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
function getHourMin(milseconds){
  var seconds = ~~ (milseconds / 1000);
  return `${Math.floor(seconds / 3600)}:${Math.floor(seconds / 60 % 60)}:${seconds % 60}`
}
//2.火柴棍等式 A + B = C ,0~9 : 6255456376

//3.数的全排序， n个数的各种排序

//深度优先搜索 Depth First Search,主要是当前该如何做，至于下一步则与第一步一样
//边界值
//1-9 ,三位数相加
var a = Array(10),book = Array.apply(null,Array(10)).map(_ => 0);
var count = 0;
function dfs(step){
  //边界情况
  if(step == 10){
    if(((a[1]*100+a[2]*10+a[3]) + (a[4]*100 + a[5]*10+a[6])) == (a[7]*100 + a[8]*10+a[9])){
      count++;
      console.log(`${a[1]}${a[2]}${a[3]} + ${a[4]}${a[5]}${a[6]} = ${a[7]}${a[8]}${a[9]}`);
    }
    return;
  }
  for(var i =1;i<10;i++){
    if(book[i] == 0){
      a[step] = i;
      book[i] = 1;
      dfs(step+1);
      book[i] = 0;
    }
  }
}
//n个数的全排列
function getAllSort(n){
  var a = Array(n+1),book = Array.apply(null,Array(n+1)).map(_ => 0);
  return function dfs2(step){
    //边界情况
    if(step == n+1){
      console.log(a.join(""))
      return;
    }
    for(var i=1;i<=n;i++){
      if(book[i] == 0){
        a[step] = i;
        book[i] = 1;
        dfs2(step+1);
        book[i] = 0;
      }
    }
  }
}
var startstamp2 = Date.now();
console.time('test')
// dfs(1);       //test: 40.899ms  count 336
// getPlusEqual();  //test: 85020.275ms  count 336
getAllSort(5)(1);
console.timeEnd("test");  
console.log('dfs task', getHourMin(Date.now() - startstamp2));
console.log('count',count);

//广度优先搜索 Breadth first search
//一层一层扩展，  找扩展点
//队列，满足条件(边界&&未重复)有扩展点就入队，某点扩展完毕就出列（head指针要向后....），队列为空循环结束，队尾为要找的
//迷宫 小岛  独立岛
// {
//   起始点-> 找扩展点(排除边界情况&&是否已经标记过)
//   满足条件的扩展点(s) -> 分别 加入队列；标记为已用
//   将找过扩展的点从队列中出列
// }

//树--任意两个结点有且只有一条路径的无向图
//二叉树--每一个结点最多只有两个儿子
//满二叉树--如果二叉树的每个内部结点都有两个儿子,深度为h，则有 2的h次方 - 1 个结点
//完全二叉树--除了最右边位置缺少一个或几个叶子结点，其它都是丰满的。深度为h，则除h层其余层都是满的。
//完全二叉树，可以从上到下，从左到右进行编号
//编号规则--完全二叉树，父节点编号k，左儿子=2*k；右儿子 = 2*k+1；已知儿子x，父节点x/2(向下取整);
// 最后一个非页结点数为 n / 2
//堆 --- 特殊的完全二叉树。
//最小堆 -- 所有父结点都比子结点小
//最大堆 -- 所有父结点都比子结点大

//创建堆的算法过程-将n个数建立一个堆，1~n编码=>完全二叉树，从最后一个非叶结点开始到根结点，逐个扫描，并根据需要向下调整结点

//优先队列 -- 支持插入元素和寻找最大最小值的数据结构叫优先队列
//建堆 ，排序(最小堆) ， 堆排序（从小到大，有最大堆）

//创建堆
function heap(arr){
  this.data = Array.isArray(arr) ? arr : [arr];
  //从1开始编号
  this.data = [0].concat(this.data);
  this.count = this.data.length - 1; //结点数
  // //创建堆
  // this.create();
}
heap.prototype.createMinHeap = function(){
  //获取最后一个非叶结点
  var lastNonLeaf = ~~(this.count/2);
  for(;lastNonLeaf>=1;lastNonLeaf--){
    this.siftdownmax(lastNonLeaf);
  }
}
heap.prototype.createMaxHeap = function(){
  //获取最后一个非叶结点
  var lastNonLeaf = ~~(this.count/2);
  for(;lastNonLeaf>=1;lastNonLeaf--){
    this.siftdownmin(lastNonLeaf);
  }
}
//往下移动- 大的往下
heap.prototype.siftdownmax = function(i){
  var t,flag=0;//flag是否需要向下移动，0需要，1不需要
  var arr = this.data;
  while(2*i <= this.count && flag == 0){
    if(arr[i] > arr[2*i]){
      t = 2 * i;
    }else{
      t = i;
    }
    if(2*i+1 <= this.count && arr[t] > arr[2*i+1]){
      t = 2*i + 1;
    }
    if(t != i){
      this.swape(t,i);
      i = t;  //继续从t 顶点往下找
    }else{
      flag = 1;
    }
  }
}
//大的往上
heap.prototype.siftdownmin = function(i){
  var t,flag=0;
  var arr = this.data;
  while(2*i <= this.count && flag == 0){
    if(arr[i] < arr[2*i]){
      t = 2*i;
    }else{
      t = i;
    }
    if(2*i+1 <=this.count && arr[t] < arr[2*i+1]){
      t = 2*i + 1;
    }
    if(t != i){
      this.swape(t,i);
      i = t;
    }else{
      flag = 1;
    }
  }
}
//将大的往上移动--用于在 堆中添加新的元素，找到合适的位置，使最大堆定义成立，找到添加后的最大值
heap.prototype.siftupmax = function(i){
  var parent = ~~(i/2);
  if(parent >=1 && this.data[parent] < this.data[i]){
    this.swape(parent,i);
    //交换之后 还需要再次往上比较
    this.siftup(parent);
  }
}
//将小的往上移动--用于在 堆中添加新的元素，找到合适的位置，使最小堆定义成立，找到添加后的最小值
heap.prototype.siftupmin = function(i){
  var parent = ~~(i/2);
  if(parent >=1 && this.data[parent] > this.data[i]){
    this.swape(parent,i);
    //交换之后 还需要再次往上比较
    this.siftup(parent);
  }
}
//a = [b,b=a][0];
//[a,b] = [b,a]
//对象/数组 a={a:b,b:a};a =[a,b]
heap.prototype.swape = function(i,j){
  this.data[i] = this.data.splice(j,1,this.data[i])[0];
}
heap.prototype.printHeap = function(){
  return this.data.slice(1);
}
//从小到大
heap.prototype.sort = function(){
  this.createMinHeap();
  var sorted = [];
  while(this.count){
    sorted.push(this.data[1]);
    this.swape(1,this.count);
    this.count--;
    this.siftdownmax(1);//将最小置顶
  }
  //sorted从小到大，this.data为从大到小
  return sorted;
  //返回 从大到小，将堆顶最小的交换到末尾！！！
}
//从大到小
heap.prototype.sort2 = function(){
  this.createMaxHeap();
  var sorted = [];
  while(this.count){
    sorted.push(this.data[1]);
    this.swape(1,this.count);
    this.count--;
    this.siftdownmin(1);
  }
  return sorted;
}
//最小堆可以实时获取最小值
var testheap = new heap([1,87,32,56,23,76,12,49,25,80,4,65]);
console.log('min--',testheap.sort());
// console.log(testheap.printHeap());
var testheap2 = new heap([1,87,32,56,23,76,12,49,25,80,4,65]);
// testheap2.createMaxHeap()
console.log('max--',testheap2.sort2());

function create(arr){
  
}

