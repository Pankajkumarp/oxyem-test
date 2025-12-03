// import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import Frontend from './Components/Layouts/Frontend.jsx';
import Login from './Components/Layouts/Login.jsx';
import  useAutoLogout from './hooks/useAutoLogout.jsx';
import { useEffect } from "react";
import { useRouter } from "next/router"
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,
    authority: process.env.NEXT_PUBLIC_AZURE_AUTHORITY,
    redirectUri: process.env.NEXT_PUBLIC_AZURE_REDIRECTURI,
  },
});

export default function _app({ Component, pageProps }: AppProps) {
useAutoLogout();
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []); 

  const router = useRouter()
   useEffect(() => {
    const url = window.location.href;
    const path = new URL(url).pathname;
    if (path === '/') {
        router.push(`/home`)    
      }

  }, [router.asPath]);
  if (router.route === "/" || router.route === "/login" || router.route === "/home" || router.route === "/changepassword" || router.route === "/passwordreset" || router.route === "/aboutus" || router.route === "/pricing" || router.route === "/signup") {
    return (
      <>
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/font.css" />
		<link rel="stylesheet" href="/assets/cssmenu/style.css" />
        <link rel="stylesheet" href="/assets/cssmenu/responsive.css" />
		<MsalProvider instance={msalInstance}>
        <Login>
            <Component {...pageProps} />       
        </Login>
		</MsalProvider>
        <script src="/assets/js/jquery-3.6.0.min.js"></script>
        <script src="/assets/js/script.js"></script>
        <script src="/assets/jsmenu/main.js"></script>
      </>

    )
  }  
  if (router.route === "/login" || router.route === "/passwordreset" || router.route === "/changepassword") {
    return (
      <>
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/font.css" />
        <Login>
            <Component {...pageProps} />
          
        </Login>
        <script src="/assets/js/jquery-3.6.0.min.js"></script>
        <script src="/assets/js/script.js"></script>
      </>

    )
  }
  if (router.route === "/home" || router.route === "/Privacy-policy") {
    return (
      <>
        <link rel="stylesheet" href="/assets/css/font.css" />
        <link rel="stylesheet" href="/assets/cssmenu/style.css" />
        <link rel="stylesheet" href="/assets/cssmenu/responsive.css" />
        <Component {...pageProps} />
        <script src="/assets/js/jquery-3.6.0.min.js"></script>
        <script src="/assets/js/script.js"></script>
        <script src="/assets/jsmenu/main.js"></script>
      </>

    )
  }
  return (
    <>
      <link rel="stylesheet" href="/assets/css/style.css" />
      <link rel="stylesheet" href="/assets/css/font.css" />
      {/* <Provider store={store}> */}
	  {/* <FollowerListProvider>
      <AppWrapper> */}
	  <MsalProvider instance={msalInstance}>
        <Frontend>
          <Component {...pageProps} />
        </Frontend>
		</MsalProvider>
      {/* </AppWrapper>
	  </FollowerListProvider> */}
      {/* </Provider> */}
      <script src="/assets/js/jquery-3.6.0.min.js"></script>
      <script src="/assets/js/script.js"></script>
    </>
  )
}