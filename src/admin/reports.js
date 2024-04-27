document.addEventListener("DOMContentLoaded", function () {
    const reportForm = document.getElementById('report-form');
    const reportTableContainer = document.getElementById('report-table-container');

    reportForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form data
        const reportType = reportForm.elements['report-type'].value;
        const startDate = reportForm.elements['start-date'].value;
        const endDate = reportForm.elements['end-date'].value;

        // Validate date range
        if (startDate > endDate) {
            alert('Start date cannot be greater than end date.');
            return;
        }

        // Construct URL for fetching report data
        const url = `/api/reports?type=${reportType}&start=${startDate}&end=${endDate}`;

        // Fetch report data from the server
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Check if report data is empty
                if (data.length === 0) {
                    reportTableContainer.innerHTML = '<p>No data available for the selected parameters.</p>';
                    return;
                }

                // Generate report table
                const table = generateReportTable(data);
                reportTableContainer.innerHTML = ''; // Clear previous table
                reportTableContainer.appendChild(table);
            })
            .catch(error => {
                console.error('Error fetching report data:', error);
                reportTableContainer.innerHTML = '<p>An error occurred while fetching report data.</p>';
            });
    });

    // Function to generate report table
    function generateReportTable(data) {
        const table = document.createElement('table');
        const thead = table.createTHead();
        const tbody = table.createTBody();

        // Create table header
        const headerRow = thead.insertRow();
        for (const key in data[0]) {
            const th = document.createElement('th');
            th.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
            headerRow.appendChild(th);
        }

        // Create table rows
        data.forEach(rowData => {
            const row = tbody.insertRow();
            for (const key in rowData) {
                const cell = row.insertCell();
                cell.textContent = rowData[key];
            }
        });

        return table;
    }
});