export interface ISearchDataElement {
    name:string,
    phoneNumber:string,
    map:string,
    tournament:string|null,
    id:string,
    time:string,
}

export interface ISearchDataResponse {
    elements: ISearchDataElement[]|null
}
