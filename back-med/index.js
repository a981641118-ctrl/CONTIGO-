const express = require("express");
const cors = require("cors"); // Requerimos el paquete CORS

const pool = require("./db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 4000;

// **********************************************
// ********* CONFIGURACIÓN DE CORS **************
// **********************************************

// 1. Define los orígenes (dominios) que están permitidos para hacer peticiones.
const allowedOrigins = [
    // El dominio de tu frontend desplegado en Vercel
    'https://contigo-two.vercel.app', 
    // Puedes agregar localhost para desarrollo local (si usas otro puerto)
    'http://localhost:3000', 
    'http://localhost:5000' 
];

const corsOptions = {
    // La función 'origin' verifica si el dominio solicitante está en la lista de permitidos
    origin: function (origin, callback) {
        // Permite peticiones si no tienen origen (como Postman o navegadores antiguos)
        // O si el origen está en nuestra lista de permitidos.
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Muestra un error si el origen no está permitido
            callback(new Error('Not allowed by CORS policy'));
        }
    },
    // Esto es CRUCIAL para que el login funcione y las credenciales (cookies, headers de auth) se envíen.
    credentials: true, 
};

// Aplica la nueva configuración de CORS
app.use(cors(corsOptions));
// **********************************************
// **********************************************


app.use(express.json());

app.get("/", (req, res) => {
    res.send("Conectado");
});

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const auth = (req, res, next) => {
    const h = req.headers.authorization || "";
    const p = h.startsWith("Bearer ") ? h.slice(7) : "";
    if (!p) return res.status(401).json({ error: "No autorizado" });
    try {
        const d = jwt.verify(p, JWT_SECRET);
        req.user = d;
        next();
    } catch (e) {
        res.status(401).json({ error: "Token inválido" });
    }
};

app.post("/auth/register", async (req, res) => {
    const {
        nombre,
        correo,
        password,
        contacto_emergencia_nombre,
        contacto_emergencia_telefono,
    } = req.body;
    if (!correo || !password)
        return res.status(400).json({ error: "Datos incompletos" });
    try {
        const exists = await pool.query(
            "SELECT id_usuario FROM usuarios WHERE correo = $1",
            [correo]
        );
        if (exists.rows.length)
            return res.status(409).json({ error: "Correo ya registrado" });
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO usuarios (id_rol,nombre,correo,password_hash,contacto_emergencia_nombre,contacto_emergencia_telefono) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id_usuario,nombre,correo,id_rol,contacto_emergencia_nombre,contacto_emergencia_telefono",
            [
                0,
                nombre || "",
                correo,
                hash,
                contacto_emergencia_nombre || "",
                contacto_emergencia_telefono || "",
            ]
        );
        const u = result.rows[0];
        const token = jwt.sign({ id: u.id_usuario, correo: u.correo }, JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({ token, usuario: u });
    } catch (err) {
        res.status(500).json({ error: "Error al registrar" });
    }
});

app.post("/auth/login", async (req, res) => {
    const { correo, password } = req.body;
    if (!correo || !password)
        return res.status(400).json({ error: "Datos incompletos" });
    try {
        // --- AQUÍ ESTÁ EL PRIMER PUNTO DE FALLO POTENCIAL: CONEXIÓN A DB ---
        const result = await pool.query(
            "SELECT id_usuario,nombre,correo,id_rol,password_hash,contacto_emergencia_nombre,contacto_emergencia_telefono FROM usuarios WHERE correo = $1",
            [correo]
        );
        if (!result.rows.length)
            return res.status(401).json({ error: "Credenciales inválidas" });
        const u = result.rows[0];
        const ok = await bcrypt.compare(password, u.password_hash);
        if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });
        const token = jwt.sign({ id: u.id_usuario, correo: u.correo }, JWT_SECRET, {
            expiresIn: "7d",
        });
        delete u.password_hash;
        res.json({ token, usuario: u });
    } catch (err) {
        // Si hay un error aquí, es probable que la base de datos no esté conectada.
        console.error("Error en /auth/login:", err.message); 
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
});

