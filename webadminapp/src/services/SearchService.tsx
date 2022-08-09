import {ISearchDataElement} from "../Interfaces/RawDataResponse";

const API_URL = () => {
    return "http://localhost:7071/api/"
}

export async function searchDatabase(name?: string, phone?: string, map?: string, tournament?: string) {

    const query = "GetUserData"

    if (!name && !phone && !tournament && !map) {
        return []
    } else {
        let response = await fetch(API_URL() + query, {
            method: "POST",
            body: JSON.stringify({Name: name, PhoneNumber: phone, Tournament: tournament, Map: map})
        })
        let data = await response.json()
        return data as ISearchDataElement[];

    }
}
