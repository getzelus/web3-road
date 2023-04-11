//SPDX-License-Identifier: Unlicense

// contracts/BuyMeACoffee.sol
pragma solidity ^0.8.0;

// Switch this to your own contract address once deployed, for bookkeeping!
// Example Contract Address on Goerli: 0xDBa03676a2fBb6711CB652beF5B7416A53c1421D

contract Tip {
    // Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message,
        uint amount
    );

    event UnknownPay(
        address from,
        uint amount
    );
    
    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
        uint amount;
    }
    
    // Address of contract deployer. Marked payable so that
    // we can withdraw to this address later.
    address payable owner;

    // List of all memos received from coffee purchases.
    Memo[] memos;

    constructor() {
        // Store the address of the deployer as a payable address.
        // When we withdraw funds, we'll withdraw here.
        owner = payable(msg.sender);
    }

    /**
     * @dev fetches all stored memos
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
     * @dev buy a coffee for owner (sends an ETH tip and leaves a memo)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        // Must accept more than 0 ETH for a coffee.
        require(msg.value > 0, "can't buy coffee for free!");

        // Add the memo to storage!
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message,
            msg.value
        ));

        // Emit a NewMemo event with details about the memo.
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message,
            msg.value
        );
    }

     function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() public {
       // require(owner.send(address(this).balance));
        require(msg.sender == owner, "Not owner");
        require(getBalance() > 0, "No ether");
        (bool sent, ) = owner.call{value: getBalance()}("");
        require(sent, "Failed to send Ether");
    }

        // Function to receive Ether. msg.data must be empty
    receive() external payable {
        emit UnknownPay(msg.sender, msg.value);
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}