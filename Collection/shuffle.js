//

// method 1
function shuffle(arr){
	var rearr=[];

	while(arr.length){
		var ran = ~~(Math.random() * arr.length);
		rearr.push(arr[ran]);
		arr.splice(ran,1);
	}

	return rearr;
}

//method 2
function shuffle(arr){
	return arr.concat().sort(function(){
		return Math.random - 0.5
	})
}
//method 3  Fisher–Yates Shuffle
function shuffle(arr){
	var len = arr.length;
	var shuffle = Array(len);

	for(var index=0,rand;index<len;index++){
		rand = ~~(Math.random() * (index+1));
		if(rand !== index){
			shuffle[index] = shuffle[rand];
		}
		shuffle[rand] = arr[index];
	}

	return shuffle;
}


