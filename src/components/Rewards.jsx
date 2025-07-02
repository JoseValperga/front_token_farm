export default function Rewards({ contract, signer, address }) {
  const claim = async () => {
    try {
      await contract.claimRewards();
      alert("✅ Recompensas reclamadas!");
    } catch (e) {
      console.error(e);
      alert("Error al reclamar.");
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">🎁 Recompensas</h2>
      <button onClick={claim} className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600">
        Reclamar Recompensas
      </button>
    </div>
  );
}
