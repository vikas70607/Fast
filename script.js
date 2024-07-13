document.getElementById('query-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Show loading animation
    document.getElementById('loading').style.display = 'block';

    const Table_Name = document.getElementById('table-select').value;
    const Query = document.getElementById('query-input').value;

    let Category;

    if(Table_Name == 'ACUM_Customer'){
        Category = 'ACUM';
    }
    else{
        Category = 'Actions'
    }

    fetch('https://hook.eu2.make.com/mdm1t9yrd6cqp2b69ghpioeuonpknse3', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Table_Name,Query,Category })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loading').style.display = 'none';
        displayResults(data);
    })
    .catch(error => {
        document.getElementById('loading').style.display = 'none';
        console.error('Error:', error);
    });
});

function displayResults(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (data.length === 0) {
        resultDiv.innerHTML = 'No results found';
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    const columns = Object.keys(data[0]);
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    data.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(column => {
            const td = document.createElement('td');
            td.textContent = row[column] !== null ? row[column] : '';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    resultDiv.appendChild(table);
}
