// historialController.js
import sql from '../db/connection.js';


  
  

export const obtenerHistoriales = async (req, res) => {
  try {
    const historial = await sql`SELECT * FROM historial_cambios;`;
    res.status(200).json({ success: true, data: historial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerHistorialPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [h] = await sql`SELECT * FROM historial_cambios WHERE id = ${id};`;
    if (!h) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }
    res.status(200).json({ success: true, data: h });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerHistorialPorUsuario = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const historial = await sql`SELECT * FROM historial_cambios WHERE usuario_id = ${usuario_id};`;
    res.status(200).json({ success: true, data: historial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const eliminarHistorial = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM historial_cambios WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Registro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
