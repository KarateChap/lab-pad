//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is ERC20{
  constructor() ERC20("TOKEN", "TKN"){
    _mint(msg.sender, 1000000000);
  }

  function decimals() public view virtual override returns (uint8){
    return 0;
  }
}
