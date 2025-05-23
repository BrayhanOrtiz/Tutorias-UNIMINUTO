import { validationResult } from 'express-validator';
import sql from '../db/connection.js';
// import logo from '../../assets/logo-uniminuto.png';
// import bcrypt from 'bcrypt'; // Eliminar la importación de bcrypt


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
    contraseña, fecha_nacimiento, experticia
  } = req.body;

  // Validar campos requeridos
  if (!id || !nombre || !apellido || !correo_institucional || !contraseña) {
    return res.status(400).json({ 
      success: false, 
      message: 'Faltan campos requeridos: id, nombre, apellido, correo_institucional y contraseña son obligatorios' 
    });
  }

  try {
    // Verificar si el usuario ya existe
    const [existingUser] = await sql`
      SELECT id FROM usuario WHERE id = ${id} OR correo_institucional = ${correo_institucional}
    `;

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un usuario con ese ID o correo institucional' 
      });
    }

    const newUser = await sql.begin(async (tx) => {
      const [user] = await tx`
        INSERT INTO usuario
          (id, nombre, apellido, correo_institucional, "contraseña", fecha_nacimiento, experticia)
        VALUES
          (
            ${id},
            ${nombre},
            ${apellido},
            ${correo_institucional},
            ${contraseña},
            ${fecha_nacimiento ?? null},
            ${experticia ?? null}
          )
        RETURNING *
      `;

      await tx`
        INSERT INTO usuario_rol (usuario_id, rol_id)
        VALUES (${user.id}, 2)
      `;

      return user;
    });

    res.status(201).json({ 
      success: true, 
      data: newUser,
      message: 'Docente creado exitosamente' 
    });
  } catch (error) {
    console.error('Error al crear usuario docente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear el docente',
      error: error.message 
    });
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
      // Construir la consulta dinámicamente
      const updates = [];
      const values = [];

      if (nombre !== undefined) {
        updates.push('nombre = $' + (values.length + 1));
        values.push(nombre);
      }
      if (apellido !== undefined) {
        updates.push('apellido = $' + (values.length + 1));
        values.push(apellido);
      }
      if (correo_institucional !== undefined) {
        updates.push('correo_institucional = $' + (values.length + 1));
        values.push(correo_institucional);
      }
      
      // **Modificación aquí:** Solo actualizar contraseña si no es undefined Y NO está vacía
      if (contraseña !== undefined && contraseña !== '') {
        // **Nota:** Las contraseñas NO se están hasheando en este proyecto.
        // En un proyecto real o de producción, SIEMPRE debes hashear las contraseñas.
        // const hashedPassword = await bcrypt.hash(contraseña, 10); // Eliminar línea de hasheo
        updates.push('"contraseña" = $' + (values.length + 1));
        values.push(contraseña); // Usar la contraseña sin hashear
      }

      if (carrera_id !== undefined) {
        updates.push('carrera_id = $' + (values.length + 1));
        values.push(carrera_id);
      }
      if (fecha_nacimiento !== undefined) {
        updates.push('fecha_nacimiento = $' + (values.length + 1));
        values.push(fecha_nacimiento);
      }
      if (experticia !== undefined) {
        updates.push('experticia = $' + (values.length + 1));
        values.push(experticia);
      }

      let user;
      // Solo ejecutar UPDATE si hay algo que actualizar
      if (updates.length > 0) {
        const query = `
          UPDATE usuario
          SET ${updates.join(', ')}
          WHERE id = $${values.length + 1}
          RETURNING *
        `;
        values.push(id);

        [user] = await tx.unsafe(query, values);
      } else {
        // Si no hay campos para actualizar (excepto la contraseña si estaba vacía),
        // simplemente obtener el usuario existente
        [user] = await tx`SELECT * FROM usuario WHERE id = ${id}`;
      }

      // Actualizar rol si se proporciona
      if (rol_id != null) {
        await tx`
          UPDATE usuario_rol
          SET rol_id = ${rol_id}
          WHERE usuario_id = ${id}
        `;
      }

      return user;
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error en actualizarUsuario:', error);
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

// Obtener todos los docentes
export const obtenerDocentes = async (req, res) => {
  try {
    console.log('Iniciando consulta de docentes...');
    
    // Primero verificamos la conexión con una consulta simple
    try {
      const testConnection = await sql`SELECT 1 as test`;
      console.log('Conexión a la base de datos exitosa:', testConnection);
    } catch (connError) {
      console.error('Error de conexión a la base de datos:', connError);
      throw new Error('Error de conexión a la base de datos');
    }

    // Verificamos las tablas necesarias
    const tables = ['usuario', 'usuario_rol', 'rol'];
    for (const table of tables) {
      const exists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${table}
        );
      `;
      console.log(`Tabla ${table} existe:`, exists[0].exists);
      if (!exists[0].exists) {
        throw new Error(`La tabla ${table} no existe en la base de datos`);
      }
    }

    // Consulta simplificada paso a paso
    console.log('Obteniendo usuarios...');
    const usuarios = await sql`
      SELECT * FROM usuario;
    `;
    console.log('Usuarios encontrados:', usuarios.length);

    console.log('Obteniendo roles...');
    const roles = await sql`
      SELECT * FROM rol;
    `;
    console.log('Roles encontrados:', roles.length);

    console.log('Obteniendo usuario_rol...');
    const usuarioRoles = await sql`
      SELECT * FROM usuario_rol;
    `;
    console.log('Relaciones usuario-rol encontradas:', usuarioRoles.length);

    // Consulta final
    console.log('Ejecutando consulta final...');
    const docentes = await sql`
      SELECT 
        u.id,
        u.nombre,
        u.apellido,
        u.correo_institucional,
        ur.rol_id,
        r.nombre_rol
      FROM usuario u
      INNER JOIN usuario_rol ur ON u.id = ur.usuario_id
      INNER JOIN rol r ON ur.rol_id = r.id
      WHERE ur.rol_id = 2
      ORDER BY u.nombre, u.apellido;
    `;
    
    console.log('Docentes encontrados:', docentes.length);

    res.status(200).json({ 
      success: true, 
      data: docentes 
    });
  } catch (error) {
    console.error('Error detallado al obtener docentes:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail
    });
    
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la lista de docentes',
      error: {
        message: error.message,
        code: error.code,
        detail: error.detail || 'No hay detalles adicionales disponibles'
      }
    });
  }
};
