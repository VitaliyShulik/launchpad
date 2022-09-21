// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./IUniswapV2Router02.sol";
import "./IUniswapV2Factory.sol";
import "./TokenLockerFactory.sol";

contract IDOPool is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for ERC20;

    struct FinInfo {
        uint256 tokenPrice;
        uint256 softCap;
        uint256 hardCap;
        uint256 minEthPayment;
        uint256 maxEthPayment;
        uint256 listingPrice;
        uint256 lpInterestRate;
    }

    struct Timestamps {
        uint256 startTimestamp;
        uint256 finishTimestamp;
        uint256 startClaimTimestamp;
    }

    struct DEXInfo {
        address router;
        address factory;
        address weth;
    }

    ERC20 public rewardToken;
    uint256 public decimals;

    FinInfo public finInfo;
    Timestamps public timestamps;
    DEXInfo public dexInfo;

    TokenLockerFactory public lockerFactory;

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
        Timestamps memory _timestamps,
        DEXInfo memory _dexInfo
    ) {

        rewardToken = _rewardToken;
        decimals = rewardToken.decimals();

        finInfo = _finInfo;

        setTimestamps(_timestamps);

        dexInfo = _dexInfo;
    }

    function setTimestamps(Timestamps memory _timestamps) internal {
        require(
            _timestamps.startTimestamp < _timestamps.finishTimestamp,
            "Start timestamp must be less than finish timestamp"
        );
        require(
            _timestamps.finishTimestamp > block.timestamp,
            "Finish timestamp must be more than current block"
        );

        timestamps = _timestamps;
    }

    function pay() payable external {
        require(block.timestamp >= timestamps.startTimestamp, "Not started");
        require(block.timestamp < timestamps.finishTimestamp, "Ended");

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

    function getListingAmount(uint256 ethAmount)
        internal
        view
        returns (uint256)
    {
        return ethAmount.mul(10**decimals).div(finInfo.listingPrice);
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
        require(block.timestamp > timestamps.startClaimTimestamp, "Distribution not started");
        UserInfo storage user = userInfo[_receiver];
        uint256 _amount = user.debt;
        if (_amount > 0) {
            user.debt = 0;
            distributedTokens = distributedTokens.add(_amount);
            rewardToken.safeTransfer(_receiver, _amount);
            emit TokensWithdrawn(_receiver,_amount);
        }
    }

    function withdrawETH() external payable onlyOwner {
        // This forwards all available gas. Be sure to check the return value!
        uint256 balance = address(this).balance;

        if ( finInfo.lpInterestRate > 0 && finInfo.listingPrice > 0 ) {
            // if TokenLockerFactory has fee we should provide there fee by msg.value and sub it from balance for correct execution
            balance -= msg.value;
            uint256 ethForLP = (balance * finInfo.lpInterestRate)/100;
            uint256 ethWithdraw = balance - ethForLP;

            uint256 tokenAmount = getListingAmount(ethForLP);

            // Add Liquidity ETH
            IUniswapV2Router02 uniswapRouter = IUniswapV2Router02(dexInfo.router);
            rewardToken.approve(address(uniswapRouter), tokenAmount);
            (,, uint liquidity) = uniswapRouter.addLiquidityETH{value: ethForLP}(
                address(rewardToken),
                tokenAmount,
                0, // slippage is unavoidable
                0, // slippage is unavoidable
                address(this),
                block.timestamp + 360
            );

            // Lock LP Tokens
            (address lpTokenAddress) = IUniswapV2Factory(dexInfo.factory).getPair(address(rewardToken), dexInfo.weth);

            ERC20 lpToken = ERC20(lpTokenAddress);

            if (timestamps.startClaimTimestamp > block.timestamp) {
                lpToken.approve(address(lockerFactory), liquidity);
                lockerFactory.createLocker{value: msg.value}(
                    lpToken,
                    string.concat(lpToken.symbol(), " tokens locker"),
                    liquidity, msg.sender, timestamps.startClaimTimestamp
                );
            } else {
                lpToken.transfer(msg.sender, liquidity);
                // return msg.value along with eth to output if someone sent it wrong
                ethWithdraw += msg.value;
            }

            // Withdraw rest ETH
            (bool success, ) = msg.sender.call{value: ethWithdraw}("");
            require(success, "Transfer failed.");
        } else {
            (bool success, ) = msg.sender.call{value: balance}("");
            require(success, "Transfer failed.");
        }
    }

     function withdrawNotSoldTokens() external onlyOwner {
        require(block.timestamp > timestamps.finishTimestamp, "Withdraw allowed after stop accept ETH");
        uint256 balance = rewardToken.balanceOf(address(this));
        rewardToken.safeTransfer(msg.sender, balance.add(distributedTokens).sub(tokensForDistribution));
    }
}