import { createRoot } from 'react-dom/client';
import { UserProvider } from './context/UserContext';
import { App } from './App';
import './calendar.css';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(
    <UserProvider>
        <App />
    </UserProvider>
);
