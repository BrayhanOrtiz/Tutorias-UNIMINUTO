import sql from '../db/connection.js';

import { registrarCambio } from "../utils/registrarCambio.js";

// Listar todos los horarios
export const obtenerHorarios = async (req, res) => {
  try {
    const horarios = await sql`SELECT * FROM horario;`;
    res.status(200).json({ success: true, data: horarios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener un horario por ID
export const obtenerHorarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [horario] = await sql`SELECT * FROM horario WHERE id = ${id};`;
    if (!horario) {
      return res.status(404).json({ success: false, message: 'Horario no encontrado' });
    }
    res.status(200).json({ success: true, data: horario });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener todos los horarios de un usuario
export const obtenerHorariosPorUsuario = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const horarios = await sql`
      SELECT * 
      FROM horario 
      WHERE usuario_id = ${usuario_id};
    `;
    res.status(200).json({ success: true, data: horarios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Crear un horario (sin enviar id)
export const crearHorario = async (req, res) => {
    const { dia_semana, hora_inicio, hora_fin, salon, usuario_id } = req.body;
    try {
      const [newHorario] = await sql`
        INSERT INTO horario (dia_semana, hora_inicio, hora_fin, salon, usuario_id)
        VALUES (${dia_semana}, ${hora_inicio}, ${hora_fin}, ${salon}, ${usuario_id})
        RETURNING *;
      `;
      res.status(201).json({ success: true, data: newHorario });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Actualizar un horario
export const actualizarHorario = async (req, res) => {
    const { id } = req.params;
    const { dia_semana, hora_inicio, hora_fin, salon, usuario_id } = req.body;

    try {
        // Primero obtenemos el horario actual para registrar el cambio en el historial
        const horario = await sql`SELECT * FROM horario WHERE id = ${id} AND usuario_id = ${usuario_id}`;
        if (!horario.length) {
            return res.status(404).json({ success: false, message: 'Horario no encontrado para ese usuario' });
        }

        await registrarCambio({
            usuario_id: parseInt(usuario_id),
            horario_id: parseInt(id),
            campo_modificado: 'Horario',
            valor_anterior: `${horario[0].hora_inicio}-${horario[0].hora_fin}`,
            valor_nuevo: `${hora_inicio}-${hora_fin}`
        });

        // Luego, actualizamos el horario
        const [updatedHorario] = await sql`
            UPDATE horario
            SET dia_semana = ${dia_semana}, 
                hora_inicio = ${hora_inicio}, 
                hora_fin = ${hora_fin}, 
                salon = ${salon}
            WHERE id = ${id} AND usuario_id = ${usuario_id}
            RETURNING *;
        `;
        res.status(200).json({ success: true, data: updatedHorario });
    } catch (error) {
        console.error('Error al actualizar horario:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
  
  // Actualizar un horario específico de un usuario
  export const actualizarHorarioEspecifico = async (req, res) => {
    const { usuario_id, id } = req.params;
    const { dia_semana, hora_inicio, hora_fin, salon } = req.body;
  
    try {
      // 1. Obtener el horario actual
      const [horarioActual] = await sql`
        SELECT * FROM horario WHERE id = ${id} AND usuario_id = ${usuario_id};
      `;
  
      if (!horarioActual) {
        return res
          .status(404)
          .json({ success: false, message: 'Horario no encontrado para ese usuario' });
      }
  
      // 2. Registrar cambios en historial por cada campo modificado
      if (dia_semana && dia_semana !== horarioActual.dia_semana) {
        await registrarCambio({
          usuario_id: parseInt(usuario_id),
          horario_id: parseInt(id),
          campo_modificado: 'dia_semana',
          valor_anterior: horarioActual.dia_semana,
          valor_nuevo: dia_semana
        });
      }
      
      if (hora_inicio && hora_inicio !== horarioActual.hora_inicio) {
        await registrarCambio({
          usuario_id: parseInt(usuario_id),
          horario_id: parseInt(id),
          campo_modificado: 'hora_inicio',
          valor_anterior: horarioActual.hora_inicio,
          valor_nuevo: hora_inicio
        });
      }
      
      if (hora_fin && hora_fin !== horarioActual.hora_fin) {
        await registrarCambio({
          usuario_id: parseInt(usuario_id),
          horario_id: parseInt(id),
          campo_modificado: 'hora_fin',
          valor_anterior: horarioActual.hora_fin,
          valor_nuevo: hora_fin
        });
      }
      
      if (salon && salon !== horarioActual.salon) {
        await registrarCambio({
          usuario_id: parseInt(usuario_id),
          horario_id: parseInt(id),
          campo_modificado: 'salon',
          valor_anterior: horarioActual.salon,
          valor_nuevo: salon
        });
      }
      
      // 3. Actualizar el horario
      const [updated] = await sql`
        UPDATE horario
        SET
          dia_semana  = COALESCE(${dia_semana}, dia_semana),
          hora_inicio = COALESCE(${hora_inicio}, hora_inicio),
          hora_fin    = COALESCE(${hora_fin}, hora_fin),
          salon       = COALESCE(${salon}, salon)
        WHERE id = ${id} AND usuario_id = ${usuario_id}
        RETURNING *;
      `;
  
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // Eliminar un horario específico de un usuario
export const eliminarHorarioEspecifico = async (req, res) => {
    const { usuario_id, id } = req.params;
  
    try {
      const result = await sql`
        DELETE FROM horario
        WHERE id = ${id} AND usuario_id = ${usuario_id}
        RETURNING *;
      `;
  
      if (result.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Horario no encontrado para ese usuario' });
      }
  
      res.status(200).json({ success: true, message: 'Horario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Eliminar un horario
export const eliminarHorario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM horario WHERE id = ${id} RETURNING *;`;
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Horario no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Horario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
