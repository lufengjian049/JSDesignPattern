function Coder(){
    var that = this;
    return {
        get name(){
            if(that.name){
                return that.name;
            }
            return 'has no name';
        },
        set name(val){
            that.name = val;
        }
    }
}
var c = new Coder();
console.log(c.name);
c.name = "test";
console.log(c.name);

//method 2
var Coder2 = function(){}
Coder2.prototype.__defineGetter__('name2',function(){
    if(this.name2){
        return this.name2;
    }
    return 'has no name';
});
Coder2.prototype.__defineSetter__('name2',function(val){
    this.name2 = val;
})
var c2 = new Coder2();
console.log(c2.name2);
c2.name = "test";
console.log(c2.name2);

//可以在set中监听属性值得变化，变成了一个监听器

