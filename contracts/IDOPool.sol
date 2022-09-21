// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IDOPool is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for ERC20;

    struct FinInfo {
        uint256 tokenPrice;
        uint256 softCap;
        uint256 hardCap;
        uint256 minEthPayment;
        uint256 maxEthPayment;
    }

    struct Timestaps {
        uint256 startTimestamp;
        uint256 finishTimestamp;
        uint256 startClaimTimestamp;
    }

    ERC20 public rewardToken;
    uint256 public decimals;

    FinInfo public finInfo;
    Timestaps public timestaps;

    uint256 public totalInvestedETH;
    uint256 public tokensForDistribution;
    uint256 public distributedTokens;

    struct UserInfo {
        uint debt;
        uint total;
        uint totalInvestedETH;
    }

    mapping(address => UserInfo) public userInfo;

    event TokensDebt(
        address indexed holder,
        uint256 ethAmount,
        uint256 tokenAmount
    );

    event TokensWithdrawn(address indexed holder, uint256 amount);

    constructor(
        ERC20 _rewardToken,
        FinInfo memory _finInfo,
        Timestaps memory _timestamps
    ) {
        setUtils(_rewardToken, rewardToken.decimals());

        finInfo = _finInfo;

        setTimestamps(_timestamps);
    }

    function setUtils(ERC20 _rewardToken, uint256 _decimals) internal{
        rewardToken = _rewardToken;
        decimals = _decimals;
    }

    function setTimestamps(Timestaps memory _timestamps) internal {
        require(
            _timestamps.startTimestamp < _timestamps.finishTimestamp,
            "Start timestamp must be less than finish timestamp"
        );
        require(
            _timestamps.finishTimestamp > block.timestamp,
            "Finish timestamp must be more than current block"
        );

        timestaps = _timestamps;
    }

    function pay() payable external {
        require(block.timestamp >= timestaps.startTimestamp, "Not started");
        require(block.timestamp < timestaps.finishTimestamp, "Ended");

        require(msg.value >= finInfo.minEthPayment, "Less then min amount");
        require(msg.value <= finInfo.maxEthPayment, "More then max amount");
        require(totalInvestedETH.add(msg.value) <= finInfo.hardCap, "Overfilled");

        UserInfo storage user = userInfo[msg.sender];
        require(user.totalInvestedETH.add(msg.value) <= finInfo.maxEthPayment, "More then max amount");

        uint256 tokenAmount = getTokenAmount(msg.value);

        tokensForDistribution = tokensForDistribution.add(tokenAmount);
        user.totalInvestedETH = user.totalInvestedETH.add(msg.value);
        user.total = user.total.add(tokenAmount);
        user.debt = user.debt.add(tokenAmount);

        emit TokensDebt(msg.sender, msg.value, tokenAmount);
    }

    function getTokenAmount(uint256 ethAmount)
        internal
        view
        returns (uint256)
    {
        return ethAmount.mul(10**decimals).div(finInfo.tokenPrice);
    }


    /// @dev Allows to claim tokens for the specific user.
    /// @param _user Token receiver.
    function claimFor(address _user) external {
        proccessClaim(_user);
    }

    /// @dev Allows to claim tokens for themselves.
    function claim() external {
        proccessClaim(msg.sender);
    }

    /// @dev Proccess the claim.
    /// @param _receiver Token receiver.
    function proccessClaim(
        address _receiver
    ) internal nonReentrant{
        require(block.timestamp > timestaps.startClaimTimestamp, "Distribution not started");
        UserInfo storage user = userInfo[_receiver];
        uint256 _amount = user.debt;
        if (_amount > 0) {
            user.debt = 0;
            distributedTokens = distributedTokens.add(_amount);
            rewardToken.safeTransfer(_receiver, _amount);
            emit TokensWithdrawn(_receiver,_amount);
        }
    }

    function withdrawETH(uint256 amount) external onlyOwner {
        // This forwards all available gas. Be sure to check the return value!
        (bool success, ) = msg.sender.call{ value: amount }("");
        require(success, "Transfer failed.");
    }

     function withdrawNotSoldTokens() external onlyOwner {
        require(block.timestamp > timestaps.finishTimestamp, "Withdraw allowed after stop accept ETH");
        uint256 balance = rewardToken.balanceOf(address(this));
        rewardToken.safeTransfer(msg.sender, balance.add(distributedTokens).sub(tokensForDistribution));
    }
}