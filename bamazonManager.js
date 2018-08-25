
var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({

    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "Abosaad123",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    program_info();
});


function program_info() {
    inquirer.prompt([
        {
            name: "opreation",
            type: "list",
            message: "What is the opreation would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }

    ])
        .then(function (ans) {
            console.log(ans)

            if (ans.opreation === "View Products for Sale") {
                viewProducts()
            }

            else if (ans.opreation === "View Low Inventory") {
                lowInventory();
            }

            else if (ans.opreation === "Add to Inventory") {
                addInv();
            }

            else {
                addProduct();
            }
        });
}

function viewProducts() {
    connection.query('SELECT * FROM products', function (error, results, fields) {

        if (error) throw error;
        console.log('-----------Avaliable Products------------\n');

        var showInfo = results.filter(function (obj) {
            return  console.log('--------------------------') + console.log('Product: ' + obj.product_name + '\nCatagory: ' + obj.department_name + '\nid: ' + obj.id + '\nAvailability: ' + obj.stock_quantity + " items" + '\nPrice: $' + obj.price + '\n');
        });
        program_info();
    });
}

function lowInventory() {
    connection.query('SELECT * FROM products', function (error, results, fields) {

        if (error) throw error;
        console.log('\n-----------Low Inventory Products that are less than 100------------\n');

        var lowInv = results.filter(function (obj) {
            if (obj.stock_quantity < 100) {

                return console.log('--------------------------') + console.log('Product: ' + obj.product_name + '\nCatagory: ' + obj.department_name + '\nid: ' + obj.id + '\nAvailability: ' + obj.stock_quantity + " items" + '\nPrice: $' + obj.price + '\n');
            }
        });
        program_info();
    });
}

function addInv() {
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "What is the id of the product(s) you would like to add to?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;

            }
        },
        {
            name: "quantity",
            type: "input",
            message: "How Many of this item would you like to add? Type number 1 if you only need to add 1 item.",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (ans) {
            var userId = ans.item;
            var userQuantity = ans.quantity;

            if (userQuantity <= 0) {
                console.log('\nQuantity must be 1 or more! It cannot be zero or less!\n');
                program_info();
            }
            else {
                connection.query('SELECT * FROM products WHERE id = ?', [userId], function (error, results, fields) {
                    if (error) throw error;

                    var userChosenProduct = results[0];
                    var add = Number(userQuantity) + Number(userChosenProduct.stock_quantity);
                    console.log("\n Inventory Before you add: " + userChosenProduct.stock_quantity);

                    connection.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [add, userId], function (error, results, fields) {
                        if (error) throw error;

                        console.log('\n-----------------Updated Inventory-----------------');

                        console.log('\n               Product: ' + userChosenProduct.product_name);
                        console.log('              id: ' + userChosenProduct.id)
                        console.log("              Quantity: " + add + '\n');

                        console.log('---------------------------------------------------');

                        program_info();
                    });
                }); // end of select statement
            } //end of else statement
        }); //end of then func
} //end of addInv() func

function addProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the product?",
        },
        {
            name: "department",
            type: "input",
            message: "What is the depratment of the product?",
        },
        {
            name: "quantity",
            type: "input",
            message: "How Many of this item would you like to add?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "price",
            type: "input",
            message: "What is the price of the product?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }

    ])
        .then(function (ans) {

            if (ans.quantity <= 0) {
                console.log(' Worng Quantity. It has to be higher than zero!');
                program_info()
            }
            else if (ans.price <= 0) {
                console.log(' Price has to be higher than zero!');
                program_info()
            }
            else {
                var post = { 
                    product_name: ans.name,
                    department_name: ans.department,
                    stock_quantity: ans.quantity,
                    price: ans.price
                };

                 connection.query('INSERT INTO products SET ?', post, function (error, results, fields) {
                    if (error) throw error;

                    console.log('\n-------------------Product Successfully Added!-------------------\n');
                    program_info();
                });

            } //end of else statement
        }) //end of then func
} //end of addProduct func