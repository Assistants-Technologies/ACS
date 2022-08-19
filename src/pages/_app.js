import App, { AppContext } from 'next/app'
import { GoogleAnalytics, usePageViews } from "nextjs-google-analytics"

function MyApp({ Component, pageProps }) {
  usePageViews({ gaMeasurementId: "G-8CGP8663C1" })

  return (
    <>
      <GoogleAnalytics gaMeasurementId={"G-8CGP8663C1"} />
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