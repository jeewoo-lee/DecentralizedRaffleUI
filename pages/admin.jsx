import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader.js"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"
import Link from "next/link"
import NavBar from "../components/NavBar"
import CreateRaffle from "../components/CreateRaffle"

export default function Admin() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Our Smart Contract Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <ManualHeader /> */}
      {/* <Header />
      <LotteryEntrance />
      <Link href="/">
        <a>this page!</a>
      </Link> */}
      <NavBar></NavBar>
      <CreateRaffle />
    </div>
  )
}
