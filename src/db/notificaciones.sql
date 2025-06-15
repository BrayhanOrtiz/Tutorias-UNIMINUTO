CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id),
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP,
    enlace VARCHAR(255),
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX idx_notificaciones_fecha ON notificaciones(fecha_creacion); 