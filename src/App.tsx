import { useState } from 'react'
//import { gql } from "@apollo/client";
//import { useQuery } from "@apollo/client/react";
//import { Chart as ChartJs } from 'chart.js'

import WelcomeSearch from './components/WelcomeSearch'
import Dashboard from './components/Dashboard'


function App() {
  const [symbol, setSymbol] = useState<string|null>(null)

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <main className='flex-1 flex flex-col'>
        {symbol?(
          <Dashboard symbol={symbol}/>
        ):(
      <WelcomeSearch onSearchSubmit={setSymbol}/>
      )}
      </main>
    </div>
  )
}

export default App
