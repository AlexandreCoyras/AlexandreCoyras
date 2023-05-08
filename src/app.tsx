// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Home from './pages';
import Pc from './pages/pc';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/pc" element={<Pc />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
