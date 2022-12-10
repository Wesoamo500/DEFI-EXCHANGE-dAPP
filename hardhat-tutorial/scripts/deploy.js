const {ethers} = require("hardhat");
require("dotenv").config({path: ".env"});
const {L3PAD_TOKEN_CONTRACT_ADDRESS} = require("../constants");

async function main(){
  const contractAddress = L3PAD_TOKEN_CONTRACT_ADDRESS;

  const exchangeContract = await ethers.getContractFactory("Exchange");

  const deployedExchangedContract = await exchangeContract.deploy(contractAddress);

  await deployedExchangedContract.deployed();

  console.log("Exchange Contract Address: ", deployedExchangedContract.address);
}


main().then(()=>process.exit(0)).catch((error)=>{
  console.log(error),
  process.exit(1);
})

