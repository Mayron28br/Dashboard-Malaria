import React, { useEffect, useState } from "react";
import "./Charts.css";
import { Radar, Line, Bar, Pie } from "react-chartjs-2";
import Papa from "papaparse";
import { Chart as ChartJS, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registrar os componentes necessários
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const RadarChart = () => {
  const [originalData, setOriginalData] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [years, setYears] = useState([]);
  const [chartType, setChartType] = useState("radar");
  const [selectedMunicipality, setSelectedMunicipality] = useState(""); // Estado para armazenar a cidade selecionada

  const backgroundColor = [
    'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
    'rgba(201, 203, 207, 0.2)', 'rgba(255, 99, 71, 0.2)', 'rgba(144, 238, 144, 0.2)',
    'rgba(135, 206, 235, 0.2)', 'rgba(255, 140, 0, 0.2)', 'rgba(173, 216, 230, 0.2)',
    'rgba(106, 90, 205, 0.2)', 'rgba(255, 215, 0, 0.2)', 'rgba(128, 0, 128, 0.2)',
    'rgba(240, 128, 128, 0.2)', 'rgba(220, 20, 60, 0.2)', 'rgba(0, 128, 128, 0.2)',
    'rgba(218, 112, 214, 0.2)'
  ];

  const borderColor = [
    'rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 206, 86)', 'rgb(75, 192, 192)',
    'rgb(153, 102, 255)', 'rgb(255, 159, 64)', 'rgb(201, 203, 207)', 'rgb(255, 99, 71)',
    'rgb(144, 238, 144)', 'rgb(135, 206, 235)', 'rgb(255, 140, 0)', 'rgb(173, 216, 230)',
    'rgb(106, 90, 205)', 'rgb(255, 215, 0)', 'rgb(128, 0, 128)', 'rgb(240, 128, 128)',
    'rgb(220, 20, 60)', 'rgb(0, 128, 128)', 'rgb(218, 112, 214)'
  ];

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
            const data = result.data;
            const allMunicipalities = [...new Set(data.map((row) => row['Município']))];
            const allYears = [...new Set(data.map((row) => new Date(row['Date']).getFullYear()))];

            setOriginalData(data);
            setMunicipalities(allMunicipalities);
            setYears(allYears);
          },
        });
      })
      .catch((error) => console.error('Erro ao carregar o CSV:', error));
  }, []);

  // Processar dados para o gráfico considerando apenas a cidade selecionada
  const notificationsByMunicipalityAndYear = municipalities
    .filter((mun) => mun === selectedMunicipality) // Filtra pela cidade selecionada
    .map((mun) => {
      return years.map((year) => {
        return originalData
          .filter(
            (row) =>
              row["Município"] === mun &&
              new Date(row["Date"]).getFullYear() === year
          )
          .reduce((sum, row) => sum + parseInt(row["Notifications"]), 0);
      });
    });

  // Aplique cores diferentes para cada ano
  const chartData = {
    labels: years,
    datasets: selectedMunicipality
      ? [{
          label: selectedMunicipality,
          data: notificationsByMunicipalityAndYear[0], // Dados da cidade selecionada
          backgroundColor: years.map((_, index) => backgroundColor[index % backgroundColor.length]),
          borderColor: years.map((_, index) => borderColor[index % borderColor.length]),
          borderWidth: 1,
        }]
      : [],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Gráfico de Casos Registrados ao Longo dos Anos Por Municipio',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    layout: {
      padding: 10,
    },
  };

  const handleMunicipalityChange = (e) => {
    setSelectedMunicipality(e.target.value);
  };

  return (
    <div className="Container">
      {/* Seleção de uma cidade */}
      <div className="Municipio">
        <label htmlFor="municipality-select">Selecione uma cidade:</label>
        <select
          id="municipality-select"
          value={selectedMunicipality}
          onChange={handleMunicipalityChange}
        >
          <option value="">Selecione uma cidade</option>
          {municipalities.map((mun, index) => (
            <option key={index} value={mun}>
              {mun}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro para selecionar tipo de gráfico */}
      <div className="radio-input" value={chartType} onChange={(e) => setChartType(e.target.value)}>
        <label>
          <input 
            type="radio" 
            value="line" 
            name="value-radio" 
            id="value-1" 
            checked={chartType === "line"} 
          />
          <span>Linha</span>
        </label>
        <label>
          <input 
            type="radio" 
            value="bar" 
            name="value-radio" 
            id="value-2" 
            checked={chartType === "bar"} 
            onChange={(e) => setChartType(e.target.value)}
          />
          <span>Barra</span>
        </label>
        <label>
          <input 
            type="radio" 
            value="pie" 
            name="value-radio" 
            id="value-3" 
            checked={chartType === "pie"} 
            onChange={(e) => setChartType(e.target.value)}
          />
          <span>Pizza</span>
        </label>
        <span className="selection"></span>
      </div>

      {/* Aqui está o bloco alterado */}
      <div className="ChartLine">
        {selectedMunicipality ? (
          chartType === 'line' ? (
            <Line data={chartData} options={options} />
          ) : chartType === 'bar' ? (
            <Bar data={chartData} options={options} />
          ) : (
            <Pie data={chartData} options={options} />
          )
        ) : (
          <p>Por favor, selecione uma cidade para visualizar o gráfico.</p>
        )}
      </div>
    </div>
  );
};

export default RadarChart;
