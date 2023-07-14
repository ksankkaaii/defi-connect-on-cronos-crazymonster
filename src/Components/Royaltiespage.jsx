import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaTwitter, FaDiscord, FaLink } from "react-icons/fa";
import BigNumber from "bignumber.js";

const Royaltiespage = () => {
  const [totalDistributed, setTotalDistributed] = useState(0);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const provider = useSelector((state) => {
    return state.user.provider;
  });
  const walletAddress = useSelector((state) => {
    return state.user.address;
  });
  const nftContract = useSelector((state) => {
    return state.user.monsterContract;
  });
  const royaltyContract = useSelector((state) => {
    return state.user.royaltyContract;
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, nftContract, provider]);

  const fetchData = async () => {
    if (!nftContract || !walletAddress || !provider || !royaltyContract) {
      return;
    }

    const totalReleases = await royaltyContract.totalReleased();
    setTotalDistributed(
      BigNumber(totalReleases.toString())
        .div(10 ** 18)
        .toNumber()
        .toFixed(2)
    );

    const tokenIds = await nftContract.walletOfOwner(walletAddress.toString());
    const availableToClaim = await royaltyContract.mymultiPAYOUT(tokenIds);
    setTotalAvailable(
      BigNumber(availableToClaim.toString())
        .div(10 ** 18)
        .toNumber()
        .toFixed(2)
    );
  };

  const handleClaim = async () => {
    if (!nftContract || !walletAddress || !provider || !royaltyContract) {
      return;
    }
    const tokenIds = await nftContract.walletOfOwner(walletAddress.toString());
    console.log(tokenIds.toString());
    const availableToClaim = await royaltyContract.mymultiPAYOUT(tokenIds);
    console.log(availableToClaim.toString());
    const tx = await royaltyContract.multiRelease(
      tokenIds,
      walletAddress.toString()
    );
    await tx.wait();
    fetchData();
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <div className="border border-2 border-gray-300 w-fit">
        <h2 className="text-3xl font-bold text-center py-5 px-9 text-primary">
          Royalties{" "}
        </h2>
      </div>
      <div className="text-2xl font-bold">
        <h2>Crazzzy Monsters</h2>
      </div>
      <div className="flex gap-6 px-4 md:px-0">
        <div className="bg-secondary px-6 py-2 rounded-lg bg-opacity-80 text-black text-center">
          <h3 className="font-bold">Claimable</h3>
          <h3>{totalAvailable} CRO</h3>
        </div>
        <div className="bg-secondary px-6 py-2 rounded-lg bg-opacity-80 text-black text-center">
          <h3 className="font-bold">Total Distributed</h3>
          <h3>{totalDistributed} CRO</h3>
        </div>
      </div>
      <div>
        <button
          className="bg-gray-300 px-6 py-2 rounded-lg bg-opacity-20 hover:bg-primary  text-xl hover:text-2xl font-bold transition-all ease-in-out"
          onClick={handleClaim}
        >
          Claim
        </button>
      </div>

      {/* Social Links */}
      <div className="inline-flex gap-12 mt-6 text-2xl">
        <div>
          <Link>
            <FaTwitter className="hover:text-secondary" />
          </Link>
        </div>
        <div>
          <Link>
            <FaDiscord className="hover:text-secondary" />
          </Link>
        </div>
        <div>
          <Link>
            <FaLink className="hover:text-secondary" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Royaltiespage;
