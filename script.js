
let selectedCategory = '';
let selectedTable = 'Not_Available';
let Data;

// Fetch the JSON data from the file
fetch('tables.json')
    .then(response => response.json())
    .then(jsonData => {
        populateDropdown(jsonData);
        Data = jsonData;
    })
    .catch(error => console.error('Error loading JSON:', error));

// Populate dropdown from JSON data
function populateDropdown(jsonData) {
    const dropdownMenu = document.getElementById('dropdownMenu');

    Object.keys(jsonData).forEach(category => {
        let categoryItem;

        if (typeof jsonData[category] === 'object' && !Array.isArray(jsonData[category])) {
            // Has nested tables
            categoryItem = document.createElement('li');
            categoryItem.classList.add('dropdown-submenu');

            const categoryLink = document.createElement('a');
            categoryLink.classList.add('dropdown-item', 'dropdown-toggle');
            categoryLink.href = "#";
            categoryLink.textContent = category;
            categoryItem.appendChild(categoryLink);

            const subMenu = document.createElement('ul');
            subMenu.classList.add('dropdown-menu');

            Object.keys(jsonData[category]).forEach(table => {
                const subMenuItem = document.createElement('li');
                const tableLink = document.createElement('a');
                tableLink.classList.add('dropdown-item', 'table-value');
                tableLink.href = "#";
                tableLink.textContent = table;
                tableLink.setAttribute('data-category', category);
                tableLink.setAttribute('data-table', table);
                subMenuItem.appendChild(tableLink);
                subMenu.appendChild(subMenuItem);
            });

            categoryItem.appendChild(subMenu);
        } else {
            // No nested tables
            categoryItem = document.createElement('li');
            const categoryLink = document.createElement('a');
            categoryLink.classList.add('dropdown-item', 'table-value');
            categoryLink.href = "#";
            categoryLink.textContent = category;
            categoryLink.setAttribute('data-category', category);
            categoryLink.setAttribute('data-table', 'Not_Available');
            categoryItem.appendChild(categoryLink);
        }

        dropdownMenu.appendChild(categoryItem);
    });
}

function displayColumnNames(columnNames) {
    const container = document.getElementById('columnsContainer');
    container.innerHTML = ''; // Clear existing items

    columnNames.forEach(name => {
        const item = document.createElement('div');
        item.className = 'card-item';
        item.textContent = name;
        container.appendChild(item);
    });
}

// Handle subcategory click to update the category button text
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('table-value')) {
        e.preventDefault();
        selectedCategory = e.target.getAttribute('data-category');
        selectedTable = e.target.getAttribute('data-table');
        // Update the category button text
        if (selectedTable == 'Not_Available') {
            document.getElementById('categoryButton').textContent = selectedCategory
            displayColumnNames(Data[selectedCategory])
        }
        else {
            document.getElementById('categoryButton').textContent = selectedCategory + " - " + selectedTable;
            displayColumnNames(Data[selectedCategory][selectedTable])
        }
    }
});

document.getElementById('searchButton').addEventListener('click', function () {
    const query = document.getElementById('queryInput').value;

    // Validate input
    if (!selectedCategory || !query) {
        alert('Please select a category, table, and enter a query!');
        return;
    }

    // Show loading animation
    document.getElementById('loadingAnimation').style.display = 'block';

    // Prepare API request payload
    const payload = {
        category: selectedCategory,
        table_name: selectedTable,
        query: query
    };

    // Fetch data from API (replace 'your-api-url' with the actual API endpoint)
    fetch('http://66.175.236.154/sqlgpt/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            // Hide loading animation
            document.getElementById('loadingAnimation').style.display = 'none';

            // Display the table with the received data
            displayTable(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('loadingAnimation').style.display = 'none';
            alert('Error fetching data from the API');
        });
});

function displayTable(data) {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    // Display headers
    const headers = Object.keys(data[0]);
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeader.appendChild(th);
    });

    // Display rows
    data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    document.getElementById('resultsTable').style.display = 'table';
}