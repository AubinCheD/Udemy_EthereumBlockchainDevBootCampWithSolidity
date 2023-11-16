// compile code will go here
const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const lotterySource = fs.readFileSync(lotteryPath, 'utf8')

const input = 
{
    language: 'Solidity',
    sources: 
    {
        'Lottery.sol': { content: lotterySource }
    },
    settings:
    {
        outputSelection:
        {
            '*':
            {
                '*': ['*']
            }
        }
    }
};

//console.log(solc.compile(lotterySource, 1));
console.log(JSON.parse(solc.compile(JSON.stringify(input))));
//console.log(input);
//module.exports = solc.compile(source, 1).contracts[':Lottery']; //old version (<0.8.9)
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Lottery.sol'].Lottery; //new version