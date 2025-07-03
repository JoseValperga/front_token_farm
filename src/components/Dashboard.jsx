import { useEffect, useState } from "react";
import { ethers } from "ethers";
import StakeForm from "./StakeForm";
import Rewards from "./Rewards";
import OwnerPanel from "./OwnerPanel";
import tokenFarmAbi from "../abi/TokenFarm.json";
import lpTokenAbi from "../abi/LPToken.json";

const lpTokenAddress = import.meta.env.VITE_LPTOKEN_ADDRESS;
const tokenFarmAddress = import.meta.env.VITE_TOKENFARM_ADDRESS;

export default function Dashboard({ provider, signer, address }) {
  const [isOwner, setIsOwner] = useState(false);
  const [tokenFarmContract, setTokenFarmContract] = useState(null);
  const [lpTokenContract, setLpTokenContract] = useState(null);

  useEffect(() => {
    if (!signer) return;

    // Conectar contratos
    const tf = new ethers.Contract(tokenFarmAddress, tokenFarmAbi.abi, signer);
    setTokenFarmContract(tf);

    const lp = new ethers.Contract(lpTokenAddress, lpTokenAbi.abi, signer);
    setLpTokenContract(lp);

    // Verificar owner
    const checkOwner = async () => {
      try {
        const owner = await tf.owner();
        setIsOwner(owner.toLowerCase() === address.toLowerCase());
      } catch (err) {
        console.error("Error verificando owner:", err);
      }
    };

    checkOwner();
  }, [signer, address]);

  return (
    <div>
      <p className="mb-4">✅ Conectado como: {address}</p>

      {tokenFarmContract && lpTokenContract && (
        <StakeForm
          lpTokenContract={lpTokenContract}
          tokenFarmContract={tokenFarmContract}
          signer={signer}
          address={address}
        />
      )}

      {tokenFarmContract && (
        <Rewards
          contract={tokenFarmContract}
          signer={signer}
          address={address}
        />
      )}
      {isOwner && tokenFarmContract && (
        <OwnerPanel
          contract={tokenFarmContract}
          lpTokenContract={lpTokenContract}
        />
      )}
    </div>
  );
}
