import sql from '../db/connection.js';

// Obtener todos los roles
export const obtenerRoles = async (req, res) => {
  try {
    const roles = await sql`SELECT * FROM rol;`;
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Crear un rol
export const crearRol = async (req, res) => {
  const { id, nombre_rol } = req.body;
  try {
    const [newRol] = await sql`
      INSERT INTO rol (id, nombre_rol)
      VALUES (${id}, ${nombre_rol})
      RETURNING *;
    `;
    res.status(201).json({ success: true, data: newRol });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// (Aquí pueden ir también tus obtenerRolPorId, actualizarRol, eliminarRol)


// Obtener un rol por ID
export const obtenerRolPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rol] = await sql`
      SELECT * FROM rol WHERE id = ${id};
    `;
    if (!rol) {
      return res
        .status(404)
        .json({ success: false, message: 'Rol no encontrado' });
    }
    res.status(200).json({ success: true, data: rol });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Actualizar un rol por ID
export const actualizarRol = async (req, res) => {
  const { id } = req.params;
  const { nombre_rol } = req.body;
  try {
    const [updated] = await sql`
      UPDATE rol
      SET nombre_rol = ${nombre_rol}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: 'Rol no encontrado' });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar un rol por ID
export const eliminarRol = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`
      DELETE FROM rol WHERE id = ${id} RETURNING *;
    `;
    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Rol no encontrado' });
    }
    res
      .status(200)
      .json({ success: true, message: 'Rol eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
