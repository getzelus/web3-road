//SPDX-License-Identifier: Unlicense

// contracts/BuyMeACoffee.sol
pragma solidity ^0.8.0;

// Switch this to your own contract address once deployed, for bookkeeping!
// Example Contract Address on Goerli: 0xDBa03676a2fBb6711CB652beF5B7416A53c1421D

contract Tipo {
    // Event to emit when a Memo is created.
       // Memo struct.
    struct Memo {
        string str;
        uint256 num;
    }

    event NewMemo(
        Memo memo
    );

    constructor() {
      
    }
    
     function callEvent() public  {
        Memo memory memo = Memo( "hi", 2);
        emit NewMemo(memo);
    }


 
}