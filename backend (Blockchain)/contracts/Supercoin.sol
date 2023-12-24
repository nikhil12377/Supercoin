// SPDX-License-Identifier: MIT
// @title Supercoin: A blockchain-based Loyalty and Rewards Program using fungible tokens
// @notice This contract implements a loyalty program where users can earn and redeem fungible tokens.
// @param _name The name of the ERC20 token.
// @param _symbol The symbol of the ERC20 token.
// @param _initialValue The initial value of each token.
// @param _joiningAmount The joining amount required to participate in the program.
// @param _initialSupply The initial supply of tokens.

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Supercoin is ERC20, Ownable {
    using SafeMath for uint256;

    // Custom error messages
    // @dev Error messages for various invalid conditions
    error Invalid_Address();
    error Insufficient_Balance();
    error Invalid_Platform_Or_Brand();
    error Amount_Should_Be_Greater_Than_Zero();
    error Not_Enough_ETH();

    // Events
    // @dev These events are triggered to log specific actions on the blockchain.
    event newTokensIssued(address indexed user, uint256 indexed amount);
    event tokensAllocated(
        address indexed from,
        address indexed to,
        uint256 indexed amount
    );

    // State variables
    uint256 public joiningAmount;
    uint256 public tokenValue;
    uint256 _decimals = 10 ** decimals();
    mapping(address => bool) isPlatformOrBrand;

    // Constructor
    // @param _name The name of the ERC20 token.
    // @param _symbol The symbol of the ERC20 token.
    // @param _initialValue The initial value of each token.
    // @param _joiningAmount The joining amount required to participate in the program.
    // @param _intialSupply The initial supply of tokens.
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialValue,
        uint256 _joiningAmount,
        uint256 _intialSupply
    ) ERC20(_name, _symbol) {
        tokenValue = _initialValue;
        joiningAmount = _joiningAmount.mul(_decimals);
        _mint(msg.sender, _intialSupply.mul(_decimals));
    }

    // Function to issue tokens to a user
    // @param _user The address of the user to whom tokens will be issued.
    // @param _amount The amount of tokens to be issued.
    function issueTokens(
        address _user,
        uint256 _amount
    ) external onlyOwner onlyValidAddress(_user) onlyValidAmount(_amount) {
        _mint(_user, _amount.mul(_decimals));
        emit newTokensIssued(_user, _amount);
    }

    // Function for a user to buy an item
    // @param _user The address of the user who bought the item.
    // @param _amount The amount of tokens to be burned for the item.
    function itemBought(
        address _user,
        uint256 _amount
    )
        external
        onlyOwner
        onlyValidAmount(_amount)
        onlyValidBalance(_user, _amount)
    {
        _burn(_user, _amount.mul(_decimals));
    }

    // Function for onboarding a platform or brand and allocating tokens
    // @param _platformOrBrand The address of the platform or brand to be onboarded.
    function onboardAndAllocate(
        address _platformOrBrand
    ) external onlyOwner onlyValidAddress(_platformOrBrand) {
        uint256 _joiningAmount = joiningAmount;
        isPlatformOrBrand[_platformOrBrand] = true;
        _mint(_platformOrBrand, _joiningAmount);
    }

    // Function for users to buy tokens with ETH
    // @return The amount of tokens bought.
    function buyTokens() external payable returns (uint256) {
        if (msg.value <= 0) {
            revert Not_Enough_ETH();
        }
        if (!checkPlatformOrBrand()) {
            revert Invalid_Platform_Or_Brand();
        }

        uint256 tokenAmount = SafeMath.mul(msg.value, tokenValue);
        _mint(msg.sender, tokenAmount);
        return tokenAmount;
    }

    // Function to allocate tokens from a user to user
    // @param _from The address of the user allocating tokens.
    // @param _to The address of the user receiving tokens.
    // @param _amount The amount of tokens to be allocated.
    function allocateTokens(
        address _from,
        address _to,
        uint256 _amount
    )
        external
        onlyOwner
        onlyValidAddress(_from)
        onlyValidAddress(_to)
        onlyValidAmount(_amount)
        onlyValidBalance(_from, _amount)
    {
        _transfer(_from, _to, _amount.mul(_decimals));
        emit tokensAllocated(_from, _to, _amount);
    }

    // Function to set the token value
    // @param _newTokenValue The new token value to be set.
    function setTokenValue(uint256 _newTokenValue) external onlyOwner {
        tokenValue = _newTokenValue;
    }

    // Function to set the joining amount
    // @param _newJoiningAmount The new joining amount to be set.
    function setJoiningAmount(uint256 _newJoiningAmount) external onlyOwner {
        joiningAmount = _newJoiningAmount.mul(_decimals);
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

    // Modifiers

    // Modifier to check if the address is valid
    modifier onlyValidAddress(address _user) {
        if (_user == address(0)) {
            revert Invalid_Address();
        }
        _;
    }

    // Modifier to check if the amount is valid
    modifier onlyValidAmount(uint256 _amount) {
        if (_amount <= 0) {
            revert Amount_Should_Be_Greater_Than_Zero();
        }
        _;
    }

    // Modifier to check if the user's balance is sufficient
    modifier onlyValidBalance(address _user, uint256 _amount) {
        uint256 userBalance = balanceOf(_user);
        if (userBalance < _amount.mul(_decimals)) {
            revert Insufficient_Balance();
        }
        _;
    }
}