app.get("/me", auth, async (req, res) => {
    try {
        const r = await pool.query(
            "SELECT id_usuario,nombre,correo,id_rol,contacto_emergencia_nombre,contacto_emergencia_telefono FROM usuarios WHERE id_usuario = $1",
            [req.user.id]
        );
        if (!r.rows.length) return res.status(404).json({ error: "No encontrado" });
        res.json(r.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error en la consulta" });
    }
});

//FAMILIARES
app.get('/usuarios', auth, async (req, res) => {
    try {
        const result = await pool.query('SELECT id_usuario,id_rol,nombre,correo,contacto_emergencia_nombre,contacto_emergencia_telefono FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Error en la consulta');
    }
});
app.get('/usuarios/single/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT id_usuario,id_rol,nombre,correo,contacto_emergencia_nombre,contacto_emergencia_telefono FROM usuarios WHERE id_usuario = $1', [id]);
        if (!result.rows.length) return res.status(404).json({ error: 'Registro no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error en la consulta' });
    }
});
app.post('/usuarios/save', auth, async (req, res) => {
    const { id_rol, nombre, correo, password, contacto_emergencia_nombre, contacto_emergencia_telefono } = req.body;
    if (!correo || !password) return res.status(400).json({ error: 'Datos incompletos' });
    try {
        const exists = await pool.query('SELECT id_usuario FROM usuarios WHERE correo = $1', [correo]);
        if (exists.rows.length) return res.status(409).json({ error: 'Correo ya registrado' });
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO usuarios (id_rol,nombre,correo,password_hash,contacto_emergencia_nombre,contacto_emergencia_telefono) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id_usuario,id_rol,nombre,correo,contacto_emergencia_nombre,contacto_emergencia_telefono',
            [id_rol ?? 0, nombre || '', correo, hash, contacto_emergencia_nombre || '', contacto_emergencia_telefono || '']
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Error al insertar');
    }
});
app.put('/usuarios/edit/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { id_rol, nombre, correo, password, contacto_emergencia_nombre, contacto_emergencia_telefono } = req.body;
    try {
        let hash = null;
        if (password) hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'UPDATE usuarios SET id_rol = COALESCE($1,id_rol), nombre = COALESCE($2,nombre), correo = COALESCE($3,correo), password_hash = COALESCE($4,password_hash), contacto_emergencia_nombre = COALESCE($5,contacto_emergencia_nombre), contacto_emergencia_telefono = COALESCE($6,contacto_emergencia_telefono) WHERE id_usuario = $7 RETURNING id_usuario,id_rol,nombre,correo,contacto_emergencia_nombre,contacto_emergencia_telefono',
            [id_rol, nombre, correo, hash, contacto_emergencia_nombre, contacto_emergencia_telefono, id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Registro no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar registro' });
    }
});
app.delete('/usuarios/delete/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING id_usuario,id_rol,nombre,correo,contacto_emergencia_nombre,contacto_emergencia_telefono', [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Registro no encontrado' });
        res.json({ message: 'Registro eliminado', usuario: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar registro' });
    }
});
app.get("/familiares", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM familiares");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en la consulta");
    }
});
app.get("/familiares/single/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM familiares WHERE id_familiar = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        const result_count_med = await pool.query(
            "SELECT COUNT(*) FROM medicamentos WHERE id_familiar = $1",
            [id]
        );
        const result_count_sint = await pool.query(
            "SELECT COUNT(*) FROM sintomas WHERE id_familiar = $1",
            [id]
        );

        const result_medicamentos = await pool.query(
            "SELECT * FROM medicamentos WHERE id_familiar = $1",
            [id]
        );
        res.json({
            familiar: result.rows[0],
            count_medicamentos: result_count_med.rows[0].count,
            count_sintomas: result_count_sint.rows[0].count,
            medicamentos: result_medicamentos.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en la consulta" });
    }
});
app.post("/familiares/save", async (req, res) => {
    const {
        nombre,
        apellido,
        parentesco,
        fecha_nacimiento,
        documento_identidad,
    } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO familiares (nombre,apellido,parentesco,fecha_nacimiento,documento_identidad,id_usuario_cuidador) VALUES ($1,$2,$3,$4,$5,0) RETURNING *",
            [nombre, apellido, parentesco, fecha_nacimiento, documento_identidad]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al insertar");
    }
});
app.put("/familiares/edit/:id", async (req, res) => {
    const { id } = req.params;
    const {
        nombre,
        apellido,
        parentesco,
        fecha_nacimiento,
        documento_identidad,
    } = req.body;

    try {
        const result = await pool.query(
            "UPDATE familiares SET nombre = $1, apellido = $2, parentesco = $3, fecha_nacimiento = $4 , documento_identidad = $5, id_usuario_cuidador = 0  WHERE id_familiar = $6 RETURNING *",
            [nombre, apellido, parentesco, fecha_nacimiento, documento_identidad, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al actualizar registro" });
    }
});
app.delete("/familiares/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM familiares WHERE id_familiar = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json({ message: "Registro eliminado", user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar registro" });
    }
});

