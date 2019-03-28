//listener
//push,   一直推数据，你talkback结束
function source(type,sink) {
    if(type !== 0) return;
    let i = 1;
    const handle = setInterval(() => {
        sink(1,i++);
    },1000);
    const talkback = (t,d) => {
        t === 2 && clearInterval(handle);
    };
    sink(0,talkback);
}
let timer = null;
function sink(type,data) {
    if(type === 0) {
        const talkback = data;
        timer = setTimeout(() => {
            talkback(2);
        },5000);
    }
    if(type === 1) {
        console.log(data);
    }
    if(type === 2) {
        clearTimeout(timer);
    }
}
source(0,sink);

//puller
//pull--sink主动拉取数据，来拉数据，我给，还是告诉什么时候没数据了
function source_puller(type,sink) {
    if(type !== 0) return;
    let i = 100;
    const talkback = (t,d) => {
        if(t === 1) {
            if(i < 105) {
                sink(1,i++);
            } else{
                //通知 sink没数据了
                sink(2);
            }
        }
    };
    sink(0,talkback);
}
let pullerHandle = null;
function sink_puller(type,data) {
    if(type === 0) {
        const talkback = data;
        pullerHandle = setInterval(() => talkback(1),1000);
    }
    if(type === 1) {
        console.log(data);
    }
    if(type === 2) {
        console.log('pull-end');
        clearInterval(pullerHandle);
    }
}
source_puller(0,sink_puller);

//operators
//源头是push type
const fromEvent = (dom,event) => (type,sink) => {
    if(type !== 0) return;
    const handler = e => sink(1,e);
    dom.addEventListener(event,handler);
    sink(0,(start) => {
        if(start === 2) {
            dom.removeEventListener(event,handler);
        }
    });
};

const filter = condition => inputsource => (type,sink) => {
    if(type !== 0) return;
    let talkback = null;
    //成为上游的消费者
    inputsource(0,(start,data) => {
        if(start === 0) {
            talkback = data;
            //向下游greet
            sink(0,talkback);
        }else if(start === 1) {
            if(condition(data)) {
                //给下游发出数据
                sink(1,data);
            }else{
                //上游如果push模型是不处理type=1，只有puller才会处理type=1
                talkback(1);
            }
        }else{
            //只有上游是puller才会出现这种情形，拉取数据时，才会出现type=2木有了
            sink(start,data);
        }
    });
};

const map = mapFun => inputsource => (type,sink) => {
    if(type !== 0) return;
    // inputsource(0,(start,data) => {
    //     if(start === 0) {
    //         talkback = data;
    //         sink(0,talkback);
    //     }else if(start === 1) {
    //         sink(1,mapFun(data));
    //         // talkback(1)
    //     }else{
    //         sink(start,data);
    //     }
    // });
    inputsource(0,(start,data) => sink(start,start === 1 ? mapFun(data) : data));
};
//消费者
const forEach = operation => (inputsource) => {
    let talkback = null;
    inputsource(0,(type,data) => {
        if(type === 0) talkback = data;
        if(type === 1) operation(data);
        if(type === 0 || type === 1) talkback(1);
    });
};

//puller -- 数据源决定了数据链
const fromIter = iter => (type,sink) => {
    if(type !== 0) return;
    const iterator = typeof Symbol !== 'undefined' && iter[Symbol.iterator] ? iter[Symbol.iterator]() : iter;
    let inloop = false;
    let res;
    const loop = () => {
        inloop = true;
        res = iterator.next();
        if(!res.done) {
            sink(1,res.value);
        }else{
            sink(2);
        }
        inloop = false;
    };
    const talkback = (start) => {
        if(start === 1) {
            if(!inloop && !(res && res.done)) loop();
        }
    };
    sink(0,talkback);
};

const take = max => inputsource => (type,sink) => {
    if(type !== 0) return;
    let token = 0;
    const talkback = (t,d) => {
        if(token < max) sourcetalkback(t,d);
    };
    let sourcetalkback = null;
    inputsource(0,(start,data) => {
        if(start === 0) {
            sourcetalkback = data;
            sink(0,talkback);
        }else if(start === 1) {
            if(token < max) {
                sink(1,data);
                token++;
            }else{
                sink(2);
                sourcetalkback(2);
            }
        }else {
            sink(start,data);
        }
    });
};
// pipe(
//     fromEvent(document, 'click'),
//     filter(ev => ev.target.tagName === 'BUTTON'),
//     map(ev => ({x: ev.clientX, y: ev.clientY})),
//     forEach(coords => console.log(coords))
// );

// fromIter(getRandom()),
//   take(5),
//   forEach(x => console.log(x))
