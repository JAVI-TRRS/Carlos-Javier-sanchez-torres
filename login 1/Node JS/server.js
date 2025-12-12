const express = require('express');
const cors = require('cors');
const connection = require('./Database');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// LISTAR USUARIOS
app.get('/usuarios', (req, res) => {
    connection.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            res.status(500).send('Error database');
            return;
        }
        res.json(results);
    });
});

// LOGIN
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM usuarios WHERE correo = ? AND password = ?";
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error("Error al consultar:", err);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }

        if (results.length > 0) {
            return res.json({ success: true, message: "Inicio de sesión exitoso" });
        } else {
            return res.status(401).json({ success: false, message: "Correo o contraseña incorrectos" });
        }
    });
});

app.listen(port, () => {
    console.log(`servidor escuchando en ${port}`);
});
