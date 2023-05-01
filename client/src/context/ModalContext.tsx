import { useState, createContext } from 'react';

// Success Modal
export const SuccessModalContext = createContext({
    successProps: { show: false, message: '', onHide: () => {} },
    setSuccessProps: (state) => {},
});

// Error Modal
export const ErrorModalContext = createContext({
    errorProps: { show: false, message: '', onHide: () => {} },
    setErrorProps: (state) => {},
});

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

export function ModalProviders({ children }) {
    const [successProps, setSuccessProps] = useState({
        show: false,
        message: '',
        onHide: () => {},
    });

    const [errorProps, setErrorProps] = useState({
        show: false,
        message: '',
        onHide: () => {},
    });

    const [dropoffProps, setDropoffProps] = useState({
        offers: [],
        show: false,
        onHide: () => {},
        onSuccess: () => {},
        onFail: () => {},
    });

    return (
        <DropoffModalContext.Provider value={{ dropoffProps, setDropoffProps }}>
            <SuccessModalContext.Provider value={{ successProps, setSuccessProps }}>
                <ErrorModalContext.Provider value={{ errorProps, setErrorProps }}>
                    {children}
                </ErrorModalContext.Provider>
            </SuccessModalContext.Provider>
        </DropoffModalContext.Provider>
    );
}
