import React from "react";

type GlassPanelProps = {
    children: React.ReactNode,
    className?: string,
}

const GlassPanel = ({children, className = ""}: GlassPanelProps) =>{
    return(
        <div className={`
        bg-black/10 backdrop-blur-lg rounded-xl shadow-lg
        border border-white/10
        p-6 ${className} 
      `}>
        {children}
      </div>
      
    )
}

export default GlassPanel