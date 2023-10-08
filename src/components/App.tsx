import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Home from './Home';
import PlayPage from './PlayPage';
import '../App.css';
import Results from './Results';

function App() {
    const currentPage = useSelector((state: RootState) => state.playPage.currentPage)
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
