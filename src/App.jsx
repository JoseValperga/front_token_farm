import { useEffect, useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Dashboard from "./components/Dashboard";
import { ethers } from "ethers";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");

  // 🎯 ESTE EFECTO es el que detecta cambios en MetaMask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        console.log("⚡ Cuenta de MetaMask cambiada:", accounts);
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          if (provider) {
            const newSigner = await provider.getSigner();
            setSigner(newSigner);
          }
        } else {
          // Usuario desconectó todas las cuentas
          setAddress("");
          setSigner(null);
          setProvider(null);
        }
      });
    }

    return () => {
      // Limpieza del listener
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
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
