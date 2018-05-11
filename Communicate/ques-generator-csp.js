//csp 通信顺序进程
//csp 将事件循环的消息队列转化为数据队列，并把这个队列叫channel
//而任务 则 等待channel中的数据
//将任务 和 异步数据从回调地狱中分离出来
//go block 状态机
function go_(machine,step){
	while(!step.done){
		var arr = step.value(),//yield function
			state = arr[0],
			value = arr[1];
		switch(state){
			case 'park':
				setTimeout(function(){go_(machine,step)},0);  //在于park 会一直去检查channel的状态，并切换channel状态
				return;
			case 'timeout':
				setTimeout(function(){go_(machine,machine.next())},value);
				return;
			case 'continue':
				step = machine.next(value);
				break;
			
		}
	}
}
function go(machine){
	var gen = machine();
	go_(gen,gen.next());
}

//timeout channel
function timeout(interval){
	var channel = [interval];
	channel.name = 'timeout';
	return channel;
}

//take  channel中没数据，park
function take(channel){
	return function(){
		if(channel.name == "timeout"){
			// console.log("timeout ",channel.pop());
			return ['timeout',channel.pop()];
		}else if(channel.length  == 0){
			return ['park',null];
		}else{
			return ["continue",channel.pop()];
		}
	}
}

//put
function put(channel,val){
	return function(){
		if(channel.length == 0){
			channel.unshift(val);
			return ["continue",null];
		}else{
			return ["park",null];
		}
	}
}
//channel
var work = [],text=[];

function boss_yelling(){
	go(function* (){
		for(var i=0;i<5;i++){
			yield take(timeout(1000));
			yield put(work,"boss say:work " + i);
		}
	})
}

function wife_texting(){
	go(function* (){
		for(var i=0;i<5;i++){
			yield take(timeout(4000));
			yield put(text,"wife say:come home");
		}
	})
}

function working(){
	go(function* (){
		for(var i=0;i<10;i++){
			console.log("working--"+i)
			var task = yield take(work);
			console.log(task,"me working",new Date() * 1);
		}
	})
}

function texting(){
	go(function* (){
		for(var i=0;i<10;i++){
			var read = yield take(text);
			console.log(read,"me ignore");
		}
	})
}

boss_yelling();
wife_texting();
working();
texting();