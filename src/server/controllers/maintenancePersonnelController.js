const login = (req, res) => {
    // Logic to handle login
    res.send('Admin login successful!');
};

// Example function to handle staff management
const staffManagement = (req, res) => {
    // Logic to handle staff management
    res.send('Staff management functionality');
};

// Export controller functions
module.exports = {
    login,
    staffManagement
};