import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import ConnectWallet from './ConnectWallet';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">Camila Rondinini's Project</p>
          <p className="sub-text">
            Starter template for building a Solana/Rust project.
          </p>
          <br />
        </div>
        <div className="content-container">
          <ConnectWallet />
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Project provided by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
