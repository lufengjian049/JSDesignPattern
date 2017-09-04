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
 //冒泡排序
 //快速排序