//MEDICAMENTOS
app.get("/medicamentos", async (req, res) => {
    try {
        let queryText = "SELECT * FROM medicamentos";
        const { familiar_id } = req.query;
        const queryParams = [];
        if (familiar_id) {
            queryParams.push(`${familiar_id}`);
            queryText += ` WHERE id_familiar = $${queryParams.length}`;
        }

        const result = await pool.query(queryText, queryParams);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en la consulta");
    }
});
app.get("/medicamentos/single/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM medicamentos WHERE id_medicamento = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en la consulta" });
    }
});
app.post("/medicamentos/save", async (req, res) => {
    const {
        id_familiar,
        nombre_medicamento,
        dosis,
        frecuencia,
        duracion_tratamiento,
    } = req.body;
    try {
        const today = new Date();
        const result = await pool.query(
            "INSERT INTO medicamentos (id_familiar,nombre_medicamento,dosis,frecuencia,duracion_tratamiento,fecha_registro) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
            [
                id_familiar,
                nombre_medicamento,
                dosis,
                frecuencia,
                duracion_tratamiento,
                today,
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al insertar");
    }
});
app.put("/medicamentos/edit/:id", async (req, res) => {
    const { id } = req.params;
    const {
        id_familiar,
        nombre_medicamento,
        dosis,
        frecuencia,
        duracion_tratamiento,
    } = req.body;

    try {
        const today = new Date();
        const result = await pool.query(
            "UPDATE medicamentos SET id_familiar = $1, nombre_medicamento = $2, dosis = $3, frecuencia = $4 , duracion_tratamiento = $5, fecha_registro = $6  WHERE id_medicamento = $7 RETURNING *",
            [
                id_familiar,
                nombre_medicamento,
                dosis,
                frecuencia,
                duracion_tratamiento,
                today,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al actualizar registro" });
    }
});
app.delete("/medicamentos/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM medicamentos WHERE id_medicamento = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json({ message: "Registro eliminado", user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar registro" });
    }
});

//SINTOMAS
app.get("/sintomas", async (req, res) => {
    try {
        let queryText = "SELECT * FROM sintomas";
        const { familiar_id } = req.query;
        const queryParams = [];
        if (familiar_id) {
            queryParams.push(`${familiar_id}`);
            queryText += ` WHERE id_familiar = $${queryParams.length}`;
        }
        const result = await pool.query(queryText, queryParams);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en la consulta");
    }
});
app.get("/sintomas/single/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM sintomas WHERE id_sintoma = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en la consulta" });
    }
});
app.post("/sintomas/save", async (req, res) => {
    const { id_familiar, tipo_sintoma, intensidad, fecha_inicio, comentarios } =
        req.body;
    try {
        const result = await pool.query(
            "INSERT INTO sintomas (id_familiar,tipo_sintoma,intensidad,fecha_inicio,comentarios) VALUES ($1,$2,$3,$4,$5) RETURNING *",
            [id_familiar, tipo_sintoma, intensidad, fecha_inicio, comentarios]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al insertar");
    }
});
app.put("/sintomas/edit/:id", async (req, res) => {
    const { id } = req.params;
    const { id_familiar, tipo_sintoma, intensidad, fecha_inicio, comentarios } =
        req.body;
    try {
        const result = await pool.query(
            "UPDATE sintomas SET id_familiar = $1, tipo_sintoma = $2, intensidad = $3, fecha_inicio = $4 , comentarios = $5 WHERE id_sintoma = $6 RETURNING *",
            [id_familiar, tipo_sintoma, intensidad, fecha_inicio, comentarios, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al actualizar registro" });
    }
});
app.delete("/sintomas/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM sintomas WHERE id_sintoma = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json({ message: "Registro eliminado", user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar registro" });
    }
});

//Historial
app.get("/familiares/historial/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM familiares WHERE id_familiar = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        const medicamentos = await pool.query(
            "SELECT nombre_medicamento, dosis, frecuencia, fecha_registro, id_familiar FROM medicamentos WHERE id_familiar = $1",
            [id]
        );
        const sintomas = await pool.query(
            "SELECT tipo_sintoma, intensidad, comentarios, fecha_inicio, id_familiar FROM sintomas WHERE id_familiar = $1",
            [id]
        );

        // Normalizamos para que tengan la misma estructura
        const med = medicamentos.rows.map((m) => ({
            tipo: "medicamento",
            descripcion: m.nombre_medicamento,
            dosis: m.dosis,
            frecuencia: m.frecuencia,
            fecha: m.fecha_registro,
        }));

        const sint = sintomas.rows.map((s) => ({
            tipo: "sintoma",
            descripcion: s.tipo_sintoma,
            intensidad: s.intensidad,
            comentarios: s.comentarios,
            fecha: s.fecha_inicio,
        }));

        // Combinamos y ordenamos por fecha DESC
        const registros = [...med, ...sint].sort(
            (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        res.json({ registros: registros, familiar: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en la consulta");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

