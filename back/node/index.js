const cors = require('cors')
const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'a20erigomvil_grillgrab',
    port: 3306 
};

// Configuración de multer para almacenar las imágenes en una carpeta del servidor
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único del archivo
    }
});

const upload = multer({ storage: storage });

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

app.post('/addProd', upload.single('imatge'), async (req, res) => {
    console.log("addProd");
    const prod = req.body;
    

    if (prod.nom != null && prod.nom != "" && prod.descripcio != null && prod.descripcio != "" && prod.preu != null && prod.preu != ""&& prod.stock != null && prod.stock != "" && prod.category != null && prod.category != "") {
        try {
            const connection = await mysql.createConnection(config);

            const insertQuery = `
                INSERT INTO productes (nom, descripcio, fotoRuta, preu, oferta, stock, category, halal, vegan, gluten, lactosa, crustacis)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const fotoRuta = req.file.path;

            let oferta = null;

            if(prod.oferta =! null){
                oferta == prod.oferta   
            }

            console.log("dasdasdasdas", prod.oferta)

            await connection.execute(insertQuery, [
                prod.nom,
                prod.descripcio,
                fotoRuta,
                prod.preu,
                oferta,
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
            console.error('Error MySQL', err);
            res.status(500).send('Error data');
        }
    }
     else {
    res.json("Na puede estar vacio");
    }
});

app.put('/modProd/:id', upload.single('imatge'), async (req, res) => {
    console.log("modProd");
    const id = req.params.id;
    const prod = req.body;


    if (prod.nom != null && prod.nom != "" && prod.descripcio != null && prod.descripcio != "" && prod.preu != null && prod.preu != ""&& prod.stock != null && prod.stock != "" && prod.category != null && prod.category != "") {
        try {

            const connection = await mysql.createConnection(config);

            const [MM] = await connection.execute('SELECT * FROM productes WHERE id = ?', [id]);
            const cosas = MM[0];

            console.log(cosas.id);

            const fotoRuta = req.file.path;

            let oferta = null;

            if(prod.oferta == "null"){
                oferta == null   
            }
            else{
                oferta == prod.oferta
            }
            
            if (prod.nom == null){
                prod.nom = cosas.nom
            }

            if (fotoRuta == null){
                fotoRuta = cosas.fotoRuta
            }

            if (prod.descripcio == null){
                prod.descripcio = cosas.descripcio
            }

            if (prod.preu == null){
                prod.preu = cosas.preu
            }

            if (prod.stock == null){
                prod.stock = cosas.stock
            }

            if (prod.category == null){
                prod.category = cosas.category
            }

            if (prod.halal == null){
                prod.halal = cosas.halal
            }

            if (prod.vegan == null){
                prod.vegan = cosas.vegan
            }

            if (prod.gluten == null){
                prod.gluten = cosas.gluten
            }

            if (prod.lactosa == null){
                prod.lactosa = cosas.lactosa
            }

            if (prod.crustacis == null){
                prod.crustacis = cosas.crustacis
            }

            const updateQuery = 'UPDATE productes SET nom = ?, descripcio = ?, fotoRuta = ?, preu = ?, oferta = ?, stock = ?, category = ?, halal = ?, vegan = ?, gluten = ?, lactosa = ?, crustacis = ? WHERE id = ?;';

            await connection.execute(updateQuery, [
                prod.nom,
                prod.descripcio,
                fotoRuta,
                prod.preu,
                oferta,
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

    //USUARIS
    app.get('/getUsers', async (req, res) => {
        console.log('getUsers')
    
        try {
            connection = await mysql.createConnection(config);
    
            const [rows, fields] = await connection.execute('SELECT * FROM usuaris');
    
            const users = rows;
    
            res.json(users);
        } catch (err) {
            console.error('Error MySQL', err)
            res.status(500).send('Error data')
        } finally {
            if (connection) {
                await connection.end()
            }
        }
    });
        
    app.put('/editUserAdmin/:id', async (req, res) => {
        const id = req.params.id;
        const { admin } = req.body; 
    
        if (admin !== undefined && (admin === 0 || admin === 1)) {
            try {
                const connection = await mysql.createConnection(config);
    
                const updateQuery = `
                    UPDATE usuaris 
                    SET admin = ? 
                    WHERE id = ?
                `;
    
                await connection.execute(updateQuery, [admin, id]);
    
                const [rows] = await connection.execute('SELECT * FROM usuaris');
                res.json(rows);
    
                await connection.end();
            } catch (err) {
                console.error('Error MySQL', err);
                res.status(500).send('Error al actualizar el campo admin del usuario');
            }
        } else {
            res.status(400).send('Valor de admin inválido; debe ser 0 o 1');
        }
    });
    
    app.delete('/deleteUser/:id', async (req, res) => {
        const id = req.params.id;
    
        try {
            const connection = await mysql.createConnection(config);
    
            await connection.execute('DELETE FROM usuaris WHERE id = ?', [id]);
    
            const [rows] = await connection.execute('SELECT * FROM usuaris');
            res.json(rows);
    
            await connection.end();
        } catch (err) {
            console.error('Error MySQL', err);
            res.status(500).send('Error al eliminar el usuario');
        }
    });
    
    app.post('/addUser', async (req, res) => {
        console.log("addUser");
        const user = req.body;

        if (user.nom && user.correu && user.contrasenya && user.halal !== undefined && user.vegan !== undefined && user.gluten !== undefined && user.lactosa !== undefined && user.crustacis !== undefined) {
            try {
                const connection = await mysql.createConnection(config);

                const hashedPassword = await bcrypt.hash(user.contrasenya, 10);

                const insertQuery = `
                    INSERT INTO usuaris (nom, correu, contrasenya, halal, vegan, gluten, lactosa, crustacis)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
    
                await connection.execute(insertQuery, [
                    user.nom,
                    user.correu,
                    hashedPassword, 
                    user.halal,
                    user.vegan,
                    user.gluten,
                    user.lactosa,
                    user.crustacis
                ]);
    
                const [rows] = await connection.execute('SELECT * FROM usuaris WHERE correu = ?', [user.correu]);
                res.json(rows);
    
                await connection.end();
    
            } catch (err) {
                console.error('Error MySQL', err);
                res.status(500).send('Error adding user');
            }
        } else {
            res.status(400).json("Los campos no pueden estar vacíos");
        }
    });
    
    app.post('/login', async (req, res) => {
        console.log("login");
        const { correu, contrasenya } = req.body;
        console.log(correu);
        console.log(contrasenya)
        if (correu && contrasenya) {
            try {
                const connection = await mysql.createConnection(config);
                
                const [rows] = await connection.execute(
                    'SELECT id, correu, contrasenya FROM usuaris WHERE correu = ?',
                    [correu]
                );
    
                await connection.end();
    
                if (rows.length > 0) {

                    const validPassword = await bcrypt.compare(contrasenya, rows[0].contrasenya);
                    
                    if (validPassword) {
                        res.json({
                            success: true,
                            message: "Login exitoso",
                            user: rows[0].id
                        });
                    } else {
                        res.status(401).json({ success: false, message: "Correu o contrassenya incorrectes" });
                    }
                }
            } catch (err) {
                console.error('Error MySQL', err);
                res.status(500).send('Error en el login');
            }
        } else {
            res.status(400).json("Correo i contrassenya obligatoris");
        }
    });
    
    //COMANDES
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


    app.put('/modComan/:id', async (req, res) => {
        const id = req.params.id;
        console.log("modifComan")
        const prod = req.body
    
        if (prod.contingut != null && prod.contingut != "" && prod.estat != null && prod.estat != "" && prod.client != null && prod.client != "") {
        
        try {
            const connection = await mysql.createConnection(config);
    
            const insertQuery = `
                UPDATE comandes SET data = ?, contingut = ?, estat = ?, client = ?  WHERE id = ?
            `;
    
            await connection.execute(insertQuery, [
                prod.data,
                prod.contingut,
                prod.estat,
                prod.client,
                id
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