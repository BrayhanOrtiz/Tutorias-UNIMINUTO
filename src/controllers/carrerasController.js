import sql from '../db/connection.js';

// Listar todas las carreras
export const obtenerCarreras = async (req, res) => {
  try {
    const carreras = await sql`SELECT * FROM carrera;`;
    res.status(200).json({ success: true, data: carreras });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener una carrera por ID
export const obtenerCarreraPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [carrera] = await sql`SELECT * FROM carrera WHERE id = ${id};`;
    if (!carrera) {
      return res.status(404).json({ success: false, message: 'Carrera no encontrada' });
    }
    res.status(200).json({ success: true, data: carrera });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Crear una nueva carrera
export const crearCarrera = async (req, res) => {
  const { id, nombre_carrera } = req.body;
  try {
    const [newCarrera] = await sql`
      INSERT INTO carrera (id, nombre_carrera)
      VALUES (${id}, ${nombre_carrera})
      RETURNING *;
    `;
    res.status(201).json({ success: true, data: newCarrera });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar una carrera por ID
export const actualizarCarrera = async (req, res) => {
  const { id } = req.params;
  const { nombre_carrera } = req.body;
  try {
    const [updatedCarrera] = await sql`
      UPDATE carrera
      SET nombre_carrera = ${nombre_carrera}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (!updatedCarrera) {
      return res.status(404).json({ success: false, message: 'Carrera no encontrada' });
    }
    res.status(200).json({ success: true, data: updatedCarrera });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar una carrera por ID
export const eliminarCarrera = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`
      DELETE FROM carrera WHERE id = ${id} RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Carrera no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Carrera eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
