import styles from "../styles/Wallet.module.css";
import { useEffect} from "react";
import useStore from './../store/useStore';
import { ethers } from "ethers";

export default function Wallet() {

  const provider = useStore((s) => s.provider);
  const setProvider = useStore((s) => s.setProvider);

  const signer = useStore((s) => s.signer);
  const setSigner = useStore((s) => s.setSigner);

  useEffect(() => {

    const provide = async () => {
      let newProvider;
      if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults")
        newProvider = ethers.getDefaultProvider();
      } else {
        newProvider = await new ethers.BrowserProvider(window.ethereum)
      }
    
      if (newProvider) {
        setProvider(newProvider);
        let newSigner = await newProvider.getSigner();
        setSigner(newSigner);
      } 
    }
    provide();
  }, [])

  const connect = async () => {
    if (!provider) return;
    let newSigner;
    try {
      newSigner = await provider.getSigner();
      setSigner(newSigner);
    } catch(e){
      console.log(e);
    }
  }

  return (<div className={styles.container}>

    <p>wallet : {signer?.address} </p>
    <button onClick={() => connect()}>connect</button>

  </div>);
}


