import React, { useState } from "react"

type WelcomeSearchProps = {
    onSearchSubmit: (symbol:string) => void
}

const WelcomeSearch = ({onSearchSubmit}: WelcomeSearchProps) => {
    const [inputValue, setInputValue] = useState("")

    const handleSubmit = (event: React.FormEvent) =>{
        event.preventDefault()
        if (inputValue.trim()){
            onSearchSubmit(inputValue.trim().toUpperCase())
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setInputValue(event.target.value)
    }

    return(
        
            <div className="w-full max-w-3xl px-4">
        <form className="relative" onSubmit={handleSubmit}>
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <button className="absolute top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200" type="submit">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>
            </button>
            </div>
            <input className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" value={inputValue}  onChange={handleChange} placeholder="Search for a stock symbol (e.g., AAPL)"/>
        </form>
        </div>

    )

}

export default WelcomeSearch