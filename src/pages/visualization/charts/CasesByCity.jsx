import React, { useEffect, useState } from "react";
import './Charts.css';
import '../components/TypeChartButton.css';
import { Bar, Line, Pie } from "react-chartjs-2";
import Papa from "papaparse";

const Charts = () => {
  const [originalData, setOriginalData] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [years, setYears] = useState([]);
  const [chartType, setChartType] = useState("bar"); // Inicializa como gráfico de barras
  const [chartData, setChartData] = useState(null); // Estado para armazenar os dados do gráfico

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

  useEffect(() => {
    if (originalData.length > 0 && municipalities.length > 0) {
      const notificationsByMunicipality = municipalities.map((mun) => {
        return {
          municipality: mun,
          notifications: originalData
            .filter((row) => row['Município'] === mun)
            .reduce((sum, row) => sum + parseInt(row['Notifications']), 0),
        };
      });

      const top15Municipalities = notificationsByMunicipality
        .sort((a, b) => b.notifications - a.notifications)
        .slice(0, 15);

      const backgroundColor = [
        'rgba(255, 99, 132, 0.2)',  'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',  'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)', 'rgba(255, 99, 71, 0.2)',
        'rgba(144, 238, 144, 0.2)', 'rgba(135, 206, 235, 0.2)',
        'rgba(255, 140, 0, 0.2)',   'rgba(173, 216, 230, 0.2)',
        'rgba(106, 90, 205, 0.2)',  'rgba(255, 215, 0, 0.2)',
        'rgba(128, 0, 128, 0.2)'
      ];

      const borderColor = [
        'rgb(255, 99, 132)',  'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',  'rgb(75, 192, 192)',
        'rgb(153, 102, 255)', 'rgb(255, 159, 64)',
        'rgb(201, 203, 207)', 'rgb(255, 99, 71)',
        'rgb(144, 238, 144)', 'rgb(135, 206, 235)',
        'rgb(255, 140, 0)',   'rgb(173, 216, 230)',
        'rgb(106, 90, 205)',  'rgb(255, 215, 0)',
        'rgb(128, 0, 128)'
      ];

      setChartData({
        labels: top15Municipalities.map((item) => item.municipality),
        datasets: [
          {
            label: "Notificações por Município",
            data: top15Municipalities.map((item) => item.notifications),
            backgroundColor: backgroundColor.slice(0, top15Municipalities.length),
            borderColor: borderColor.slice(0, top15Municipalities.length),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [originalData, municipalities]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
          display: true,
          text: 'Gráfico de Notificações de Malária por Município',
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

export default Charts;
