import React from "react"
import { ConnectButton } from "web3uikit"
import { Transition } from "@headlessui/react" // smooth transition between tabs
import { Link } from "next/link" // Alternate for a tag. We use Link for ref.
import { navLinks } from "../utils/data"

export default function NavBar() {
  return (
    <div>
      {/* for Main Nav Container */}
      {/* <nav className="shadow-sm fixed w-full z-10"> */}
      <nav className="w-screen m-0 flex flex-row">
        <div className="w-screen">
          <div className="flex items-center h-20 w-full">
            {/* first block section Outer Part */}
            <div className="flex items items-center mx-20 justify-between w-full">
              <div className="flex justify-center items-center flex-shrink-0">
                <h1 className="font-bold text-3xl cursor-pointer">
                  <a href="/">
                    <span className="text-blue-500">Ely</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500" duration={500}>
                      Raffle
                    </span>
                  </a>
                </h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline spacce-x-4">
                  <a href="/" className="cursor-pointer px-3 py-2 text-lg hover:text-violet-600">
                    Team
                  </a>
                  <a href="/" className="cursor-pointer px-3 py-2 text-lg hover:text-violet-600">
                    Learn
                  </a>
                  <a href="/" className="cursor-pointer px-3 py-2 text-lg hover:text-violet-600">
                    Docs
                  </a>
                  <a href="/raffle" className="cursor-pointer px-3 py-2 text-lg hover:text-violet-600">
                    Raffles
                  </a>
                  <a href="/admin" className="cursor-pointer px-3 py-2 text-lg hover:text-violet-600">
                    Create
                  </a>
                  <ConnectButton />

                  {/* <Link href="/">
                    <a className="cursor-pointer text-blue-600 font-semibold px-3 py-2 text-md hover:font-bold"> Home</a>
                  </Link> */}
                  {/* <Link to="Home" smooth={true} offset={50} duration={500} className="cursor-pointer text-blue-600 font-semibold px-3 py-2 text-md hover:font-bold"></Link> */}
                  {/* <Link activeClass="About" to="about" smooth={true} offset={0} duration={500} className="cursor-pointer font-sens px-3 py-2 text-md hover:font-semibold hover:text-blue-500">
                    About
                  </Link>
                  <Link
                    activeClass="Participate"
                    to="participate"
                    smooth={true}
                    offset={0}
                    duration={500}
                    className="cursor-pointer font-sens px-3 py-2 text-md hover:font-semibold hover:text-blue-500"
                  >
                    Participate
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* </nav> */}
    </div>
  )
}
