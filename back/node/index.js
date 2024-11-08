const cors = require('cors');
const express = require('express');
const http = require('http'); // Importar http
const socketIo = require('socket.io'); // Importar socket.io
const app = express();
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const { exec } = require('child_process')
const fs = require('fs').promises;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Crear un servidor HTTP
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

const config = {
    host: 'localhost',
    user: 'a20erigomvil_grillgrab',
    password: 'GrillGrab123!',
    database: 'a20erigomvil_grillgrab',
    port: 3306 
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único del archivo
    }
});

const upload = multer({ storage: storage });

app.get('/clientes', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(config);

        const query = `
            SELECT 
                u.id AS ID, 
                u.nom AS Clientes, 
                COUNT(c.client) AS Ventes, 
                COALESCE(SUM(c.Total), 0) AS Diners
            FROM 
                usuaris u
            LEFT JOIN 
                comandes c ON u.id = c.client
            GROUP BY 
                u.id, u.nom  
        `;

        const [rows] = await connection.execute(query);

        let jsonData = { "usuaris": [] };

        rows.forEach(row => {
            // Calcular Diners/venda (dinero por venta)
            let dinersVenda = row.Ventes > 0 ? (row.Diners / row.Ventes).toFixed(2) : 0;

            jsonData.usuaris.push({
                "ID": row.ID,
                "Clients": row.Clientes,
                "Ventes": row.Ventes,
                "Diners": row.Diners,
                "Diners/venda": parseFloat(dinersVenda),
                "Moneda": "€"
            });
        });

        res.json(jsonData);

    } catch (err) {
        console.error('Error MySQL', err);
        res.status(500).send('Error en los datos');
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});
app.get('/generate-client-stats', (req, res) => {
    const scriptPath = path.join(__dirname, '..', 'python', 'clients.py'); 
    exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando el script: ${stderr}`);
            return res.status(500).json({ error: "Error al generar las estadísticas" });
        }

        const imageUrl = `http://dam.inspedralbes.cat:26968/uploads/estats.png`;
        res.json({ imageUrl });
    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/historial_vendas', async (req, res) => {
    const email = req.query.email; 
    let connection;
    try {
        connection = await mysql.createConnection(config);

        const query = `
            SELECT 
                c.id AS comanda_id,
                c.preuComanda AS diners_gastats,
                c.data AS data_comanda
            FROM 
                usuaris u
            JOIN 
                comandes c ON u.id = c.client
            WHERE 
                u.correu = ?  `; 

        const [rows] = await connection.execute(query, [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron ventas para este correo." });
        }

        res.json(rows);

    } catch (err) {
        console.error('Error MySQL', err);
        res.status(500).send('Error en los datos');
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});


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
    

    if (prod.nom != null && prod.nom != "" && prod.descripcio != null && prod.descripcio != "" && prod.preu != null && prod.preu != "" && prod.oferta != null && prod.oferta != "" && prod.stock != null && prod.stock != "" && prod.category != null && prod.category != "") {
        try {
            const connection = await mysql.createConnection(config);

            const insertQuery = `
                INSERT INTO productes (nom, descripcio, fotoRuta, preu, oferta, stock, category, halal, vegan, gluten, lactosa, crustacis)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const fotoRuta = req.file.path;
            console.log("dasdasdasdas", prod.oferta)

            await connection.execute(insertQuery, [
                prod.nom,
                prod.descripcio,
                fotoRuta,
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
            io.emit("productesUpdated");
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

    if (prod.nom && prod.descripcio && prod.preu && prod.stock && prod.category) {
        try {
            const connection = await mysql.createConnection(config);
            const [resultats] = await connection.execute('SELECT * FROM productes WHERE id = ?', [id]);
            const cosas = resultats[0];

            if (!cosas) {
                return res.status(404).send('No existe el producto');
            }

            const fotoRuta = req.file ? req.file.path : cosas.fotoRuta;

            prod.nom = prod.nom || cosas.nom;
            prod.descripcio = prod.descripcio || cosas.descripcio;
            prod.preu = prod.preu || cosas.preu;
            prod.stock = prod.stock || cosas.stock;
            prod.category = prod.category || cosas.category;
            prod.halal = prod.halal !== undefined ? prod.halal : cosas.halal;
            prod.vegan = prod.vegan !== undefined ? prod.vegan : cosas.vegan;
            prod.gluten = prod.gluten !== undefined ? prod.gluten : cosas.gluten;
            prod.lactosa = prod.lactosa !== undefined ? prod.lactosa : cosas.lactosa;
            prod.crustacis = prod.crustacis !== undefined ? prod.crustacis : cosas.crustacis;

            //let oferta = prod.oferta === "0" ? null : prod.oferta;
            console.log(prod.oferta)
            if(prod.oferta != "null"){
            const updateQuery = 'UPDATE productes SET nom = ?, descripcio = ?, fotoRuta = ?, preu = ?, oferta = ?, stock = ?, category = ?, halal = ?, vegan = ?, gluten = ?, lactosa = ?, crustacis = ? WHERE id = ?;';
            await connection.execute(updateQuery, [
                prod.nom,
                prod.descripcio,
                fotoRuta,
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
        }
            else{
                const updateQuery = 'UPDATE productes SET nom = ?, descripcio = ?, fotoRuta = ?, preu = ?, oferta = ?, stock = ?, category = ?, halal = ?, vegan = ?, gluten = ?, lactosa = ?, crustacis = ? WHERE id = ?;';
                await connection.execute(updateQuery, [
                    prod.nom,
                    prod.descripcio,
                    fotoRuta,
                    prod.preu,
                    null,
                    prod.stock,
                    prod.category,
                    prod.halal,
                    prod.vegan,
                    prod.gluten,
                    prod.lactosa,
                    prod.crustacis,
                    id
                ]); 
            }

            const [rows] = await connection.execute('SELECT * FROM productes');
            io.emit("productesUpdated");
            res.json(rows);
            await connection.end();

        } catch (err) {
            console.error('Error MySQL', err);
            res.status(500).send('Error updating product');
        }
    } else {
        res.status(400).json("No puede estar vacío");
    }
});

app.delete('/delProd/:id', async (req, res) => {
    const id = req.params.id;
    console.log("delProd")
    
    try {
        const connection = await mysql.createConnection(config);
        const [rows] = await connection.execute('SELECT fotoRuta FROM productes WHERE id = ?', [id]);
        if (rows.length > 0) {
            const fotoRuta = rows[0].fotoRuta;
            const filePath = `./${fotoRuta}`;
            try {
                await fs.access(filePath); 
                await fs.unlink(filePath); 
                console.log(`Archivo eliminado: ${filePath}`);
            } catch (error) {
                console.error('El archivo no existe o no pudo ser eliminado:', error);
            }

        await connection.execute('DELETE FROM productes WHERE id = ' + id);

        const [updatedRows] = await connection.execute('SELECT * FROM productes');
        io.emit("productesUpdated");

        res.json(updatedRows);
        }
        else {
            res.status(404).send('Producte no trobat')
        }
    } catch (err) {
        console.error('Error MySQL', err)
        res.status(500).send('Error data')
    }
    
    });
    
app.put('/stockProd/:id', upload.single('imatge'), async (req, res) => {
    console.log("modProd");
    const id = req.params.id;
    const cantidad = req.body;
        try {
            const connection = await mysql.createConnection(config);
            const [resultats] = await connection.execute('SELECT * FROM productes WHERE id = ?', [id]);
            const cosas = resultats[0];

            if (!cosas) {
                return res.status(404).send('No existe el producto');
            }

            const stock = cosas.stock - cantidad.stock;

            //let oferta = prod.oferta === "0" ? null : prod.oferta;
            
            const updateQuery = 'UPDATE productes SET stock = ? WHERE id = ?;';
            await connection.execute(updateQuery, [
                stock,
                id
            ]);

            const [rows] = await connection.execute('SELECT * FROM productes');
            io.emit("productesUpdated");
            res.json(rows);
            await connection.end();

        } catch (err) {
            console.error('Error MySQL', err);
            res.status(500).send('Error updating product');
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
                console.log("CONTRASENYA", user.contrasenya)

                const insertQuery = `
                    INSERT INTO usuaris (nom, correu, contrasenya, halal, vegan, gluten, lactosa, crustacis, admin)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, false)
                `;
    
                await connection.execute(insertQuery, [
                    user.nom,
                    user.correu,
                    user.contrasenya, 
                    user.halal,
                    user.vegan,
                    user.gluten,
                    user.lactosa,
                    user.crustacis
                ]);
    
                const [rows] = await connection.execute('SELECT * FROM usuaris WHERE correu = ?', [user.correu]);
                console.log("FINAL",rows[0].contrasenya)
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
    		console.log([rows])
                if (rows.length > 0) {
			console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEO", contrasenya, rows[0].contrasenya)
                    
			console.log("QUE DISE", contrasenya, "Poh digo", rows[0].contrasenya)
                    if (contrasenya==rows[0].contrasenya) {
			
                        res.json(
                            rows
                        );
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

    app.get('/getComan/:id', async (req, res) => {
        console.log('getComanId')
        const id = req.params.id;

    
        try {
            connection = await mysql.createConnection(config);
    
            const [rows] = await connection.execute(
                'SELECT * FROM comandes WHERE id = ?',
                [id]
            );
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

    app.get('/getComanContent/:id', async (req, res) => {
        console.log('getComanId')
        const id = req.params.id;

        try {
            connection = await mysql.createConnection(config);

            const [rows] = await connection.execute(
                'SELECT contingut FROM comandes WHERE id = ?',
                [id]
            );

            if (rows.length > 0) {
                res.send(rows[0].contingut);
            } else {
                res.status(404).send('No se encontró la comanda');
            }
        } catch (err) {
            console.error('Error MySQL', err)
            res.status(500).send('Error data')
        } finally {
            if (connection) {
                await connection.end()
            }
        }
    });

    app.get('/getComanClient/:client', async (req, res) => {
        console.log('getComanUsers')
        const client = req.params.client;

    
        try {
            connection = await mysql.createConnection(config);
    
            const [rows] = await connection.execute(
                'SELECT * FROM comandes WHERE client = ?',
                [client]
            );
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

    async function reduceStock(content){
        const cesta = JSON.parse(content);
        const connection = await mysql.createConnection(config);
            for (const item of cesta) {
            console.log(item.id)
            const [rows] = await connection.execute('SELECT stock FROM productes WHERE id = ?', [item.id]);
            if (rows.length > 0) {
            const newStock = rows[0].stock - item.quantitat;
            console.log(newStock)
            await connection.execute('UPDATE productes SET stock = ? WHERE id = ?', [newStock, item.id]);
            }
        }
    
    }
app.post('/addComan', async (req, res) => {
        console.log("addComan")
        const prod = req.body
        console.log(prod)
        if (prod.contingut != null && prod.contingut != "" && prod.client != null && prod.client != "") {
        try {
            const connection = await mysql.createConnection(config);
    
            const insertQuery = `INSERT INTO comandes (contingut, client, preuComanda) VALUES (?, ?, ?)`;
    
            prod.contingut = JSON.stringify(prod.contingut);

            await connection.execute(insertQuery, [
                prod.contingut,
                prod.client,
                prod.preuComanda
            ]);
    
    
            const [result] = await connection.execute('SELECT LAST_INSERT_ID() as id');
            const lastInsertedId = result[0].id;
            console.log(prod.contingut)
            reduceStock(prod.contingut)
            res.send(lastInsertedId.toString());
    
        } catch (err) {
            console.error('Error MySQL', err)
            res.status(500).send('Error data')
        }
        }
         else {
        res.json("Na puede estar vacio");
        }
    });

    app.get('/estatsComanda', async (req, res) => {
        try {
            const connection = await mysql.createConnection(config);
            
            // Ejecuta la consulta para obtener la columna 'estat' de la tabla 'comandes'
            const [rows] = await connection.execute(`SHOW COLUMNS FROM comandes LIKE 'estat'`);
            const enumColumn = rows[0].Type;
    
            // Extrae los valores del ENUM usando una expresión regular
            const enumValues = enumColumn.match(/enum\((.*)\)/)[1]
                .split(',') // Divide los valores por coma
                .map(value => value.replace(/'/g, '')); // Elimina las comillas simples
    
            connection.end(); // Cierra la conexión
    
            // Devuelve los valores del ENUM como respuesta
            res.json(enumValues);
        } catch (error) {
            console.error('Error al obtener los estados:', error);
            res.status(500).json({ error: 'Error al obtener los estados' }); // Respuesta de error en caso de fallo
        }
    });


    app.put('/modComan/:id', async (req, res) => {
        const id = req.params.id;
        const { estat } = req.body;
        
        console.log(`PUT /modComan/${id} con estado: ${estat}`); // Registro de la solicitud
    
        const connection = await mysql.createConnection(config);
        const [enumValues] = await connection.execute(`SHOW COLUMNS FROM comandes LIKE 'estat'`);
        const validValues = enumValues[0].Type.match(/enum\((.*)\)/)[1].split(',').map(val => val.replace(/'/g, ''));
    
        if (!validValues.includes(estat)) {
            console.log('Estado no válido:', estat); // Registro de estado no válido
            return res.status(400).json({ error: "Estado no válido" });
        }
    
        try {
            const updateQuery = `UPDATE comandes SET estat = ? WHERE id = ?`;
            await connection.execute(updateQuery, [estat, id]);
            
            io.emit('comandaUpdated', { id, estat }); 
            console.log('Comanda actualizada:', { id, estat }); // Registro de la actualización
    
            const [updatedRow] = await connection.execute(`SELECT * FROM comandes WHERE id = ?`, [id]);
            connection.end();
            res.json(updatedRow[0]);
        } catch (error) {
            console.error('Error al actualizar el estado:', error); // Registro de error
            res.status(500).json({ error: 'Error al actualizar el estado de la comanda' });
        }
    });
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');
    
        socket.on('updateComanda', async (data) => {
            // Aquí puedes llamar a tu función para actualizar la base de datos
            try {
                const { id, estat } = data;
                await updateComandaInDatabase(id, estat); // Asegúrate de que esta función existe y funciona correctamente
                // Emitir el evento para que todos los clientes actualicen la UI
                io.emit('comandaUpdated', { id, estat });
            } catch (error) {
                console.error("Error al actualizar la comanda:", error);
            }
        });
        
    });
    async function updateComandaInDatabase(id, estat){
        console.log(`PUT /modComan/${id} con estado: ${estat}`); // Registro de la solicitud
    
        const connection = await mysql.createConnection(config);
        const [enumValues] = await connection.execute(`SHOW COLUMNS FROM comandes LIKE 'estat'`);
        const validValues = enumValues[0].Type.match(/enum\((.*)\)/)[1].split(',').map(val => val.replace(/'/g, ''));
    
        if (!validValues.includes(estat)) {
            console.log('Estado no válido:', estat); // Registro de estado no válido
            return res.status(400).json({ error: "Estado no válido" });
        }
    
        try {
            const updateQuery = `UPDATE comandes SET estat = ? WHERE id = ?`;
            await connection.execute(updateQuery, [estat, id]);
            
            io.emit('comandaUpdated', { id, estat }); 
            console.log('Comanda actualizada:', { id, estat }); // Registro de la actualización
    
            const [updatedRow] = await connection.execute(`SELECT * FROM comandes WHERE id = ?`, [id]);
            connection.end();
            return updatedRow[0]
        } catch (error) {
            console.error('Error al actualizar el estado:', error); // Registro de error
            return "error"
        }
    }

app.put('/delComan/:id', async (req, res) => {
    const id = req.params.id;

    console.log("delComan " + id);

    const connection = await mysql.createConnection(config);

    try {
        const updateQuery = `UPDATE comandes SET cancel = 1 WHERE id = ?; `;
        await connection.execute(updateQuery, [id]);

        const [updatedRow] = await connection.execute(`SELECT * FROM comandes WHERE id = ?`, [id]);
        connection.end();
        res.json(updatedRow[0]);
    } catch (error) {
        console.error('Error al actualizar el estado:', error);
        res.status(500).json({ error: 'Error al actualizar el estado de la comanda' });
    }
});
    
    // Cambiar app.listen a server.listen
    server.listen(26968, () => {
        console.log('Servidor escuchando en http://localhost:26968');
    });
