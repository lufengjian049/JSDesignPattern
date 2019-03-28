//简单的任务调度
//lufj@ctrip.com
const queue = [];
let semaphore = 0;
function exec(task) {
    try{
        suspend();
        task();
    }finally {
        release();
    }
}
export function asap(task) {
    queue.push(task);
    if(!semaphore) {
        suspend();
        flush();
    }
}
export function suspend() {
    semaphore++;
}
function release() {
    semaphore--;
}
export function flush() {
    release();
    let task;
    while(!semaphore && (task = queue.shift())) {
        exec(task);
    }
}
