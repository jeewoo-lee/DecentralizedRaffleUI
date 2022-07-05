import { useMoralis, useWeb3Contract } from "react-moralis"
import { factoryABI, factoryAddress } from "../constants"
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
  const dispatch = useNotification()

  let itemPrice, interval, inputId

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
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "raffleId",
    params: {},
  })

  const { runContractFunction: getRaffles } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "raffles",
    params: { id: inputId },
  })

  const { runContractFunction: getMinInput } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "minInput",
    params: {},
  })
}
