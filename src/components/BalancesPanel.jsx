import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function BalancesPanel({
  address,
  signer,
  tokenFarmContract,
  lpTokenContract,
  dappTokenContract,
}) {
  const [lpWallet, setLpWallet] = useState(0n);
  const [lpStaking, setLpStaking] = useState(0n);
  const [dappPending, setDappPending] = useState(0n);
  const [dappWallet, setDappWallet] = useState(0n);
  const [loading, setLoading] = useState(true);

  const fetchBalances = async () => {
    if (!address || !tokenFarmContract || !lpTokenContract || !dappTokenContract) return;

    setLoading(true);

    try {
      // LP en Wallet
      const lpBal = await lpTokenContract.balanceOf(address);
      setLpWallet(lpBal);

      // LP en Staking
      const stakerData = await tokenFarmContract.stakers(address);
      setLpStaking(stakerData.stakingBalance);

      // DAPP pendientes
      const pending = await tokenFarmContract.getPendingRewards(address);
      setDappPending(pending);

      // DAPP en Wallet
      const dappBal = await dappTokenContract.balanceOf(address);
      setDappWallet(dappBal);

    } catch (err) {
      console.error("Error cargando balances:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBalances();

    const interval = setInterval(fetchBalances, 15000);
    return () => clearInterval(interval);
  }, [address, tokenFarmContract, lpTokenContract, dappTokenContract]);

  // Helper para formatear
  const fmt = (v) => ethers.formatEther(v);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-md mx-auto my-6">
      <h2 className="text-2xl font-bold mb-4 text-green-400 flex items-center">
        🧾 Tus Balances
      </h2>

      {loading ? (
        <p className="text-yellow-300">⏳ Cargando balances...</p>
      ) : (
        <div className="space-y-3 text-lg">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-300">💰 LP en Wallet</span>
            <span className="font-mono text-green-300">{fmt(lpWallet)} LP</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-300">🌿 LP en Staking</span>
            <span className="font-mono text-yellow-300">{fmt(lpStaking)} LP</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-300">🎁 DAPP pendientes</span>
            <span className="font-mono text-purple-300">{fmt(dappPending)} DAPP</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">💎 DAPP en Wallet</span>
            <span className="font-mono text-blue-300">{fmt(dappWallet)} DAPP</span>
          </div>
        </div>
      )}
    </div>
  );
}
