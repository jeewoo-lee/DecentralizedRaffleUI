import React from "react"
import { Transition } from "@headlessui/react" // smooth transition between tabs
import { Link } from "next/link" // Alternate for a tag. We use Link for ref.
import { navLinks } from "../utils/data"

function NavBar() {
  return (
    <div>
      {/* for Main Nav Container */}
      <nav className="shadow-sm fixed w-full z-10">
        <div className="w-full">
          <div className="flex items-center h-20 w-full">
            {/* first block section Outer Part */}
            <div className="flex items items-center mx-20 justify-between w-full">
              <div className="flex justify-center items-center flex-shrink-0">
                <h1 className="font-bold text-3xl cursor-pointer">
                  <a href="/">
                    <span className="text-blue-500">Ely</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500">Raffle</span>
                  </a>
                </h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline spacce-x-4">
                  <a href="/" className="cursor-pointer px-3 py-2 text-lg hover:text-blue-600">
                    About
                  </a>
                  <a href="/" className="cursor-pointer px-3 py-2 text-lg hover:text-blue-600">
                    Raffles
                  </a>

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
    </div>
  )
}

export default NavBar
