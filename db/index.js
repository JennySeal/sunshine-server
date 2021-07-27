const {Pool} = require('pg');
require('dotenv').config();


const devConfig = {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
}


const proConfig = {
    connectionString: process.env.DATABASE_URL
}

const pool = new Pool(process.env.NODE_ENV === 'production' ? proConfig : devConfig)

const getProducts = (req, res) => {
    pool.query('SELECT * FROM products ORDER BY product_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const getProduct = (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM products WHERE product_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const login = async (req) => {
    const username = req;
    const res = await pool.query('SELECT * FROM customers WHERE username = $1', [username]) 
      return res.rows
    }
        

const addUser = (req, res) => {
    const {address_line1, address_line2, town, county, postcode, email, saltyhash, username, first_name, surname} = req.body;
    pool.query
    ('INSERT INTO customers(address_line1, address_line2, town, county, postcode, email, saltyhash, username, first_name, surname) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', 
    [address_line1, address_line2, town, county, postcode, email, saltyhash, username, first_name, surname], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`User added with ID: ${results.rows[0].customer_id}`)
    })
}


const getOrderHistory = (req, res) => {
    const customer_id = req.params.id;
    const customer_id_number = parseInt(customer_id, 10);
    pool.query('SELECT order_lines.order_line_id, order_lines.product_id, orders.date_of_order, products.name, products.image, products.price FROM order_lines INNER JOIN orders ON order_lines.order_id = orders.order_id INNER JOIN products ON order_lines.product_id = products.product_id WHERE order_lines.customer_id = $1', 
    [customer_id_number], (error, results) => {
        if (error) {
           throw error;
        }
        res.status(200).json(results.rows)
    })
}


const addOrder = (req, res) => {
    const {total_spent, customer_id, date_of_order, status} = req.body;
    pool.query
    ('INSERT INTO orders(total_spent, customer_id, date_of_order, status) VALUES($1, $2, $3, $4) RETURNING *', 
    [total_spent, customer_id, date_of_order, status], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`${results.rows[0].order_id}`)
    })
}

const addOrderLines = (req, res) => {
    const {order_line_id, order_id, product_id, quantity, customer_id} = req.body;

    pool.query
    ('INSERT INTO order_lines(order_line_id, order_id, product_id, quantity, customer_id) VALUES($1, $2, $3, $4, $5) RETURNING *', 
    [order_line_id, order_id, product_id, quantity, customer_id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Order Lines added with ID: ${results.rows[0].order_id}`)
    })
}

const updateStock = (req, res) => {
    const {product_id} = req.body;

    pool.query
    ('UPDATE products SET items_in_stock = (items_in_stock - 1) WHERE product_id = $1 RETURNING *', 
    [product_id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Stock updated for products with ID: ${results.rows[0].product_id}`)
    })
}




module.exports = {
    getProducts,
    getProduct,
    login, 
    getOrderHistory,
    addUser, 
    addOrder,
    addOrderLines,
    updateStock,
};