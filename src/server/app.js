// app.js

const express = require('express');
const path = require('path'); // Node.js path module
const mongoose = require('mongoose');
const config = require('./config');
const bodyparser = require('body-parser')
const Customer = require("./model/customerModel")
const Order = require('./model/orderModel');
const session = require('express-session');

// const routes = require('./routes/routes');
path1 = path.format({ root: "E:/Hackathon/CarServiceCenter/" })
customer_path = path.format({ root: "E:/Hackathon/CarServiceCenter/src/customers/" })
admin_path = path.format({ root: "E:/Hackathon/CarServiceCenter/src/admin/" })
maintainance_path = path.format({ root: "E:/Hackathon/CarServiceCenter/src/maintenance_personal/" })


// Initialize Express app
const app = express();

app.use(bodyparser.urlencoded({extended:false}))
app.use(session({
  secret: 'your-secret-key', // Change this to a random secret key
  resave: false,
  saveUninitialized: false
}));
// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

// Middleware
app.use(express.json()); // Parse JSON bodies

// Home page route
app.get('/', (req, res) => {
  res.sendFile(path.join(path1, 'public', 'index.html'));
});

app.get('/loginpage',(req,res)=>{
  res.sendFile("E:\\Hackathon\\CarServiceCenter\\src\\server\\login.html")
})

