import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";
import { Header } from "../components/Header";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Supercoin</title>
        <meta name="description" content="Supercoin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Header />
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}

export default MyApp;
