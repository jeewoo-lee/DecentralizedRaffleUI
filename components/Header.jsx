import { ConnectButton } from "web3uikit"

export default function Header() {
  return (
    <div>
      <div className="p-5 border-b-2 flex flex-row">
        <div className="text-5xl font-extrabold ...">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 font-mono">Decentralized Lottery</span>
        </div>
        <div className="ml-auto py-2 px-4">
          <ConnectButton moralis Auth={false} />
        </div>
      </div>
    </div>
  )
}
