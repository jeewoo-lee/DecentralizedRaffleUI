import React from "react"

function Hero() {
  return (
    <div>
      <div className="flex justify-center items-center flex-col pt-40 text-center font-bold lg:text-8xl text-6xl space-y-5 ">
        <div className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          <h1>Participate In</h1>
          <h1>Decentralized Raffle</h1>
        </div>
        <span className="text-sm font-light">Earn your chance to get Jordans, Yeezys, Teslas or whatever is listed with just few bucks! 🙏</span>
        <div className="flex justify-center items-center cursor-pointer hover:shadow-lg text-lg text-white bg-black py-2 px-4 rounded-lg">
          <a href="/raffle">🔥 Join Right Now! 💪</a>
        </div>
      </div>
    </div>
  )
}

export default Hero
