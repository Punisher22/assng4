var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);

var Employee = require('./models/employee');
 
app.get('/api/employees', function(req, res) {
	// use mongoose to get all todos in the database
	Employee.find().then(function(employees) {
		// if there is an error retrieving, send the error otherwise send data
		if (!employees || employees.length === 0) {
			res.status(404).json({ error: 'No employees found' });
		} else {
			res.json(employees); // return all employees in JSON format
		}
	}).catch(function(err) {
		// Handle errors here
		res.status(500).json({ error: 'Internal Server Error' });
	});
});


// get a employee with ID of 1
app.get('/api/employees/:employee_id', function(req, res) {
	let id = req.params.employee_id;
	Employee.findById(id).then(function(err, employee) {
		if (err)
			res.send(err)
 
		res.json(employee);
	});
 
});

// create employee and send back all employees after creation
app.post('/api/employees', function(req, res) {
    // create mongoose method to create a new record into collection
    console.log(req.body);

    Employee.create({
        name: req.body.name,
        salary: req.body.salary,
        age: req.body.age
    })
    .then(employee => {
        // Successfully created employee
        // Now get and return all the employees after newly created employee record
        Employee.find().exec()
        .then(employees => {
            res.json(employees);
        })
        .catch(error => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
    })
    .catch(error => {
        // Handle create error
        res.status(500).json({ error: 'Failed to create employee' });
    });
});


// update employee by id
app.put('/api/employees/:employee_id', function(req, res) {
    let id = req.params.employee_id;
    
    var data = {
        name: req.body.name,
        salary: req.body.salary,
        age: req.body.age
    }

    // update the user
    Employee.findByIdAndUpdate(id, data)
        .then(employee => {
            if (!employee) {
                res.status(404).send('Employee not found.');
            } else {
                res.send('Successfully! Employee updated - ' + employee.name);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

// delete an employee by id
app.delete('/api/employees/:employee_id', function(req, res) {
    console.log(req.params.employee_id);
    let id = req.params.employee_id;
    
    Employee.deleteOne({ _id: id })
        .then(result => {
            if (result.deletedCount === 1) {
                res.send('Successfully! Employee has been Deleted.');
            } else {
                res.status(404).send('Employee not found.');
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
});


app.listen(port);
console.log("App listening on port : " + port);
