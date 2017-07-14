//string to number
var numberstr = '123';
console.log('string to number,Number',Number(numberstr)) //123
console.log('string to number,parseInt',parseInt(numberstr,10)) //123
console.log('string to number, + 一元运算符',+numberstr) //123
console.log('string to number, - ',-numberstr) //-123
console.log('string to number, - - ',- -numberstr) //取反 123
//object
var numberobj = {
  a:'42',
  toString:function(){
    // console.log(this)
    return this.a
  },
  valueOf:function(){
    return this.a + '1'
  }
}
console.log('object to number,Number',Number(numberobj)) // 421
console.log('object to number,parseInt',parseInt(numberobj,10)) //42
console.log('object to number,+',+numberobj) // 421
//array
var numberarr = [1,2,3]
console.log('array to number,Number',Number(numberarr)) //NaN
console.log('array to number,parseInt',parseInt(numberarr,10)) // 1
console.log('array to number,+',+numberarr) //NaN
//bollean
var numberbool = true
console.log('boolean to number,Number',Number(numberbool)) // 1
console.log('boolean to number,parseInt',parseInt(numberbool,10)) // NaN
console.log('boolean to number,+',+numberbool) // 1
console.log('boolean to number,-',-numberbool) // -1
//undefined
var numberundefined = undefined
console.log('undefined to number,Number',Number(numberundefined)) //NaN
console.log('undefined to number,parseInt',parseInt(numberundefined,10)) //NaN
console.log('undefined to number,+',+numberundefined) //NaN
//null
var numbernull = null
console.log('null to number,Number',Number(numbernull)) //0 
console.log('null to number,parseInt',parseInt(numbernull,10)) //NaN
console.log('null to number,+',+numbernull) //0



var ary = ['1','2']

ary = ary.map((item) => {
  return Number(item)
})
ary = ary.map(Number)
console.log(ary)

//D:/d/workbench/f2ehint-hook
//D:/workbench/f2ehint-hook

 var regexp = /([A-Z]:\/)[a-z]\//; 
 var path = 'D:/d/workbench/f2ehint-hook';
 path = path.replace(regexp, '$1');
 console.log(path);

 //String.match String.replace ...etc
