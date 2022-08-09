const API_URL = () => {
    return "http://localhost:7071/api/"
}

export async function deleteSingleEntryById(id: string) {
    const command = `Delete`;

    if (!id) {
        return null
    } else {
        let response = await fetch(API_URL()+command, {
            method: "POST",
            body: JSON.stringify({Id:id})
        })
        return await response.text()
    }
}

export async function editScoreById(id: string, name: string, phone: string, time: string, map: string, tournament: string | null) {
    let query = `EditScore`
    return await fetch(API_URL() + query, {
        method: "POST",
        body: JSON.stringify({Id: id,Name: name, Time:time,PhoneNumber: phone, Tournament: tournament, Map: map})
    })
}

export async function addToDatabase(name: string, phone: string, time: string, map: string, tournament: string | null) {
    let query = `AddScore`
    return await fetch(API_URL() + query, {
        method: "POST",
        body: JSON.stringify({Name: name, PhoneNumber: phone, Tournament: tournament, Map: map, Time:time,Signature:await signatureGenerator(time)})
    })
}
const NOT_USED_FOR_ANYTHING_I_PROMISE = "Secret secret!!!!";
function buf2hex(buffer: ArrayBuffer) {
    // buffer is an ArrayBuffer
    // @ts-ignore
    return [...new Uint8Array(buffer)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");
}

export const signatureGenerator = async (message: string) => {
    const encoder = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(NOT_USED_FOR_ANYTHING_I_PROMISE + message),
        { name: "HMAC", hash: { name: "SHA-512" } },
        false,
        ["sign", "verify"]
    );
    const signature = await window.crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(message)
    );
    return buf2hex(signature);
};