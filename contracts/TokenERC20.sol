// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TokenERC20 is ERC20, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    address public admin;
    uint256 private _decimals = 2;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function updateAdmin(address newAdmin) external onlyRole(ADMIN_ROLE) {
        admin = newAdmin;
    }

    function mint(address to, uint256 amount)
        external
        onlyonlyRole(ADMIN_ROLE)
    {
        _mint(to, amount);
    }

    function burn(address account, uint256 amount)
        external
        onlyRole(ADMIN_ROLE)
    {
        _burn(account, amount);
    }
}
