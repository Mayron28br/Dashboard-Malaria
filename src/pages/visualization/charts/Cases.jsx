import React, { useState, useEffect } from 'react';
import './Cases.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, LineElement } from 'chart.js';
import Papa from 'papaparse';

// Registre todos os elementos necessários para o Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, LineElement);

const Cases = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch('/malariaprepro.csv')
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao carregar o arquivo CSV');
        return response.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          delimiter: ';',
          skipEmptyLines: true,
          complete: (result) => {
            console.log('Dados brutos:', result.data);
  
            // 1. Transforme a data em ano e agrupe os valores
            const groupedData = result.data.reduce((acc, row) => {
              const year = new Date(row.Date).getFullYear(); // Extraia o ano da data
              const value = parseInt(row.Notifications, 10) || 0; // Converta notificações para número
              
              if (!acc[year]) acc[year] = 0; // Inicialize o ano com zero, se necessário
              acc[year] += value; // Some os valores das notificações
              return acc;
            }, {});
  
            // 2. Prepare os dados para o gráfico
            const labels = Object.keys(groupedData); // Os anos (chaves do objeto)
            const data = Object.values(groupedData); // Os valores agregados
  
            setChartData({
              labels: labels,
              datasets: [
                {
                  label: 'Notificações de Malária por Ano',
                  data: data,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  fill: true,
                  tension: 0.4,
                },
              ],
            });
          },
        });
      })
      .catch((error) => console.error('Erro ao carregar o CSV:', error));
  }, []);
  
  

  // Opções do gráfico
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Gráfico de Casos Registrados ao Longo dos Anos',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    layout: {
      padding: 10,
    },
  };

  return (
    <div className="Container">
      <div className="ChartLine">
        {chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>Carregando gráfico...</p>
        )}
      </div>
    </div>
  );
};

export default Cases;
