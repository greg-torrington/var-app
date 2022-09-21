/* global BigInt */

import TotalVAR from './TotalVAR';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createClient } from "urql"

let protocolInfo = []

export let allProtocols = []
export let totalVaR = 0;

const APIURL = "https://api.thegraph.com/subgraphs/name/greg-torrington/greg-v3"
const assetQuery = `
query {
  assets {
    id
    name
  	count
    users
  }
}
`

const client = createClient({
    url: APIURL
})

var navigate;

function Loading(){

    let usersQuery

    async function fetchBlockChainData() {
        const assetResponse = await client.query(assetQuery).toPromise()
        var rawAssetData = assetResponse.data.assets
        protocolInfo[0] = "Maker"
        protocolInfo[1] = rawAssetData

        for (var i=0; i<protocolInfo[1].length; i++){
            var noUsers = protocolInfo[1][i].count
      
            let skip = 0
            let first = 1000
            let users = []
            while (noUsers>0) {
      
                if (noUsers<1000){first=noUsers}

                    usersQuery = `
                        query {
                            users (
                            first: `+first+`
                                after: `+skip+`
                                ){
                                id
                                balance
                                allowance
                            }
                        }
                        `
                skip += 1000
                noUsers = noUsers - 1000

                const userResponse = await client.query(usersQuery).toPromise()
                users.push(userResponse.data.users)
            }
            protocolInfo[1][i][0] = users

            var contractVaR = 0
            for (var j=0; j<protocolInfo[1][i][0].length; j++){
                for (var c=0; c<protocolInfo[1][i][0][j].length; c++){
                    var allowance = protocolInfo[1][i][0][j][c].allowance
                    var balance = protocolInfo[1][i][0][j][c].balance
                    allowance = parseInt(allowance)/10**18
                    balance = parseInt(balance)/10**18
                    if (allowance<balance){
                        contractVaR = contractVaR + allowance
                    } else {
                        contractVaR = contractVaR + balance
                    }
                }
            }

        }

        var protocolVaR = 0
        for (var i=0; i<protocolInfo[1].length; i++){
            protocolVaR += protocolInfo[1][i][1]
        }
        protocolInfo[2] = contractVaR
        allProtocols.push(protocolInfo)
        totalVaR = contractVaR
        navigate("/leaderboard")
    }

    navigate = useNavigate()

    useEffect(() => {
        fetchBlockChainData()
    }, []);

    return(
        <div>Loading</div>
    )
}

export default Loading