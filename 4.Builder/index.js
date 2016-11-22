//建造者模式

//更加关心的是创建对象的整个过程，甚至于创建对象的每一个细节。

//创建一个人类
var Human = function(param){
    this.skill = param && param.skill || "保密";
    this.hobby = param && param.hobby || "保密";
} 

Human.prototype = {
    getSkill:function(){
        return this.skill;
    },
    getHobby:function(){
        return this.hobby;
    }
}

//姓名类
var Named = function(name){
    var that = this;
    (function(name,that){
        that.wholeName = name;
        if(name.indexOf(' ') > -1){
            that.FirstName = name.slice(0,name.indexOf(' '));
            that.secondName = name.slice(name.indexOf(' '));
        }
    })(name,that);
}

//职位类
var Work = function(work){
    var that = this;
    (function(work,that){
        switch(work){
            case 'code':
                that.work = "工程师";
                that.workDescript = "每天沉醉于编程";
                break;
            case 'UI':
            case 'UE':
                that.work = "设计师";
                that.workDescript = "设计是一种艺术";
                break;
        }
    })(work,that);
}
Work.prototype.changeWork = function(work){
    this.work = work;
}
Work.prototype.changeDescript = function(desc){
    this.workDescript = desc;
}

//应聘者 建造者
var Person = function(name,work){
    var _person = new Human();
    _person.name = new Named(name);
    _person.work = new Work(work);
    return _person;
}

var person = new Person("xiao ming",'code');
console.log(person.skill);
console.log(person.name.secondName);
console.log(person.work.workDescript);


//建造者模式不仅仅得到创建的结果，然而也参与了创建的具体过程，对象创建的具体实现的细节也参与了干涉。可以说这种模式创建的对象是一个复合对象