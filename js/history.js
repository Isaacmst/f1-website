fetch('data/champions.json')
  .then(response => response.json())
  .then(data => {
    // Crear la tabla de campeones (código existente)
    const champions = Array.isArray(data) ? data : data.champions || [];
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

    // Crear gráfico de campeones
    const driverWins = {};
    champions.forEach(champion => {
      const driver = champion.driver || 'Desconocido';
      driverWins[driver] = (driverWins[driver] || 0) + 1;
    });

    const labels = Object.keys(driverWins);
    const dataValues = Object.values(driverWins);

    const ctx = document.getElementById('champions-chart').getContext('2d');
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
            }
          }
        }
      }
    });
  })
  .catch(error => {
    console.error('Error al cargar campeones:', error);
    document.getElementById('champions-table').innerHTML = 'Error al cargar los datos de campeones.';
  });
