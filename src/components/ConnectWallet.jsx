import { ethers } from "ethers";

export default function ConnectWallet({ setProvider, setSigner, setAddress }) {
  const connect = async () => {
    if (!window.ethereum) {
      alert("Instala MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    let accounts = await provider.send("eth_accounts", []);

    if (accounts.length === 0) {
      accounts = await provider.send("eth_requestAccounts", []);
    }

    if (accounts.length === 0) {
      alert("No se obtuvo ninguna cuenta");
      return;
    }

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
