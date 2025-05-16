import sql from '../db/connection.js';

//Obtener todos los temas
export const obtenerTemas = async (req, res) => {
  try {
    const temas = await sql`SELECT * FROM tema`;
    res.status(200).json({ success: true, data: temas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 
