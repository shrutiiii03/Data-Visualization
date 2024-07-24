import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';  // Import D3.js

const Graph = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/visualizer/intensity-values/')
            .then(response => response.json())
            .then(data => {
                const intensities = data.map(item => item.intensity);
                setData(intensities);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            createGraph(data);
        }
    }, [data]);

    const createGraph = (data) => {
        const containerWidth = window.innerWidth - 50;  // Adjust container width to cover almost the entire page
        const svg = d3.select('#graph')
            .attr('width', containerWidth)
            .attr('height', 500);

        const margin = { top: 20, right: 30, bottom: 60, left: 40 };  // Increased bottom margin for text
        const width = containerWidth - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        const x = d3.scaleBand()
            .domain(data.map((d, i) => i))
            .range([margin.left, width - margin.right])
            .padding(0.01);  // Adjust padding to make bars wider

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d)]).nice()
            .range([height - margin.bottom, margin.top]);

        svg.selectAll("*").remove();

        svg.append('g')
            .attr('fill', 'steelblue')
            .selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', (d, i) => x(i))
            .attr('y', d => y(d))
            .attr('height', d => y(0) - y(d))
            .attr('width', x.bandwidth());

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat('').tickSizeOuter(0));  // Remove tick labels

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        // Remove the second line on the x-axis
        svg.selectAll(".domain").attr("d", null);

        // Add text below the x-axis
        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', width / 2)
            .attr('y', height - margin.bottom + 40)  // Adjust position to be below the x-axis
            .text('Intensity Values over the Years');
    };

    return (
        <div style={{ width: '100%' }}>  {/* Ensure the container div is full width */}
            <h1>Intensity Graph</h1>
            <svg id="graph"></svg>
        </div>
    );
};

export default Graph;
