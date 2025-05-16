// src/utils/registrarCambio.js
import sql from '../db/connection.js'; 

export const registrarCambio = async ({
  usuario_id,
  horario_id,
  campo_modificado,
  valor_anterior,
  valor_nuevo
}) => {
  try {
    // Verifica que el horario existe antes de registrar el cambio
    const horario = await sql`SELECT * FROM horario WHERE id = ${horario_id}`;
    if (horario.length === 0) {
      throw new Error('El horario no existe');
    }

    await sql`
      INSERT INTO historial_cambios (
        usuario_id,
        horario_id,
        campo_modificado,
        valor_anterior,
        valor_nuevo
      )
      VALUES (
        ${usuario_id},
        ${horario_id},
        ${campo_modificado},
        ${valor_anterior},
        ${valor_nuevo}
      );
    `;
  } catch (error) {
    console.error('Error al registrar el cambio:', error.message);
    // Puedes lanzar el error si quieres que el controlador lo capture
    // throw error;
  }
};
