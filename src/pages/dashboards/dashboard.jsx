import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Header from '../../components/Header';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, LineElement, BarElement, ArcElement } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, LineElement, BarElement, ArcElement);

const Dashboard = () => {
  const [originalData, setOriginalData] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('line');

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

  const getMonthName = (monthNumber) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[monthNumber];
  };

  const generateMonthColors = () => {
    const colors = [
      'rgba(255, 99, 132, 0.2)',  // Vermelho claro
      'rgba(54, 162, 235, 0.2)',  // Azul claro
      'rgba(255, 206, 86, 0.2)',  // Amarelo claro
      'rgba(75, 192, 192, 0.2)',  // Verde água claro
      'rgba(153, 102, 255, 0.2)', // Roxo claro
      'rgba(255, 159, 64, 0.2)',  // Laranja claro
      'rgba(201, 203, 207, 0.2)', // Cinza claro
      'rgba(144, 238, 144, 0.2)', // Verde claro
      'rgba(135, 206, 235, 0.2)', // Azul céu claro
      'rgba(220, 20, 60, 0.2)',   // Carmim claro
      'rgba(0, 128, 128, 0.2)',   // Verde água escuro claro
      'rgba(218, 112, 214, 0.2)'  // Orquídea médio claro
    ];
    return colors;
  };

    const borderColor = [
      'rgb(255, 99, 132)',  // Vermelho
      'rgb(54, 162, 235)',  // Azul
      'rgb(255, 206, 86)',  // Amarelo
      'rgb(75, 192, 192)',  // Verde água
      'rgb(153, 102, 255)', // Roxo
      'rgb(255, 159, 64)',  // Laranja
      'rgb(201, 203, 207)', // Cinza
      'rgb(144, 238, 144)', // Verde claro
      'rgb(135, 206, 235)', // Azul céu
      'rgb(220, 20, 60)',   // Carmim
      'rgb(0, 128, 128)',   // Verde água escuro
      'rgb(218, 112, 214)'  // Orquídea médio
    ];

  useEffect(() => {
    if (!selectedMunicipality || !selectedYear) return;

    const filteredData = originalData.filter(
      (row) =>
        row['Município'] === selectedMunicipality &&
        new Date(row['Date']).getFullYear() === parseInt(selectedYear, 10)
    );

    const monthlyData = filteredData.reduce((acc, row) => {
      const date = new Date(row['Date']);
      const month = date.getMonth();
      const monthYear = `${month}`;
      const notifications = parseInt(row['Notifications'], 10);

      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }

      acc[monthYear] += notifications;
      return acc;
    }, {});

    const months = Object.keys(monthlyData).sort((a, b) => a - b);
    const monthLabels = months.map((month) => getMonthName(parseInt(month, 10)));
    const data = months.map((month) => monthlyData[month]);
    const monthColors = generateMonthColors();

    const borderConfig = chartType === 'bar' ? {
      borderColor: borderColor.slice(0, data.length),
      borderWidth: 2,
    } : {};

    setChartData({
      labels: monthLabels,
      datasets: [
        {
          label: `Notificações de Malária em ${selectedMunicipality} (${selectedYear})`,
          data: data,
          backgroundColor: monthColors,
          fill: chartType === 'line',
          tension: 0.4,
          ...borderConfig,
        },
      ],
    });
  }, [selectedMunicipality, selectedYear, originalData, chartType]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Gráfico de Notificações de Malária',
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
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      default:
        return <Line data={chartData} options={options} />;
    }
  };

  return (
    <div className='ContainerDB'>
      <Header />
      <div className='ContainerDashBoard'>
        <div className="Filters">
          <div className='municipio'>
            <p>Município:</p>
            <select value={selectedMunicipality} onChange={(e) => setSelectedMunicipality(e.target.value)}>
              <option value="">Selecione um Município</option>
              {municipalities.map((municipality) => (
                <option key={municipality} value={municipality}>
                  {municipality}
                </option>
              ))}
            </select>
          </div>

          <div className='ano'>
            <p>Ano:</p>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="">Selecione um ano</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div className='grafico' value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <p>Tipo de Gráfico:</p>
            <label className='TypeChart' htmlFor="line">
              <input type="radio" value="line" id='line' checked={chartType === "line"}/>
              <span>Linha</span>
            </label>
          
            <label className='TypeChart' htmlFor="bar">
              <input type="radio" value="bar" id='bar' checked={chartType === "bar"}/>
              <span>Barra</span>
            </label>

            <label className='TypeChart' htmlFor="pie">
              <input type="radio" value="pie" id='pie' checked={chartType === "pie"}/>
              <span>Pizza</span>
            </label>
          </div>
        </div>

        <div className="ChartDashBoard">
          {chartData ? (
            renderChart()
          ) : (
            <p>Selecione um Município e um Ano para exibir o gráfico.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
