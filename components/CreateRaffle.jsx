import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, factoryAddress } from "../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function CreateRaffle() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const raffleContract = chainId in factoryAddress ? factoryAddress[chainId][0] : null
  const [itemPrice, setitemPrice] = useState("0")
  const [totalDeposited, settotalDeposited] = useState("0")
  const [recentWinNum, setrecentWinNum] = useState("0")
}
