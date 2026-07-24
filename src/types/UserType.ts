/**
 * SIAN
 * Copyright © 2009 | SIN S.p.A.
 */
export type UserType = {
    /**
     * The fiscal code of the user.
     */
    codfis: string;
    /**
     * The email of the user.
     */
    mail: string;
    /**
     * The given name of the user (first name).
     */
    givenname: string;
    /**
     * The roles of the user.
     */
    roles: string[];
    /**
     * The surname of the user (last name).
     */
    sn: string;
    /**
     * The type of the user ('Q' for qualified user, 'I' for institutional user).
     */
    tipologiautente: 'Q' | 'I';
    /**
     * The phone number of the user.
     */
    telefono: string;
    /**
     * The subject of the user.
     */
    sub: string;
    /**
     * The issuer of the user.
     */
    iss: string;
    /**
     * The issue at timestamp of the user.
     */
    iat: number;
    /**
     * The expiration timestamp of the user.
     */
    exp: number;
    /**
     * Indicates whether the user is foreign or not.
     */
    isForeign: boolean;
};
