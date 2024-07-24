import React, { useEffect, useState } from 'react';
import * as d3 from d3;

const LikelihoodGraph = () => {
    const [likelihoodData, setLikelihoodData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('http://localhost:8000/visualizer/likelihood-values/')  // Replace with your actual URL
            .then(response => response.json())
            .then(data => {
                // Convert likelihood values to numeric and count instances
                const likelihoodCounts = countLikelihoods(data);
                setLikelihoodData(likelihoodCounts);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const countLikelihoods = (data) => {
        // Count instances of each likelihood value
        const counts = {};
        data.forEach(item => {
            const likelihood = parseInt(item.likelihood);  
            counts[likelihood] = counts[likelihood] ? counts[likelihood] + 1 : 1;
        });
        return Object.entries(counts).map(([likelihood, count]) => ({
            likelihood: parseInt(likelihood),
            count
        }));
    };

    useEffect(() => {
        if (likelihoodData.length > 0) {
            drawChart();
        }
    }, [likelihoodData]);

    const drawChart = () => {
        // D3 code to draw the bar chart
        const containerWidth = window.innerWidth - 50;
        const svg = d3.select('#likelihood-graph')
            .attr('width', containerWidth)
            .attr('height', 500);

        const margin = { top: 20, right: 30, bottom: 60, left: 40 };
        const width = containerWidth - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        const x = d3.scaleBand()
            .domain(likelihoodData.map(d => d.likelihood))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(likelihoodData, d => d.count)]).nice()
            .range([height - margin.bottom, margin.top]);

        svg.selectAll("*").remove();

        svg.append('g')
            .attr('fill', 'steelblue')
            .selectAll('rect')
            .data(likelihoodData)
            .join('rect')
            .attr('x', d => x(d.likelihood))
            .attr('y', d => y(d.count))
            .attr('height', d => y(0) - y(d.count))
            .attr('width', x.bandwidth());

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(d3.format('d')));

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', width / 2)
            .attr('y', height + 40)
            .text('Likelihood Values and Counts');

        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -(height / 2))
            .attr('y', -margin.left + 10)
            .text('Count of Entries');
    };

    return (
        <div style={{ width: '100%' }}>
            <h1>Likelihood Graph</h1>
            <svg id="likelihood-graph"></svg>
        </div>
    );
};

export default LikelihoodGraph;
