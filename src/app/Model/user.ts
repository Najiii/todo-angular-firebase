export class User {
    email: String;
    todo: Array<String>

    constructor(email: String, todo: Array<String>) {
        this.email = email;
        this.todo = todo;
    }
}
