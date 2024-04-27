// Dummy data for initial staff list display
const staffData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Maintenance' }
    // Add more staff members as needed
  ];
  
  // Function to populate staff list on page load
  function populateStaffList() {
    const staffListDiv = document.getElementById('staffList');
    staffListDiv.innerHTML = ''; // Clear existing content
  
    staffData.forEach(staff => {
      const staffItem = document.createElement('div');
      staffItem.classList.add('staff-item');
      staffItem.innerHTML = `
        <span>${staff.name}</span>
        <span>${staff.email}</span>
        <span>${staff.role}</span>
        <button onclick="editStaff(${staff.id})">Edit</button>
        <button onclick="deleteStaff(${staff.id})">Delete</button>
      `;
      staffListDiv.appendChild(staffItem);
    });
  }
  
  // Function to add new staff member
  function addStaff(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
  
    // Add new staff member to the staffData array (simulating backend data storage)
    const newStaff = { id: staffData.length + 1, name, email, role };
    staffData.push(newStaff);
  
    // Refresh staff list display
    populateStaffList();
  
    // Clear form inputs
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('role').value = '';
  }
  
  // Initialize staff list on page load
  window.onload = function () {
    populateStaffList();
  }
  
  // Event listener for submitting new staff form
  document.getElementById('newStaffForm').addEventListener('submit', addStaff);
  