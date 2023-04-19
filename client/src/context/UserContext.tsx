import { useState, createContext, Dispatch, SetStateAction } from 'react';

interface IUserContext {
    token?: string;
    isVerified?: boolean;
    details?: {
        _id: string;
        isVerified: boolean;
    };
}

const UserContext = createContext<[IUserContext, Dispatch<SetStateAction<IUserContext>>]>([
    {},
    () => {},
]);

const UserProvider = (props) => {
    const [state, setState] = useState({});
    return <UserContext.Provider value={[state, setState]}>{props.children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
