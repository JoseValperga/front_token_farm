import { ethers } from "ethers";

export default function ConnectWallet({ setProvider, setSigner, setAddress }) {
  const connect = async () => {
    if (!window.ethereum) {
      alert("Instala MetaMask");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    setProvider(provider);
    setSigner(signer);
    setAddress(accounts[0]);
  };

  return (
    <button
      onClick={connect}
      className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
    >
      Conectar Wallet
    </button>
  );
}
