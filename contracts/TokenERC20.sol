// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ITokenERC20 {
    function mint(address to, uint256 amount) external;

    function symbol() external;

    function burn(address owner, uint256 amount) external;
}

contract TokenERC20 is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("TokenERC20", "TKN") {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}
