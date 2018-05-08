/**
 * 异步递归
 * 回调/Promise/Async await
 * 基于分批次一次性加载数据
 */
//异步递归
//模拟多次获取数据--同步
const getSentenceFragment = (offset = 0) => {
  const pagesize = 3;
  const sentence = [...'hello world'];
  return {
    data: sentence.slice(offset,offset + pagesize),
    nextpage: offset + pagesize < sentence.length ? offset + pagesize : void 0
  }
}
function getSentence(offset = 0) {
  const fragment = getSentenceFragment(offset);
  if(fragment.nextpage) {
    return fragment.data.concat(getSentence(fragment.nextpage));
  }else{
    return fragment.data;
  }
}
console.log(getSentence());

//异步
console.log('async');
const getSentenceFragmentAsync = (offset = 0,callback) => {
  const pagesize = 3;
  const sentence = [...'hello world'];
  setTimeout(() => {
    callback({
      data: sentence.slice(offset,offset + pagesize),
      nextpage: offset + pagesize < sentence.length ? offset + pagesize : void 0
    })
  },500);
}
function getSentenceAsync(offset = 0,callback) {
  getSentenceFragmentAsync(offset,fragment => {
    if(fragment.nextpage) {
      getSentenceAsync(fragment.nextpage,nextFragmentData => {
        callback(fragment.data.concat(nextFragmentData));
      })
    }else{
      callback(fragment.data);
    }
  });
}
console.log(getSentenceAsync(0,data => console.log(data)));

const getSentenceFragmentPromise = (offset = 0) => new Promise(resolve => {
  const pagesize = 3;
  const sentence = [...'hello world'];
  setTimeout(() => {
    resolve({
      data: sentence.slice(offset,offset + pagesize),
      nextpage: offset + pagesize < sentence.length ? offset + pagesize : void 0
    })
  },500);
})
function getSentencePromise(offset = 0) {
  return getSentenceFragmentPromise(offset).then(fragment => {
    if(fragment.nextpage) {
      return getSentencePromise(fragment.nextpage).then(nextFragmentData => fragment.data.concat(nextFragmentData));
    }else{
      return fragment.data;
    }
  })
}
getSentencePromise().then(data => console.log('promise:',data));

//async
const getSentenceFragment1 = async (offset = 0) => {
  const pagesize = 3;
  const sentence = [...'hello world'];
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: sentence.slice(offset,offset + pagesize),
        nextpage: offset + pagesize < sentence.length ? offset + pagesize : void 0
      })
    }, 500);
  })
}
async function getSentence1(offset = 0) {
  const fragment = await getSentenceFragment1(offset);
  if(fragment.nextpage) {
    return fragment.data.concat(await getSentence1(fragment.nextpage));
  }else{
    return fragment.data;
  }
}
getSentence1().then(data => console.log("11",data));

//async/await
//promise + yield(co自执行)