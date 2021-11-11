import { useSolanaWallet  } from "./useSolanaWallet";

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
    <div className="gradient-text wallet-address-container">
        <span>{walletAddress ? `Public address: ${walletAddress}` : (errorMessage || '')}</span>
    </div>
    </>
  );
}
