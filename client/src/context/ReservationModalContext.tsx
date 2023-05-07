import { useState, createContext } from 'react';
import { SelectDropoffModal } from '../components/SelectDropoffModal';
import { ConfirmCancelModal } from '../components/ConfirmCancelModal';

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

// Cancel Offer Modal
export const CancelOfferModalContext = createContext({
    cancelProps: {
        show: false,
        sendCancel: () => Promise.resolve(),
        onHide: () => {},
        onSuccess: () => {},
        onFail: () => {},
    },
    setCancelProps: (state) => {},
});

export function DropoffModalProvider({ children }) {
    const [dropoffProps, setDropoffProps] = useState({
        offers: [],
        show: false,
        onHide: () => {},
        onSuccess: () => {},
        onFail: () => {},
    });

    const [cancelProps, setCancelProps] = useState({
        show: false,
        sendCancel: () => Promise.resolve(),
        onHide: () => {},
        onSuccess: () => {},
        onFail: () => {},
    });

    return (
        <DropoffModalContext.Provider value={{ dropoffProps, setDropoffProps }}>
            <CancelOfferModalContext.Provider value={{ cancelProps, setCancelProps }}>
                <SelectDropoffModal />
                <ConfirmCancelModal />
                {children}
            </CancelOfferModalContext.Provider>
        </DropoffModalContext.Provider>
    );
}
