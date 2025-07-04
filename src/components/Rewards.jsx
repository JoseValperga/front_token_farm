import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Rewards({ contract, signer, address }) {
  const [pendingRewards, setPendingRewards] = useState(ethers.parseEther("0"));

  useEffect(() => {
    if (!contract || !address) return;

    const fetchRewards = async () => {
      try {
        const rewards = await contract.getPendingRewards(address);
        setPendingRewards(rewards);
      } catch (err) {
        console.error("Error al obtener recompensas:", err);
        setPendingRewards(ethers.parseEther("0"));
      }
    };

    fetchRewards();

    const interval = setInterval(fetchRewards, 15000);
    return () => clearInterval(interval);
  }, [contract, address]);

  const claim = async () => {
    try {
      await contract.connect(signer).claimRewards();
      alert("✅ Recompensas reclamadas!");
      setPendingRewards(ethers.parseEther("0"));
    } catch (e) {
      console.error(e);
      alert("Error al reclamar.");
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">🎁 Recompensas</h2>

      <p className="mb-2">
        💰 Recompensas pendientes:{" "}
        <span className="font-mono">
          {ethers.formatEther(pendingRewards)} DAPP
        </span>
      </p>

      <button
        onClick={claim}
        disabled={pendingRewards <= 0n}
        className={`px-4 py-2 rounded ${
          pendingRewards > 0n
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        {pendingRewards > 0n ? "Reclamar Recompensas" : "Nada para reclamar"}
      </button>
    </div>
  );
}
