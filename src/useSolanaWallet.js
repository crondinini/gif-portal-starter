import { useEffect, useState } from 'react';

export const useSolanaWallet = () => {
  const [walletType, setWalletType] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const connectToWallet = async ({ afterUserAuthorization }) => {
    const { solana } = window;
    if (!solana) {
      setWalletType('no-wallet')
      return;
    }

    if (solana.isPhantom) {
      setWalletType('phantom');
      try {
        const authorization = await solana.connect({ onlyIfTrusted: afterUserAuthorization });
        const address = authorization.publicKey.toString();
        setWalletAddress(address);
      } catch(e) {
        setErrorMessage(e.message);
      }
    }
  };

  const checkIfWalletIsConnected = () => connectToWallet({ afterUserAuthorization: true });

  const connectToWalletForFirstTime = () => {
    connectToWallet({ afterUserAuthorization: false });
  };

  useEffect(() => {
    window.addEventListener('load', checkIfWalletIsConnected)
    return () => {
      window.removeEventListener('load', checkIfWalletIsConnected)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { walletType, walletAddress, errorMessage, connectToWalletForFirstTime };
};
