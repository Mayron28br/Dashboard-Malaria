import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Header from '../../components/Header';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, LineElement, BarElement, ArcElement } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, LineElement, BarElement, ArcElement);

const Dashboard = () => {
  const [originalData, setOriginalData] = useState([]); // Dados completos do CSV
  const [municipalities, setMunicipalities] = useState([]); // Lista de municípios
  const [years, setYears] = useState([]); // Lista de anos
  const [selectedMunicipality, setSelectedMunicipality] = useState(''); // Município selecionado
  const [selectedYear, setSelectedYear] = useState(''); // Ano selecionado
  const [chartData, setChartData] = useState(null); // Dados filtrados para o gráfico
  const [chartType, setChartType] = useState('line'); // Tipo de gráfico selecionado

  useEffect(() => {
    // Carrega o CSV e processa os dados
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

            // Obtenha lista de municípios e anos
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
      'rgba(75, 192, 192, 1)', // Janeiro
      'rgba(153, 102, 255, 1)', // Fevereiro
      'rgba(255, 159, 64, 1)', // Março
      'rgba(255, 99, 132, 1)', // Abril
      'rgba(54, 162, 235, 1)', // Maio
      'rgba(50, 0, 255, 1)', // Junho
      'rgba(201, 0, 255, 1)', // Julho
      'rgba(100, 255, 218, 1)', // Agosto
      'rgba(255, 0, 20, 1)', // Setembro
      'rgba(30, 255, 30, 1)', // Outubro
      'rgba(255, 132, 192, 1)', // Novembro
      'rgba(255, 0, 128, 1)', // Dezembro
    ];
    return colors;
  };

  // Atualiza os dados do gráfico quando os filtros mudam
  useEffect(() => {
    if (!selectedMunicipality || !selectedYear) return;

    // Agrupar dados por mês (ano e mês)
    const filteredData = originalData.filter(
      (row) =>
        row['Município'] === selectedMunicipality &&
        new Date(row['Date']).getFullYear() === parseInt(selectedYear, 10)
    );

    // Agrupando os dados por mês
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

    // Ordenar os meses
    const months = Object.keys(monthlyData).sort((a, b) => a - b);

    // Converte os números dos meses em nomes
    const monthLabels = months.map((month) => getMonthName(parseInt(month, 10)));
    const data = months.map((month) => monthlyData[month]);

    // Gerar cores para os meses
    const monthColors = generateMonthColors();

    // Ajustar o gráfico com cores personalizadas para cada mês
    setChartData({
      labels: monthLabels,
      datasets: [
        {
          label: `Notificações de Malária em ${selectedMunicipality} (${selectedYear})`,
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: monthColors, 
          fill: chartType === 'line',
          tension: 0.4,
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
    elements: {
      arc: {
        borderWidth: 0, 
      }
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
          <label className='municipio'>
            Município:
            <select value={selectedMunicipality} onChange={(e) => setSelectedMunicipality(e.target.value)}>
              <option value="">Selecione um município</option>
              {municipalities.map((municipality) => (
                <option key={municipality} value={municipality}>
                  {municipality}
                </option>
              ))}
            </select>
          </label>

          <label className='ano'>
            Ano:
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="">Selecione um ano</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className='grafico'>
            Tipo de gráfico:
            <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <option value="line">Linha</option>
              <option value="bar">Barra</option>
              <option value="pie">Pizza</option>
            </select>
          </label>
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
