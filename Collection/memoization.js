//缓存记忆函数
//自记忆函数
function getElements(id){
    if(!getElements.cache) getElements.cache = {};
    return getElements.cache[id] = getElements.cache[id] || document.getElementById(id);
}


function isPrime(value) {
  if (!isPrime.answers) isPrime.answers = {};                  
  if (isPrime.answers[value] != null) {                        
    return isPrime.answers[value];                             
  }                                                            
  var prime = value != 1; // 1永远都不会是素数
  for (var i = 2; i < value; i++) {
    if (value % i == 0) {
      prime = false;
      break;
    }
  }
  return isPrime.answers[value] = prime;                       
}
