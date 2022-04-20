//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';


contract Ticket is Ownable, ReentrancyGuard{
  IERC20 public labInstance;
  address public fundReceiver;
  uint public labFee;


  constructor(){
  }

  // Transfer All LAB to fundReceiver Adddress
  function withdrawAll() external onlyOwner nonReentrant {
      uint ownerBalance = labInstance.balanceOf(address(this));
      labInstance.transfer(fundReceiver, ownerBalance);
  }

  // get Contract LAB Balance
  function getContractBalance() external view returns(uint){
    return labInstance.balanceOf(address(this));
  }

  // make a LAB payment function
  function transferLabFee() external {
    require(labInstance.balanceOf(msg.sender) > labFee, "Ticket: Insufficient LAB Balance!");
    labInstance.transferFrom(msg.sender, address(this), labFee);
  }


  // update value functions
  function changeLabFee(uint _labFee) external onlyOwner {
    labFee = _labFee;
  }
  // update value functions
  function changeFundReceiverWallet(address newOwner) external onlyOwner{
    fundReceiver = newOwner;
  }
  // update value functions
  function changeTokenInstance(IERC20 _labInstance) external onlyOwner{
    labInstance = _labInstance;
  }
}
