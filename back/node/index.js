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

app.get('/getCat', async (req, res) => {
    console.log('getCat')

    try {
        connection = await mysql.createConnection(config);

        const [rows, fields] = await connection.execute('SELECT * FROM categories');

        const categories = rows;

        res.json(categories);
    } catch (err) {
        console.error('Error MySQL', err)
        res.status(500).send('Error data')
    } finally {
        if (connection) {
            await connection.end()
        }
    }
});

app.put('/addCat', async (req, res) => {
    console.log("addCat")
    const prod = req.body 
    
    try {
        const connection = await mysql.createConnection(config);

        const insertQuery = `
            INSERT INTO categories (nom)
            VALUES (?)
        `;

        await connection.execute(insertQuery, [
            prod.nom
        ]);

        const [rows] = await connection.execute('SELECT * FROM categories');

        res.json(rows);

    } catch (err) {
        console.error('Error MySQL', err)
        res.status(500).send('Error data')
    }
});

app.delete('/delCat/:id', async (req, res) => {
    const id = req.params.id;
    console.log("delCat")
    
    try {
        const connection = await mysql.createConnection(config);

        const [rows] = await connection.execute('SELECT * FROM productes WHERE category = ' + id);

        console.log(rows.length)

        if(rows.length == 0){
            await connection.execute('DELETE FROM categories WHERE id = ' + id);

            res.json("borrao");
        }
        else{
            res.json("no puedes");
        }
        

    } catch (err) {
        console.error('Error MySQL', err)
        res.status(500).send('Error data')
    }
    
    });

app.listen(25959, () => {
    console.log('localhost:25959')
});