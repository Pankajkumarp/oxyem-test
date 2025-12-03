import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
 
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1,shrink-to-fit=no, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/assets/img/favicon.ico" />
		<Script
        strategy="beforeInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="beforeInteractive">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
      </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html> 
  )
}
