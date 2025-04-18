fetch('data/champions.json')
  .then(response => response.json())
  .then(data => {
    let list = '<ul>';
    for (let champion of data) {
      list += `<li>${champion.year}: ${champion.driver} (${champion.team})</li>`;
    }
    list += '</ul>';
    document.getElementById('champions').innerHTML = list;
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('champions').innerHTML = 'Error al cargar los datos históricos.';
  });