// CountryPieChart.js

import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const CountryPieChart = () => {
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/visualizer/country-values/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const countries = data.map(entry => entry.country).filter(country => country); // Filter out empty strings
      setCountryData(countries);
      createPieChart(countries);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const createPieChart = (countries) => {
    const countryCounts = countOccurrences(countries);
    const labels = Object.keys(countryCounts);
    const data = Object.values(countryCounts);
    const backgroundColors = generateUniqueColors(labels.length);

    const ctx = document.getElementById('countryPieChart');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Country Distribution',
          data: data,
          backgroundColor: backgroundColors,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              }
            }
          }
        }
      }
    });
  };

  const countOccurrences = (array) => {
    return array.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
  };

  const generateUniqueColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = (360 / numColors) * i;
      const color = `hsl(${hue}, 70%, 50%)`; // Generate colors using HSL color model
      colors.push(color);
    }
    return colors;
  };

  return (
    <div>
      <h2>Country Pie Chart</h2>
      <canvas id="countryPieChart" width="400" height="400"></canvas>
    </div>
  );
};

export default CountryPieChart;
