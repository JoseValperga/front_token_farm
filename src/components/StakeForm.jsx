import { useState } from "react";
import { ethers } from "ethers";

export default function StakeForm({
  lpTokenContract,
  tokenFarmContract,
  signer,
  address,
}) {
  const [amount, setAmount] = useState("");

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

      // 1️⃣ Aprobar el TokenFarm para mover tus LP
      await lpTokenContract
        .connect(signer)
        .approve(tokenFarmContract.target, parsed);

      // 2️⃣ Hacer el depósito
      await tokenFarmContract.connect(signer).deposit(parsed);

      alert("✅ Depósito exitoso!");
      setAmount("");
    } catch (err) {
      console.error("Error al hacer depósito:", err);
      alert(
        `❌ Error al depositar: ${
          err.reason || err.message || "Error desconocido"
        }`
      );
    }
  };

  // 🌿 Retirar tokens stakeados
  const withdraw = async () => {
    try {
      if (!tokenFarmContract) {
        alert("❌ Contrato no inicializado.");
        return;
      }

      await tokenFarmContract.connect(signer).withdraw();
      alert("✅ Retiro exitoso!");
    } catch (err) {
      console.error("Error al retirar:", err);
      alert(
        `❌ Error al retirar: ${
          err.reason || err.message || "Error desconocido"
        }`
      );
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
        className="text-white bg-gray-800 p-2 rounded mr-2"
      />
      <button
        onClick={deposit}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Depositar
      </button>
      <button
        onClick={withdraw}
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 ml-2"
      >
        Retirar
      </button>
    </div>
  );
}
