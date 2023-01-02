// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Exchange is ERC20 {
    address public L3padTokenAddress;

    constructor(address _L3padToken) ERC20("L3pad LP tokens","LLP"){
        require(_L3padToken != address(0), "Token address passed is null");
        L3padTokenAddress = _L3padToken ;
    }

    /*
        Returns the amount of token held by the contract
    */
    function getReserve() public view returns(uint){
        return ERC20(L3padTokenAddress).balanceOf(address(this));
    }

    // Add liquidity to exchange

    function addLiquidity(uint _amount) public payable returns(uint){
        uint liquidity;
        uint ethBalance = address(this).balance;
        uint L3padTokenReserve = getReserve();
        ERC20 L3padToken = ERC20(L3padTokenAddress);

        if(L3padTokenReserve == 0){
            L3padToken.transferFrom(msg.sender, address(this), _amount);

            liquidity = ethBalance;
            _mint(msg.sender,liquidity);
        }else{
            uint ethReserve = ethBalance - msg.value ;
            uint256 L3padTokenAmount = (msg.value * L3padTokenReserve)/(ethReserve);
            require(_amount >= L3padTokenAmount, "Amount of token sent is less than the minimum required");

            L3padToken.transferFrom(msg.sender,address(this),L3padTokenAmount);

            liquidity = (totalSupply() * msg.value)/ethReserve;
            _mint(msg.sender,liquidity);
        }
        return liquidity;
    }

    function removeLiquidity(uint _amount) public returns(uint,uint){
        require(_amount > 0, "Amount should be greater than zero");
        uint ethReserve = address(this).balance;
        uint _totalSupply = totalSupply();

        uint ethAmount = (ethReserve * _amount)/_totalSupply;

        uint L3padTokenAmount =(getReserve()*_amount)/_totalSupply; 

        _burn(msg.sender,_amount);
        payable(msg.sender).transfer(ethAmount);

        ERC20(L3padTokenAddress).transfer(msg.sender, L3padTokenAmount);

        return(ethAmount,L3padTokenAmount);
    }

    function getAmountOfTokens(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) public pure  returns(uint256){
        require(inputReserve > 0 && outputReserve > 0 , "INvalid Reserves");

        uint256 inputAmountWithFee  = inputAmount * 99 ;

        uint256 numerator = inputAmountWithFee * outputReserve ;

        uint256 denominator = (inputReserve * 100) + inputAmountWithFee ;

        return numerator/denominator ;
    }

    function ethToL3padTokens (uint _minTokens) public payable{
        uint256 tokenReserve = getReserve();

        uint256 tokensBought = getAmountOfTokens(msg.value, address(this).balance - msg.value, tokenReserve);

        require(tokensBought >= _minTokens, "insufficient output amount");

        ERC20(L3padTokenAddress).transfer(msg.sender, tokensBought);
    }

    function L3padTokenToEth(uint _tokensSold, uint _minEth) public {
        uint256 tokenReserve = getReserve();
        uint256 ethBought = getAmountOfTokens(_tokensSold,tokenReserve,address(this).balance);

        require(ethBought >= _minEth, "Insufficient output amount");

        ERC20(L3padTokenAddress).transferFrom(msg.sender, address(this) ,_tokensSold);

        payable(msg.sender).transfer(ethBought);
    }
}