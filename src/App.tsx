import { useState } from 'react'
//import { gql } from "@apollo/client";
//import { useQuery } from "@apollo/client/react";
//import { Chart as ChartJs } from 'chart.js'

import WelcomeSearch from './components/WelcomeSearch'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'


function App() {
  const [symbol, setSymbol] = useState<string|null>(null)

  return (
    <div className='min-h-screen flex flex-col text-white font-inter animated-gradient-bg'>
      {symbol?(<Header onSearchSubmit={setSymbol}/>):("")}
      <main className={`flex-1 ${
    symbol ? "" : "flex items-center justify-center"
  }`}>
        {symbol?(
          <Dashboard symbol={symbol} setSymbol={setSymbol}/>
        ):( 
      <WelcomeSearch onSearchSubmit={setSymbol}/>
      )}
      </main>
      <Footer/>
    </div>
  )
}

export default App
