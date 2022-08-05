import {ISearchDataElement} from "../Interfaces/RawDataResponse";

const API_URL = () => {
    return "http://localhost:7071/api/"
}

export async function searchDatabase(name?: string, phone?: string, map?: string, tournament?: string) {
    const queryString = () => {
        let query = "GetUserData?";
        if (name) {
            query += `&name=${name}`
        }
        if (phone) {
            query += `&phone=${phone}`
        }
        if (tournament) {
            query += `&tournament=${tournament}`
        }
        if (map) {
            query += `&map=${map}`
        }
        return query
    }

    if (!name && !phone && !tournament && !map) {
        return []
    } else {
        let response = await fetch(API_URL() + queryString())
        let data = await response.json()
        return data as ISearchDataElement[];

    }
}

export async function getSingleUserById(id: string) {
    const query = `GetSingleUserById?id=${id}`;
    
    if (!id) {
        return null
    } else {
        let response = await fetch(API_URL() + query)
        let data = await response.json()
        return data as ISearchDataElement;

    }
}
