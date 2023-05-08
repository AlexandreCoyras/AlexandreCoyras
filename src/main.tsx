import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './style.css';
import App from './app';
import { Analytics } from '@vercel/analytics/react';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <StrictMode>
        <App />
        <Analytics />
    </StrictMode>
);
