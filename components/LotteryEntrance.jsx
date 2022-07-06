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
  const [winMsg, setWinMsg] = useState(" ")

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

  const [tokenId, setTokenId] = useState(0)

  const handleChange = (event) => {
    setTokenId(event.target.value)

    console.log("value is:", event.target.value)
  }

  const tokenHandleClick = (event) => {
    event.preventDefault()

    // 👇️ value of input field
    console.log("tokenHandleClick 👉️", tokenId)
    checkWin()
  }

  async function checkWin() {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    console.log(raffleAddress.toString())
    const raffle = new ethers.Contract(raffleAddress, abi, signer)
    const isWinner = await raffle.checkWin(tokenId)
    if (isWinner && recentWinNum != 0) {
      console.log("You're the winner. Congrats 🔥")
      setWinMsg("You're the winner. Congrats 🔥")
    } else {
      console.log("You didn't win this time. 😪 Don't worry, you can win next time! 🤞")
      setWinMsg("You didn't win this time. 😪 Don't worry, you can win next time! 🤞")
    }
  }

  return (
    <div className="flex justify-center items-center flex-col">
      {raffleFactoryAddress ? (
        <div className="p-5 bg-center">
          <div className="text-xl	text-fuchsia-500">Raffle Entrance!</div>
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
            <form class="w-full max-w-sm">
              <div class="flex items-center border-b border-violet-500 py-2">
                <input
                  class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="text"
                  placeholder="Enter Token ID ... "
                  aria-label="Token ID"
                  onChange={handleChange}
                />
                <button
                  onClick={tokenHandleClick}
                  class="flex-shrink-0 bg-violet-500 hover:bg-violet-700 border-violet-500 hover:border-violet-700 text-sm border-4 text-white py-1 px-2 rounded"
                  type="button"
                >
                  Check Win
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-red-500">Connect to the valid Network! </div>
      )}
      <div>
        {winMsg}
      </div>
    </div>
  )
}
