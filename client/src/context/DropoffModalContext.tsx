import { useState, createContext } from 'react';
import { SelectDropoffModal } from '../components/SelectDropoffModal';

// Dropoff Modal
export const DropoffModalContext = createContext({
    dropoffProps: {
        offers: [],
        show: false,
        onHide: () => {},
        onSuccess: () => {},
        onFail: () => {},
    },
    setDropoffProps: (state) => {},
});

export function DropoffModalProvider({ children }) {
    const [dropoffProps, setDropoffProps] = useState({
        offers: [],
        show: false,
        onHide: () => {},
        onSuccess: () => {},
        onFail: () => {},
    });

    return (
        <DropoffModalContext.Provider value={{ dropoffProps, setDropoffProps }}>
            <SelectDropoffModal />
            {children}
        </DropoffModalContext.Provider>
    );
}
