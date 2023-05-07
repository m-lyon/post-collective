import { useState, createContext } from 'react';
import { ErrorModal } from '../components/ErrorModal';
import { SuccessModal } from '../components/SuccessModal';

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

export function ActionModalProviders({ children }) {
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

    return (
        <SuccessModalContext.Provider value={{ successProps, setSuccessProps }}>
            <ErrorModalContext.Provider value={{ errorProps, setErrorProps }}>
                <ErrorModal />
                <SuccessModal />
                {children}
            </ErrorModalContext.Provider>
        </SuccessModalContext.Provider>
    );
}
