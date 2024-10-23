const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

app.use(express.json()); 

const config = {
    host: 'localhost',
    user: 'a20erigomvil_grillgrab',
    password: 'GrillGrab123!',
    database: 'a20erigomvil_grillgrab',
    port: 3306 
};

app.get('/getProd', async (req, res) => {
    console.log('getProd')

    try {
        connection = await mysql.createConnection(config);

        const [rows, fields] = await connection.execute('SELECT * FROM productes');

        const productos = rows;

        res.json(productos);
    } catch (err) {
        console.error('Error MySQL', err)
        res.status(500).send('Error data')
    } finally {
        if (connection) {
            await connection.end()
        }
    }
});

app.put('/addProd', async (req, res) => {
    console.log("addProd")
    const prod = req.body 
    
    try {
        const connection = await mysql.createConnection(config);

        const insertQuery = `
            INSERT INTO productes (nom, descripcio, fotoRuta, preu, oferta, stock, category, halal, vegan, gluten, lactosa, crustacis)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.execute(insertQuery, [
            prod.nom,
            prod.descripcio,
            prod.fotoRuta,
            prod.preu,
            prod.oferta,
            prod.stock,
            prod.category,
            prod.halal,
            prod.vegan,
            prod.gluten,
            prod.lactosa,
            prod.crustacis
        ]);

        const [rows] = await connection.execute('SELECT * FROM productes');

        res.json(rows);

    } catch (err) {
        console.error('Error MySQL', err)
        res.status(500).send('Error data')
    }
});

app.listen(25959, () => {
    console.log('localhost:25959')
});