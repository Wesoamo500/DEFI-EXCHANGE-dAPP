import { Contract,utils,BigNumber,providers } from "ethers";

import { DEFI_EXCHANGE_CONTRACT,DEFI_EXCHANGE_ABI } from "../constants";

export const removeLiquidity = async(signer, removeLPTokenWei) => {
    try {
        const exchangeContract = new Contract(
            DEFI_EXCHANGE_CONTRACT,DEFI_EXCHANGE_ABI,signer
        )

        const tx = await exchangeContract.removeLiquidity(removeLPTokenWei)

        await tx.wait()
    } catch (error) {
        console.log(error)
    }
}

export const getTokenAfterRemove = async(provider,removeLPTokenWei,_ethBalance,L3padTokenReserve) =>{
    try {
        const exchangeContract = new Contract(
            DEFI_EXCHANGE_CONTRACT,
            DEFI_EXCHANGE_ABI,
            provider
        );
        const _totalSupply = await exchangeContract.totalSupply();

        const _removeEther = _ethBalance.mul(removeLPTokenWei).div(_totalSupply);
        const _removeLPD = L3padTokenReserve.mul(removeLPTokenWei).div(_totalSupply)

        return{
            _removeEther,
            _removeLPD
        }
    } catch (error) {
        console.log(error)
    }
}