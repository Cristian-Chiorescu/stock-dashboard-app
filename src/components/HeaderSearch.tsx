import React, { useState } from "react"

type HeaderSearchProps = {
    onSearchSubmit: (symbol:string) => void
}

const HeaderSearch = ({onSearchSubmit}: HeaderSearchProps) => {
    const [inputValue, setInputValue] = useState("")

    const handleSubmit = (event: React.FormEvent) =>{
        event.preventDefault()
        if (inputValue.trim()){
            onSearchSubmit(inputValue.trim().toUpperCase())
        }
        setInputValue("")
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setInputValue(event.target.value)
    }

    return(
        

        <form className="relative pl-" onSubmit={handleSubmit}>
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <button className="absolute top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors hover:bg-gray-100" type="submit">
            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>
            </button>
            </div>
            <input className="w-full py-2 pl-10 pr-4 bg-black/10 border border-white/20 rounded-full text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" value={inputValue}  onChange={handleChange} placeholder="Search..."/>
        </form>

    )

}

export default HeaderSearch