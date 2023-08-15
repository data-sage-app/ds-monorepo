import Head from "next/head";
import Hero from "../components/marketing/hero";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>DataSage</title>
        <meta
          name="description"
          content="DataSage - Supercharge your business"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <Hero />
      </main>
    </>
  );
};

export default Home;
