require("dotenv").config()
const alchemyKey = process.env.ALCHEMY_KEY
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(alchemyKey)

const factoryABI = require("../constants/factoryABI.json")
const contractAddress = "0x6E35456677D17cd3d6d1F0A1C741fF90b632c830"

const factoryContract = new web3.eth.Contract(contractABI, contractAddress)



