//import { gql } from "@apollo/client"
//import { useQuery } from "@apollo/client/react"

type DashboardProps = {
    symbol: string
}



const Dashboard = ({symbol}: DashboardProps) =>{
    return(
        <div>
            <h1>Displaying data for {symbol}</h1>
        </div>
    )
}

export default Dashboard