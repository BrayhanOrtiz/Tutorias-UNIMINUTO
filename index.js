// src/index.js
import express from 'express';
import sql from './db.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== USUARIO ====================
// Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM usuario;`;
    res.status(200).json({
      success: true,
      message: "DATOS DE LA TABLA USUARIO",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Crear un nuevo usuario
app.post('/api/usuarios', async (req, res) => {
  const { nombre, apellido, email, contraseña } = req.body;
  try {
    const result = await sql`
      INSERT INTO usuario (nombre, apellido, email, contraseña)
      VALUES (${nombre}, ${apellido}, ${email}, ${contraseña})
      RETURNING *;
    `;
    res.status(201).json({
      success: true,
      message: "USUARIO CREADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CREANDO USUARIO',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Obtener un usuario por ID
app.get('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`SELECT * FROM usuario WHERE id = ${id};`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "USUARIO NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "DATOS DEL USUARIO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Actualizar un usuario
app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, contraseña } = req.body;
  try {
    const result = await sql`
      UPDATE usuario
      SET nombre = ${nombre}, apellido = ${apellido}, email = ${email}, contraseña = ${contraseña}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "USUARIO NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "USUARIO ACTUALIZADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ACTUALIZANDO USUARIO',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Eliminar un usuario
app.delete('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM usuario WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "USUARIO NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "USUARIO ELIMINADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ELIMINANDO USUARIO',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// ==================== ROL ====================
// Obtener todos los roles
app.get('/api/roles', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM rol;`;
    res.status(200).json({
      success: true,
      message: "DATOS DE LA TABLA ROL",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Crear un nuevo rol
app.post('/api/roles', async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await sql`
      INSERT INTO rol (nombre)
      VALUES (${nombre})
      RETURNING *;
    `;
    res.status(201).json({
      success: true,
      message: "ROL CREADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CREANDO ROL',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Obtener un rol por ID
app.get('/api/roles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`SELECT * FROM rol WHERE id = ${id};`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ROL NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "DATOS DEL ROL",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Actualizar un rol
app.put('/api/roles/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const result = await sql`
      UPDATE rol
      SET nombre = ${nombre}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ROL NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "ROL ACTUALIZADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ACTUALIZANDO ROL',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Eliminar un rol
app.delete('/api/roles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM rol WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ROL NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "ROL ELIMINADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ELIMINANDO ROL',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// ==================== CARRERA ====================
// Obtener todas las carreras
app.get('/api/carreras', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM carrera;`;
    res.status(200).json({
      success: true,
      message: "DATOS DE LA TABLA CARRERA",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Crear una nueva carrera
app.post('/api/carreras', async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await sql`
      INSERT INTO carrera (nombre)
      VALUES (${nombre})
      RETURNING *;
    `;
    res.status(201).json({
      success: true,
      message: "CARRERA CREADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CREANDO CARRERA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Obtener una carrera por ID
app.get('/api/carreras/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`SELECT * FROM carrera WHERE id = ${id};`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "CARRERA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "DATOS DE LA CARRERA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Actualizar una carrera
app.put('/api/carreras/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const result = await sql`
      UPDATE carrera
      SET nombre = ${nombre}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "CARRERA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "CARRERA ACTUALIZADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ACTUALIZANDO CARRERA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Eliminar una carrera
app.delete('/api/carreras/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM carrera WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "CARRERA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "CARRERA ELIMINADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ELIMINANDO CARRERA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// ==================== HORARIO ====================
// Obtener todos los horarios
app.get('/api/horarios', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM horario;`;
    res.status(200).json({
      success: true,
      message: "DATOS DE LA TABLA HORARIO",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Crear un nuevo horario
app.post('/api/horarios', async (req, res) => {
  const { usuario_id, dia_semana, hora_inicio, hora_fin, salon } = req.body;
  try {
    const result = await sql`
      INSERT INTO horario (usuario_id, dia_semana, hora_inicio, hora_fin, salon)
      VALUES (${usuario_id}, ${dia_semana}, ${hora_inicio}, ${hora_fin}, ${salon})
      RETURNING *;
    `;
    res.status(201).json({
      success: true,
      message: "HORARIO CREADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CREANDO HORARIO',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Obtener un horario por ID
app.get('/api/horarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`SELECT * FROM horario WHERE id = ${id};`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "HORARIO NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "DATOS DEL HORARIO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Actualizar un horario
app.put('/api/horarios/:id', async (req, res) => {
  const { id } = req.params;
  const { usuario_id, dia_semana, hora_inicio, hora_fin, salon } = req.body;
  try {
    const result = await sql`
      UPDATE horario
      SET usuario_id = ${usuario_id}, dia_semana = ${dia_semana}, hora_inicio = ${hora_inicio}, hora_fin = ${hora_fin}, salon = ${salon}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "HORARIO NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "HORARIO ACTUALIZADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ACTUALIZANDO HORARIO',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Eliminar un horario
app.delete('/api/horarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM horario WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "HORARIO NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "HORARIO ELIMINADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ELIMINANDO HORARIO',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// ==================== TUTORIA ====================
// Obtener todas las tutorías
app.get('/api/tutorias', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM tutoria;`;
    res.status(200).json({
      success: true,
      message: "DATOS DE LA TABLA TUTORIA",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Crear una nueva tutoría
app.post('/api/tutorias', async (req, res) => {
  const { estudiante_id, docente_id, tema_id, fecha, hora_inicio, hora_fin, salon, materia } = req.body;
  try {
    const result = await sql`
      INSERT INTO tutoria (estudiante_id, docente_id, tema_id, fecha, hora_inicio, hora_fin, salon, materia)
      VALUES (${estudiante_id}, ${docente_id}, ${tema_id}, ${fecha}, ${hora_inicio}, ${hora_fin}, ${salon}, ${materia})
      RETURNING *;
    `;
    res.status(201).json({
      success: true,
      message: "TUTORIA CREADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CREANDO TUTORIA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Obtener una tutoría por ID
app.get('/api/tutorias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`SELECT * FROM tutoria WHERE id = ${id};`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "TUTORIA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "DATOS DE LA TUTORIA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Actualizar una tutoría
app.put('/api/tutorias/:id', async (req, res) => {
  const { id } = req.params;
  const { estudiante_id, docente_id, tema_id, fecha, hora_inicio, hora_fin, salon, materia } = req.body;
  try {
    const result = await sql`
      UPDATE tutoria
      SET estudiante_id = ${estudiante_id}, docente_id = ${docente_id}, tema_id = ${tema_id}, fecha = ${fecha}, hora_inicio = ${hora_inicio}, hora_fin = ${hora_fin}, salon = ${salon}, materia = ${materia}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "TUTORIA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "TUTORIA ACTUALIZADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ACTUALIZANDO TUTORIA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Eliminar una tutoría
app.delete('/api/tutorias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM tutoria WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "TUTORIA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "TUTORIA ELIMINADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ELIMINANDO TUTORIA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// ==================== TEMA ====================
// Obtener todos los temas
app.get('/api/temas', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM tema;`;
    res.status(200).json({
      success: true,
      message: "DATOS DE LA TABLA TEMA",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Crear un nuevo tema
app.post('/api/temas', async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await sql`
      INSERT INTO tema (nombre)
      VALUES (${nombre})
      RETURNING *;
    `;
    res.status(201).json({
      success: true,
      message: "TEMA CREADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CREANDO TEMA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Obtener un tema por ID
app.get('/api/temas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`SELECT * FROM tema WHERE id = ${id};`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "TEMA NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "DATOS DEL TEMA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Actualizar un tema
app.put('/api/temas/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const result = await sql`
      UPDATE tema
      SET nombre = ${nombre}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "TEMA NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "TEMA ACTUALIZADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ACTUALIZANDO TEMA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Eliminar un tema
app.delete('/api/temas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM tema WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "TEMA NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "TEMA ELIMINADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ELIMINANDO TEMA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// ==================== ENCUESTA ====================
// Obtener todas las encuestas
app.get('/api/encuestas', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM encuesta_satisfaccion;`;
    res.status(200).json({
      success: true,
      message: "DATOS DE LA TABLA ENCUESTA",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Crear una nueva encuesta
app.post('/api/encuestas', async (req, res) => {
  const { tutoria_id, fecha } = req.body;
  try {
    const result = await sql`
      INSERT INTO encuesta_satisfaccion (tutoria_id, fecha)
      VALUES (${tutoria_id}, ${fecha})
      RETURNING *;
    `;
    res.status(201).json({
      success: true,
      message: "ENCUESTA CREADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CREANDO ENCUESTA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Obtener una encuesta por ID
app.get('/api/encuestas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`SELECT * FROM encuesta_satisfaccion WHERE id = ${id};`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ENCUESTA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "DATOS DE LA ENCUESTA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Actualizar una encuesta
app.put('/api/encuestas/:id', async (req, res) => {
  const { id } = req.params;
  const { tutoria_id, fecha } = req.body;
  try {
    const result = await sql`
      UPDATE encuesta_satisfaccion
      SET tutoria_id = ${tutoria_id}, fecha = ${fecha}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ENCUESTA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "ENCUESTA ACTUALIZADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ACTUALIZANDO ENCUESTA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Eliminar una encuesta
app.delete('/api/encuestas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM encuesta_satisfaccion WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ENCUESTA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "ENCUESTA ELIMINADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ELIMINANDO ENCUESTA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// ==================== PREGUNTA ====================
// Obtener todas las preguntas
app.get('/api/preguntas', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM pregunta_encuesta;`;
    res.status(200).json({
      success: true,
      message: "DATOS DE LA TABLA PREGUNTA",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Crear una nueva pregunta
app.post('/api/preguntas', async (req, res) => {
  const { texto } = req.body;
  try {
    const result = await sql`
      INSERT INTO pregunta_encuesta (texto)
      VALUES (${texto})
      RETURNING *;
    `;
    res.status(201).json({
      success: true,
      message: "PREGUNTA CREADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CREANDO PREGUNTA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Obtener una pregunta por ID
app.get('/api/preguntas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`SELECT * FROM pregunta_encuesta WHERE id = ${id};`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "PREGUNTA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "DATOS DE LA PREGUNTA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Actualizar una pregunta
app.put('/api/preguntas/:id', async (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;
  try {
    const result = await sql`
      UPDATE pregunta_encuesta
      SET texto = ${texto}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "PREGUNTA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "PREGUNTA ACTUALIZADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ACTUALIZANDO PREGUNTA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Eliminar una pregunta
app.delete('/api/preguntas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM pregunta_encuesta WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "PREGUNTA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "PREGUNTA ELIMINADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ELIMINANDO PREGUNTA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// ==================== RESPUESTA ====================
// Obtener todas las respuestas
app.get('/api/respuestas', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM respuesta_encuesta;`;
    res.status(200).json({
      success: true,
      message: "DATOS DE LA TABLA RESPUESTA",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Crear una nueva respuesta
app.post('/api/respuestas', async (req, res) => {
  const { encuesta_id, pregunta_id, valor } = req.body;
  try {
    const result = await sql`
      INSERT INTO respuesta_encuesta (encuesta_id, pregunta_id, valor)
      VALUES (${encuesta_id}, ${pregunta_id}, ${valor})
      RETURNING *;
    `;
    res.status(201).json({
      success: true,
      message: "RESPUESTA CREADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CREANDO RESPUESTA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Obtener una respuesta por ID
app.get('/api/respuestas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`SELECT * FROM respuesta_encuesta WHERE id = ${id};`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "RESPUESTA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "DATOS DE LA RESPUESTA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Actualizar una respuesta
app.put('/api/respuestas/:id', async (req, res) => {
  const { id } = req.params;
  const { encuesta_id, pregunta_id, valor } = req.body;
  try {
    const result = await sql`
      UPDATE respuesta_encuesta
      SET encuesta_id = ${encuesta_id}, pregunta_id = ${pregunta_id}, valor = ${valor}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "RESPUESTA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "RESPUESTA ACTUALIZADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ACTUALIZANDO RESPUESTA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Eliminar una respuesta
app.delete('/api/respuestas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM respuesta_encuesta WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "RESPUESTA NO ENCONTRADA"
      });
    }
    res.status(200).json({
      success: true,
      message: "RESPUESTA ELIMINADA",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ELIMINANDO RESPUESTA',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// ==================== HISTORIAL ====================
// Obtener todo el historial
app.get('/api/historial', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM historial_cambios;`;
    res.status(200).json({
      success: true,
      message: "DATOS DE LA TABLA HISTORIAL",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Crear un nuevo registro en el historial
app.post('/api/historial', async (req, res) => {
  const { usuario_id, tabla_afectada, accion, detalles } = req.body;
  try {
    const result = await sql`
      INSERT INTO historial_cambios (usuario_id, tabla_afectada, accion, detalles)
      VALUES (${usuario_id}, ${tabla_afectada}, ${accion}, ${detalles})
      RETURNING *;
    `;
    res.status(201).json({
      success: true,
      message: "REGISTRO CREADO EN HISTORIAL",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CREANDO REGISTRO EN HISTORIAL',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Obtener un registro del historial por ID
app.get('/api/historial/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`SELECT * FROM historial_cambios WHERE id = ${id};`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "REGISTRO NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "DATOS DEL REGISTRO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR CONSULTANDO LA DB',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Actualizar un registro del historial
app.put('/api/historial/:id', async (req, res) => {
  const { id } = req.params;
  const { usuario_id, tabla_afectada, accion, detalles } = req.body;
  try {
    const result = await sql`
      UPDATE historial_cambios
      SET usuario_id = ${usuario_id}, tabla_afectada = ${tabla_afectada}, accion = ${accion}, detalles = ${detalles}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "REGISTRO NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "REGISTRO ACTUALIZADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ACTUALIZANDO REGISTRO',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});

// Eliminar un registro del historial
app.delete('/api/historial/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM historial_cambios WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "REGISTRO NO ENCONTRADO"
      });
    }
    res.status(200).json({
      success: true,
      message: "REGISTRO ELIMINADO",
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR ELIMINANDO REGISTRO',
      details: error.message || 'ERROR DESCONOCIDO'
    });
  }
});




// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});