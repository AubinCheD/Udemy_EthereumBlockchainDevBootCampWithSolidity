import web3 from './web3';
const contractAddress = '0x38711059d467a7d840C3eE370FcB06a080D5303C';
const contractAbi = 
[
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
      inputs: [],
      name: 'enter',
      outputs: [],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getNumber',
      outputs: [ { internalType: 'int256', name: '', type: 'int256' } ],
      stateMutability: 'pure',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getPlayers',
      outputs: [ { internalType: 'address[]', name: '', type: 'address[]' } ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'manager',
      outputs: [ { internalType: 'address', name: '', type: 'address' } ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'pickWinner',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'pickWinner_V2',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
      name: 'players',
      outputs: [ { internalType: 'address', name: '', type: 'address' } ],
      stateMutability: 'view',
      type: 'function'
    }
  ];

const lottery = new web3.eth.Contract(contractAbi, contractAddress, { gas: '10000000', dataInputFill: "data" });
export default lottery;

// 0x87FD1AA82495810Ad368B77103A498b1d63fA071