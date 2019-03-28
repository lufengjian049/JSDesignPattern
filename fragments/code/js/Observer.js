var publisher = {
	subscribers:{
		any:[]
	},
	subscribe:function(fn,type){
		type = type || "any" ;
		if(typeof this.subscribers[type]  === "undefined"){
			this.subscribers[type] = [];
		}
		this.subscribers[type].push(fn);
	},
    unsubscribe:function(fn,type){
        this.visitSubscribes("unsubscribe",fn,type);
    },
    publish:function(publishaction,type){
        this.visitSubscribes("publish",publishaction,type);
    },
    visitSubscribes:function(action,args,type){
        var pubtype = type || "any",
            subscribers = this.subscribers[pubtype],
            i,
            max = subscribers.length;
        for(i ; i < max ;i++){
            if(action == "publish"){
                subscribers[i](args);
            }else{
                if(subscribers[i] === args){
                    subscribers.splice(i,1);
                }
            }
        }
    }
}
function makePublisher(o){
    var i;
    for(i in publisher){
        if(publisher.hasOwnProperty(i) && typeof publisher[i] === "function"){
            o[i]=publisher[i];
        }
    }
    o.subscribers={any:[]};
}
var pager={
    daily:function(){
        this.publish("news");
    },
    monthly:function(){

    }
}
makePublisher(pager);

var joe={
    drink:function(page){

    }
}

pager.subscribe(joe.drink);

pager.daily();
