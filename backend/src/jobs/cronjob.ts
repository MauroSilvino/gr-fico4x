import axios from "axios";
import { prisma } from "../lib/prisma";

export function updateDatabase() {
    const API_REQUEST_FROM_SYMBOL = 'EUR'
    const API_REQUEST_TO_SYMBOL = 'USD'

    setInterval(async () => {
        const response = await axios({
            method: 'get',
            url: `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${API_REQUEST_FROM_SYMBOL}&to_symbol=${API_REQUEST_TO_SYMBOL}&interval=5min&apikey=demo`,
        })

        const data = await prisma.graphicData.create({
            data: {
                value: response.data
            }
        })

        if(!data.id) {
            console.error('error while updating data on database')
            return
        }
        
        return data.id
    }, 300000); // 5min
}

