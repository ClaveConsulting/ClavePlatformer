
const API_URL = () => {
    return "http://localhost:7071/api/"
}

export async function deleteSingleEntryById(id: string) {
    const query = `Delete?id=${id}`;

    if (!id) {
        return null
    } else {
        let response = await fetch(API_URL() + query,{
            method: "POST",
        })
        return await response.text()
    }
}
