// App.js

import React from 'react';
import './App.css';
import Graph from './graph'; 
import LikelihoodGraph from './LikelihoodGraph'; 
import CountryPieChart from './CountryPieChart'; 

const App = () => {
    return (
        <div>
            <Graph />
            <LikelihoodGraph />
            <CountryPieChart /> 
        </div>
    );
};

export default App;
