import HeaderSearch from "./HeaderSearch"

type HeaderProps={
    onSearchSubmit: (symbol:string) => void
}

const Header = ({onSearchSubmit}:HeaderProps) =>{
    return(
        <header className="p-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center gap-10 px-2 md:px-8">
        
        <div>
          <a className="font-pacifico bg-linear-140 from-cyan-300 to-indigo-300 bg-clip-text text-transparent" href="https://cristianchiorescu.com/" target="_blank" aria-label="Portfolio">
            CristianChiorescu
          </a>
        </div>

        <div className="w-xs">
          <HeaderSearch onSearchSubmit={onSearchSubmit} />
        </div>

      </div>
    </header>
    )
}

export default Header