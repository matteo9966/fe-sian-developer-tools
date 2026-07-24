import type { UserType } from './UserType';
import type { Dispatch, SetStateAction } from 'react';

type UserContextType = {
    user: UserType | null;
    setUser: Dispatch<SetStateAction<UserType | null>>;
    authInizialized: boolean;
    setAuthInizialized: Dispatch<SetStateAction<boolean>>;
    loadUser: () => Promise<void>;
    parseJwt: (token: string) => string;
    lastAccessSaved: boolean;
    setLastAccessSaved: Dispatch<SetStateAction<boolean>>;
};

export type { UserContextType };