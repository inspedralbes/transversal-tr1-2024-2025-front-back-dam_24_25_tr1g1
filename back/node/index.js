const cors = require('cors');
const express = require('express');
const http = require('http'); // Importar http
const socketIo = require('socket.io'); // Importar socket.io
const app = express();
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const { spawn } = require('child_process')
const { exec } = require('child_process')

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Crear un servidor HTTP
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Ajusta según sea necesario
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

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
// Endpoint para generar estadísticas de clientes
app.get('/generate-client-stats', (req, res) => {
    // Ruta del archivo .ipynb convertido en un script de Python
    const scriptPath = path.join(__dirname, '..', 'python', 'clients.py'); // Adaptamos el .ipynb a un .py

    // Ejecutar el script de Python
    exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando el script: ${stderr}`);
            return res.status(500).json({ error: "Error al generar las estadísticas" });
        }

        // Imagen generada en uploads/client_stats.png
        const imageUrl = `http://localhost:26968/uploads/estats.png`;
        res.json({ imageUrl });
    });
});

// Servir la carpeta de uploads para que las imágenes generadas sean accesibles
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/historial_vendas', async (req, res) => {
    const email = req.query.email; 
    let connection;
    try {
        connection = await mysql.createConnection(config);

        const query = `
            SELECT 
                c.id AS comanda_id,
                c.Total AS diners_gastats,
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


    if (prod.nom != null && prod.nom != "" && prod.descripcio != null && prod.descripcio != "" && prod.preu != null && prod.preu != "" && prod.stock != null && prod.stock != "" && prod.category != null && prod.category != "") {
        try {
            const connection = await mysql.createConnection(config);

            const insertQuery = `
                INSERT INTO productes (nom, descripcio, fotoRuta, preu, oferta, stock, category, halal, vegan, gluten, lactosa, crustacis)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const fotoRuta = req.file.path;

            let oferta = null;

            if (prod.oferta = ! null) {
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

    // Verificar campos obligatorios
    if (prod.nom != null && prod.nom !== "" && prod.descripcio != null && prod.descripcio !== "" && 
        prod.preu != null && prod.preu !== "" && prod.stock != null && prod.stock !== "" && 
        prod.category != null && prod.category !== "") {
        
        let connection;

        try {
            // Crear conexión
            connection = await mysql.createConnection(config);

            // Obtener el producto existente
            const [MM] = await connection.execute('SELECT * FROM productes WHERE id = ?', [id]);
            const cosas = MM[0];

            if (!cosas) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            // Determinar ruta de la imagen
            const fotoRuta = req.file ? req.file.path : cosas.fotoRuta;

            // Asignar valor a oferta correctamente
            let oferta = (prod.oferta === "null") ? null : prod.oferta;

            // Función auxiliar para asignar valores existentes si los nuevos son nulos
            const getValidValue = (newValue, existingValue) => (newValue != null && newValue !== "") ? newValue : existingValue;

            // Asignar valores con función auxiliar
            prod.nom = getValidValue(prod.nom, cosas.nom);
            prod.descripcio = getValidValue(prod.descripcio, cosas.descripcio);
            prod.preu = getValidValue(prod.preu, cosas.preu);
            prod.stock = getValidValue(prod.stock, cosas.stock);
            prod.category = getValidValue(prod.category, cosas.category);
            prod.halal = getValidValue(prod.halal, cosas.halal);
            prod.vegan = getValidValue(prod.vegan, cosas.vegan);
            prod.gluten = getValidValue(prod.gluten, cosas.gluten);
            prod.lactosa = getValidValue(prod.lactosa, cosas.lactosa);
            prod.crustacis = getValidValue(prod.crustacis, cosas.crustacis);

            // Actualizar el producto en la base de datos
            const updateQuery = `
                UPDATE productes 
                SET nom = ?, descripcio = ?, fotoRuta = ?, preu = ?, oferta = ?, stock = ?, category = ?, halal = ?, vegan = ?, gluten = ?, lactosa = ?, crustacis = ? 
                WHERE id = ?;
            `;

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

            // Obtener todos los productos y responder
            const [rows] = await connection.execute('SELECT * FROM productes');
            res.json(rows);

        } catch (err) {
            console.error('Error MySQL:', err);
            res.status(500).json({ error: 'Error actualizando el producto' });

        } finally {
            // Cerrar la conexión
            if (connection) {
                await connection.end();
            }
        }

    } else {
        res.status(400).json({ error: "Campos obligatorios no pueden estar vacíos" });
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

        if (rows.length == 0) {
            await connection.execute('DELETE FROM categories WHERE id = ' + id);

            res.json("borrao");
        }
        else {
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
            console.log("FINAL", rows[0].contrasenya)
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
                if (contrasenya == rows[0].contrasenya) {

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
    console.log(prod)
    if (prod.contingut != null && prod.contingut != "" && prod.client != null && prod.client != "") {
        try {
            const connection = await mysql.createConnection(config);

            
            const insertQuery = `INSERT INTO comandes (contingut, client, data) VALUES (?, ?, NOW())`;

            prod.contingut = JSON.stringify(prod.contingut);

            await connection.execute(insertQuery, [
                prod.contingut,
                prod.client
            ]);

            const [result] = await connection.execute('SELECT LAST_INSERT_ID() as id');
            const lastInsertedId = result[0].id;
            res.send(lastInsertedId.toString());

        } catch (err) {
            console.error('Error MySQL', err)
            res.status(500).send('Error data')
        }
    }
    else {
        res.json("No puede estar vacío");
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
async function updateComandaInDatabase(id, estat) {
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

// Cambiar app.listen a server.listen
server.listen(26968, () => {
    console.log('Servidor escuchando en http://localhost:26968');
});
