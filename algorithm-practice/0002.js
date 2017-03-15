var lexicalOrder = function(n) {
    var count = n;
    var nArr = [];
    var j=0;
    do{
        nArr[j] = count%10;
        count = Math.floor(count/10);
        j++;
    }while(count!==0);

    var len = nArr.length;
    var bitbase = 0.1;
    var diff = 0;
    var topNum = nArr[len-1];
    for(var i=0; i<len;i++){
        if(i<len-1){
            diff += nArr[i]*Math.pow(10,i);
        }
        bitbase*=10;
    }
    var maxNum = bitbase;
    var minNum = bitbase/10;
    var midNum = diff+1;
    var countNum = 0;
    var temNum = 0;
    var finalArr = [];
    var ls,lt;
    var temArr = [];
    function countMet(){
        temNum=countNum;
        if(temNum % 10 === 0){
            temArr = [];
            while(temNum % 10 === 0){
                temNum = temNum/10;
                temArr.push(temNum);
            }
            for(lt = 0; lt<temArr.length; lt++){
                finalArr.push(temArr[temArr.length-lt-1]);
            }
        }
        finalArr.push(countNum);
        countNum++;
    }
    for(var lr=1; lr<10; lr++){
        if(lr<topNum){
            countNum = lr*bitbase;
            for(ls=0;ls<maxNum;ls++){
                countMet();
            }
        }else if(lr===topNum){
            for(ls=0;ls<midNum;ls++){
                countMet();
            }
            countNum = Math.floor((countNum-1)/10)+1;
            var leftNum = minNum-Math.floor(midNum/10)-1;
            for(ls=0;ls<leftNum;ls++){
                countMet();
            }
        }else{
            countNum = lr*bitbase/10;
            for(ls=0;ls<minNum;ls++){
                countMet();
            }
        }
    }
    return finalArr;
};

lexicalOrder(9742);
