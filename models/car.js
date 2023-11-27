// load mongoose since we need it to define a model
const mongoose = require('mongoose');

const carschema = new mongoose.Schema({
  InvoiceNo: String,
  image: String,
  Manufacturer: String,
  class: String,
  Sales_in_thousands: Number,
  __year_resale_value: Number,
  Vehicle_type: String,
  Price_in_thousands: Number,
  Engine_size: Number,
  Horsepower: Number,
  Wheelbase: Number,
  Width: Number,
  Length: Number,
  Curb_weight: Number,
  Fuel_capacity: Number,
  Fuel_efficiency: Number,
  Latest_Launch: Date,
  Power_perf_factor: Number
});

const Invoice = mongoose.model('Car',carschema);

module.exports = Invoice;
