import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");

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
