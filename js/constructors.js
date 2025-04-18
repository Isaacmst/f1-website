fetch('https://ergast.com/api/f1/current/constructorStandings.json')
  .then(response => response.json())
  .then(data => {
    const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    let table = '<table><tr><th>Posición</th><th>Equipo</th><th>Puntos</th></tr>';
    for (let constructor of standings) {
      table += `<tr>
        <td>${constructor.position}</td>
        <td>${constructor.Constructor.name}</td>
        <td>${constructor.points}</td>
      </tr>`;
    }
    table += '</table>';
    document.getElementById('constructor-standings').innerHTML = table;
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('constructor-standings').innerHTML = 'Error al cargar las clasificaciones.';
  });
