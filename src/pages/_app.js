import App, { AppContext } from 'next/app'
import { GoogleAnalytics, usePageViews } from "nextjs-google-analytics"
import Script from "next/script";
import React from "react";

function MyApp({ Component, pageProps }) {
  usePageViews({ gaMeasurementId: "G-8CGP8663C1" })

  return (
    <>
      <GoogleAnalytics gaMeasurementId={"G-8CGP8663C1"} />
      <Script id="Adsense-id" data-ad-client="ca-pub-3673520795587574"
              async strategy="afterInteractive"
              onError={ (e) => { console.error('Script failed to load', e) }}
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      />
        <Script async strategy="afterInteractive" custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"/>
      <Component {...pageProps} />
    </>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)

  if (appContext.ctx.res?.statusCode === 404) {
    appContext.ctx.res.writeHead(302, { Location: '/?error=404_not_found' })
    appContext.ctx.res.end()
    return
  }

  return { ...appProps }
}

export default MyApp
