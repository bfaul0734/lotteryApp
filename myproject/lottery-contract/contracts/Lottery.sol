// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract lottery {
  uint value = 0;
  address public manager;
  address[] public players;
  mapping(address => bool) public hasEntered; // Mapping to track whether a player has entered

modifier onlyManager(){
        require(msg.sender == manager); // Require manager
        _;
    }

constructor(){
        manager = msg.sender; // Initialize manager
    }

  function getPrizePool() public view returns (uint) {
        return address(this).balance; // Returns prize pool
    }

  function getNumPlayers() public view returns (uint) {
        return players.length; // Returns # of players
    }
    
function getPlayerAddresses() public view returns (address[] memory) {
    return players; // Player addresses
}
  
function getManager() public view returns (address) {
        return manager; // Manager address
    }

  function enter() public payable {
        require(msg.value >= 1, "You must send some Ether to enter the lottery."); // Enter contract, however need ETH, updates players
        require(!hasEntered[msg.sender], "You have already entered the lottery."); // Check if player has already entered

        players.push(msg.sender);
        hasEntered[msg.sender] = true; // Mark the player as entered
    }

    // Randomly pick a winner
    function pickWinner() public payable onlyManager {
        require(players.length > 0, "No participants to pick a winner.");

        // Generate random index based on block information
        uint index = random() % players.length;
        
        address winner = players[index];
        // Transfer prize pool to the winner
        (bool success, ) = winner.call{value: address(this).balance}("");
        require(success);
        

        for (uint i = 0; i < players.length; i++) {
        hasEntered[players[i]] = false;
    }
    delete players;
}

// Generate a pseudo-random number
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.number, block.timestamp, players)));
    }

}