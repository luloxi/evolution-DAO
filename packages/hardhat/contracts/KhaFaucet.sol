// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KhaFaucet is Ownable {
    IERC20 private khaToken;

    function setTokenAddress(address _khaTokenAddress) public /* onlyOwner */ {
        khaToken = IERC20(_khaTokenAddress);
    }

    function requestTokens(uint256 _amount) public {
        require(address(khaToken) != address(0), "Token address not set");
        khaToken.transfer(msg.sender, _amount);
    }

    function withdrawTokens(uint256 _amount) public onlyOwner {
        require(address(khaToken) != address(0), "Token address not set");
        khaToken.transfer(owner(), _amount);
    }

    function balanceOf() public view returns (uint256) {
        require(address(khaToken) != address(0), "Token address not set");
        return khaToken.balanceOf(address(this));
    }

    function getTokenAddress() public view returns (address) {
        return address(khaToken);
    }
}
