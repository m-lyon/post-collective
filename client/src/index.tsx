import { createRoot } from 'react-dom/client';
import { UserProvider } from './context/UserContext';
import { App } from './components/App';
import './calendar.css';
import { ActionModalProviders } from './context/ActionModalContext';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(
    <UserProvider>
        <ActionModalProviders>
            <App />
        </ActionModalProviders>
    </UserProvider>
);
