import { useState } from "react";
import { ethers } from "ethers";

export default function OwnerPanel({ contract, lpTokenContract }) {
  const [reward, setReward] = useState("");
  const [fee, setFee] = useState("");

  const setRewardPerBlock = async () => {
    try {
      await contract.setRewardPerBlock(ethers.parseEther(reward));
      alert("✅ Reward por bloque actualizado!");
    } catch (e) {
      console.error(e);
      alert("Error al actualizar reward.");
    }
  };

  const setFeePercentage = async () => {
    try {
      await contract.setFeePercentage(Number(fee));
      alert("✅ Fee actualizado!");
    } catch (e) {
      console.error(e);
      alert("Error al actualizar fee.");
    }
  };

  const distributeAll = async () => {
    try {
      await contract.distributeRewardsAll();
      alert("✅ Recompensas distribuidas!");
    } catch (e) {
      console.error(e);
      alert("Error al distribuir.");
    }
  };

  return (
    <div className="mt-8 p-4 border rounded border-green-400">
      <h2 className="text-xl font-bold mb-2">👑 Owner Panel</h2>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Reward por bloque (ETH)"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          className="text-white p-2 rounded mr-2"
        />
        <button
          onClick={setRewardPerBlock}
          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
        >
          Set Reward
        </button>
      </div>
      <div className="mb-2">
        <input
          type="number"
          placeholder="Fee (bps)"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="text-withe p-2 rounded mr-2"
        />
        <button
          onClick={setFeePercentage}
          className="bg-pink-600 px-4 py-2 rounded hover:bg-pink-700"
        >
          Set Fee
        </button>
      </div>
      <button
        onClick={distributeAll}
        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 mt-2"
      >
        Distribuir Recompensas a Todos
      </button>
      <p></p>
      {lpTokenContract && (
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mt-4"
          onClick={async () => {
            try {
              const recipient = prompt(
                "Ingrese la dirección del destinatario:"
              );
              if (!recipient) return;

              const amount = ethers.parseEther("100");
              await lpTokenContract.transfer(recipient, amount);
              alert(`✅ Transferidos 100 LP a ${recipient}`);
            } catch (err) {
              console.error(err);
              alert("❌ Error al transferir LP");
            }
          }}
        >
          Enviar 100 LP a una wallet (TEST)
        </button>
      )}
    </div>
  );
}
