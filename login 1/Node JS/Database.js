const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'base'
});

connection.connect((err) => {
    if (err) {
        console.error('error database', err);
        return;
    }
    console.log('Conexion exitosa con MYSQL');
});

module.exports = connection;
