import { Contract, utils } from "ethers";

import {DEFI_EXCHANGE_CONTRACT,DEFI_EXCHANGE_ABI,L3PAD_TOKEN_ABI,L3PAD_TOKEN_CONTRACT} from "../constants"

export const addLiquidity = async(signer, addLPDAmountWei, addEtherAmountWei) =>{
    try {
        const exchangeContract = new Contract(
            DEFI_EXCHANGE_CONTRACT,
            DEFI_EXCHANGE_ABI,
            signer
        );
        const tokenContract = new Contract(
            L3PAD_TOKEN_CONTRACT,
            L3PAD_TOKEN_ABI,
            signer
        );
        let tx = await tokenContract.approve(DEFI_EXCHANGE_CONTRACT,addLPDAmountWei.toString());
        await tx.wait();

        tx = await exchangeContract.addLiquidity(addLPDAmountWei,{
            value: addEtherAmountWei
        })
        await tx.wait();
    } catch (error) {
        console.log(error)
    }
}

export const calculateLPD = async(_addEther = "0", etherBalanceContract,lpdTokenReserve) =>{
    const _addEtherAmountWei = utils.parseEther(_addEther);

    const l3padTokenAmount = _addEtherAmountWei.mul(lpdTokenReserve).div(etherBalanceContract);

    return l3padTokenAmount
}