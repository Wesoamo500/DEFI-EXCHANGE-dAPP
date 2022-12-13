import { Contract } from "ethers";

import { DEFI_EXCHANGE_CONTRACT,DEFI_EXCHANGE_ABI,L3PAD_TOKEN_CONTRACT,L3PAD_TOKEN_ABI } from "../constants";


export const getAmountOfTokensReceivedFromSwap = async (_swapAmountWei,provider,ethSelected,ethBalance,reservedLPD) =>{
    const exchangeContract = new Contract(
        DEFI_EXCHANGE_CONTRACT,DEFI_EXCHANGE_ABI,provider,
    )

    let amountOfTokens;

    if(ethSelected){
        amountOfTokens = await exchangeContract.getAmountofTokens(_swapAmountWei,ethBalance,reservedLPD)
    }else{
        amountOfTokens = await exchangeContract.getAmountofTokens(_swapAmountWei,reservedLPD,ethBalance)
    }
    return amountOfTokens;
}

export const swapTokens = async(signer,swapAmountWei,tokenToBeReceivedAfterSwap,ethSelected)=>{
    const exchangeContract = new Contract(DEFI_EXCHANGE_CONTRACT,DEFI_EXCHANGE_ABI,signer);
    const tokenContract = new Contract(L3PAD_TOKEN_CONTRACT,L3PAD_TOKEN_ABI,signer);

    let tx;

    if(ethSelected){
        tx = await exchangeContract.ethToL3padTokens(tokenToBeReceivedAfterSwap, {value:swapAmountWei})

    }else{
        tx = await tokenContract.approve(DEFI_EXCHANGE_CONTRACT,swapAmountWei.toString());

        await tx.wait()

        tx = await exchangeContract.L3padTokenToEth(swapAmountWei,tokenToBeReceivedAfterSwap);

        
    }

    await tx.wait()
}