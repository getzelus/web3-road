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
  const [values, setValues] = useState({});

  const tip = useRef();

 const address = "0xE8Af1a4108A42D52F162fEb855096aE0E191c718";

  useEffect( () => {
    if (!signer) return;
    const init = async () => {
      
      const abi = contractJson.abi;

      let newBalance = await provider.getBalance(address);
      newBalance = ethers.formatEther(newBalance);
      setBalance(newBalance);

      tip.current = new ethers.Contract(address,abi,signer);
      const newMemos = await tip.current.getMemos();
      setMemos(newMemos);
     // tip.current.on("NewMemo", onNewMemo);
    }

    init();
  }, [signer])

  const editForm = (e) => {
    setValues(  {...values, [e.target.name]: e.target.value } );
  }

  const sendForm = async (e) => {
    e.preventDefault();
    console.log(tip.current);
    if (!values.name) return;
    console.log(values);

    let amount = ethers.parseEther(values.amount);
    amount = amount.toString();

    let tx;
    try {
      tx = await tip.current.buyCoffee(
        values.name,
        values.message,
        {value: amount}
      );
    }catch(e){
      console.log(e);
    }

    if (tx){
       const receipt = await tx.wait();
       const newMemos = await tip.current.getMemos();
       setMemos(newMemos);
      console.log(receipt);
    }

    setValues({});

  
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
       let newBalance = await provider.getBalance(address);
       newBalance = ethers.formatEther(newBalance);
       setBalance(newBalance);
 
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

        <form onSubmit={sendForm}>
          <input type='text' placeholder='name' name='name' onChange={editForm}  /> <br/>
          <input type='text' placeholder='message' name='message' onChange={editForm}  /> <br/>
          <input type='number' placeholder='amount' name='amount' step='any' onChange={editForm}  /> <br/>
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
