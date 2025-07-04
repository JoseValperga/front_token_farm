import { useEffect, useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Dashboard from "./components/Dashboard";
import { ethers } from "ethers";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      console.log("⚡ Cuenta de MetaMask cambiada:", accounts);
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        if (provider) {
          const newSigner = await provider.getSigner();
          setSigner(newSigner);
        }
      } else {
        setAddress("");
        setSigner(null);
        setProvider(null);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      if (window.ethereum && handleAccountsChanged) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [provider]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">🌿 TokenFarm dApp (Sepolia)</h1>
      {!signer ? (
        <ConnectWallet
          setProvider={setProvider}
          setSigner={setSigner}
          setAddress={setAddress}
        />
      ) : (
        <Dashboard provider={provider} signer={signer} address={address} />
      )}
    </div>
  );
}
