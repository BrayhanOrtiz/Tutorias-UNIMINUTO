import { validationResult } from 'express-validator';
import sql from '../db/connection.js';
// import logo from '../../assets/logo-uniminuto.png';


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
          (
            ${id ?? null},
            ${nombre ?? null},
            ${apellido ?? null},
            ${correo_institucional ?? null},
            ${contraseña ?? null},
            ${carrera_id ?? null},
            ${fecha_nacimiento ?? null}
          )
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
    console.error('Error al crear usuario estudiante:', error);
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
          (
            ${id ?? null},
            ${nombre ?? null},
            ${apellido ?? null},
            ${correo_institucional ?? null},
            ${contraseña ?? null},
            ${carrera_id ?? null},
            ${fecha_nacimiento ?? null}
          )
        RETURNING *
      `;
      await tx`
        INSERT INTO usuario_rol (usuario_id, rol_id)
        VALUES (${user.id}, 3)
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
    rol_id,
    experticia
  } = req.body;

  try {
    const updatedUser = await sql.begin(async (tx) => {
      // 1) Construir dinámicamente la parte SET de la consulta para usuario
      // Preparamos las partes de la consulta y los valores por separado.
      const setParts = [];
      const values = [];
      let paramIndex = 1; // Para los parámetros de la consulta SQL

      if (nombre !== undefined) {
        setParts.push(`nombre = $${paramIndex++}`);
        values.push(nombre);
      }
      if (apellido !== undefined) {
        setParts.push(`apellido = $${paramIndex++}`);
        values.push(apellido);
      }
      if (correo_institucional !== undefined) {
        setParts.push(`correo_institucional = $${paramIndex++}`);
        values.push(correo_institucional);
      }
      if (contraseña !== undefined) {
        setParts.push(`"contraseña" = $${paramIndex++}`);
        values.push(contraseña);
      }
      if (carrera_id !== undefined) {
        setParts.push(`carrera_id = $${paramIndex++}`);
        values.push(carrera_id);
      }
      if (fecha_nacimiento !== undefined) {
        setParts.push(`fecha_nacimiento = $${paramIndex++}`);
        values.push(fecha_nacimiento);
      }
      if (experticia !== undefined) {
        setParts.push(`experticia = $${paramIndex++}`);
        values.push(experticia);
      }

      let user;
      // Solo ejecutar UPDATE si hay algo que actualizar en la tabla usuario
      if (setParts.length > 0) {
        // Unimos las partes SET y agregamos el ID al final de los valores
        const query = `
          UPDATE usuario
          SET ${setParts.join(', ')}
          WHERE id = $${paramIndex}
          RETURNING *;
        `;
        values.push(id); // Agregar el ID para la cláusula WHERE

        // Ejecutar la consulta con los valores como array
        [user] = await tx.query(query, values); // Asumiendo que .query(text, values) es el método

      } else {
        // Si no hay campos de usuario para actualizar, simplemente obtener el usuario actual
        [user] = await tx`SELECT * FROM usuario WHERE id = ${id}`;
      }

      // 2) Si envían rol_id, actualiza La relación en usuario_rol
      // Esta parte ya maneja los parámetros correctamente con el template literal
      if (rol_id != null) { 
        await tx`
          UPDATE usuario_rol
          SET rol_id = ${rol_id}
          WHERE usuario_id = ${id};
        `;
      }

      return user; // O el usuario actualizado completo si se recuperó
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error en actualizarUsuario:', error); // Log detallado del error en el backend
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

// Obtener información del usuario actual
export const obtenerUsuarioActual = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }
        const userId = req.user.id;
        
        const [usuario] = await sql`
            SELECT u.*, ur.rol_id, r.nombre_rol
            FROM usuario u
            LEFT JOIN usuario_rol ur ON u.id = ur.usuario_id
            LEFT JOIN rol r ON ur.rol_id = r.id
            WHERE u.id = ${userId}
        `;

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo_institucional: usuario.correo_institucional,
                rol_id: usuario.rol_id,
                nombre_rol: usuario.nombre_rol,
                carrera_id: usuario.carrera_id
            }
        });
    } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la información del usuario'
        });
    }
};

// Obtener usuarios filtrados por rol
export const obtenerUsuariosPorRol = async (req, res) => {
  const { rol_id } = req.params;
  try {
    const usuarios = await sql`
      SELECT u.*, ur.rol_id, r.nombre_rol
      FROM usuario u
      JOIN usuario_rol ur ON u.id = ur.usuario_id
      JOIN rol r ON ur.rol_id = r.id
      WHERE ur.rol_id = ${rol_id}
    `;
    res.status(200).json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
