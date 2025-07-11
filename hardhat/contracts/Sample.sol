
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.20 <0.9.0;

/**
 * @title SampleTracker
 * @dev Store one int256 number & log its tx history
 */
contract SampleTracker {

    int256 public currentNumber;

    // Event to monitor number updates
    event NumberUpdated( uint timestamp, address signer, int256 newNumber );

    /**
     * @dev Set contract deployer
     */
    constructor() {
        uint timestamp = block.timestamp;
        address signer = msg.sender;
        currentNumber  = 0;
        // Emit NumberUpdated() event
        emit NumberUpdated( timestamp, signer, currentNumber );
    }

    /**
     * @dev Say hello
     * @return string memory "Hello, from Besu private net!"
     */
    function greeting() public pure returns ( string memory ) {
        return "Hello, from Besu private net!";
    }

    /**
     * @dev Update number
     * @param newNumber int256 newly updated number
     */
    function updateNumber( int256 newNumber ) public {
        uint timestamp = block.timestamp;
        address signer = msg.sender;
        currentNumber  = newNumber;
        // Emit NumberUpdated() event
        emit NumberUpdated( timestamp, signer, currentNumber );
    }

    /**
     * @dev Get current number
     * @return int256 current number
     */
    function getCurrentNumber() public view returns ( int256 ) {
        return currentNumber;
    }
}
