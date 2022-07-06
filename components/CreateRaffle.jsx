import { useMoralis, useWeb3Contract } from "react-moralis"
// import { factoryABI, factoryAddress } from "../constants"
import factoryABI from "../constants/factoryABI.json"
import factoryAddress from "../constants/factoryAddress.json"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function CreateRaffle() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const raffleFactory = chainId in factoryAddress ? factoryAddress[chainId][0] : null
  const [raffles, setRaffles] = useState("0")
  const [minInput, setMinInput] = useState("0")
  const [raffleId, setRaffleId] = useState("0")

  const formatUnits = ethers.utils.formatUnits
  const parseEther = ethers.utils.parseEther
  const dispatch = useNotification()

  let itemPrice, interval, inputId
  itemPrice = parseEther("0.01")
  interval = 1200

  const {
    runContractFunction: createRaffle,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: factoryABI,
    contractAddress: raffleFactory,
    functionName: "createRaffle",
    params: { _itemPrice: itemPrice, _interval: interval },
  })
  const { runContractFunction: getRaffleId } = useWeb3Contract({
    abi: factoryABI,
    contractAddress: raffleFactory, // specify the networkId
    functionName: "raffleId",
    params: {},
  })

  const { runContractFunction: getRaffles } = useWeb3Contract({
    abi: factoryABI,
    contractAddress: raffleFactory, // specify the networkId
    functionName: "raffles",
    params: { id: inputId },
  })

  const { runContractFunction: getMinInput } = useWeb3Contract({
    abi: factoryABI,
    contractAddress: raffleFactory, // specify the networkId
    functionName: "minInput",
    params: {},
  })

  async function updateUI() {
    const raffleIdFromCall = (await getRaffleId()).toString()
    // const rafflesFromCall = (await s_total_deposited()).toString()
    const minInputFromCall = (await getMinInput()).toString()
    // setitemPrice(itemPriceFromCall)
    setRaffleId(raffleIdFromCall)
    setMinInput(minInputFromCall)
  }

  async function updataRaffleAddresss() {

  }

  useEffect(() => {
    if (isWeb3Enabled) {
      if (raffleFactory) {
        updateUI()
      }
    }
  }, [isWeb3Enabled])

  const handleSuccess = async (tx) => {
    await tx.wait(1)
    handleNewNotification(tx)
    updateUI()
  }

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    })
  }
  return (
    <div className="flex justify-center items-center flex-col">
      {raffleFactory ? (
        <div className="p-5 bg-center">
          <div className="text-xl	text-fuchsia-500">Raffle Admin Page</div>
          <button
            className="bg-violet-500 hover:bg-violet-600 text-white font-mono py-2 px-4 rounded self-center"
            onClick={async function () {
              await createRaffle({
                onSuccess: handleSuccess, //transaction is sent to metamask
                onError: (error) => console.log(error),
              })
            }}
            disabled={isFetching || isLoading}
          >
            {isFetching || isLoading ? <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div> : <div>Create Raffle</div>}
          </button>
          <div>Next RaffleID: {raffleId}</div>
          <div>Minimum Input: {formatUnits(minInput)}</div>
          {/* <div>Winning Number: {recentWinNum}</div> */}
        </div>
      ) : (
        <div className="text-red-500">Connect to the valid Network! </div>
      )}
    </div>
  )
}
