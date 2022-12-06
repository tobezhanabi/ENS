import Head from "next/head";
import Image from "next/image";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useState, useRef, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [ens, setENS] = useState("");
  const [address, setAddress] = useState("");

  const setENSOrAddress = async (address, web3Provider) => {
    var _ens = await web3Provider.lookupAddress(address);
    if (_ens) {
      setENS(_ens);
    } else {
      setAddress(address);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner(true);
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };
  const getProviderOrSigner = async () => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    await setENSOrAddress(address, web3Provider);
    return signer;
  };

  const renderButton = () => {
    if (walletConnected) {
      <div>Wallet Connected</div>;
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          connect your wallet
        </button>
      );
    }
  };
  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);
  return (
    <div>
      <Head>
        <title> ENS DAPP</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            welcome to Tobez {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            its an NFT collection for Tobez
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>
      <footer className={styles.footer}>Made with &#10083; by Tobex</footer>
    </div>
  );
}
