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

 //队列
// {
//   data:[],
//   head:0,
//   tail:0
// }
 //栈
//  {
//    data:[],
//    top:0
//  }

//出牌

 //链表-有序的数组中插入一个数