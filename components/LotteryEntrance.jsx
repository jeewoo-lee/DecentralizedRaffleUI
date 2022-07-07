// have a function to call the lottery
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useEffect, useState, useRef } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
import factoryABI from "../constants/factoryABI.json"
import factoryAddress from "../constants/factoryAddress.json"
import { check } from "prettier"

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
  const [raffleAddress, setRaffleAddress] = useState(0)
  const [winMsg, setWinMsg] = useState("")
  const [isOwner, setIsOwner] = useState(0)
  const inputRef = useRef(0)

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
    checkOwner()
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
      checkOwner()
    }
  }, [isWeb3Enabled])

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

  const raffleHandleChange = (event) => {
    // setEnterAmount(event.target.value)
    // console.log(enterAmount)
  }

  const raffleHandleClick = (event) => {
    event.preventDefault()
    // console.log("enter:", enterAmount)
    // setEnterAmount(event.target.value)
    // console.log(enterAmount)
    enterRaffle()
  }

  const raffleStartHandleClick = (event) => {
    startRaffle()
  }

  const startRaffle = async () => {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const theAddress = raffleAddress.toString()

    if (raffleState.isOpen) {
      alert("Raffle is already open")
    } else {
      const raffle = new ethers.Contract(theAddress, abi, signer)
      await raffle.startRaffle()
    }
  }

  const enterRaffle = async () => {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const theAddress = raffleAddress.toString()
    const enterAmount = inputRef.current.value

    // !raffleState.isOpen
    if (!raffleState.isOpen) {
      alert("This Raffle is not opened yet!")
      console.log("balance: ", (await signer.getBalance()).toString())
    } else if (enterAmount.toString() > formatUnits((await signer.getBalance()).toString())) {
      alert("You don't have enough money")
    } else {
      const raffle = new ethers.Contract(theAddress, abi, signer)
      await raffle.enterRaffle({
        value: parseEther(enterAmount),
        gasLimit: 500000,
      })
    }
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

  async function checkOwner() {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const raffle = new ethers.Contract(raffleAddress, abi, signer)
    const accountAddress = (await signer.getAddress()).toString()
    const owner = await raffle.i_owner()
    console.log(accountAddress, owner)
    console.log(accountAddress == owner)
    setIsOwner(accountAddress == owner)
  }

  return (
    <div class="flex items-center justify-center pt-5 max-w-full">
      <div class="max-w-full rounded-lg shadow-lg shadow-blue-600/50 items-center justify-center pt-3 pb-5">
        <div className="flex justify-center items-center flex-col">
          {raffleFactoryAddress ? (
            <div className="fp-5 bg-center">
              <div className="text-xl	text-fuchsia-500">
                <h1 className="flex justify-center font-sans underline underline-offset-4">Enter Raffle!</h1>
              </div>
              <form className="flex justify-center max-w-full">
                <div className="flex justify-center border-b border-violet-500 py-2">
                  <input
                    ref={inputRef}
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="text"
                    placeholder="Enter Amount "
                    aria-label="Enter Raffle"
                    onChange={raffleHandleChange}
                  />
                  <button
                    className="flex-shrink-0 bg-violet-500 hover:bg-violet-700 border-violet-500 hover:border-violet-700 text-sm border-4 text-white py-1 px-2 rounded font-sans"
                    onClick={raffleHandleClick}
                  >
                    Enter Raffle
                  </button>
                </div>
              </form>
              <div className="mx-5 py-3">
                <div className="flex justify-center">
                  🏷 &nbsp; <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Item Price:</span>{" "}
                  <span className="text-blue-500">{formatUnits(itemPrice.toString())}</span>
                </div>
                <div className="flex justify-center">
                  🏦 &nbsp; <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Total Deposited:</span>{" "}
                  <span className="text-blue-500">{formatUnits(totalDeposited.toString())}</span>
                </div>
                <div className="flex justify-center">
                  🏆 &nbsp; <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Winning Number:</span>{" "}
                  <span className="text-blue-500">{recentWinNum.toString()}</span>
                </div>
                <div className="flex justify-center">
                  🎟 &nbsp; <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Raffle State:</span>{" "}
                  <span className="text-blue-500">{raffleState.toString()}</span>
                </div>
                <div className="flex justify-center">
                  🏠 &nbsp; <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"> Address:</span>{" "}
                  <span className="text-blue-500">{raffleAddress.toString()}</span>
                </div>
              </div>

              <div className="flex justify-center">
                <form className="w-full max-w-sm">
                  <div className="flex items-center border-b border-violet-500 py-2">
                    <input
                      className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder="Enter Token ID ... "
                      aria-label="Token ID"
                      onChange={handleChange}
                    />
                    <button
                      onClick={tokenHandleClick}
                      className="flex-shrink-0 bg-violet-500 hover:bg-violet-700 border-violet-500 hover:border-violet-700 text-sm border-4 text-white py-1 px-2 rounded font-sans"
                      type="button"
                    >
                      Check Win
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex justify-center">
                <div className="justify-center items-center">{winMsg}</div>
                <a href="https://rinkeby.etherscan.io/token/0xe598b9f221f5e0f65207b1fc23e41e27c1f0fba0" className="p-5 hover:text-blue-600 justify-center">
                  Token Info Etherscan
                </a>
              </div>
            </div>
          ) : (
            <div className="text-red-500 p-5">Connect to the valid Network! </div>
          )}

          {isOwner ? (
            <div>
              <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-6 rounded self-center font-sans" onClick={raffleStartHandleClick}>
                Start Raffle
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  )
}
