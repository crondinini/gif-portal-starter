import { useState, useEffect } from 'react';
import { useSolanaWallet  } from "./useSolanaWallet";

import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';
import kp from './keypair.json'
import idl from './idl.json';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram } = web3;

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret);

// Get our program's id form the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devent.
const network = clusterApiUrl('devnet');

// Control's how we want to acknowledge when a trasnaction is "done".
const opts = {
  preflightCommitment: "processed"
};

const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(
    connection, window.solana, opts.preflightCommitment,
  );
	return provider;
};

const GifsContainer = ({ walletAddress }) => {
  const [gifList, setGifList] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const getGifList = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

      console.log("Got the account", account)
      setGifList(account.gifList)

    } catch (error) {
      console.log("Error in getGifs: ", error)
      setGifList(null);
    }
  };

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping")
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });
      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
      await getGifList();

    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  };

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      getGifList();
    }
  }, [walletAddress]);


  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log("No gif link given!")
      return
    }
    console.log('Gif link:', inputValue);
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.addGif(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("GIF successfully sent to program", inputValue)

      await getGifList();
    } catch (error) {
      console.log("Error sending GIF:", error)
    }
  };

  if (gifList === null) {
    return (
      <div className="connected-container">
        <button className="cta-button submit-gif-button" onClick={createGifAccount}>
          Do One-Time Initialization For GIF Program Account
        </button>
      </div>
    )
  }

  return (
    <div className="connected-container">
      {/* Go ahead and add this input and button to start */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>
      <div className="gif-grid">
      {gifList.map((item, index) => (
        <div className="gif-item" key={index}>
          <img src={item.gifLink} alt="Gif" />
        </div>
      ))}
      </div>
    </div>
  );
};

export default function ConnectWallet() {
  const { walletAddress, walletType, errorMessage, connectToWalletForFirstTime } = useSolanaWallet();

  let buttonText = 'Connect to wallet';
  switch (walletType) {
    case null:
      buttonText = 'Checking wallet...'
      break;
    case 'no-wallet':
      buttonText = 'No wallet found';
      break;
    default:
      buttonText = `Connect to ${walletType}`;
      break;
  }

  if (walletAddress) {
    buttonText = '✅ Connected'
  }

  return (
    <>
    <button
      className="cta-button connect-wallet-button"
      onClick={connectToWalletForFirstTime}
      disabled={walletType === 'no-wallet' || !!walletAddress}
    >
      {buttonText}
    </button>
    <br />
    <div className="wallet-address-container">
        <span>{walletAddress ? <GifsContainer walletAddress={walletAddress} /> : (errorMessage || '')}</span>
    </div>
    </>
  );
}
