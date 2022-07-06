// have a function to call the lottery
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
import factoryABI from "../constants/factoryABI.json"
import factoryAddress from "../constants/factoryAddress.json"

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  let inputId

  const raffleFactoryAddress = chainId in factoryAddress ? factoryAddress[chainId][0] : null

  // let raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
  const [itemPrice, setItemPrice] = useState("0")
  const [totalDeposited, setTotalDeposited] = useState("0")
  const [recentWinNum, setRecentWinNum] = useState("0")
  const [raffleState, setRaffleState] = useState("0")
  const [raffleAddress, setRaffleAddress] = useState("0")

  const formatUnits = ethers.utils.formatUnits
  const parseEther = ethers.utils.parseEther

  const dispatch = useNotification()

  async function updateUI() {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const theAddress = raffleAddress.toString()
    console.log(theAddress)
    const raffle = new ethers.Contract(theAddress, abi, signer)
    setItemPrice(await raffle.i_item_price())
    setTotalDeposited(await raffle.s_total_deposited())
    setRecentWinNum(await raffle.s_winNum())
    setRaffleState(await raffle.s_raffleState())
  }

  async function updatePrice() {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    console.log(raffleAddress.toString())
    const raffle = new ethers.Contract(raffleAddress, abi, signer)
    const price = (await raffle.i_item_price()).toString()
    setItemPrice(price)
  }

  async function loadRaffleAddress() {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const raffleFactory = new ethers.Contract(raffleFactoryAddress.toString(), factoryABI, signer)
    const id = (await raffleFactory.raffleId()).add(-1)
    const theAddress = await raffleFactory.raffles(id)
    setRaffleAddress(theAddress)
  }
  useEffect(() => {
    if (isWeb3Enabled) {
      loadRaffleAddress()
    }
  }, [isWeb3Enabled])
  useEffect(() => {
    if (isWeb3Enabled) {
      if (raffleAddress) {
        updateUI()
        // updatePrice()
      }
    }
  }, [isWeb3Enabled, raffleAddress])

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
      {raffleFactoryAddress ? (
        <div className="p-5 bg-center">
          <div className="text-xl	text-fuchsia-500">Raffle Entrance!</div>
          {/* <button
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
          </button> */}

          <button
            className="bg-violet-500 hover:bg-violet-600 text-white font-mono py-2 px-4 rounded self-center"
            onClick={async function () {
              if (!raffleState.isOpen) {
                alert("This Raffle is not opened yet!")
              } else {
                const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
                const theAddress = raffleAddress.toString()
                const raffle = new ethers.Contract(theAddress, abi, signer)
                await raffle.enterRaffle({
                  value: itemPrice.add(parseEther("0.05")),
                  gasLimit: 200000,
                })
              }
            }}
          >
            Enter Raffle
          </button>
          <div>Item Price: {ethers.utils.formatUnits(itemPrice.toString(), "ether")}</div>
          <div>Total Deposited: {formatUnits(totalDeposited.toString())}</div>
          <div>Winning Number: {recentWinNum.toString()}</div>
          <div>Raffle State: {raffleState.toString()}</div>
          <div>Raffle Address: {raffleAddress.toString()}</div>
          <div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:
                <input type="text" value={this.state.value} onChange={this.handleChange} />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      ) : (
        <div className="text-red-500">Connect to the valid Network! </div>
      )}
    </div>
  )
}
