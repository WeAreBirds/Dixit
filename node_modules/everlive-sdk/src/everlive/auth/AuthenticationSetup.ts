import {Setup} from '../Setup';
export class AuthenticationSetup {
    setup: Setup;

    onAuthenticationRequired: any;
    persist: boolean;

    constructor(setup: Setup, options: any = {}) {
        this.onAuthenticationRequired = options.onAuthenticationRequired;
        this.persist = options.persist;
        this.setup = setup;
    }
}