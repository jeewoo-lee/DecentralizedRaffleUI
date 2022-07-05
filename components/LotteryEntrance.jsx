// have a function to call the lottery
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
  const [itemPrice, setitemPrice] = useState("0")
  const [totalDeposited, settotalDeposited] = useState("0")
  const [recentWinNum, setrecentWinNum] = useState("0")

  const formatUnits = ethers.utils.formatUnits

  const dispatch = useNotification()

  const {
    runContractFunction: enterRaffle,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the network id
    functionName: "enterRaffle",
    params: {},
    msgValue: itemPrice,
  })

  const { runContractFunction: i_item_price } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "i_item_price",
    params: {},
  })

  const { runContractFunction: s_total_deposited } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "s_total_deposited",
    params: {},
  })

  const { runContractFunction: s_winNum } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the network id
    functionName: "s_winNum",
    params: {},
  })

  async function updateUI() {
    const itemPriceFromCall = (await i_item_price()).toString()
    const totalDepositedFromCall = (await s_total_deposited()).toString()
    const winNumFromCall = (await s_winNum()).toString()
    setitemPrice(itemPriceFromCall)
    settotalDeposited(totalDepositedFromCall)
    setrecentWinNum(winNumFromCall)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      if (raffleAddress) {
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
      {raffleAddress ? (
        <div className="p-5 bg-center">
          <div className="text-xl	text-fuchsia-500">Raffle Entrance!</div>
          <button
            className="bg-violet-500 hover:bg-violet-600 text-white font-mono py-2 px-4 rounded self-center"
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess, //transaction is sent to metamask
                onError: (error) => console.log(error),
              })
            }}
            disabled={isFetching || isLoading}
          >
            {isFetching || isLoading ? <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div> : <div>Enter Raffle</div>}
          </button>
          <div>Item Price: {ethers.utils.formatUnits(itemPrice, "ether")}</div>
          <div>Total Deposited: {formatUnits(totalDeposited)}</div>
          <div>Winning Number: {recentWinNum}</div>
        </div>
      ) : (
        <div>Unsupported Network :( </div>
      )}
    </div>
  )
}
