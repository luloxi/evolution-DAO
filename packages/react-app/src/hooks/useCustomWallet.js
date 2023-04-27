import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useCustomWallet = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      setSigner(web3Provider.getSigner());
    }
  }, []);

  return { provider, signer };
};

export default useCustomWallet;
