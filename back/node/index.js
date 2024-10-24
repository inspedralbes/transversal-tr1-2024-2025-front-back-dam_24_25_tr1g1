const cors = require('cors')
const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

app.use(express.json());
app.use(cors())

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

app.get('/getProd/:id', async (req, res) => {
    const id = req.params.id;
    console.log('getOneProd')

    try {
        connection = await mysql.createConnection(config);

        const [rows, fields] = await connection.execute('SELECT * FROM productes WHERE id = ' + id);

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

app.post('/addProd', async (req, res) => {
    console.log("addProd")
    const prod = req.body
    if (prod.nom != null && prod.nom != "" && prod.descripcio != null && prod.descripcio != "" && prod.fotoRuta != null && prod.fotoRuta != "" && prod.preu != null && prod.preu != ""&& prod.stock != null && prod.stock != "" && prod.category != null && prod.category != "") {
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
    }
     else {
    res.json("Na puede estar vacio");
    }
});

app.put('/modProd/:id', async (req, res) => {
    console.log("modProd");
    const id = req.params.id;
    const prod = req.body;

    if (prod.nom != null && prod.nom != "" && prod.descripcio != null && prod.descripcio != "" && prod.fotoRuta != null && prod.fotoRuta != "" && prod.preu != null && prod.preu != ""&& prod.stock != null && prod.stock != "" && prod.category != null && prod.category != "") {
        try {
            const connection = await mysql.createConnection(config);

            const updateQuery = 'UPDATE productes SET nom = ?, descripcio = ?, fotoRuta = ?, preu = ?, oferta = ?, stock = ?, category = ?, halal = ?, vegan = ?, gluten = ?, lactosa = ?, crustacis = ? WHERE id = ?;';

            await connection.execute(updateQuery, [
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
                prod.crustacis,
                id
            ]);

            const [rows] = await connection.execute('SELECT * FROM productes');
            res.json(rows);

            await connection.end();

        } catch (err) {
            console.error('Error MySQL', err);
            res.status(500).send('Error updating product');
        }
    } else {
        res.json("Na puede estar vacio");
    }
});

app.delete('/delProd/:id', async (req, res) => {
    const id = req.params.id;
    console.log("delProd")
    
    try {
        const connection = await mysql.createConnection(config);

        await connection.execute('DELETE FROM productes WHERE id = ' + id);

        const [rows, fields] = await connection.execute('SELECT * FROM productes');

        const categories = rows;

        res.json(categories);

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

app.post('/addCat', async (req, res) => {
    console.log("addCat")
    const prod = req.body
    if (prod.nom != null && prod.nom != "") {
    
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
    } else {
    res.json("Na puede estar vacio");
    }
});

app.put('/modCat/:id', async (req, res) => {
    const id = req.params.id;
    console.log("modifCat")
    const prod = req.body

    if (prod.nom != null && prod.nom != "") {
    
    try {
        const connection = await mysql.createConnection(config);

        const insertQuery = `
            UPDATE categories SET nom = ? WHERE id = ?
        `;

        await connection.execute(insertQuery, [
            prod.nom,
            id
        ]);

        const [rows] = await connection.execute('SELECT * FROM categories');

        res.json(rows);

    } catch (err) {
        console.error('Error MySQL', err)
        res.status(500).send('Error data')
    }
    }
     else {
    res.json("Na puede estar vacio");
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

    app.get('/getComan', async (req, res) => {
        console.log('getComan')
    
        try {
            connection = await mysql.createConnection(config);
    
            const [rows, fields] = await connection.execute('SELECT * FROM comandes');
    
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

    app.post('/addComan', async (req, res) => {
        console.log("addComan")
        const prod = req.body
        if (prod.contingut != null && prod.contingut != "" && prod.estat != null && prod.estat != "" && prod.client != null && prod.client != "") {
        try {
            const connection = await mysql.createConnection(config);
    
            const insertQuery = `
                INSERT INTO comandes (contingut, estat, client)
                VALUES (?, ?, ?)
            `;
    
            await connection.execute(insertQuery, [
                prod.contingut,
                prod.estat,
                prod.client
            ]);
    
            const [rows] = await connection.execute('SELECT * FROM comandes');
    
            res.json(rows);
    
        } catch (err) {
            console.error('Error MySQL', err)
            res.status(500).send('Error data')
        }
        }
         else {
        res.json("Na puede estar vacio");
        }
    });

app.listen(26968, () => {
    console.log('localhost:26968')
});