import { createContext, useState, useEffect } from 'react';

export const DisplayContext = createContext<boolean>(false);

export function DisplayProvider(props: any) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    function handleWindowSizeChange() {
        setIsMobile(window.innerWidth <= 768);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    return <DisplayContext.Provider value={isMobile}>{props.children}</DisplayContext.Provider>;
}
