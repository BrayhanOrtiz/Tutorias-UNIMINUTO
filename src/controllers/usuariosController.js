import { validationResult } from 'express-validator';
import sql from '../db/connection.js';


//crear Usuario
export const crearUsuarioEstudiante = async (req, res) => {
  const {
    id, nombre, apellido, correo_institucional,
    contraseña, carrera_id, fecha_nacimiento
  } = req.body;

  try {
    const newUser = await sql.begin(async (tx) => {
      const [user] = await tx`
        INSERT INTO usuario
          (id, nombre, apellido, correo_institucional, "contraseña", carrera_id, fecha_nacimiento)
        VALUES
          (${id}, ${nombre}, ${apellido}, ${correo_institucional}, ${contraseña}, ${carrera_id}, ${fecha_nacimiento})
        RETURNING *
      `;
      await tx`
        INSERT INTO usuario_rol (usuario_id, rol_id)
        VALUES (${user.id}, 1)
      `;
      return user;
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const crearUsuarioDocente = async (req, res) => {
  const {
    id, nombre, apellido, correo_institucional,
    contraseña, carrera_id, fecha_nacimiento
  } = req.body;

  try {
    const newUser = await sql.begin(async (tx) => {
      const [user] = await tx`
        INSERT INTO usuario
          (id, nombre, apellido, correo_institucional, "contraseña", carrera_id, fecha_nacimiento)
        VALUES
          (${id}, ${nombre}, ${apellido}, ${correo_institucional}, ${contraseña}, ${carrera_id}, ${fecha_nacimiento})
        RETURNING *
      `;
      await tx`
        INSERT INTO usuario_rol (usuario_id, rol_id)
        VALUES (${user.id}, 2)
      `;
      return user;
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const result = await sql`SELECT * FROM usuario;`;
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Actualizar un usuario por ID (incluyendo rol)
export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido,
    correo_institucional,
    contraseña,
    carrera_id,
    fecha_nacimiento,
    rol_id           // <— nuevo
  } = req.body;

  try {
    const updatedUser = await sql.begin(async (tx) => {
      // 1) Actualiza la fila en usuario
      const [user] = await tx`
        UPDATE usuario
        SET nombre = ${nombre},
            apellido = ${apellido},
            correo_institucional = ${correo_institucional},
            "contraseña" = ${contraseña},
            carrera_id = ${carrera_id},
            fecha_nacimiento = ${fecha_nacimiento}
        WHERE id = ${id}
        RETURNING *;
      `;

      // 2) Si envían rol_id, actualiza la relación en usuario_rol
      if (rol_id != null) {
        await tx`
          UPDATE usuario_rol
          SET rol_id = ${rol_id}
          WHERE usuario_id = ${id};
        `;
      }

      return user;
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    // Trae datos del usuario
    const [user] = await sql`
      SELECT u.*, ur.rol_id
      FROM usuario u
      LEFT JOIN usuario_rol ur
        ON ur.usuario_id = u.id
      WHERE u.id = ${id};
    `;

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar un usuario por ID
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM usuario_rol WHERE usuario_id = ${id};`; // primero eliminamos relación
    await sql`DELETE FROM usuario WHERE id = ${id};`;
    res.status(200).json({ success: true, message: "Usuario eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
