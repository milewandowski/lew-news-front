export class EventRequest {

    public name: string;
    public shortDesc: string;
    public longDesc: string;
    public imageUrl: string;
    public startDate: string;
    public endDate: string;
    public typeId: number;

    constructor(name: string,
        shortDesc: string,
        longDesc: string,
        imageUrl: string,
        startDate: string,
        endDate: string,
        typeId: number) {
            this.name = name;
            this.shortDesc = shortDesc;
            this.longDesc = longDesc;
            this.imageUrl = imageUrl;
            this.startDate = startDate;
            this.endDate = endDate;
            this.typeId = typeId;
    }
}
