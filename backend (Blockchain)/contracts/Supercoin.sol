// SPDX-License-Identifier: MIT
// @title Supercoin: A blockchain-based Loyalty and Rewards Program using fungible tokens
// @notice This contract implements a loyalty program where users can earn and redeem fungible tokens.
// @dev It also includes functionality for platform partners and brands to issue tokens and set limits.
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
    using SafeMath for uint256;

    // Custom error messages
    // @dev Error messages for various invalid conditions
    error Invalid_Address();
    error Insufficient_Balance();
    error Invalid_Platform_Or_Brand();
    error Amount_Should_Be_Greater_Than_Zero();
    error Not_Enough_ETH();
    error Token_Limit_Exceeded();

    // Events
    // @dev These events are triggered to log specific actions on the blockchain.
    event newTokensIssued(address indexed user, uint256 indexed amount);
    event newItemBought(address indexed user, uint256 indexed amount);
    event itemGotDelivered(address indexed user, uint256 indexed amount);
    event itemGotCanceled(address indexed user, uint256 indexed amount);
    event tokensAllocated(
        address indexed from,
        address indexed to,
        uint256 indexed amount
    );

    // State variables
    uint256 public joiningAmount;
    uint256 public tokenValue;
    uint256 public intialSupply;
    mapping(address => bool) isPlatformOrBrand;
    mapping(address => uint256) tokenLimit;

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
        intialSupply = _intialSupply.mul(10 ** decimals());
        tokenValue = _initialValue;
        joiningAmount = _joiningAmount.mul(10 ** decimals());
        _mint(msg.sender, intialSupply);
    }

    // Function to issue tokens to a user
    // @param _user The address of the user to whom tokens will be issued.
    // @param _amount The amount of tokens to be issued.
    function issueTokens(
        address _user,
        uint256 _amount
    ) external onlyOwner onlyValidAddress(_user) onlyValidAmount(_amount) {
        _mint(_user, _amount.mul(10 ** decimals()));
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
        _burn(_user, _amount.mul(10 ** decimals()));
        emit newItemBought(_user, _amount);
    }

    // Function to confirm item delivery
    // @param _user The address of the user who received the item.
    // @param _amount The amount of tokens to be burned for the delivered item.
    function itemDelivered(
        address _user,
        uint256 _amount
    )
        external
        onlyOwner
        onlyValidAmount(_amount)
        onlyValidBalance(_user, _amount)
    {
        _burn(_user, _amount.mul(10 ** decimals()));
        emit itemGotDelivered(_user, _amount);
    }

    // Function to cancel an item order
    // @param _user The address of the user who canceled the item order.
    // @param _amount The amount of tokens to be issued for the canceled order.
    function itemCanceled(
        address _user,
        uint256 _amount
    ) external onlyOwner onlyValidAmount(_amount) {
        _mint(_user, _amount.mul(10 ** decimals()));
        emit itemGotCanceled(_user, _amount);
    }

    // Function for onboarding a platform or brand and allocating tokens
    // @param _platformOrBrand The address of the platform or brand to be onboarded.
    // @param _tokenLimit The token limit to be set for the platform or brand.
    function onboardAndAllocate(
        address _platformOrBrand,
        uint256 _tokenLimit
    ) external onlyOwner onlyValidAddress(_platformOrBrand) {
        uint256 _joiningAmount = joiningAmount;
        isPlatformOrBrand[_platformOrBrand] = true;
        tokenLimit[_platformOrBrand] = _tokenLimit.mul(10 ** decimals());
        _mint(_platformOrBrand, _joiningAmount);
    }

    // Function for users to buy tokens with ETH
    // @return The amount of tokens bought.
    function buyTokens()
        external
        payable
        onlyPlatformOrBrand
        returns (uint256)
    {
        if (msg.value <= 0) {
            revert Not_Enough_ETH();
        }

        uint256 tokenAmount = SafeMath.mul(msg.value, tokenValue);
        _checkLimit(msg.sender, tokenAmount);
        _mint(msg.sender, tokenAmount);
        return tokenAmount;
    }

    // Function to allocate tokens from a platform or brand to a user
    // @param _platformOrBrand The address of the platform or brand allocating tokens.
    // @param _user The address of the user receiving tokens.
    // @param _amount The amount of tokens to be allocated.
    function allocateTokens(
        address _platformOrBrand,
        address _user,
        uint256 _amount
    )
        external
        onlyOwner
        onlyValidAddress(_user)
        onlyValidAmount(_amount)
        onlyValidBalance(_platformOrBrand, _amount)
    {
        if (!isPlatformOrBrand[_platformOrBrand]) {
            revert Invalid_Platform_Or_Brand();
        }
        _transfer(_platformOrBrand, _user, _amount.mul(10 ** decimals()));
        emit tokensAllocated(_platformOrBrand, _user, _amount);
    }

    // Function to increase the token limit for a platform or brand
    // @param _platformOrBrand The address of the platform or brand.
    // @param _tokenLimit The additional token limit to be added.
    function increaseTokenLimit(
        address _platformOrBrand,
        uint256 _tokenLimit
    ) external onlyOwner onlyValidAmount(_tokenLimit) {
        if (!isPlatformOrBrand[_platformOrBrand]) {
            revert Invalid_Platform_Or_Brand();
        }
        tokenLimit[_platformOrBrand] = tokenLimit[_platformOrBrand].add(
            _tokenLimit.mul(10 ** decimals())
        );
    }

    // @title Internal Function: Check Token Limit
    // @notice This internal function is used to check if a platform or brand has exceeded its allocated token limit.
    // @dev It compares the current token allocation (_tokenAmount) to the allocated token limit for a given platform or brand (_platformOrBrand).
    // @param _platformOrBrand The address of the platform or brand to check the token limit for.
    // @param _tokenAmount The amount of tokens to be allocated.
    // @return This function does not return any value, but it may revert with an error if the token limit is exceeded.
    function _checkLimit(
        address _platformOrBrand,
        uint256 _tokenAmount
    ) internal {
        // Check if the token limit for the platform or brand is less than the token amount to be allocated.
        if (tokenLimit[_platformOrBrand] < _tokenAmount) {
            revert Token_Limit_Exceeded();
        }

        // Subtract the allocated tokens from the token limit for the platform or brand.
        tokenLimit[_platformOrBrand] = tokenLimit[_platformOrBrand].sub(
            _tokenAmount
        );
    }

    // Function to set the token value
    // @param _newTokenValue The new token value to be set.
    function setTokenValue(uint256 _newTokenValue) external onlyOwner {
        tokenValue = _newTokenValue;
    }

    // Function to set the joining amount
    // @param _newJoiningAmount The new joining amount to be set.
    function setJoiningAmount(uint256 _newJoiningAmount) external onlyOwner {
        joiningAmount = _newJoiningAmount.mul(10 ** decimals());
    }

    // Function to get the joining amount
    // @return The current joining amount.
    function getJoiningAmount() external view returns (uint256) {
        return joiningAmount;
    }

    // Function to get the token limit for the caller
    // @return The token limit for the caller.
    function getTokenLimit() external view returns (uint256) {
        return tokenLimit[msg.sender];
    }

    // Function to get the balance of the caller
    // @return The total balance of tokens held by the caller.
    function getBalance() external view returns (uint256 totalUserTokens) {
        totalUserTokens = balanceOf(msg.sender);
    }

    // Function to get the token value
    // @return The current token value.
    function getTokenValue() external view returns (uint256) {
        return tokenValue;
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
        if (userBalance < _amount.mul(10 ** decimals())) {
            revert Insufficient_Balance();
        }
        _;
    }

    // Modifier to check if the caller is a platform or brand
    modifier onlyPlatformOrBrand() {
        if (!isPlatformOrBrand[msg.sender]) {
            revert Invalid_Platform_Or_Brand();
        }
        _;
    }
}
