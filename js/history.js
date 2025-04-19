document.addEventListener('DOMContentLoaded', () => {
  fetch('data/champions.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Crear la tabla de campeones
      const champions = Array.isArray(data) ? data : data.champions || [];
      if (!champions || champions.length === 0) {
        throw new Error('No se encontraron datos de campeones');
      }
      let table = '<table><tr><th>Año</th><th>Piloto</th><th>Nacionalidad</th><th>Equipo</th><th>Puntos</th></tr>';
      for (let champion of champions) {
        table += `<tr>
          <td>${champion.year || 'N/A'}</td>
          <td>${champion.driver || 'N/A'}</td>
          <td>${champion.nationality || 'N/A'}</td>
          <td>${champion.team || 'N/A'}</td>
          <td>${champion.points || 'N/A'}</td>
        </tr>`;
      }
      table += '</table>';
      document.getElementById('champions-table').innerHTML = table;

      // Crear gráfico de los 10 pilotos con más campeonatos
      const canvas = document.getElementById('champions-chart');
      if (!canvas) {
        console.error('No se encontró el elemento #champions-chart');
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('No se pudo obtener el contexto 2D del canvas');
        return;
      }

      // Contar campeonatos por piloto
      const driverWins = {};
      champions.forEach(champion => {
        const driver = champion.driver || 'Desconocido';
        driverWins[driver] = (driverWins[driver] || 0) + 1;
      });

      // Convertir a un arreglo de [piloto, campeonatos] y ordenar
      const driverWinsArray = Object.entries(driverWins).sort((a, b) => b[1] - a[1]);

      // Tomar solo los 10 primeros pilotos
      const top10Drivers = driverWinsArray.slice(0, 10);

      // Separar etiquetas y datos
      const labels = top10Drivers.map(entry => entry[0]); // Nombres de los pilotos
      const dataValues = top10Drivers.map(entry => entry[1]); // Número de campeonatos

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Campeonatos ganados',
            data: dataValues,
            backgroundColor: 'rgba(255, 0, 0, 0.5)', // Rojo F1
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true, // Hacer el gráfico responsivo
          maintainAspectRatio: false, // Permitir que el gráfico se ajuste al contenedor
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Número de campeonatos'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Pilotos'
              },
              ticks: {
                autoSkip: false, // Mostrar todas las etiquetas
                maxRotation: 45, // Rotar etiquetas 45 grados
                minRotation: 45,
                font: {
                  size: 10 // Reducir tamaño de fuente en móviles
                }
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          }
        }
      });
    })
    .catch(error => {
      console.error('Error al cargar campeones:', error);
      document.getElementById('champions-table').innerHTML = 'Error al cargar los datos de campeones.';
    });
});
