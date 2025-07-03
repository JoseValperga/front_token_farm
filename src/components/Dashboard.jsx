import { useEffect, useState } from "react";
import { ethers } from "ethers";
import StakeForm from "./StakeForm";
import Rewards from "./Rewards";
import OwnerPanel from "./OwnerPanel";
import tokenFarmAbi from "../abi/TokenFarm.json";

const tokenFarmAddress = import.meta.env.VITE_TOKENFARM_ADDRESS;

export default function Dashboard({ provider, signer, address }) {
  const [isOwner, setIsOwner] = useState(false);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const tf = new ethers.Contract(tokenFarmAddress, tokenFarmAbi.abi, signer);
    setContract(tf);

    const checkOwner = async () => {
      const owner = await tf.owner();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
    };
    checkOwner();
  }, [signer, address]);
  

  return (
    <div>
      <p className="mb-4">✅ Conectado como: {address}</p>
      <StakeForm contract={contract} signer={signer} address={address} />
      <Rewards contract={contract} signer={signer} address={address} />
      {isOwner && <OwnerPanel contract={contract} />}
    </div>
  );
}
