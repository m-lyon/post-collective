import { useState, createContext, Dispatch, SetStateAction } from 'react';

interface IUserContext {
    token?: string;
}

const UserContext = createContext<[IUserContext, Dispatch<SetStateAction<IUserContext>>]>([
    {},
    () => {},
]);

let initialState = {};

const UserProvider = (props) => {
    const [state, setState] = useState(initialState);
    return <UserContext.Provider value={[state, setState]}>{props.children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
