import { useState } from "react";
import { ethers } from "ethers";

export default function StakeForm({ contract, signer, address }) {
  const [amount, setAmount] = useState("");

  const deposit = async () => {
    try {
      const parsed = ethers.parseEther(amount);
      await contract.approve(contract.target, parsed);
      await contract.deposit(parsed);
      alert("✅ Depósito exitoso!");
    } catch (e) {
      console.error(e);
      alert("Error al depositar.");
    }
  };

  const withdraw = async () => {
    try {
      await contract.withdraw();
      alert("✅ Retiro exitoso!");
    } catch (e) {
      console.error(e);
      alert("Error al retirar.");
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">💰 Staking</h2>
      <input
        type="text"
        placeholder="Cantidad LP a stakear"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="text-black p-2 rounded mr-2"
      />
      <button onClick={deposit} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
        Depositar
      </button>
      <button onClick={withdraw} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 ml-2">
        Retirar
      </button>
    </div>
  );
}
