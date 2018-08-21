//greatBay is good source for that
//insert "mock" data insert into

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
    products_info();
});


function products_info() {

    connection.query('SELECT * FROM products', function (error, results, fields) {

        if (error) throw error;
        console.log('-----------Avaliable Products------------\n');

        var showInfo = results.filter(function (obj) {
            return console.log('--------------------------') + console.log('Product: ' + obj.product_name + '\nCatagory: ' + obj.department_name + '\nid: ' + obj.id + '\nAvailability: ' + obj.stock_quantity + " items" + '\nPrice: $' + obj.price + '\n');
        });
        buy();
    });
} // end of products_info func

function buy() {

    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "What is id of the product(s) you would like to buy?",
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
            message: "How Many would like of this item? Type number 1 if you only need 1 item. ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;

            }
        }

    ])
        .then(function (answer) {
            var userId = answer.item;
            var userQuantity = answer.quantity;

            connection.query('SELECT * FROM products WHERE id = ?', [userId], function (error, results, fields) {
                if (error) throw error;

                var userChosenItem = results[0];

                if (userQuantity <= 0) {
                    console.log('wrong quantity');
                    buy();
                }
                else {

                    var checkStock = userChosenItem.stock_quantity - userQuantity;

                    if (checkStock < 0) {
                        console.log('Insufficient quantity!');
                        buy();
                    }

                    else {

                        connection.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [checkStock, userId], function (error, results, fields) {
                            if (error) throw error;
                            //update the database
                            console.log('\n-----------Your order---------\n');
                            console.log(' Product(s): ' + userChosenItem.product_name);
                            console.log(' Total: $' + userChosenItem.price * userQuantity);
                            products_info();
                        });
                    }

                } // end of the whole else statement

            }); //end of select func

        }); // end of inquirer func

} // end of buy func