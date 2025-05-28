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

        // Validar que el docente_id existe
        if (!docente_id) {
            return res.status(400).json({ error: 'El ID del docente es requerido' });
        }

        // Validar que las fechas existen
        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({ error: 'Las fechas de inicio y fin son requeridas' });
        }

        // Validar que el docente existe
        const docente = await sql`SELECT id FROM usuario WHERE id = ${docente_id}`;
        if (docente.length === 0) {
            return res.status(404).json({ error: 'Docente no encontrado' });
        }

        // Ajustar la fecha_fin para incluir todo el día si viene como YYYY-MM-DD
        let fechaFinParam = fecha_fin;
        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha_fin)) {
            fechaFinParam = fecha_fin + ' 23:59:59';
        }

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
            AND t.fecha_hora_agendada >= ${fecha_inicio}
            AND t.fecha_hora_agendada <= ${fechaFinParam}
            ORDER BY t.fecha_hora_agendada DESC
        `;

        const resultados = await query;

        // Si no hay resultados, devolver un mensaje apropiado
        if (resultados.length === 0) {
            return res.status(404).json({ 
                error: 'No se encontraron tutorías para el período especificado' 
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Tutorías por Docente');

        // Agregar título al reporte
        worksheet.addRow(['Reporte de Tutorías']);
        worksheet.addRow([`Período: ${new Date(fecha_inicio).toLocaleDateString()} - ${new Date(fecha_fin).toLocaleDateString()}`]);
        worksheet.addRow([]); // Línea en blanco

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

        // Estilo para el encabezado
        worksheet.getRow(1).font = { bold: true, size: 14 };
        worksheet.getRow(2).font = { italic: true };
        worksheet.getRow(4).font = { bold: true };
        worksheet.getRow(4).fill = {
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
                nombre_tema: row.nombre_tema,
                nombre_carrera: row.nombre_carrera || 'No especificada',
                estado_asistencia: row.estado_asistencia,
                observaciones_asistencia: row.observaciones_asistencia || 'Sin observaciones'
            });
        });

        // Agregar resumen al final
        const totalTutorias = resultados.length;
        const totalAsistencias = resultados.filter(r => r.estado_asistencia === 'Asistió').length;
        const totalNoAsistencias = totalTutorias - totalAsistencias;

        worksheet.addRow([]); // Línea en blanco
        worksheet.addRow(['Resumen del Reporte']);
        worksheet.addRow(['Total de Tutorías', totalTutorias]);
        worksheet.addRow(['Total de Asistencias', totalAsistencias]);
        worksheet.addRow(['Total de No Asistencias', totalNoAsistencias]);

        // Estilo para el resumen
        const lastRow = worksheet.lastRow;
        lastRow.font = { bold: true };
        lastRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=reporte_tutorias_${new Date(fecha_inicio).toISOString().split('T')[0]}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al generar reporte:', error);
        res.status(500).json({ 
            error: 'Error al generar el reporte',
            detalles: error.message
        });
    }
}; 