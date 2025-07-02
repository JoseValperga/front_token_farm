export default function Dashboard({ provider, signer, address }) {
  return (
    <div>
      <p className="mb-4">✅ Conectado como: {address}</p>
      <p>⚡ Aquí van los botones e interacciones con el contrato.</p>
      <p className="text-yellow-400">👉 Próximo paso: Implementar StakeForm y Rewards</p>
    </div>
  );
}
