import web3 from './web3';
const contractAddress = '0x51538cDf072AcdeFAeFc424b6d9199971Cb38F6a';
const contractAbi = 
[
  {
    inputs: [ { internalType: 'string', name: 'initMessage', type: 'string' } ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'message',
    outputs: [ { internalType: 'string', name: '', type: 'string' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'string', name: 'newMessage', type: 'string' } ],
    name: 'setMessage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'test',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'payable',
    type: 'function'
  }
];

const inbox = new web3.eth.Contract(contractAbi, contractAddress, { gas: '10000000', dataInputFill: "data" });
export default inbox;