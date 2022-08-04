import {ISearchDataElement, ISearchDataResponse} from "../Interfaces/RawDataResponse";

const API_URL = () => {
    return "http://localhost:7071/api/"
}

export async function searchDatabase(name?: string, phone?: string, map?: string, tournament?: string) {
    const queryString = () => {
        let query = "GetUserData?";
        if (!!name) {
            query += `&name=${name}`
        }
        if (!!phone) {
            query += `&phone=${phone}`
        }
        if (!!tournament) {
            query += `&tournament=${tournament}`
        }
        if (!!map) {
            query += `&map=${map}`
        }
        return query
    }

    let responseElements = [];
    if (!name && !phone && !tournament) {
        return []
    } else {
        let response = await fetch(API_URL() + queryString())
        let data = await response.text()
        responseElements = JSON.parse(data) as ISearchDataElement[];
        
    }
    return responseElements
}
