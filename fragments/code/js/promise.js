//promise

// promise.then(
//     onFulfilled ? Function,
//     onRejected ? Function
// ) => promise

// .then() 必须返回一个新的 promise:promise2。
// 如果 onFulfilled() 或 onRejected() 返回一个值 x，并且 x 是个 promise，那么 promise2 的状态和值就会与 x 相同。否则，promise2 会成为已完成状态，值是 x。
// 如果 onFulfilled 或 onRejected 抛出一个异常 e，promise2 会被拒绝，原因是 e。
// 如果 onFulfilled 不是函数，且 promise1 已完成，那么 promise2 必须是已完成，值和 promise1 的相同。
// 如果 onRejected 不是函数，且 promise1 已拒绝，那么 promise2 必须是已拒绝，原因和 promise1 的相同

const wait = timer => new Promise(res => setTimeout(res,timer))

wait(1000)
    .then(() => new Promise(res => res('FOO')))
    .then(a => a)
    //console FOO
    .then(b => console.log(b))
    .then(() => null)
    //console null
    .then(c => console.log(c))
    .then(() => {throw new Error('error message')})
    //此处的error，只会在下面的onRejected函数中进行处理
    .then(d => console.log(`d:${d}`),
            e => console.log(`e----${e}`))
    //console f:undefined
    .then(f => console.log(`f:${f}`))
    //pass
    .catch(ee => console.log(`ee:${ee}`))
    .then(() => {throw new Error('new error')})
    .then(g => console.log(g))
    //console error
    .catch(h => console.log(`h---${h}`))
    //不推荐用这种模式去处理error，如下，如果下面没有catch，那么success里面的error就无法捕捉到。。。
    .then(() => {
        throw new Error("被吞掉的error")
    },(qq) => {
        console.log(qq)
    })

//then 返回的都是一个新的promise
//强制：promise链的最后 都用catch 去捕获未知的错误

//取消promise ： 拒绝这个promise，并用canelled作为原因

const waitCanCancel = (time, cancel = Promise.reject()) => new Promise((resolve,reject) => {
    const timer = setTimeout(resolve,time);

    cancel.then(()=>{
        clearTimeout(timer);
        reject(new Error('cancelled'))
    },()=>{})

})

const shouldCancel = Promise.resolve();
waitCanCancel(1000,shouldCancel).then(
    () => console.log('ok'),
    e => console.log(e)
)

//进一步抽象

const promiseSolutionOld = (fn , cancel = Promise.reject()) => new Promise((resolve,reject) => {
    const noop = () => {}

    const onCancel = 
        (handleCancel) => cancel.then(handleCancel,noop)
                            .catch(e => reject(e))

    fn(resolve,reject,onCancel);
})
//边缘情况，对于已经取消或者已经解决的promise，取消时，handleCancel还是会调用

const promiseSolution = (fn, cancel = Promise.reject()) => new Promise((_resolve,_reject) => {
    let isSettled = false;
    const resolve = (input) => {
        isSettled = true;
        _resolve(input);
    }
    const reject = (input) => {
        isSettled = true;
        _reject(input);
    }
    const noop = () => {}
    const onCancel = (handleCancel,cancelmsg) => {
        const mappedHandleCancel = () => {
            !isSettled && handleCancel();
            reject(new Error(cancelmsg || 'cancelled'));
        }
        cancel.then(
            mappedHandleCancel,
            noop
        ).catch(
            e => reject(e)
        )
    }
    fn(resolve,reject,onCancel);
})

const waitSec = (wait,cancel = Promise.reject()) => promiseSolution((resolve,reject,onCancel) =>{
    const timer = setTimeout(resolve,wait);
    onCancel(() =>{
        clearTimeout(timer);
    },cancelmsg)
},cancel);
//cancelled
waitSec(1000,waitSec(300)).then(
    () => console.log('ok'),
    e => console.log(e)
)
//ok
waitSec(100,waitSec(300)).then(
    () => console.log('ok'),
    e => console.log(e)
)

//Promise.resolve() 返回一个已经解决的Promise

//redux-saga

//mobx crud && redux crud https://github.com/sitepoint-editors/mobx-crud-example

//eslint 实践 https://juejin.im/post/5934ff6d2f301e005861422f

//my mvvm https://git.oschina.net/qiangdada_129/overwrite/tree/master/my-mvvm?dir=1&filepath=my-mvvm&oid=e7f9c998efcf7d13677e414f836bada3f3ed6c3e&sha=20d8bda8ccd919ae9847658aee9034daae506363







