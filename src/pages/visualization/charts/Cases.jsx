import React, { useState, useEffect } from 'react';
import './Charts.css';
import '../components/TypeChartButton.css';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, LineElement, BarElement, ArcElement } from 'chart.js';
import Papa from 'papaparse';

// Registre todos os elementos necessários para o Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, LineElement, BarElement, ArcElement);

const Cases = () => {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('line'); // Estado para o tipo de gráfico

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
  
            const groupedData = result.data.reduce((acc, row) => {
              const year = new Date(row.Date).getFullYear(); 
              const value = parseInt(row.Notifications, 10) || 0; 
              
              if (!acc[year]) acc[year] = 0; 
              acc[year] += value;
              return acc;
            }, {});
  
            const labels = Object.keys(groupedData); 
            const data = Object.values(groupedData); 

            // Cores dinâmicas para as barras
            const backgroundColor = [
              'rgba(255, 99, 132, 0.2)',  // Vermelho claro
              'rgba(54, 162, 235, 0.2)',  // Azul claro
              'rgba(255, 206, 86, 0.2)',  // Amarelo claro
              'rgba(75, 192, 192, 0.2)',  // Verde água claro
              'rgba(153, 102, 255, 0.2)', // Roxo claro
              'rgba(255, 159, 64, 0.2)',  // Laranja claro
              'rgba(201, 203, 207, 0.2)', // Cinza claro
              'rgba(255, 99, 71, 0.2)',   // Tomate claro
              'rgba(144, 238, 144, 0.2)', // Verde claro
              'rgba(135, 206, 235, 0.2)', // Azul céu claro
              'rgba(255, 140, 0, 0.2)',   // Laranja escuro claro
              'rgba(173, 216, 230, 0.2)', // Azul claro extra
              'rgba(106, 90, 205, 0.2)',  // Azul ardósia médio
              'rgba(255, 215, 0, 0.2)',   // Ouro claro
              'rgba(128, 0, 128, 0.2)',   // Púrpura
              'rgba(240, 128, 128, 0.2)', // Salmão claro
              'rgba(220, 20, 60, 0.2)',   // Carmim claro
              'rgba(0, 128, 128, 0.2)',   // Verde água escuro claro
              'rgba(218, 112, 214, 0.2)'  // Orquídea médio claro
            ];
            
            const borderColor = [
              'rgb(255, 99, 132)',  // Vermelho
              'rgb(54, 162, 235)',  // Azul
              'rgb(255, 206, 86)',  // Amarelo
              'rgb(75, 192, 192)',  // Verde água
              'rgb(153, 102, 255)', // Roxo
              'rgb(255, 159, 64)',  // Laranja
              'rgb(201, 203, 207)', // Cinza
              'rgb(255, 99, 71)',   // Tomate
              'rgb(144, 238, 144)', // Verde claro
              'rgb(135, 206, 235)', // Azul céu
              'rgb(255, 140, 0)',   // Laranja escuro
              'rgb(173, 216, 230)', // Azul claro extra
              'rgb(106, 90, 205)',  // Azul ardósia médio
              'rgb(255, 215, 0)',   // Ouro
              'rgb(128, 0, 128)',   // Púrpura
              'rgb(240, 128, 128)', // Salmão
              'rgb(220, 20, 60)',   // Carmim
              'rgb(0, 128, 128)',   // Verde água escuro
              'rgb(218, 112, 214)'  // Orquídea médio
            ];
            

            setChartData({
              labels: labels,
              datasets: [
                {
                  label: 'Notificações de Malária por Ano',
                  data: data,
                  backgroundColor: backgroundColor.slice(0, data.length), // Adapta ao tamanho dos dados
                  borderColor: borderColor.slice(0, data.length), // Adapta ao tamanho dos dados
                  borderWidth: 1,
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
    maintainAspectRatio: false,
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
      {/* Seleção do tipo de gráfico */}
      <div class="radio-input" value={chartType} onChange={(e) => setChartType(e.target.value)}>
        <label>
            <input value="line" name="value-radio" id="value-1" type="radio"/>
            <span>Linha</span>
        </label>
        <label>
            <input value="bar" name="value-radio" id="value-2" type="radio" />
            <span>Barra</span>
        </label>
        <label>
            <input value="pie" name="value-radio" id="value-3" type="radio" />
            <span>Pizza</span>
        </label>
        <span class="selection"></span>
      </div>
      {/* Renderização condicional do gráfico */}
      <div className="ChartLine">
        {chartData ? (
          chartType === 'line' ? (
            <Line data={chartData} options={options} />
          ) : chartType === 'bar' ? (
            <Bar data={chartData} options={options} />
          ) : (
            <Pie data={chartData} options={options} />
          )
        ) : (
          <p>Carregando gráfico...</p>
        )}
      </div>
    </div>
  );
};

export default Cases;
