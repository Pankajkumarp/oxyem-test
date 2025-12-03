import Head from "next/head";
import { Inter } from "next/font/google";
import MainHome from './home/index.page.jsx';
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Access to Oxyem platform | Oxytal</title>
        <meta name="description" content="Access to Oxyem platform | Oxytal" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={''}>
      
        <MainHome />
        
      </main>
    </>
  );
}
