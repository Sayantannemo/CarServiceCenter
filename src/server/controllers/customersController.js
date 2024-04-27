const login = (req, res) => {
    // Logic to handle login
    res.send('Maintenance personnel login successful!');
};

// Example function to handle service request
const serviceRequest = (req, res) => {
    // Logic to handle service request
    res.send('Service request received!');
};

// Export controller functions
module.exports = {
    login,
    serviceRequest
};