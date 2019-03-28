function unique(arr){
	var res = [];
	for(var i=0;i<arr.length;i++){
		var curitem = arr[i];

		for(var j=0;j<res.length;j++){
			if(res[j] === curitem){
				break;
			}
		}

		if(j === res.length)
			res.push(curitem)
	}

	return res;
}

function unique2(arr){
	var res = [];
	for(var i=0;i<arr.length;i++){
		var curitem = arr[i];

		(res.indexOf(curitem) == -1) && res.push(curitem);
	}
	return res;
}

function unique3(arr){
	var res = arr.filter(function(value,index,array){
		console.log(array);
		return array.indexOf(value) === index;
	})
	return res;
}