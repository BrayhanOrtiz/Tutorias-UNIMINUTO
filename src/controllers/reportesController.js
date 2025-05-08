import sql from '../db/connection.js';
import ExcelJS from 'exceljs';

// Generar reporte de asistencias
export const generarReporteAsistencias = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, docente_id, estudiante_id, tema_id } = req.query;

        // Construir la consulta base
        let query = sql`
            SELECT 
                t.id as tutoria_id,
                t.fecha_hora_agendada,
                t.hora_inicio_real,
                t.hora_fin_real,
                CONCAT(e.nombre, ' ', e.apellido) as nombre_estudiante,
                CONCAT(d.nombre, ' ', d.apellido) as nombre_docente,
                tm.nombre_tema,
                c.nombre_carrera,
                at.fecha_registro as fecha_asistencia,
                at.observaciones as observaciones_asistencia
            FROM tutoria t
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            JOIN tema tm ON t.tema_id = tm.id
            LEFT JOIN carrera c ON e.carrera_id = c.id
            LEFT JOIN asistencia_tutoria at ON t.id = at.tutoria_id
            WHERE 1=1
        `;

        // Aplicar filtros si existen
        if (fecha_inicio) {
            query = sql`${query} AND t.fecha_hora_agendada >= ${fecha_inicio}`;
        }
        if (fecha_fin) {
            query = sql`${query} AND t.fecha_hora_agendada <= ${fecha_fin}`;
        }
        if (docente_id) {
            query = sql`${query} AND t.docente_id = ${docente_id}`;
        }
        if (estudiante_id) {
            query = sql`${query} AND t.estudiante_id = ${estudiante_id}`;
        }
        if (tema_id) {
            query = sql`${query} AND t.tema_id = ${tema_id}`;
        }

        query = sql`${query} ORDER BY t.fecha_hora_agendada DESC`;

        const resultados = await query;

        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Asistencias');

        // Definir las columnas
        worksheet.columns = [
            { header: 'ID Tutoría', key: 'tutoria_id', width: 10 },
            { header: 'Fecha Programada', key: 'fecha_hora_agendada', width: 20 },
            { header: 'Hora Inicio Real', key: 'hora_inicio_real', width: 20 },
            { header: 'Hora Fin Real', key: 'hora_fin_real', width: 20 },
            { header: 'Estudiante', key: 'nombre_estudiante', width: 30 },
            { header: 'Docente', key: 'nombre_docente', width: 30 },
            { header: 'Tema', key: 'nombre_tema', width: 30 },
            { header: 'Carrera', key: 'nombre_carrera', width: 30 },
            { header: 'Fecha Asistencia', key: 'fecha_asistencia', width: 20 },
            { header: 'Observaciones', key: 'observaciones_asistencia', width: 40 }
        ];

        // Estilo para el encabezado
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD3D3D3' }
        };

        // Agregar los datos
        resultados.forEach(row => {
            worksheet.addRow({
                tutoria_id: row.tutoria_id,
                fecha_hora_agendada: new Date(row.fecha_hora_agendada).toLocaleString(),
                hora_inicio_real: row.hora_inicio_real ? new Date(row.hora_inicio_real).toLocaleString() : 'No registrada',
                hora_fin_real: row.hora_fin_real ? new Date(row.hora_fin_real).toLocaleString() : 'No registrada',
                nombre_estudiante: row.nombre_estudiante,
                nombre_docente: row.nombre_docente,
                nombre_tema: row.nombre_tema,
                nombre_carrera: row.nombre_carrera,
                fecha_asistencia: row.fecha_asistencia ? new Date(row.fecha_asistencia).toLocaleString() : 'No registrada',
                observaciones_asistencia: row.observaciones_asistencia || 'Sin observaciones'
            });
        });

        // Configurar la respuesta
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=reporte_asistencias.xlsx'
        );

        // Enviar el archivo
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al generar reporte:', error);
        res.status(500).json({ error: 'Error al generar el reporte' });
    }
};

// Generar reporte de tutorías por docente
export const generarReporteTutoriasDocente = async (req, res) => {
    try {
        const { docente_id, fecha_inicio, fecha_fin } = req.query;

        let query = sql`
            SELECT 
                t.id as tutoria_id,
                t.fecha_hora_agendada,
                t.hora_inicio_real,
                t.hora_fin_real,
                CONCAT(e.nombre, ' ', e.apellido) as nombre_estudiante,
                tm.nombre_tema,
                c.nombre_carrera,
                CASE 
                    WHEN at.id IS NOT NULL THEN 'Asistió'
                    ELSE 'No asistió'
                END as estado_asistencia,
                at.observaciones as observaciones_asistencia
            FROM tutoria t
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN tema tm ON t.tema_id = tm.id
            LEFT JOIN carrera c ON e.carrera_id = c.id
            LEFT JOIN asistencia_tutoria at ON t.id = at.tutoria_id
            WHERE t.docente_id = ${docente_id}
        `;

        if (fecha_inicio) {
            query = sql`${query} AND t.fecha_hora_agendada >= ${fecha_inicio}`;
        }
        if (fecha_fin) {
            query = sql`${query} AND t.fecha_hora_agendada <= ${fecha_fin}`;
        }

        query = sql`${query} ORDER BY t.fecha_hora_agendada DESC`;

        const resultados = await query;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Tutorías por Docente');

        worksheet.columns = [
            { header: 'ID Tutoría', key: 'tutoria_id', width: 10 },
            { header: 'Fecha Programada', key: 'fecha_hora_agendada', width: 20 },
            { header: 'Hora Inicio Real', key: 'hora_inicio_real', width: 20 },
            { header: 'Hora Fin Real', key: 'hora_fin_real', width: 20 },
            { header: 'Estudiante', key: 'nombre_estudiante', width: 30 },
            { header: 'Tema', key: 'nombre_tema', width: 30 },
            { header: 'Carrera', key: 'nombre_carrera', width: 30 },
            { header: 'Estado Asistencia', key: 'estado_asistencia', width: 15 },
            { header: 'Observaciones', key: 'observaciones_asistencia', width: 40 }
        ];

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD3D3D3' }
        };

        resultados.forEach(row => {
            worksheet.addRow({
                tutoria_id: row.tutoria_id,
                fecha_hora_agendada: new Date(row.fecha_hora_agendada).toLocaleString(),
                hora_inicio_real: row.hora_inicio_real ? new Date(row.hora_inicio_real).toLocaleString() : 'No registrada',
                hora_fin_real: row.hora_fin_real ? new Date(row.hora_fin_real).toLocaleString() : 'No registrada',
                nombre_estudiante: row.nombre_estudiante,
                nombre_tema: row.nombre_tema,
                nombre_carrera: row.nombre_carrera,
                estado_asistencia: row.estado_asistencia,
                observaciones_asistencia: row.observaciones_asistencia || 'Sin observaciones'
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=reporte_tutorias_docente.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al generar reporte:', error);
        res.status(500).json({ error: 'Error al generar el reporte' });
    }
}; 