import styles from "../styles/Wallet.module.css";
import { useEffect} from "react";
import useStore from './../store/useStore';
import { ethers } from "ethers";

export default function Wallet() {
  console.log('wallet');

 // const provider = useStore((s) => s.provider);
  const setProvider = useStore((s) => s.setProvider);

  const signer = useStore((s) => s.signer);
  const setSigner = useStore((s) => s.setSigner);

  useEffect(() => {
    connect();
  }, [])

  const connect = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newProvider = await new ethers.BrowserProvider(window.ethereum);
        if (newProvider){
          setProvider(newProvider);
          const newSigner = await newProvider.getSigner();
          setSigner(newSigner);
        }
      
      } else {
        console.log('MetaMask not installed; using read-only defaults');
       // const provider = ethers.getDefaultProvider();
        // Do something with the provider object
      }
    } catch (error) {
      console.error(error);
    }
  }

  /*
  const connect = async () => {
    let newProvider;
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults")
      //newProvider = ethers.getDefaultProvider();
    } else {
      newProvider = await new ethers.BrowserProvider(window.ethereum)
    }

    if (newProvider) {
      setProvider(newProvider);
      let newSigner = await newProvider.getSigner();
      setSigner(newSigner);
    } 
  }
  */

  return (<div className={styles.container}>

    <p>wallet : {signer?.address} </p>
    <button onClick={() => connect()}>connect</button>

  </div>);
}


