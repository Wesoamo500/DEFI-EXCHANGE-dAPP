import {Contract} from 'ethers'

import { L3PAD_TOKEN_ABI,L3PAD_TOKEN_CONTRACT,DEFI_EXCHANGE_ABI,DEFI_EXCHANGE_CONTRACT} from '../constants'

export const getEtherBalance =  async(provider,address,contract=false,) => {
    try {
        if(contract){
            const balance = await provider.getBalance(DEFI_EXCHANGE_CONTRACT)
            return balance
        }else{
            const balance = await provider.getBalance(address)
            return balance
        }
    } catch (error) {
        console.log(error)
        return 0
    }
}

export const getLPDTokenBalance = async(provider,address) =>{
    try {
        const tokenContract = new Contract(L3PAD_TOKEN_CONTRACT,L3PAD_TOKEN_ABI,provider);
        const LPDTokenBalance = await tokenContract.balanceOf(address)

        return LPDTokenBalance
    } catch (error) {
        console.log(error)
    }
}


export const getLPTokenBalance = async(provider,address)=>{
    try {
        const tokenContract = new Contract(DEFI_EXCHANGE_CONTRACT,DEFI_EXCHANGE_ABI,provider)
        const LPTokenBalance = await tokenContract.balanceOf(address);
        return LPTokenBalance
    } catch (error) {
        console.log(error)
    }
}

export const getReserveOfLPDTokens = async(provider)=>{
    try {
        const exchangeContract = new Contract(DEFI_EXCHANGE_CONTRACT,DEFI_EXCHANGE_ABI,provider);
        const reserve = await exchangeContract.getReserve()
        return reserve
    } catch (error) {
        console.log(error)
    }
}