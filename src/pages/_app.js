import App, { AppContext } from 'next/app'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
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