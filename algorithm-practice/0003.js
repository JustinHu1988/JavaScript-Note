var lexicalOrder = function(n) {
    let count = n;
    let nArr = [];
    let j=0;
    do{
        nArr[j] = count%10;
        count = Math.floor(count/10);
        j++;
    }while(count!==0);
    const len = nArr.length;
    const bitbase =Math.pow(10,len-1);
    const midNum = Math.floor(n/10)+1;
    let countNum = bitbase;
    let finalArr = [];
    let tempN =n;

    function addArray(){
        let temNum=countNum;
        if(temNum % 10 === 0){
            let temArr = [];
            while(temNum % 10 === 0){
                temNum = temNum/10;
                temArr.push(temNum);
            }
            for(let lt = 0; lt<temArr.length; lt++){
                finalArr.push(temArr[temArr.length-lt-1]);
            }
        }
        finalArr.push(countNum);
        countNum++;
        if(countNum<tempN+1){
            return addArray();
        }else if(countNum===n+1){
            if(bitbase % 10 === 0){
                countNum = midNum;
                tempN = bitbase-1;
                return addArray();
            }else{
                return;
            }
        }
        return;
    }

    addArray();
    return finalArr;
};
