import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function StakeForm({
  lpTokenContract,
  tokenFarmContract,
  signer,
  address,
}) {
  const [amount, setAmount] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [stakingBalance, setStakingBalance] = useState(0n);

  // 🔎 Consultar balance en staking
  const fetchStakingBalance = async () => {
    try {
      if (!tokenFarmContract || !address) return;
      const stakerData = await tokenFarmContract.stakers(address);
      setStakingBalance(stakerData.stakingBalance);
    } catch (err) {
      console.error("Error al obtener staking balance:", err);
      setStakingBalance(0n);
    }
  };

  // 🎯 Cargar al inicio y refrescar cada 15s
  useEffect(() => {
    fetchStakingBalance();
    const interval = setInterval(fetchStakingBalance, 15000);
    return () => clearInterval(interval);
  }, [tokenFarmContract, address]);

  // 🌿 Depositar LP Tokens en staking
  const deposit = async () => {
    try {
      if (!lpTokenContract || !tokenFarmContract) {
        alert("❌ Contratos no inicializados correctamente.");
        return;
      }

      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        alert("❌ Ingresa un monto válido.");
        return;
      }

      const parsed = ethers.parseEther(amount);

      setStatusMessage("⏳ Solicitando aprobación de LPToken...");
      const approveTx = await lpTokenContract
        .connect(signer)
        .approve(tokenFarmContract.target, parsed);
      setStatusMessage("⏳ Esperando confirmación en blockchain (approve)...");
      await approveTx.wait();
      setStatusMessage("✅ Aprobación confirmada.");

      setStatusMessage("⏳ Enviando depósito al TokenFarm...");
      const depositTx = await tokenFarmContract.connect(signer).deposit(parsed);
      setStatusMessage("⏳ Esperando confirmación en blockchain (deposit)...");
      await depositTx.wait();

      setStatusMessage("✅ Depósito exitoso!");
      setAmount("");
      fetchStakingBalance();
    } catch (err) {
      console.error("Error al hacer depósito:", err);
      setStatusMessage("");
      alert(
        `❌ Error al depositar: ${
          err.reason || err.message || "Error desconocido"
        }`
      );
    }
  };

  // 🌿 Retirar LP y reclamar recompensas en un solo paso
  const withdraw = async () => {
    try {
      if (!tokenFarmContract) {
        alert("❌ Contrato no inicializado.");
        return;
      }

      setStatusMessage("⏳ Reclamando recompensas pendientes...");
      const claimTx = await tokenFarmContract.connect(signer).claimRewards();
      await claimTx.wait();
      setStatusMessage("✅ Recompensas reclamadas con éxito!");

      setStatusMessage("⏳ Enviando retiro de LP al TokenFarm...");
      const withdrawTx = await tokenFarmContract.connect(signer).withdraw();
      setStatusMessage("⏳ Esperando confirmación en blockchain (withdraw)...");
      await withdrawTx.wait();

      setStatusMessage("✅ Retiro de LP exitoso!");
      fetchStakingBalance();
    } catch (err) {
      console.error("Error al retirar:", err);
      setStatusMessage("");
      alert(
        `❌ Error al retirar: ${
          err.reason || err.message || "Error desconocido"
        }`
      );
    }
  };

  return (
    <div className="mb-6 bg-gray-800 p-4 rounded">
      <h2 className="text-xl font-bold mb-3">💰 Staking</h2>

      <p className="mb-2">
        🌿 LP en Staking:{" "}
        <span className="font-mono">
          {ethers.formatEther(stakingBalance)} LP
        </span>
      </p>

      <div className="flex flex-wrap items-center mb-3">
        <input
          type="text"
          placeholder="Cantidad LP a stakear"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-white bg-gray-700 p-2 rounded mr-2 mb-2"
        />
        <button
          onClick={deposit}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mb-2"
        >
          Depositar
        </button>
        <button
          onClick={withdraw}
          disabled={stakingBalance <= 0n}
          className={`px-4 py-2 rounded ml-2 mb-2 ${
            stakingBalance > 0n
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          {stakingBalance > 0n
            ? "Retirar LP y Reclamar Rewards"
            : "Nada para retirar"}
        </button>
      </div>

      {statusMessage && (
        <p className="mt-2 text-yellow-400">{statusMessage}</p>
      )}
    </div>
  );
}
