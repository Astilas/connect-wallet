import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider, chain, defaultChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

import { Connect } from '../components/Connect'

function MyApp({ Component, pageProps }: AppProps) {
  // Chains for connectors to support
  const chains = defaultChains
  
  // Set up connectors
  const connectors = () => {
    return [
      new InjectedConnector({
        chains,
        options: { shimDisconnect: true },
      }),
    ]
  }

  return (
    <Provider autoConnect connectors={connectors}>
      <Connect />
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
