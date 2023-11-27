// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Invoice = require('./models/car');
const database = require('./config/database');

const app = express();
const port = process.env.PORT || 6000;

app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

mongoose.connect(database.url);

// Show all invoices
app.get('/api/invoices', function (req, res) {
  Invoice.find().then(function (invoices) {
    if (!invoices || invoices.length === 0) {
      res.status(404).json({ error: 'No invoices found' });
    } else {
      res.json(invoices);
    }
  }).catch(function (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  });
});

// Show a specific invoice by ID
app.get('/api/invoices/:invoice_id', function (req, res) {
  let id = req.params.invoice_id;
  Invoice.findById(id).then(function (invoice) {
    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
    } else {
      res.json(invoice);
    }
  });
});

// Insert a new invoice
app.post('/api/invoices', function (req, res) {
  Invoice.create(req.body)
    .then(invoice => {
      res.json(invoice);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to create invoice' });
    });
});

// Delete an existing invoice by ID
app.delete('/api/invoices/:invoice_id', function (req, res) {
    let id = req.params.invoice_id;
    Invoice.findOneAndDelete({ _id: id })
      .then(result => {
        if (!result) {
          res.status(404).json({ error: 'Invoice not found' });
        } else {
          res.json({ message: 'Invoice deleted successfully' });
        }
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
  

// Update "Manufacturer" & “price_in_thousands” of an existing invoice by ID
app.put('/api/invoices/:invoice_id', function (req, res) {
  let id = req.params.invoice_id;
  let data = {
    Manufacturer: req.body.Manufacturer,
    Price_in_thousands: req.body.Price_in_thousands
  };

  Invoice.findByIdAndUpdate(id, data, { new: true })
    .then(invoice => {
      if (!invoice) {
        res.status(404).json({ error: 'Invoice not found' });
      } else {
        res.json(invoice);
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.listen(port);
console.log("App listening on port : " + port);
