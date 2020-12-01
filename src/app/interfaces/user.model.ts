export class User {
    constructor(
        public userId: string,
        public email: string,
        private _token: string,
        private _tokenExpirationDate: Date

    ) { }

    get token() {
        if (!this._tokenExpirationDate || this._tokenExpirationDate <= new Date()) {
            return null;
        }
        return this._token;
    }

    get tokenExpirationDate() {
        if (!this._tokenExpirationDate || this._tokenExpirationDate <= new Date()) {
            return null;
        }
        return this._tokenExpirationDate;
    }

    get tokenDuration() {
        if (!this.token) {
            return 0;
        }
        return (this.tokenExpirationDate.getTime() - new Date().getTime());
        // return 2000;
    }
}
