// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Game is ERC1155, Ownable, ReentrancyGuard {
    error Invalid_Platform_Or_Brand();
    error Not_Enough_ETH();

    event newTokensIssued(address indexed user, uint256 indexed amount);
    event tokensAllocated(
        address indexed from,
        address indexed to,
        uint256 indexed amount
    );

    uint8 public SP; // default value set to 0 (That's the Supercoin id)
    string public name;
    string public symbol;
    uint256 public joiningAmount;
    uint256 public tokenValue;
    mapping(address => bool) isPlatformOrBrand;
    uint256 private decimals = 1e18;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _tokenURI,
        uint256 _joiningAmount,
        uint256 _tokenValue
    ) ERC1155(_tokenURI) {
        name = _name;
        symbol = _symbol;
        joiningAmount = _joiningAmount * decimals;
        tokenValue = _tokenValue;
    }

    function issueTokens(address _user, uint256 _amount) external onlyOwner {
        _mint(_user, SP, _amount, "");
        emit newTokensIssued(_user, _amount);
    }

    function itemBought(address _user, uint256 _amount) external onlyOwner {
        _burn(_user, SP, _amount);
    }

    function onboardAndAllocate(address _platformOrBrand) external onlyOwner {
        uint256 _joiningAmount = joiningAmount;
        isPlatformOrBrand[_platformOrBrand] = true;
        _mint(_platformOrBrand, SP, _joiningAmount, "");
    }

    function buyTokens() external payable nonReentrant returns (uint256) {
        if (msg.value <= 0) {
            revert Not_Enough_ETH();
        }
        if (!checkPlatformOrBrand()) {
            revert Invalid_Platform_Or_Brand();
        }

        uint256 tokenAmount = msg.value * tokenValue;
        _mint(msg.sender, SP, tokenAmount, "");
        return tokenAmount;
    }

    function allocateTokens(
        address _from,
        address _to,
        uint256 _amount
    ) external onlyOwner {
        safeTransferFrom(_from, _to, SP, _amount, "");
        emit tokensAllocated(_from, _to, _amount);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) public {
        _mintBatch(to, ids, values, data);
    }

    // Function to set the token value
    // @param _newTokenValue The new token value to be set.
    function setTokenValue(uint256 _newTokenValue) external onlyOwner {
        tokenValue = _newTokenValue;
    }

    // Function to set the joining amount
    // @param _newJoiningAmount The new joining amount to be set.
    function setJoiningAmount(uint256 _newJoiningAmount) external onlyOwner {
        joiningAmount = _newJoiningAmount;
    }

    // Function to get the joining amount
    // @return The current joining amount.
    function getJoiningAmount() external view returns (uint256) {
        return joiningAmount;
    }

    // Function to get the token value
    // @return The current token value.
    function getTokenValue() external view returns (uint256) {
        return tokenValue;
    }

    // Function to check if msg.sender is platform or not
    // @return True if msg.sender is platform otherwise false.
    function checkPlatformOrBrand() public view returns (bool) {
        return isPlatformOrBrand[msg.sender];
    }
}
