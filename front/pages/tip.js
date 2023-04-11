//import Head from 'next/head'
// import Image from 'next/image'
//import styles from '../styles/Home.module.css'
import { useEffect, useState, useRef} from "react";
import { ethers } from "ethers";
import contractJson from '../abis/Tip.json';
import useStore from './../store/useStore';

export default function Tip() {
  //console.log('tip');

  const provider = useStore(s => s.provider);
  const signer = useStore(s => s.signer);

  const [balance, setBalance] = useState(null);
  const [memos, setMemos] = useState([]);

  const tip = useRef();
  const formRef = useRef();

  useEffect( () => {
    if (!signer) return;
    const init = async () => {
      const abi = contractJson.abi;
      const address = "0xE8Af1a4108A42D52F162fEb855096aE0E191c718";
      tip.current = new ethers.Contract(address,abi,signer);
      updateAll();
     // tip.current.on("NewMemo", onNewMemo);
    }

    init();
  }, [signer])


  const updateBalance = async () => {
    let newBalance = await tip.current.getBalance();
    newBalance = ethers.formatEther(newBalance);
    setBalance(newBalance);
  }

  const updateMemos = async () => {
    const newMemos = await tip.current.getMemos();
    setMemos(newMemos);
  }

  const updateAll = () => {
    updateBalance();
    updateMemos();
  }

  const sendForm = async (e) => {
    e.preventDefault();
    let amount = ethers.parseEther(formRef.current.amount.value).toString();
   
    let tx;
    try {
      tx = await tip.current.buyCoffee(
        formRef.current.name.value,
        formRef.current.message.value,
        {value: amount}
      );
    }catch(e){
      console.log(e);
    }

    if (tx){
       const receipt = await tx.wait();
       console.log(receipt);
       updateAll();
    }

    formRef.current.reset();

/*
    tip.current.buyCoffee(
      values.name,
      values.message,
      {value: amount}
    ).then((res) => {
      console.log(res);
    });
    */
  }

  const withdraw = async () => {
    let tx;
    try {
      tx = await tip.current.withdrawTips();
    }catch(e){
      console.log(e);
    }

    if (tx){
       const receipt = await tx.wait();
       console.log(receipt);
       updateBalance();
    }
  }

  if (!provider || !signer){
    return 'Connect first';
  }

  return (
    <div>
        <h2>Tip</h2>
        <p>{balance}</p>
        <p><button onClick={withdraw}>withdraw</button> </p>

        <form onSubmit={sendForm} ref={formRef}>
          <input type='text' placeholder='name' name='name' /> <br/>
          <input type='text' placeholder='message' name='message' /> <br/>
          <input type='number' placeholder='amount' name='amount' step='any' /> <br/>
          <input type='submit' value='Send' />
        </form>

        <div>
          {memos.map( m =>
             <p key={m.timestamp}>{m.from} : {m.message} - {ethers.formatEther(m.amount)}</p>
            )}
        </div>
  
    </div>
  )
}
