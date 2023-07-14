import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const NftViewerpage = () => {
  const [tokens, setTokens] = useState([]);

  const walletAddress = useSelector((state) => {
    return state.user.address;
  });

  const nftContract = useSelector((state) => {
    return state.user.monsterContract;
  });

  const updateTokens = async () => {
    if (!walletAddress || !nftContract) {
      return;
    }
    const tokenIds = await nftContract.walletOfOwner(walletAddress.toString());
    setTokens(tokenIds);
  };
  const [selectedNft, setSelectedNft] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openZoomModal = (token) => {
    setSelectedNft(token);
    setIsPopupOpen(true);
  };
  const closeModal = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    updateTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, nftContract]);

  return (
    <>
      {isPopupOpen ? (
        <div
          onClick={closeModal}
          className="fixed w-full h-screen bg-opacity-80 flex items-center justify-center bg-gray-700 top-1/2 left-1/2 right-auto bottom-auto -mr-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="md:h-full p-9 ">
            <img
              src={`https://crazymonsters.s3.amazonaws.com/CrazyMonsterImages/${Number(
                selectedNft
              )}.png`}
              alt=""
              className="relative md:h-full rounded-xl shadow-xl"
            />
          </div>
        </div>
      ) : undefined}
      <div
        className={
          tokens.length > 18
            ? "flex items-center justify-center flex-col h-auto pt-32 pb-32"
            : "flex items-center justify-center flex-col h-screen pt-32 pb-32"
        }
      >
        <div>
          <h2 className="text-3xl font-bold text-center py-9">
            Your Monster NFTs{" "}
          </h2>
        </div>
        {/* Wallet Nfts */}
        <div className="h-full px-4 md:px-0 grid grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-6 items-center justify-center">
          {
            // walletNfts.map((wnft) => (
            tokens.length > 0 ? (
              tokens.map((tokenId) => (
                <div key={Number(tokenId)} className="relative">
                  <div
                    onClick={() => openZoomModal(tokenId)}
                    className="cursor-pointer"
                  >
                    <img
                      src={`https://crazymonsters.s3.amazonaws.com/CrazyMonsterImages/${Number(
                        tokenId
                      )}.png`}
                      alt="nft"
                      className="w-44 rounded-xl shadow-xl cursor-pointer"
                    />
                  </div>
                  <span className="absolute top-0 px-3 py-1 bg-slate-700 bg-opacity-70 rounded-xl">
                    {Number(tokenId)}
                  </span>
                </div>
              ))
            ) : (
              <div className="h-screen">Loading...</div>
            )
          }
        </div>
      </div>
    </>
  );
};

export default NftViewerpage;