// Login route
app.post("/register", async (req, res) => {
  try {
    // Extract data from request body
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(email)

    // Check if email already exists
    const existingUser = await Customer.findOne({ email });

    if (existingUser) {
      return res.send(`<script>alert("Email already exists"); window.location.href = "/loginpage";</script>`);
    }

    // Create new user
    const newUser = new Customer({
      name,
      email,
      password,
    });

    // Save new user to the database
    await newUser.save();
    res.send(`<script>alert("Account Created Succesfully"); window.location.href = "/loginpage";</script>`);
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(password)
  try {
    // Find the user by email
    const user = await Customer.findOne({ email });
    console.log(user)
    // If user not found, return an error
    if(user){
    if (password != user.password) {
      return res.send(`<script>alert("Invalid password"); window.location.href = "/loginpage";</script>`);
    }
  
    req.session.name = user.name;
    req.session.email = user.email;
    // Get user's role
    const role = user.role;

    // Redirect based on user role
    if (role === "CUSTOMER") {
      // Redirect to customer page
      res.redirect("/customer");
    } else if (role === "admin") {
      // Redirect to admin page
      res.redirect("/admin");
    } else {
      // Handle other roles or unexpected cases
      res.status(403).json({ message: "Unauthorized role" });
    }
  }
  else{
    return res.send(`<script>alert("Invalid Username/email"); window.location.href = "/loginpage";</script>`);
  } 
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  res.redirect("/loginpage");
});

app.get('/customer', (req, res) => {
  res.sendFile(path.join(customer_path, 'index.html'));
})

app.get('/book_appointment', (req, res) => {
  res.sendFile(path.join(customer_path, 'book_appointment.html'));
})

app.get('/my_services', async (req, res) => {
  try {
    // Retrieve user email from session
    const userEmail = req.session.email;

    // Find orders associated with the user's email
    const orders = await Order.find({ userEmail });

    // If no orders found, render the page without body content
    if (orders.length === 0) {
      return res.send(`
        ${getCommonHTML()}
        <h2>No service booked</h2>
        ${getCommonFooterHTML()}
      `);
    }

    // If orders are found, render the page with the table populated by orders
    res.send(`
      ${getCommonHTML()}
      <section id="my-services">
        <h2>My Services</h2>
        <table id="services-table" border="1">
          <thead>
            <tr>
              <th>Appointment Date</th>
              <th>Maintenance Plan</th>
              <th>Service</th>
              <th>Total Price</th>
              <th>Status</th>
              <!-- Add more columns as needed -->
            </tr>
          </thead>
          <tbody id="services-list">
            ${populateServicesTable(orders)}
          </tbody>
        </table>
      </section>
      ${getCommonFooterHTML()}
    `);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
  }
  function getCommonHTML() {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>My Services</title>
          <link rel="stylesheet" href="css/styles.css" />
          <link rel="stylesheet" href="css/customers.css" />
          <style>
          header {
            background-color: #333;
            color: white;
            padding: 10px 0;
            text-align: center;
          }
    
          nav ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
          }
    
          nav ul li {
            display: inline;
          }
    
          nav ul li a {
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            display: inline-block;
            background-color: #555; /* Default background color */
          }
    
          nav ul li a:hover {
            background-color: #777;
          }
    
          nav ul li.active a {
            background-color: #444; /* Active page background color */
          }
    
          main {
            padding: 20px;
          }
    
              /* Footer styles */
              /* Footer styles */
              footer {
                background-color: #333;
                color: white;
                text-align: center;
                padding: 20px 0;
                border-radius: 0 0 8px 8px; /* Rounded corners */
                font-size: 14px;
                margin-top: 300px; /* Added margin-top */
              }
          
              footer p {
                margin: 0;
              }
  
          /* Button styling */
  button.logout-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button.logout-button:hover {
    background-color: #0056b3;
  }
          </style>
        </head>
        <body>
          <header>
            <h1>My Services</h1>
            <nav>
              <ul>
                <li><a href="/customer">Dashboard</a></li>
                <li><a href="/book_appointment">Book Appointment</a></li>
                <li class="active"><a href="/my_services">My Services</a></li>
  
            <li><form id="logout-form" action="/logout" method="POST"><button class="logout-button" type="submit">Logout</button></form></li>
              </ul>
            </nav>
          </header>
          <main>
    `;
  }
});

// Function to generate the common HTML structure for the page header and footer


// Function to generate the common HTML structure for the page footer
function getCommonFooterHTML() {
  return `
        </main>
        <footer>
          <p>&copy; 2024 Vehicle Service Centre</p>
        </footer>
      </body>
    </html>
  `;
}

// Function to populate the services table with past services
function populateServicesTable(orders) {
  let tableRows = '';
  orders.forEach((order) => {
    tableRows += `
      <tr>
        <td>${order.appointmentDate}</td>
        <td>${order.maintenancePlan}</td>
        <td>${order.selectedServices.join(', ')}</td>
        <td>${order.totalPrice}</td>
        <td>${order.orderStatus}</td>
        
        <!-- Add more columns as needed -->
      </tr>
    `;
  });
  return tableRows;
}


app.get('/admin', (req, res) => {
  res.sendFile(path.join(admin_path, 'index.html'));
})
app.get('/staff_management', (req, res) => {
  res.sendFile(path.join(admin_path, 'staff_management.html'));
})

app.get('/order_management', (req, res) => {
  res.sendFile(path.join(admin_path, 'order_management.html'));
})

app.get('/service_plan_management', (req, res) => {
  res.sendFile(path.join(admin_path, 'service_plan_management.html'));
})

app.get('/report_management', async (req, res) => {
  try {
    // Retrieve all orders from the database
    const orders = await Order.find();

    // If no orders found, render the page with a message
    if (orders.length === 0) {
      return res.send(`
        ${getCommonHTML()}
        <h2>No Orders available</h2>
        ${getCommonFooterHTML()}
      `);
    }

    // If orders are found, render the page with the table populated by orders
    res.send(`
      ${getCommonHTML()}
      <section id="service-status">
        <h2>ALL Orders</h2>
        <table id="status-table" border="1">
          <thead>
            <tr>
              <th>User</th>
              <th>Appointment Date</th>
              <th>Service</th>
              <th>Total Price</th>
              <th>Status</th>
              <!-- Add more columns as needed -->
            </tr>
          </thead>
          <tbody id="status-list">
            ${populateStatusTable(orders)}
          </tbody>
        </table>
      </section>
      ${getCommonFooterHTML()}
    `);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
  }


// Function to generate the common HTML structure for the page header and footer
function getCommonHTML() {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Admin Dashboard</title>
      <style>
        /* CSS for navigation bar */
        header {
          background-color: #333;
          color: white;
          padding: 10px 0;
          text-align: center;
        }
  
        nav ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
  
        nav ul li {
          display: inline;
        }
  
        nav ul li a {
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          display: inline-block;
          background-color: #555; /* Default background color */
        }
  
        nav ul li a:hover {
          background-color: #777;
        }
  
        nav ul li.active a {
          background-color: #444; /* Active page background color */
        }
  
        main {
          padding: 20px;
          flex: 1; /* Take remaining space */
        }
  
        footer {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 10px 0;
          position: fixed;
          bottom: 0;
          width: 100%;
        }
  
  /* Button styling */
  button.logout-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button.logout-button:hover {
    background-color: #0056b3;
  }
      </style>
    </head>
  
    <body>
      <header>
        <h1>Orders</h1>
        <nav>
          <ul>
            <li><a href="/admin">Dashboard</a></li>
            <li class="active"><a href="/report_management">All Orders</a></li>
            <li><a href="/status_update">Status Update</a></li>
            <li><a href="/transactions">Total Revenue</a></li>
            
            <li><form id="logout-form" action="/logout" method="POST"><button class="logout-button" type="submit">Logout</button></form></li>
          </ul>
        </nav>
      </header>
      <main>
  `;
}

// Function to generate the common HTML structure for the page footer

// Function to populate the status table with orders
function populateStatusTable(orders) {
  let tableRows = '';
  orders.forEach((order) => {
    tableRows += `
      <tr>
        <td>${order.userName}</td>
        <td>${order.appointmentDate}</td>
        <td>${order.selectedServices.join(', ')}</td>
        <td>${order.totalPrice}</td>
        <td>${order.orderStatus}</td>
        <!-- Add more columns as needed -->
      </tr>
    `;
  });
  return tableRows;
}
});

app.get('/transactions',async(req,res)=>{
  try {
    // Retrieve all orders from the database
    const orders = await Order.find();

    // If no orders found, render the page with a message
    if (orders.length === 0) {
      return res.send(`
        ${getCommonHTML()}
        <h2>No Orders available</h2>
        ${getCommonFooterHTML()}
      `);
    }

    // If orders are found, render the page with the table populated by orders
    res.send(`
      ${getCommonHTML()}
      <section id="service-status">
        
            ${populateStatusTable(orders)}
          
      </section>
      ${getCommonFooterHTML()}
    `);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
  }


// Function to generate the common HTML structure for the page header and footer
function getCommonHTML() {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Admin Dashboard</title>
      <style>
        /* CSS for navigation bar */
        header {
          background-color: #333;
          color: white;
          padding: 10px 0;
          text-align: center;
        }
  
        nav ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
  
        nav ul li {
          display: inline;
        }
  
        nav ul li a {
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          display: inline-block;
          background-color: #555; /* Default background color */
        }
  
        nav ul li a:hover {
          background-color: #777;
        }
  
        nav ul li.active a {
          background-color: #444; /* Active page background color */
        }
  
        main {
          padding: 20px;
          flex: 1; /* Take remaining space */
        }
  
        footer {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 10px 0;
          position: fixed;
          bottom: 0;
          width: 100%;
        }
  
  /* Button styling */
  button.logout-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button.logout-button:hover {
    background-color: #0056b3;
  }
      </style>
    </head>
  
    <body>
      <header>
        <h1>Total Revenue</h1>
        <nav>
          <ul>
            <li><a href="/admin">Dashboard</a></li>
            <li><a href="/report_management">All Orders</a></li>
            <li><a href="/status_update">Status Update</a></li>
            <li class="active"><a href="/transactions">Total Revenue</a></li>
            
            <li><form id="logout-form" action="/logout" method="POST"><button class="logout-button" type="submit">Logout</button></form></li>
          </ul>
        </nav>
      </header>
      <main>
  `;
}

// Function to generate the common HTML structure for the page footer
function getCommonFooterHTML() {
  return `
        </main>
        <footer>
          <p>&copy; 2024 Vehicle Service Centre</p>
        </footer>
      </body>
    </html>
  `;
}
function populateStatusTable(orders) {
  let tableRows = '';
  let total_Revenue = 0;
  orders.forEach((order) => {
    total_Revenue += parseInt(order.totalPrice);
    
  });

  return `<div class="revenue-section">
      <h2>Total Revenue</h2>
      <div class="revenue-info">
        <span>₹</span> ${total_Revenue} <!-- Placeholder for dynamic revenue value -->
      </div>
      <p>This is the total revenue generated by the admin.</p>
    </div>`;
}
})

app.get('/car_management', (req, res) => {
  res.sendFile(path.join(admin_path, 'car_management.html'));
})

app.get('/status_update', async (req, res) => {
  try {
    // Retrieve all pending orders from the database
    const pendingOrders = await Order.find({ orderStatus: 'pending' });

    // If no pending orders found, render the page with a message
    if (pendingOrders.length === 0) {
      return res.send(`
        ${getCommonHTML()}
        <h2>No pending orders</h2>
        ${getCommonFooterHTML()}
      `);
    }

    // If pending orders are found, render the page with the form to update order status
    res.send(`
      ${getCommonHTML()}
      <section id="status-update">
        <h2>Status Update</h2>
        <form action="/status_update" method="POST">
          <label for="order-id">Select Order ID:</label>
          <select name="order-id" id="order-id">
            ${populateOrderDropdown(pendingOrders)}
          </select>
          <button type="submit">Update Status</button>
        </form>
        <h3>Pending Orders</h3>
        <table id="pending-orders-table" border="1">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Appointment Date</th>
              <!-- Add more columns as needed -->
            </tr>
          </thead>
          <tbody>
            ${populatePendingOrdersTable(pendingOrders)}
          </tbody>
        </table>
      </section>
      ${getCommonFooterHTML()}
    `);
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).send('Internal Server Error');
  }
});
 



// Function to generate the common HTML structure for the page header and footer
function getCommonHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Status Update</title>
        <link rel="stylesheet" href="css/styles.css" />
        <link rel="stylesheet" href="css/customers.css" />
        <style>
      /* CSS for navigation bar */
      header {
        background-color: #333;
        color: white;
        padding: 10px 0;
        text-align: center;
      }

      nav ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      nav ul li {
        display: inline;
      }

      nav ul li a {
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        display: inline-block;
        background-color: #555; /* Default background color */
      }

      nav ul li a:hover {
        background-color: #777;
      }

      nav ul li.active a {
        background-color: #444; /* Active page background color */
      }

      main {
        padding: 20px;
        flex: 1; /* Take remaining space */
      }

      footer {
        background-color: #333;
        color: white;
        text-align: center;
        padding: 10px 0;
        position: fixed;
        bottom: 0;
        width: 100%;
      }

/* Button styling */
button.logout-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.logout-button:hover {
  background-color: #0056b3;
}
    </style>
      </head>
      <body>
        <header>

          <h1>Status Update</h1>
          <nav>
        <ul>
          <li ><a href="/admin">Dashboard</a></li>
          <li><a href="/report_management">All Orders</a></li>
          <li class="active"><a href="/status_update">Status Update</a></li>
          <li><a href="/transactions">Total Revenue</a></li>
          
          <li><form id="logout-form" action="/logout" method="POST"><button class="logout-button" type="submit">Logout</button></form></li>
        </ul>
        </header>
        <main>
  `;
}

// Function to generate the common HTML structure for the page footer

// Function to populate the dropdown list with pending orders
function populateOrderDropdown(orders) {
  let dropdownOptions = '';
  orders.forEach((order) => {
    dropdownOptions += `<option value="${order._id}">${order._id}</option>`;
  });
  return dropdownOptions;
}
// Function to populate the pending orders table
function populatePendingOrdersTable(orders) {
  let tableRows = '';
  orders.forEach((order) => {
    tableRows += `
      <tr>
        <td>${order._id}</td>
        <td>${order.userName}</td>
        <td>${order.appointmentDate}</td>
        <!-- Add more columns as needed -->
      </tr>
    `;
  });
  return tableRows;
}

// POST route to update order status
app.post('/status_update', async (req, res) => {
  const orderId = req.body['order-id'];

  try {
    // Find the order by ID and update its status to "Completed"
    await Order.findByIdAndUpdate(orderId, { orderStatus: 'Completed' });

    // Redirect back to the status_update page
    res.redirect('/status_update');
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/payment_portal', async(req, res) => {
  // Extract data from the form submission
  const vehicleType = req.body.vehicle;
  const vehicleModel = req.body.modelname;
  const appointmentDate = req.body.appointmentDate;
  const appointmentTime = req.body.appointmentTime;
  const maintenancePlan = req.body.maintenancePlan;
  const specialRequests = req.body.specialRequests;
  const selectedServices = req.body.selectedServices;
  const userName = req.session.name;
  const userEmail = req.session.email;

  // Define vehicle types
var vehicleTypePrices = {
  "Two Wheeler": 200,
  "Three Wheeler": 300,
  "Four Wheeler": 400
};
// Define prices for each add-on service
var addOnServicePrices = {
  "Oil Change": 150,
  "Tire Rotation": 260,
  "Brake Inspection": 170,
  "Engine Tune-up": 180,
  "Car Wash": 790,
  "Interior Detailing": 300,
  "Exterior Detailing": 400,
  "Wheel Alignment": 520,
  "Battery Replacement": 1300,
  "AC Service": 700
};
// Define maintenance plan costs
var maintenancePlanCosts = {
  "basic": 500,
  "standard": 2000,
  "premium": 3000
};
 totalPrice = 0 
// Add price of selected vehicle type
  totalPrice += vehicleTypePrices[vehicleType] || 0;

  // Add prices of selected services
  if (Array.isArray(selectedServices)) {
    selectedServices.forEach(service => {
      totalPrice += addOnServicePrices[service] || 0;
    });
  } else if (selectedServices) { // Handle single selected service
    totalPrice += addOnServicePrices[selectedServices] || 0;
  }

  // Add price of selected maintenance plan
  totalPrice += maintenancePlanCosts[maintenancePlan] || 0;
    try {
      const order = new Order({
        userName,
        userEmail,
        vehicleModel,
        appointmentDate,
        appointmentTime,
        maintenancePlan,
        specialRequests,
        selectedServices,
        vehicleType,
        totalPrice // Include totalPrice field
      });

      // Save the order to the database
      await order.save();

      // Redirect or respond with a success message
      res.send('<script>alert("Order placed successfully!"); window.location.href = "/customer";</script>');
  } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).send('<script>alert("Error placing order"); window.location.href = "/book_appointment";</script>');
  }
});


const PORT =  3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;