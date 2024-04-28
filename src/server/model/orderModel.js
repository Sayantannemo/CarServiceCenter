const mongoose = require('mongoose');

// Define the schema
const OrderSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  vehicleModel: {
    type: String,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  maintenancePlan: {
    type: String,
    required: true
  },
  specialRequests: String,
  selectedServices: [String],
  vehicleType: String,
  totalPrice: Number,
  orderStatus: {
    type: String,
    default: "pending"
  }
});

// Create the model
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
