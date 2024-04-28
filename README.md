# Vehicle Service Center

## Description

This is a web application for managing appointments and services at a vehicle service center. It allows customers to book appointments, view their past services, and make payments. Administrators can view all orders, update order status, and track revenue.

## Features

- **Customer Dashboard:** Customers can view their past services, pending appointments, and make new appointments.
- **Book Appointment:** Customers can book appointments by selecting their vehicle type, brand, services, and maintenance plan.
- **Payment Summary:** Customers can view a summary of their payments and make payments securely.
- **Service Status:** Customers can track the status of their service appointments.
- **Admin Panel:** Administrators can view all orders, track revenue, and update order status.
- **Status Update:** Administrators can update the status of orders from pending to completed.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Sayantannemo/CarServiceCenter.git

2. Ensure all dependencies are installed:

   ```bash
   npm install


## Configuration

Before running the application, make sure to update the MongoDB URL in the `config.js` file:

```javascript
// config.js

module.exports = { mongoURI: 'YOUR_MONGODB_URL_HERE' };
```

## Usage

To run:
```bash
node app.js
```
## Issue

If you encounter any issues or have suggestions for improvements, please feel free to open an issue [here](https://github.com/yourusername/yourrepository/issues).

## Contributing

We welcome contributions from the community! If you'd like to contribute to this project, please follow these guidelines:
1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or bug fix.
3. Make your changes and test them thoroughly.
4. Commit your changes and push them to your fork.
5. Submit a pull request, detailing the changes you've made and explaining why they should be merged.

For major changes, please open an issue first to discuss your ideas.

## Acknowledgements

We extend our heartfelt gratitude to the following contributors for their valuable contributions to this project:
- Sayantan Bhattacharyya
- Bidyannad Mishra
- Nikhil Raj
- Milind Chakraborty

## License

This project is licensed under the MIT License
