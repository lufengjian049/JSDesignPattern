// 模板方法模块
//父类中定义一组操作算法的骨架，而将一些实现步骤延迟到子类中

//创建基本提示框
var Alert = function(data){
    if(!data)
        return;
    this.content = data.content;
    this.panel = document.createElement("div");
    this.contentNode = document.createElement("p");
    this.confirmBtn = document.createElement("span");
    this.closeBtn = document.createElement("b");

    this.panel.className = "alert";
    this.closeBtn.className = "a-close";
    this.confirmBtn.className = "a-confirm";
    this.confirmBtn.innerHTML = data.confirm || "确认";
    this.contentNode.innerHTML = this.content;
    
    this.success = data.success || function(){};
    this.fail = data.fail || function(){};
}
//模板的原型方法
Alert.prototype = {
    init:function(){
        this.panel.appendChild(this.closeBtn);
        this.panel.appendChild(this.contentNode);
        this.panel.appendChild(this.confirmBtn);

        document.body.appendChild(this.panel);

        this.bindEvent();

        this.show();
    },
    bindEvent:function(){
        var _this = this;
        this.closeBtn.onclick = function(){
            _this.fail();
            _this.hide();
        }
        this.confirmBtn.onclick = function(){
            _this.success();
            _this.hide();
        }
    },
    hide:function(){
        this.panel.style.display = "none";
    },
    show:function(){
        this.panel.style.display = "block";
    }
}

//根据模板类，去创建不同类型的实现类

//右侧按钮提示框
var RightAlert = function(data){
    Alert.call(this,data);
    this.confirmBtn.className = this.confirmBtn.className + " right";
}
RightAlert.prototype = new Alert();

//标题提示框
var TitleAlert = function(data){
    Alert.call(this,data);
    this.title = data.title;
    this.titleNode = document.createElement("h3");
    this.titleNode.innerHTML = this.title;
}
TitleAlert.prototype = new Alert();
TitleAlert.prototype.init = function(){
    this.panel.insertBefore(this.titleNode,this.panel.firstChild);
    Alert.prototype.init.call(this);
}

new TitleAlert({
    title:"",
    content:"",
    success:function(){

    },
    fail:function(){

    }
}).init();

//模板方法的核心在于对方法的重用，将核心方法封装在基类中，让子类继承基类的方法，实现基类方法的共享，达到方法共用。