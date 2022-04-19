import React, { useEffect, useState } from 'react'
import { useAccount, useConnect, useBalance } from 'wagmi'
import { Button } from 'antd'

export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

export const Connect = () => {

  useEffect(() => {

    const fetchDataAsync = async () => {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        'any'
      )

      const signer = provider.getSigner()
  
      let greet = new ethers.Contract(
        '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        [
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_greeting",
                "type": "string"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "inputs": [],
            "name": "greet",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_greeting",
                "type": "string"
              }
            ],
            "name": "setGreeting",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        provider
      )
      const message = await greet.greet() // read
      const tx = await greet.connect(signer).setGreeting("ui") // write
      console.log(message, "message")
      console.log(tx, "tx")

      tx.wait().then(
        (receipt: any) => {
       
          message.success('Funds withdrawn')
  
        },
        (error: any) => {
       
          console.log('Error', error)
       
        }
      )
    }
     fetchDataAsync()

  }, [])

  const isMounted = useIsMounted()
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  const [{ data: balanceData, error: errorBalance, loading }, getBalance] = useBalance({
    addressOrName: accountData ? accountData.address : '',
  })

  // if (loading) return <div className='wallet-info'>Fetching balance…</div>
  if (errorBalance) return <div className='wallet-info'>Error fetching balance</div>

  if (accountData) {
    return (
      <div className='wallet-info'>
        <h3>Connected to {accountData.connector.name}</h3>
        <img src={accountData.ens?.avatar} alt="ENS Avatar" />
        <div>
          {accountData.ens?.name
            ? `${accountData.ens?.name} (${accountData.address})`
            : accountData.address}
        </div>
        <div>
          {balanceData?.formatted} {balanceData?.symbol}
        </div>
        <Button
          type='danger'
          onClick={disconnect}
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <>
    <div>
    <div className='wallet-div'>
      {data.connectors.map((connector) => (
        <Button
          type='primary'
          disabled={isMounted ? !connector.ready : false}
          key={connector.id}
          onClick={() => connect(connector)}
        >
          {isMounted ? connector.name : connector.id === 'injected' ? connector.id : connector.name}
          {isMounted ? !connector.ready && ' (unsupported)': ''}
        </Button>
      )
      )}
      </div>
      {error && <div className='wallet-div'>{error?.message ?? 'Failed to connect'}</div>}
      </div>
    </>
  )
}