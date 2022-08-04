const API_URL = () => {
    return "http://localhost:7071/api/"
}

export async function deleteSingleEntryById(id: string) {
    const query = `Delete?id=${id}`;

    if (!id) {
        return null
    } else {
        let response = await fetch(API_URL() + query, {
            method: "POST",
        })
        return await response.text()
    }
}

export async function editScoreById(id: string, name: string, phone: string, time: string, map: string, tournament: string|null) {
    const query = `EditScore?id=${id}&name=${name}&phone=${phone}&time=${time}&map=${map}&tournament=${tournament}`
    return await fetch(API_URL() + query, {method: "POST"})
}
