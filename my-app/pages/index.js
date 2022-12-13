import Head from 'next/head'
import styles from '../styles/Home.module.css'

import {BigNumber,providers,utils} from "ethers";
import { useRef } from 'react';




export default function Home() {
  const web3ModalRef = useRef();

  const getProviderOrSigner = async(needSigner=false) =>{
    const provider = web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const {chainId} = await web3Provider.getNetwork();

    if(chainId !== 5){
      window.alert("Choose goerli network")

      throw new Error("Choose goerli network")
    }

    if(needSigner){
      const signer = web3Provider.getSigner();
      return signer
    }
    return web3Provider
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Defi Exchange</title>
        <meta name="description" content="Defi Exchange dAPP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
