import HeaderSearch from "./HeaderSearch"

type HeaderProps={
    onSearchSubmit: (symbol:string) => void
}

const Header = ({onSearchSubmit}:HeaderProps) =>{
    return(
        <header className="p-4">
      {/* A wrapper to control width and centering, matching the dashboard */}
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-2 md:px-8">
        
        {/* Left Side: Logo */}
        <div>
          <a href="#" aria-label="Home">
            CristianChiorescu
          </a>
        </div>

        {/* Right Side: Search Bar */}
        <div className="w-full max-w-xs">
          <HeaderSearch onSearchSubmit={onSearchSubmit} />
        </div>

      </div>
    </header>
    )
}

export default Header