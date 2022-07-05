import React from "react"

function Hero() {
  return (
    <div className="flex justify-center items-center flex-col pt-40 text-center font-bold lg:text-8xl text-6xl space-y-8 ">
      <div className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        <h1>Participate In</h1>
        <h1>Decentralized Raffle</h1>
      </div>
      <div className="flex justify-center items-center cursor-pointer hover:shadow-lg text-3xl text-white bg-pink-500 py-2 px-4 rounded-lg">
        <a href="/raffle">Join Right Now!</a>
      </div>
    </div>
  )
}

export default Hero
