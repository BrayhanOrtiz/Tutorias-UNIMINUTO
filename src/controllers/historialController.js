// historialController.js
import sql from '../db/connection.js';

export const registrarCambio = async (req, res) => {
    const { usuario_id, horario_id, campo_modificado, valor_anterior, valor_nuevo } = req.body;
    
    // Verificar que el horario_id existe en la tabla horario
    const horario = await sql`SELECT * FROM horario WHERE id = ${horario_id}`;
    if (horario.length === 0) {
      return res.status(404).json({ success: false, message: 'El horario no existe' });
    }
  
    try {
      const [newCambio] = await sql`
        INSERT INTO historial_cambios (usuario_id, horario_id, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (${usuario_id}, ${horario_id}, ${campo_modificado}, ${valor_anterior}, ${valor_nuevo})
        RETURNING *;
      `;
      res.status(201).json({ success: true, data: newCambio });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  

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

export const crearHistorial = async (req, res) => {
  const { usuario_id, horario_id, campo_modificado, valor_anterior, valor_nuevo } = req.body;
  try {
    const [newH] = await sql`
      INSERT INTO historial_cambios
        (usuario_id, horario_id, campo_modificado, valor_anterior, valor_nuevo)
      VALUES
        (${usuario_id}, ${horario_id}, ${campo_modificado}, ${valor_anterior}, ${valor_nuevo})
      RETURNING *;
    `;
    res.status(201).json({ success: true, data: newH });
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
