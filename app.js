function checkCashRegister(price, cash, cid) {
    //First, create a 'table' object with each possible 'coin' or bill. 
    //The values will be another object with the keys 'value' (the value of the 'coin'), 
    //'cashier' (the amount of cash in drawer of the 'coin') and 'change' (the change that will be paid in that 'coin').

    const table = {
        'ONE HUNDRED': { value: 10000, cashier: 0, change: 0 },
        'TWENTY': { value: 2000, cashier: 0, change: 0 },
        'TEN': { value: 1000, cashier: 0, change: 0 },
        'FIVE': { value: 500, cashier: 0, change: 0 },
        'ONE': { value: 100, cashier: 0, change: 0 },
        'QUARTER': { value: 25, cashier: 0, change: 0 },
        'DIME': { value: 10, cashier: 0, change: 0 },
        'NICKEL': { value: 5, cashier: 0, change: 0 },
        'PENNY': { value: 1, cashier: 0, change: 0 },
    }

    //Calculate the difference between 'cash' and 'price' (multiplying by 100 to avoid the weird fraction calculatio in Javascript)
    let diff = Math.round(cash * 100 - price * 100)

    //Then, iterate through the 'cid' array to get the amount in drawer of each 'coin' and update the 'table' object
    for (let arr of cid) {
        table[arr[0]]['cashier'] += Math.round(arr[1] * 100)
    }

    //Create a variable 'totalChange' which will be used for calculations later. Set it to 0 initally
    let totalChange = 0

    //Then, create an object which will hold the result.
    //By default, the 'result.status' is set to 'INSUFFICIENT_FUNDS' and the 'result.change' to '[]'
    let result = {
        'status': 'INSUFFICIENT_FUNDS',
        'change': []
    }

    //Create a new function 'testFunc'
    function testFunc() {

        //It always starts by setting 'totalChange' to 0
        totalChange = 0

        //Then, iterate through the 'table' object. If the value of the 'coin' is bigger than the current difference ('diff'), that coin is ignored since it would not be able to be used for change.
        //If it is lower or equal to 'diff', sum the amount of the coin (table[coin]['cashier']) to the 'totalChange'
        for (let coin in table) {
            if (table[coin]['value'] <= diff) {
                console.log(table[coin]['cashier'])
                totalChange += table[coin]['cashier']
            }
        }

        //If the 'totalChange' is lower than the 'diff', it means we don`t have sufficient change.
        //It returns the result and ends the function
        if (totalChange < diff) {
            return result
        }

        //Else, 'diff' is higher than 0, it starts making calculations to decide the change, from bigger 'coin's to smaller ones
        else if (diff > 0) {

            //Iterates through each 'coin'. If the value of the 'coin is bigger than the current 'diff' and we still have any amount of that 'coin' in the 'cashier'...
            //...we update 'diff' by subtracting the 'coin' value,...
            //...we update the amount of the 'coin' in the 'cashier' by subtracting the 'coin' value...
            //...we update the amount of the 'coin' in the 'change' by adding the 'coin' value.
            //Then we break this loop and recursevely call the testFunc. 
            //If it got here, it will keep calling itself until it realizes the exact change won`t be possible (totalChange < 0 on the if above)...
            //...or until 'diff' reaches 0, which means the change is possible
            for (let coin in table) {
                if (diff >= table[coin]['value'] && table[coin]['cashier'] > 0) {
                    diff -= table[coin]['value']
                    table[coin]['cashier'] -= table[coin]['value']
                    table[coin]['change'] += table[coin]['value']
                    break
                }

            }
            testFunc();

        }

        //When 'diff' reaches 0, it means the change is possible. Then it will define the 'result' 
        else if (diff == 0) {

            //Create a variable 'leftInCashier' and sets it initially to false.
            //Then iterates through the coins to see if there is any cash left in any drawer. If it finds any amount of any 'coin', it sets 'leftInCashier' to true and breaks this small loop.
            let leftInCashier = false
            for (let coin in table) {
                if (table[coin]['cashier'] > 0) {
                    leftInCashier = true
                    break
                }
            }

            //If 'leftInCashier' is true, change the 'result.status' to OPEN and then iterate through each 'coin'.
            if (leftInCashier == true) {
                result.status = 'OPEN'
                for (let coin in table) {

                    //If the amount of 'change' of this 'coin' is bigger than 0, push an array to 'result.change' where the first elemenet is the name of the 'coin' and the second is the amount of 'change' in this 'coin'
                    if (table[coin]['change'] > 0) {
                        result.change.push([coin, table[coin]['change'] / 100])
                    }
                }

                //Return the 'result' object with the expected outcome, ending the function.
                return result
            }

            //In case there was no cash left in the cashier, set 'result.status' to CLOSED and iterate through each 'coin'
            else {
                result.status = 'CLOSED'
                for (let coin in table) {

                    //Unshift an array to 'result.change' where the first element is the name of the 'coin' and the second element is the amount of 'change' in this coin.
                    //In this case, 'result.change' will include an array for each 'coin', even if the 'change' in this 'coin' is 0.
                    result.change.unshift([coin, table[coin]['change'] / 100])
                }

                //Return the 'result' object with the expected outcome, ending the function.
                return result
            }
        }
    }

    testFunc()


    return result;
}

console.log(checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]))