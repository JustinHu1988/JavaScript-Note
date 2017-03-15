/**
 * @param {number} n
 * @return {number[]}
 */
var lexicalOrder = function(n) {
    var count = n;
    var nArr = [];
    var j=0;
    do{
        nArr[j] = count%10;
        count = Math.floor(count/10);
        j++;
    }while(count!==0);

    var numList = [];
    var len = nArr.length;
    var bitbase = 1;
    var diff = 0;
    var topNum = nArr[len-1];
    for(var i=0; i<len;i++){
        if(i<len-1){
            diff += nArr[i]*Math.pow(10,i);
        }

        bitbase*=10;
    }
    var maxNum = Math.floor(bitbase*10/9);
    var minNum = Math.floor(bitbase/9);
    var midNum = diff+1;
    var countNum = 0;
    var finalArr = [];
    for(var ls=0; ls<topNum-1; ls++){
        for(var lt=0; lt<len; lt++){
            countNum=Math.pow(10,lt);
            for(var lu=0;lu<countNum;lu++){
                finalArr.push((ls+1)*Math.pow(10,lt)+lu);
            }
        }
    }
    ls = topNum-1;
    for(lt=0; lt<len-1; lt++){
        countNum=Math.pow(10,lt);
        for(lu=0;lu<countNum;lu++){
            finalArr.push((ls+1)*Math.pow(10,lt)+lu);
        }
    }
    lt=len-1;
    for(lu=0;lu<midNum;lu++){
        finalArr.push((ls+1)*Math.pow(10,lt)+lu);
    }
    for(ls=topNum; ls<9; ls++){
        for(lt=0; lt<len-1; lt++){
            countNum=Math.pow(10,lt);
            for(lu=0;lu<countNum;lu++){
                finalArr.push((ls+1)*Math.pow(10,lt)+lu);
            }
        }
    }
    return finalArr;
};
