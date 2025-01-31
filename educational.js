document.addEventListener('DOMContentLoaded', function () {
    // Initialize Dexie database
    const db = new Dexie('KabeteNationalPolytechnicDB');

    // Define the schema with the correct version
    db.version(1).stores({
        educationalDetails: '++id, date, course, admissionNumber',
    });

    // DOM elements
    const itemForm = document.getElementById('itemForm');
    const dateInput = document.getElementById('dateInput');
    const courseInput = document.getElementById('courseInput');
    const admissionNumberInput = document.getElementById('admissionNumberInput');
    const itemsDiv = document.getElementById('itemsDiv');

    // Add educational detail to the database and update the display
    itemForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const course = courseInput.value.trim();
        const admissionNumber = admissionNumberInput.value.trim();
        const date = dateInput.value;

        if (course !== '' && admissionNumber !== '') {
            // Add educational detail to the database
            db.educationalDetails.add({
                date,
                course,
                admissionNumber,
            }).then(() => {
                // Clear the form inputs
                courseInput.value = '';
                admissionNumberInput.value = '';
                dateInput.value = '';

                // Refresh the displayed educational details
                displayEducationalDetails();
            });
        }
    });

    // Display educational details in the itemsDiv
    function displayEducationalDetails() {
        // Clear existing educational details
        itemsDiv.innerHTML = '';

        // Create table headers
        const tableHeaders = document.createElement('tr');
        tableHeaders.innerHTML = `
            <th>Date</th>
            <th>Course</th>
            <th>Admission Number</th>
            <th>Action</th>
        `;
        const headersTable = document.createElement('table');
        headersTable.appendChild(tableHeaders);
        itemsDiv.appendChild(headersTable);

        // Fetch educational details from the database and display them
        db.educationalDetails.toArray().then(details => {
            details.forEach(detail => {
                const detailRow = document.createElement('tr');
                detailRow.innerHTML = `
                    <td>${detail.date}</td>
                    <td>${detail.course}</td>
                    <td>${detail.admissionNumber}</td>
                    <td><button class="deleteButton" data-detail-id="${detail.id}">Delete</button></td>
                `;
                headersTable.appendChild(detailRow);
            });

            // Add event listeners for delete buttons
            const deleteButtons = document.querySelectorAll('.deleteButton');
            deleteButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const detailId = parseInt(button.getAttribute('data-detail-id'), 10);
                    deleteEducationalDetail(detailId);
                });
            });
        });
    }

    // Function to delete an educational detail by ID
    function deleteEducationalDetail(detailId) {
        db.educationalDetails.delete(detailId).then(() => {
            // Refresh the displayed educational details after deletion
            displayEducationalDetails();
        });
    }

    // Initial display of educational details
    displayEducationalDetails();
});
