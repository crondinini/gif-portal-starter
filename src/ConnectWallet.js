import { useState, useEffect } from 'react';
import { useSolanaWallet  } from "./useSolanaWallet";

const TEST_GIFS = [
	'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
	'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
	'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
	'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
];

const GifsContainer = ({ walletAddress }) => {
  const [gifList, setGifList] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');

      // Call Solana program here.

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);


  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
    } else {
      console.log('Empty input. Try again.');
    }
  };

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
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
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
