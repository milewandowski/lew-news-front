export class User {
    public id: number;
    public userId: string;
    public username: string;
    public password: string;
    public active: boolean;
    public notLocked: boolean;
    public role: string;
    public authorities: [];

    constructor() {
        this.id = 0;
        this.userId = ''
        this.username = '';
        this.password = '';
        this.active = false;
        this.notLocked = false;
        this.role = '';
        this.authorities = [];
    }
}
