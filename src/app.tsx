// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Home from './pages';
import Pc from './pages/pc';
import { Route, Routes } from 'react-router-dom';

export function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/pc" element={<Pc />}></Route>
            </Routes>
        </div>
    );
}

export default App;
