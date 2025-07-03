import { useEffect, useState } from "react";
import { ethers } from "ethers";
import StakeForm from "./StakeForm";
import Rewards from "./Rewards";
import OwnerPanel from "./OwnerPanel";
import BalancesPanel from "./BalancesPanel";

import tokenFarmAbi from "../abi/TokenFarm.json";
import lpTokenAbi from "../abi/LPToken.json";
import dappTokenAbi from "../abi/DAppToken.json";

const lpTokenAddress = import.meta.env.VITE_LPTOKEN_ADDRESS;
const tokenFarmAddress = import.meta.env.VITE_TOKENFARM_ADDRESS;
const dappTokenAddress = import.meta.env.VITE_DAPPTOKEN_ADDRESS;

export default function Dashboard({ provider, signer, address }) {
  const [isOwner, setIsOwner] = useState(false);
  const [tokenFarmContract, setTokenFarmContract] = useState(null);
  const [lpTokenContract, setLpTokenContract] = useState(null);
  const [dappTokenContract, setDappTokenContract] = useState(null);

  // Inicializar contratos
  useEffect(() => {
    if (!signer) return;

    const tf = new ethers.Contract(tokenFarmAddress, tokenFarmAbi.abi, signer);
    setTokenFarmContract(tf);

    const lp = new ethers.Contract(lpTokenAddress, lpTokenAbi.abi, signer);
    setLpTokenContract(lp);

    const dapp = new ethers.Contract(dappTokenAddress, dappTokenAbi.abi, signer);
    setDappTokenContract(dapp);

    // Chequear si la cuenta es el owner
    const checkOwner = async () => {
      try {
        const owner = await tf.owner();
        setIsOwner(owner.toLowerCase() === address.toLowerCase());
      } catch (err) {
        console.error("Error al verificar owner:", err);
      }
    };
    checkOwner();
  }, [signer, address]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-400">
        ✅ Conectado como: <span className="font-mono">{address}</span>
      </p>

      {tokenFarmContract && lpTokenContract && dappTokenContract && (
        <BalancesPanel
          address={address}
          signer={signer}
          tokenFarmContract={tokenFarmContract}
          lpTokenContract={lpTokenContract}
          dappTokenContract={dappTokenContract}
        />
      )}

      <StakeForm
        lpTokenContract={lpTokenContract}
        tokenFarmContract={tokenFarmContract}
        signer={signer}
        address={address}
      />

      <Rewards contract={tokenFarmContract} signer={signer} address={address} />

      {isOwner && lpTokenContract && (
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mt-4"
          onClick={async () => {
            try {
              const recipient = prompt("Ingrese la dirección del destinatario:");
              if (!recipient) return;

              const amount = ethers.parseEther("100");
              const tx = await lpTokenContract.transfer(recipient, amount);
              await tx.wait();

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

      {isOwner && <OwnerPanel contract={tokenFarmContract} />}
    </div>
  );
}
