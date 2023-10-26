import React from 'react';
import { useAppStore } from '../zstore';
import Home from './Home';
import PlayPage from './PlayPage';
import '../App.css';
import Results from './Results';

function App() {
    const currentPage = useAppStore((state) => state.currentPage)
    switch(currentPage) {
        case 'home':
            return (<Home />)
        case 'results':
            return (<Results />)
        default:
            return (<PlayPage />)
    }
}

export default App;
