fetch('data/champions.json')
  .then(response => response.json())
  .then(data => {
    let table = '<table><tr><th>Año</th><th>Piloto</th><th>Nacionalidad</th><th>Equipo</th><th>Puntos</th></tr>';
    for (let champion of data) {
      table += `<tr>
        <td>${champion.year}</td>
        <td>${champion.driver}</td>
        <td>${champion.nationality}</td>
        <td>${champion.team}</td>
        <td>${champion.points}</td>
      </tr>`;
    }
    table += '</table>';
    document.getElementById('champions-table').innerHTML = table;
  })
  .catch(error => {
    console.error('Error al cargar campeones:', error);
    document.getElementById('champions-table').innerHTML = 'Error al cargar los datos de campeones.';
  });
