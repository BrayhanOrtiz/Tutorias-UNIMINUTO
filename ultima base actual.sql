--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.2

-- Started on 2025-05-21 21:51:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 20 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3777 (class 0 OID 0)
-- Dependencies: 20
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 292 (class 1259 OID 17902)
-- Name: asistencia_tutoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asistencia_tutoria (
    id integer NOT NULL,
    tutoria_id integer NOT NULL,
    estudiante_id integer NOT NULL,
    observaciones text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.asistencia_tutoria OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 17901)
-- Name: asistencia_tutoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asistencia_tutoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asistencia_tutoria_id_seq OWNER TO postgres;

--
-- TOC entry 3780 (class 0 OID 0)
-- Dependencies: 291
-- Name: asistencia_tutoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asistencia_tutoria_id_seq OWNED BY public.asistencia_tutoria.id;


--
-- TOC entry 262 (class 1259 OID 17419)
-- Name: carrera; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carrera (
    id integer NOT NULL,
    nombre_carrera character varying(100) NOT NULL
);


ALTER TABLE public.carrera OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 17422)
-- Name: carrera_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carrera_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carrera_id_seq OWNER TO postgres;

--
-- TOC entry 3783 (class 0 OID 0)
-- Dependencies: 263
-- Name: carrera_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carrera_id_seq OWNED BY public.carrera.id;


--
-- TOC entry 264 (class 1259 OID 17423)
-- Name: encuesta_satisfaccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encuesta_satisfaccion (
    id integer NOT NULL,
    tutoria_id integer NOT NULL,
    fecha_respuesta timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.encuesta_satisfaccion OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 17427)
-- Name: encuesta_satisfaccion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.encuesta_satisfaccion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.encuesta_satisfaccion_id_seq OWNER TO postgres;

--
-- TOC entry 3786 (class 0 OID 0)
-- Dependencies: 265
-- Name: encuesta_satisfaccion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.encuesta_satisfaccion_id_seq OWNED BY public.encuesta_satisfaccion.id;


--
-- TOC entry 266 (class 1259 OID 17428)
-- Name: historial_cambios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_cambios (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    horario_id integer NOT NULL,
    fecha_hora_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    campo_modificado character varying(100) NOT NULL,
    valor_anterior character varying(255),
    valor_nuevo character varying(255)
);


ALTER TABLE public.historial_cambios OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 17434)
-- Name: historial_cambios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_cambios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_cambios_id_seq OWNER TO postgres;

--
-- TOC entry 3789 (class 0 OID 0)
-- Dependencies: 267
-- Name: historial_cambios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_cambios_id_seq OWNED BY public.historial_cambios.id;


--
-- TOC entry 268 (class 1259 OID 17435)
-- Name: horario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horario (
    id integer NOT NULL,
    dia_semana character varying(20) NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    salon character varying(100),
    usuario_id integer NOT NULL
);


ALTER TABLE public.horario OWNER TO postgres;

--
-- TOC entry 295 (class 1259 OID 17952)
-- Name: horario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.horario_id_seq OWNER TO postgres;

--
-- TOC entry 3792 (class 0 OID 0)
-- Dependencies: 295
-- Name: horario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horario_id_seq OWNED BY public.horario.id;


--
-- TOC entry 298 (class 1259 OID 23569)
-- Name: password_reset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.password_reset OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 23568)
-- Name: password_reset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_id_seq OWNER TO postgres;

--
-- TOC entry 3795 (class 0 OID 0)
-- Dependencies: 297
-- Name: password_reset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_id_seq OWNED BY public.password_reset.id;


--
-- TOC entry 269 (class 1259 OID 17439)
-- Name: pregunta_encuesta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pregunta_encuesta (
    id integer NOT NULL,
    texto_pregunta character varying(255) NOT NULL,
    tipo_pregunta character varying(20)
);


ALTER TABLE public.pregunta_encuesta OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 17442)
-- Name: pregunta_encuesta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pregunta_encuesta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pregunta_encuesta_id_seq OWNER TO postgres;

--
-- TOC entry 3798 (class 0 OID 0)
-- Dependencies: 270
-- Name: pregunta_encuesta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pregunta_encuesta_id_seq OWNED BY public.pregunta_encuesta.id;


--
-- TOC entry 271 (class 1259 OID 17443)
-- Name: respuesta_encuesta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.respuesta_encuesta (
    id integer NOT NULL,
    encuesta_satisfaccion_id integer NOT NULL,
    pregunta_encuesta_id integer NOT NULL,
    respuesta text
);


ALTER TABLE public.respuesta_encuesta OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 17448)
-- Name: respuesta_encuesta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.respuesta_encuesta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.respuesta_encuesta_id_seq OWNER TO postgres;

--
-- TOC entry 3801 (class 0 OID 0)
-- Dependencies: 272
-- Name: respuesta_encuesta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.respuesta_encuesta_id_seq OWNED BY public.respuesta_encuesta.id;


--
-- TOC entry 273 (class 1259 OID 17449)
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    id integer NOT NULL,
    nombre_rol character varying(100) NOT NULL
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 17452)
-- Name: rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_id_seq OWNER TO postgres;

--
-- TOC entry 3804 (class 0 OID 0)
-- Dependencies: 274
-- Name: rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_id_seq OWNED BY public.rol.id;


--
-- TOC entry 294 (class 1259 OID 17922)
-- Name: tarea_tutoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tarea_tutoria (
    id integer NOT NULL,
    tutoria_id integer NOT NULL,
    descripcion text NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    asignada_por integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega date,
    CONSTRAINT tarea_tutoria_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'en_progreso'::character varying, 'completada'::character varying])::text[])))
);


ALTER TABLE public.tarea_tutoria OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 17921)
-- Name: tarea_tutoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tarea_tutoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tarea_tutoria_id_seq OWNER TO postgres;

--
-- TOC entry 3807 (class 0 OID 0)
-- Dependencies: 293
-- Name: tarea_tutoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tarea_tutoria_id_seq OWNED BY public.tarea_tutoria.id;


--
-- TOC entry 275 (class 1259 OID 17453)
-- Name: tema; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tema (
    id integer NOT NULL,
    nombre_tema character varying(150) NOT NULL
);


ALTER TABLE public.tema OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 19071)
-- Name: tema_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tema_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tema_id_seq OWNER TO postgres;

--
-- TOC entry 3810 (class 0 OID 0)
-- Dependencies: 296
-- Name: tema_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tema_id_seq OWNED BY public.tema.id;


--
-- TOC entry 276 (class 1259 OID 17457)
-- Name: tutoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tutoria (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    docente_id integer NOT NULL,
    fecha_hora_agendada timestamp without time zone NOT NULL,
    tema_id integer NOT NULL,
    hora_inicio_real timestamp without time zone,
    hora_fin_real timestamp without time zone,
    firma_docente_habilitada boolean DEFAULT false,
    firmada_estudiante boolean DEFAULT false
);


ALTER TABLE public.tutoria OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 17462)
-- Name: tutoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tutoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tutoria_id_seq OWNER TO postgres;

--
-- TOC entry 3813 (class 0 OID 0)
-- Dependencies: 277
-- Name: tutoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tutoria_id_seq OWNED BY public.tutoria.id;


--
-- TOC entry 278 (class 1259 OID 17463)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    fecha_nacimiento date,
    correo_institucional character varying(150) NOT NULL,
    "contraseña" character varying(255) NOT NULL,
    carrera_id integer,
    experticia text
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 3815 (class 0 OID 0)
-- Dependencies: 278
-- Name: COLUMN usuario.experticia; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.usuario.experticia IS 'Los docentes colcan en que son expertos aqui';


--
-- TOC entry 279 (class 1259 OID 17468)
-- Name: usuario_rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_rol (
    usuario_id integer NOT NULL,
    rol_id integer NOT NULL
);


ALTER TABLE public.usuario_rol OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 17471)
-- Name: vista_horarios_docentes; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_horarios_docentes AS
 SELECT u.id AS docente_id,
    concat(u.nombre, ' ', u.apellido) AS nombre_completo,
    h.dia_semana,
    h.hora_inicio,
    h.hora_fin,
    h.salon
   FROM (((public.usuario u
     JOIN public.usuario_rol ur ON ((u.id = ur.usuario_id)))
     JOIN public.rol r ON ((ur.rol_id = r.id)))
     JOIN public.horario h ON ((u.id = h.usuario_id)))
  WHERE ((r.nombre_rol)::text = 'Docente'::text);


ALTER VIEW public.vista_horarios_docentes OWNER TO postgres;

--
-- TOC entry 3544 (class 2604 OID 17905)
-- Name: asistencia_tutoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencia_tutoria ALTER COLUMN id SET DEFAULT nextval('public.asistencia_tutoria_id_seq'::regclass);


--
-- TOC entry 3531 (class 2604 OID 17534)
-- Name: carrera id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera ALTER COLUMN id SET DEFAULT nextval('public.carrera_id_seq'::regclass);


--
-- TOC entry 3532 (class 2604 OID 17535)
-- Name: encuesta_satisfaccion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta_satisfaccion ALTER COLUMN id SET DEFAULT nextval('public.encuesta_satisfaccion_id_seq'::regclass);


--
-- TOC entry 3534 (class 2604 OID 17536)
-- Name: historial_cambios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_cambios ALTER COLUMN id SET DEFAULT nextval('public.historial_cambios_id_seq'::regclass);


--
-- TOC entry 3536 (class 2604 OID 17953)
-- Name: horario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horario ALTER COLUMN id SET DEFAULT nextval('public.horario_id_seq'::regclass);


--
-- TOC entry 3549 (class 2604 OID 23572)
-- Name: password_reset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset ALTER COLUMN id SET DEFAULT nextval('public.password_reset_id_seq'::regclass);


--
-- TOC entry 3537 (class 2604 OID 17538)
-- Name: pregunta_encuesta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pregunta_encuesta ALTER COLUMN id SET DEFAULT nextval('public.pregunta_encuesta_id_seq'::regclass);


--
-- TOC entry 3538 (class 2604 OID 17539)
-- Name: respuesta_encuesta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuesta_encuesta ALTER COLUMN id SET DEFAULT nextval('public.respuesta_encuesta_id_seq'::regclass);


--
-- TOC entry 3539 (class 2604 OID 17540)
-- Name: rol id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol ALTER COLUMN id SET DEFAULT nextval('public.rol_id_seq'::regclass);


--
-- TOC entry 3546 (class 2604 OID 17925)
-- Name: tarea_tutoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea_tutoria ALTER COLUMN id SET DEFAULT nextval('public.tarea_tutoria_id_seq'::regclass);


--
-- TOC entry 3540 (class 2604 OID 19072)
-- Name: tema id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tema ALTER COLUMN id SET DEFAULT nextval('public.tema_id_seq'::regclass);


--
-- TOC entry 3541 (class 2604 OID 17542)
-- Name: tutoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutoria ALTER COLUMN id SET DEFAULT nextval('public.tutoria_id_seq'::regclass);


--
-- TOC entry 3765 (class 0 OID 17902)
-- Dependencies: 292
-- Data for Name: asistencia_tutoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asistencia_tutoria (id, tutoria_id, estudiante_id, observaciones, fecha_registro) FROM stdin;
1	3	826863	Asistencia registrada correctamente	2025-05-08 03:26:02.565803
2	6	123321	bien	2025-05-16 17:23:44.275775
3	9	123321	Asistencia registrada por el estudiante	2025-05-19 21:45:16.443834
4	10	123321	Asistencia registrada por el estudiante	2025-05-20 01:20:07.734344
5	11	271198	Asistencia registrada por el estudiante	2025-05-21 15:21:39.124184
6	18	271198	Asistencia registrada por el estudiante	2025-05-21 15:21:40.982229
7	17	271198	Asistencia registrada por el estudiante	2025-05-21 15:21:42.481954
8	19	271198	Asistencia registrada por el estudiante	2025-05-21 15:21:44.227942
9	15	271198	Asistencia registrada por el estudiante	2025-05-21 15:21:45.754799
10	20	271198	Asistencia registrada por el estudiante	2025-05-21 15:50:31.452248
11	21	271198	Asistencia registrada por el estudiante	2025-05-21 16:22:11.831133
12	23	271198	Asistencia registrada por el estudiante	2025-05-21 16:33:46.644684
13	24	271198	Asistencia registrada por el estudiante	2025-05-21 17:03:58.177408
14	25	271198	Asistencia registrada por el estudiante	2025-05-21 17:08:25.658176
\.


--
-- TOC entry 3746 (class 0 OID 17419)
-- Dependencies: 262
-- Data for Name: carrera; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carrera (id, nombre_carrera) FROM stdin;
2	Ingeniería Industrial
1	Ing. de Sistemas y Computación
3	Ingeniería Civil
4	contaduria
5	Psicologia
\.


--
-- TOC entry 3748 (class 0 OID 17423)
-- Dependencies: 264
-- Data for Name: encuesta_satisfaccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.encuesta_satisfaccion (id, tutoria_id, fecha_respuesta) FROM stdin;
\.


--
-- TOC entry 3750 (class 0 OID 17428)
-- Dependencies: 266
-- Data for Name: historial_cambios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_cambios (id, usuario_id, horario_id, fecha_hora_cambio, campo_modificado, valor_anterior, valor_nuevo) FROM stdin;
2	12345	1	2025-05-07 16:34:37.086888	dia_semana	Jueves	Viernes
3	12345	1	2025-05-07 16:34:37.504007	salon	D404	B404
4	863619	4	2025-05-07 16:37:14.312578	hora_inicio	08:00:00	12:00:00
5	863619	4	2025-05-07 16:37:14.589624	hora_fin	10:00:00	16:00:00
6	863619	4	2025-05-07 16:37:14.881717	salon	A101	A404
7	12345	2	2025-05-16 04:23:16.011125	hora_inicio	09:00:00	09:00
8	12345	2	2025-05-16 04:23:16.390742	hora_fin	11:00:00	11:00
9	12345	2	2025-05-16 04:23:16.639148	salon	Salon B-201	B-201
10	12345	1	2025-05-16 05:04:29.581721	dia_semana	Viernes	Jueves
11	12345	1	2025-05-16 05:04:29.972868	hora_inicio	14:00:00	14:00
12	12345	1	2025-05-16 05:04:30.23079	hora_fin	16:00:00	16:00
13	863618	10	2025-05-16 05:05:41.470461	dia_semana	Lunes	Martes
14	863618	10	2025-05-16 05:05:41.931094	hora_inicio	08:00:00	08:00
15	863618	10	2025-05-16 05:05:42.252717	hora_fin	10:00:00	10:00
17	863619	4	2025-05-20 00:55:40.850652	Horario	12:00:00-16:00:00	12:00:00-17:00
18	863619	4	2025-05-20 01:00:35.194576	Horario	12:00:00-17:00:00	12:00:00-15:00
19	863619	4	2025-05-20 01:19:24.798656	Horario	12:00:00-15:00:00	12:00:00-16:00
\.


--
-- TOC entry 3752 (class 0 OID 17435)
-- Dependencies: 268
-- Data for Name: horario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horario (id, dia_semana, hora_inicio, hora_fin, salon, usuario_id) FROM stdin;
6	Lunes	13:00:00	15:00:00	A302	12345
2	Martes	09:00:00	11:00:00	B-201	12345
1	Jueves	14:00:00	16:00:00	B404	12345
10	Martes	08:00:00	10:00:00	A101	863618
9	Martes	15:00:00	15:59:00	B200	863617
12	Sábado	09:00:00	10:00:00	A202	863617
14	Lunes	16:30:00	18:00:00	A404	863617
4	Lunes	12:00:00	16:00:00	A404	863619
\.


--
-- TOC entry 3771 (class 0 OID 23569)
-- Dependencies: 298
-- Data for Name: password_reset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset (id, usuario_id, email, token, expires_at, created_at) FROM stdin;
1	863617	brayhan.ortiz@uniminuto.edu.co	bc9c54205ec8fbbee6b07dc1fd35e1c07d58be9f8396a9aa1ced0e4cc0fe2904	2025-05-14 21:31:54.39+00	2025-05-14 21:01:54.611311+00
2	863617	brayhan.ortiz@uniminuto.edu.co	f1fe76b8e82788744c629dd5473d872f3f559ba25d4b999c88655a6c117a5108	2025-05-15 19:27:32.225+00	2025-05-15 18:57:32.421445+00
3	863617	brayhan.ortiz@uniminuto.edu.co	d52fe6e282ff227ee812a3bfd7d67727637c679651b075aaa71785417196dabd	2025-05-15 19:31:26.37+00	2025-05-15 19:01:26.55429+00
4	863617	brayhan.ortiz@uniminuto.edu.co	dd951ef47a68b646ceb6712e6ff609d935aab72ddb3f7ea4c2bbcb3d2815ef2c	2025-05-15 19:39:09.205+00	2025-05-15 19:09:09.403813+00
5	863617	brayhan.ortiz@uniminuto.edu.co	78ab76f90871765c920159a7d14b07f3a316b8255532ba2ed0a4f65de4c66d5a	2025-05-15 19:40:46.322+00	2025-05-15 19:10:46.50699+00
6	863617	brayhan.ortiz@uniminuto.edu.co	5508449cccfa88a1bbf2e80e1eeb57a48d07567d22864cf7125ec716ff03a9de	2025-05-15 20:08:05.315+00	2025-05-15 19:38:05.488309+00
7	863617	brayhan.ortiz@uniminuto.edu.co	d758399b3bf4cbd08fcc1fbf3345e90cfd2bea0fde13ef56b85b962075f6e1a3	2025-05-15 20:32:37.281+00	2025-05-15 20:02:37.427576+00
8	863617	brayhan.ortiz@uniminuto.edu.co	db6f0373ff7051610b3d9e73f7dded6f532b8a4cff9681f177bc81e96a81d8bc	2025-05-15 20:39:21.072+00	2025-05-15 20:09:21.214025+00
9	827833	jorge.castro-pa@uniminuto.edu.co	90c887528b1887004c4d5d98b01d175f2fb6fab8612bade748f9bf437b70a7c3	2025-05-15 20:48:38.044+00	2025-05-15 20:18:38.186996+00
10	863617	brayhan.ortiz@uniminuto.edu.co	e3dd024585de04352219b92762dbc3e14b3d156e5c756de5159af484d0740411	2025-05-15 20:56:58.304+00	2025-05-15 20:26:58.454353+00
11	863617	brayhan.ortiz@uniminuto.edu.co	becc075bce68b1ab24ae6c54229247fdd558a0ad8e87a19e4e0131c2f064fc5b	2025-05-15 21:06:48.073+00	2025-05-15 20:36:48.244795+00
12	827833	jorge.castro-pa@uniminuto.edu.co	aa8a210b6065bfb4c0b3433947b76cd6ddd486bcbcd1db329da8d48d799f1385	2025-05-15 21:21:39.437+00	2025-05-15 20:51:39.638196+00
14	827833	jorge.castro-pa@uniminuto.edu.co	23e94f1ddc408a67ed88d59fbe22940535d193bf731714761b18c4e96373c68e	2025-05-15 21:39:23.543+00	2025-05-15 21:09:23.353889+00
15	827833	jorge.castro-pa@uniminuto.edu.co	fbdd4f65be456c933e1f503c471336bbbdf16677c6c0b653470dc7cba40ef876	2025-05-15 21:40:20.815+00	2025-05-15 21:10:20.974035+00
16	827833	jorge.castro-pa@uniminuto.edu.co	4913eee9f7e9c4ee63a22a51d9d1ffc72016ba651007ce282f6a13e9aadb22a4	2025-05-15 21:42:22.205+00	2025-05-15 21:12:22.352956+00
17	863617	brayhan.ortiz@uniminuto.edu.co	82de99baedc148d16246e0a496f549013e01b0ba589ec8650687acaf69b25493	2025-05-15 21:43:48.954+00	2025-05-15 21:13:49.097082+00
18	827833	jorge.castro-pa@uniminuto.edu.co	7bfa7d74159bec2d43bb5edd475bf59eac469b8148fe1acd46095522926db564	2025-05-15 21:44:30.726+00	2025-05-15 21:14:30.868855+00
19	827833	jorge.castro-pa@uniminuto.edu.co	3a7774dc4950f87d590cb1fae157471190b95b5231c72413fa40ac95bd1a4eeb	2025-05-15 21:48:37.592+00	2025-05-15 21:18:37.741955+00
20	863617	brayhan.ortiz@uniminuto.edu.co	16ee7a861d53660adeb958f5ba696878eaad93ae82a4460d8fa41ade16bdbd75	2025-05-15 21:49:18.149+00	2025-05-15 21:19:18.302293+00
21	827833	jorge.castro-pa@uniminuto.edu.co	5ee7a77272ab7d182c88a4355cb34fb2ecccfc18956d9690c68be18799a6a293	2025-05-15 21:51:01.149+00	2025-05-15 21:21:01.29916+00
22	827833	jorge.castro-pa@uniminuto.edu.co	339a9c5b9cc8a04690893bdda4dae1e48267e42cf49536bb69230fffea841d0c	2025-05-15 21:53:19.022+00	2025-05-15 21:23:19.17146+00
23	827833	jorge.castro-pa@uniminuto.edu.co	55f6931ce75b1aa8a10ba2f2389f3b0e3057acc978bdddbdea66352319ce3311	2025-05-15 21:56:02.983+00	2025-05-15 21:26:03.123324+00
24	827833	jorge.castro-pa@uniminuto.edu.co	02eceaf4c9f520746bc2e0c6914975e7042b0f7e4c9314ecfc04c7be96e96dbf	2025-05-15 22:07:32.861+00	2025-05-15 21:37:33.011785+00
25	863617	brayhan.ortiz@uniminuto.edu.co	973bb9322775f9ef586d1d6a1d28fed273f66c332488398770428625a744f921	2025-05-15 22:09:12.647+00	2025-05-15 21:39:12.780413+00
26	863617	brayhan.ortiz@uniminuto.edu.co	4641213b7f5504f6afaefa4d9997ae9b1dde39658d4d615a7f8800e98bddfed7	2025-05-15 22:16:32.355+00	2025-05-15 21:46:32.485826+00
27	827833	jorge.castro-pa@uniminuto.edu.co	62c69e33c1dfac0d144d1f34834e8ee2bf06b55794186b7eecab1531ba206da7	2025-05-15 22:17:04.803+00	2025-05-15 21:47:04.935487+00
28	854286	paula.martinez-hu@uniminuto.edu.co	9e7f2b898aaf8a2507dc51fa4f6989f3838e23920b0bbddb0cec470b3ba71403	2025-05-15 22:20:23.504+00	2025-05-15 21:50:23.629559+00
29	863617	brayhan.ortiz@uniminuto.edu.co	2e9f938e2c7803cd8726d344af93cdc140c1f10422ca934f1ed9bc6309ed1f25	2025-05-15 22:26:25.057+00	2025-05-15 21:56:25.182307+00
30	827833	jorge.castro-pa@uniminuto.edu.co	366e39b4868f87b8fb4aa86a9facb4d795748596ca88f43a3d3f43aa7d4f9095	2025-05-15 22:27:39.177+00	2025-05-15 21:57:39.300292+00
31	827833	jorge.castro-pa@uniminuto.edu.co	9b0ed17cfebb8439e93f373654001fae95561861a700c9be6f51232fa51443ba	2025-05-15 22:29:13.081+00	2025-05-15 21:59:12.931087+00
32	827833	jorge.castro-pa@uniminuto.edu.co	0d3b180635a8154280dc90e6259e7e06add0c35cc2a498826ada7b5df605f1b9	2025-05-15 22:31:12.666+00	2025-05-15 22:01:12.784758+00
33	863617	brayhan.ortiz@uniminuto.edu.co	0e7bacdeab2664718cceaf2e3396be864bb1781f0e0d9d078941562bda5157e5	2025-05-15 22:32:47.795+00	2025-05-15 22:02:47.912218+00
34	827833	jorge.castro-pa@uniminuto.edu.co	9a7d61cf3be951b299de7d3044c4ac2f398c4aa155c33df718fcae4db6d298d7	2025-05-15 22:37:41.414+00	2025-05-15 22:07:41.530402+00
35	827833	jorge.castro-pa@uniminuto.edu.co	3500a691dbadf05fd811595cf16d971762ed03a368cabf49e9043989411b4e0f	2025-05-15 22:38:23.305+00	2025-05-15 22:08:23.455368+00
36	827833	jorge.castro-pa@uniminuto.edu.co	858c85ba6258183b831cdb2d06407eb36bffff741e4d2e2a2a7e8ee30fa5fbdb	2025-05-15 23:01:43.736+00	2025-05-15 22:31:43.319744+00
37	863617	brayhan.ortiz@uniminuto.edu.co	c78c30b528c18898696fef1846760b2a997273fb48f5a62df4f9d8f578e78cd0	2025-05-15 23:02:22.545+00	2025-05-15 22:32:22.131505+00
38	827833	jorge.castro-pa@uniminuto.edu.co	a5e8530f1c530582fd422ea3b601649e194bfd5949ed79e61dd56bbc54d360fa	2025-05-15 23:03:11.554+00	2025-05-15 22:33:11.652994+00
39	863617	brayhan.ortiz@uniminuto.edu.co	613a62b8235c2320cba65daf79452affe2aa0b15c61fd6883f6286e4627c71d1	2025-05-15 23:03:50.626+00	2025-05-15 22:33:50.726102+00
40	863617	brayhan.ortiz@uniminuto.edu.co	9c54bf9d5246225ff265290acaa5d91128db4bad97f1a21549ae0397d11a489d	2025-05-15 23:04:33.194+00	2025-05-15 22:34:33.293462+00
41	827833	jorge.castro-pa@uniminuto.edu.co	f113f2888bdbefda75c8f1968a57c85d3ca5663b38dfaa7b13c0bd4485a84ee0	2025-05-15 23:07:34.739+00	2025-05-15 22:37:34.841027+00
42	863617	brayhan.ortiz@uniminuto.edu.co	09236f0c5fd1dc639240251c18fe23263e3bc791f1ee869ceb5c78ee59a98348	2025-05-15 23:07:43.057+00	2025-05-15 22:37:43.210231+00
43	863617	brayhan.ortiz@uniminuto.edu.co	8a5d6a44d676d6abcdf169a514c99136c4713182ac83c1d73e9b7fa80a019068	2025-05-15 23:08:27.301+00	2025-05-15 22:38:26.901144+00
45	863617	brayhan.ortiz@uniminuto.edu.co	96cf0781f4c52958fd4c0224b85dccfc943903411a0308f27e9fa0a983428659	2025-05-16 08:57:42.149+00	2025-05-16 08:27:42.277463+00
46	827833	jorge.castro-pa@uniminuto.edu.co	acbc3fb171e06e26184a9c4c25e3f554df994c7712b0c971b6aa10d4f908a36e	2025-05-16 17:21:48.928+00	2025-05-16 16:51:49.16288+00
47	863617	brayhan.ortiz@uniminuto.edu.co	92c204c908ba221e5e71d3d00b8633cc40c97a8fb3670a9633c04cd0a2df2c8b	2025-05-16 17:36:46.651+00	2025-05-16 17:06:46.52984+00
\.


--
-- TOC entry 3753 (class 0 OID 17439)
-- Dependencies: 269
-- Data for Name: pregunta_encuesta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pregunta_encuesta (id, texto_pregunta, tipo_pregunta) FROM stdin;
1	¿El tutor explicó claramente los contenidos?	binaria
2	¿Te sentiste apoyado durante todo el proceso?	likert
\.


--
-- TOC entry 3755 (class 0 OID 17443)
-- Dependencies: 271
-- Data for Name: respuesta_encuesta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.respuesta_encuesta (id, encuesta_satisfaccion_id, pregunta_encuesta_id, respuesta) FROM stdin;
\.


--
-- TOC entry 3757 (class 0 OID 17449)
-- Dependencies: 273
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (id, nombre_rol) FROM stdin;
1	Estudiante
2	Docente
3	Administrativo
\.


--
-- TOC entry 3767 (class 0 OID 17922)
-- Dependencies: 294
-- Data for Name: tarea_tutoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tarea_tutoria (id, tutoria_id, descripcion, estado, asignada_por, fecha_creacion, fecha_entrega) FROM stdin;
\.


--
-- TOC entry 3759 (class 0 OID 17453)
-- Dependencies: 275
-- Data for Name: tema; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tema (id, nombre_tema) FROM stdin;
1	Casos de Uso
2	Arquitectura de Software
3	Bases de Datos
4	Inteligencia Artificial
5	Redes de Computadoras
6	Sistemas Operativos
7	Desarrollo Web
8	Ingeniería de Requerimientos
9	Algoritmos y Estructuras de Datos
10	Seguridad Informática
11	Programación Orientada a Objetos
12	Métodos Ágiles
13	Teoría de la Computación
14	Sistemas Distribuidos
15	Big Data y Análisis de Datos
16	Cloud Computing
17	Blockchain
18	Computación Cuántica
19	Internet de las Cosas (IoT)
\.


--
-- TOC entry 3760 (class 0 OID 17457)
-- Dependencies: 276
-- Data for Name: tutoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tutoria (id, estudiante_id, docente_id, fecha_hora_agendada, tema_id, hora_inicio_real, hora_fin_real, firma_docente_habilitada, firmada_estudiante) FROM stdin;
2	823802	863617	2024-03-20 14:00:00	1	\N	\N	t	t
3	826863	863617	2025-05-10 19:00:00	1	2025-05-08 03:26:02.828451	\N	t	t
4	123321	12345	2025-05-16 20:30:00	16	\N	\N	t	f
5	123321	12345	2025-05-18 12:40:00	9	\N	\N	t	f
6	123321	863617	2025-05-17 13:30:00	10	2025-05-16 17:23:44.603053	\N	t	t
9	123321	863617	2025-05-19 21:30:00	3	2025-05-19 21:45:16.729493	\N	t	t
10	123321	863619	2025-06-05 20:30:00	12	2025-05-20 01:20:08.055728	\N	t	t
11	271198	863617	2025-05-20 20:00:00	17	2025-05-21 15:21:39.391558	\N	t	t
18	271198	863617	2025-05-20 15:40:00	18	2025-05-21 15:21:41.106436	\N	t	t
17	271198	863617	2025-05-20 15:30:00	5	2025-05-21 15:21:42.609306	\N	t	t
19	271198	863617	2025-05-20 15:50:00	12	2025-05-21 15:21:44.372091	\N	t	t
15	271198	863617	2025-05-20 15:30:00	1	2025-05-21 15:21:45.878575	\N	t	t
20	271198	863617	2025-05-21 10:40:00	4	2025-05-21 15:50:31.701822	\N	t	t
21	271198	863617	2025-05-21 11:20:00	19	2025-05-21 16:22:12.080254	\N	t	t
23	271198	863617	2025-05-21 11:30:00	2	2025-05-21 16:33:46.893206	\N	t	t
24	271198	863617	2025-05-21 11:40:00	9	2025-05-21 17:03:58.45725	\N	t	t
25	271198	863617	2025-05-21 12:00:00	7	2025-05-21 17:08:25.916346	\N	t	t
\.


--
-- TOC entry 3762 (class 0 OID 17463)
-- Dependencies: 278
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id, nombre, apellido, fecha_nacimiento, correo_institucional, "contraseña", carrera_id, experticia) FROM stdin;
102456	Carlos	Pérez	\N	carlos.perez@miuniversidad.edu	contraseñaSegura123	1	\N
166678	laura	ortiz	2000-07-15	laura.ortiz@miuniversidad.edu	segura456	1	\N
863619	camila	García	2000-01-01	camila.garcia@uniminuto.edu	123456	1	\N
826863	Jorge	Castro	2002-10-23	Jorge.castro@uniminuto.edu.co	123	1	\N
823802	Andres	Triana	2002-10-23	Andres.triana@uniminuto.edu.co	1234567	1	\N
271198	Juan Carlos	Herrera Estrada	1998-11-27	Juan.Herrera@uniminuto.edu.co	271198	1	\N
981127	Alejandro	Ballesteros	1998-05-13	alejandro.ballesteros@uniminuto..edu.co	271198	1	\N
9876543	carmen	Laverde	1998-11-27	carmen.laverde@uniminuto.edu.co	98765432	1	\N
123321	paula	martinez	2004-09-11	paula.martinez@uniminuto.edu.co	123321	1	\N
908890	Jose	Angulo	2000-01-04	jose.angulo@uniminuto.edu.co	908890	1	\N
12345	Juan	Pérez	1980-05-15	juan.perez@universidad.edu	hashedpassword123	\N	Bases de datos relacionales
854286	paula	martinez	2004-09-11	paula.martinez-hu@uniminuto.edu.co	paula123	1	\N
863618	Brayhan	García	2000-05-10	brayhan.garcia@uniminuto.edu	nuevaContraseña123	1	apis backend\nprogramacion web
1998	aracely	Jurado	1998-11-26	aracely.jurado@uniminuto.edu.co	3103362262	3	\N
863617	Brayhan	Ortiz	1998-11-27	brayhan.ortiz@uniminuto.edu.co	contraseña123	1	project management\n
827833	Jorge Andres	Castro Pachon	2002-10-23	jorge.castro-pa@uniminuto.edu.co	Contraseña	1	\N
9000000	Jonny	Diaz	2024-10-23	jonny.diaz@uniminuto.edu.co	Contraseña9090	1	\N
\.


--
-- TOC entry 3763 (class 0 OID 17468)
-- Dependencies: 279
-- Data for Name: usuario_rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario_rol (usuario_id, rol_id) FROM stdin;
12345	2
863619	2
863618	2
826863	1
863617	2
823802	1
271198	1
981127	3
9876543	1
123321	1
908890	1
827833	1
854286	1
1998	1
9000000	1
\.


--
-- TOC entry 3819 (class 0 OID 0)
-- Dependencies: 291
-- Name: asistencia_tutoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asistencia_tutoria_id_seq', 14, true);


--
-- TOC entry 3820 (class 0 OID 0)
-- Dependencies: 263
-- Name: carrera_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carrera_id_seq', 1, false);


--
-- TOC entry 3821 (class 0 OID 0)
-- Dependencies: 265
-- Name: encuesta_satisfaccion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.encuesta_satisfaccion_id_seq', 1, true);


--
-- TOC entry 3822 (class 0 OID 0)
-- Dependencies: 267
-- Name: historial_cambios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_cambios_id_seq', 19, true);


--
-- TOC entry 3823 (class 0 OID 0)
-- Dependencies: 295
-- Name: horario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horario_id_seq', 14, true);


--
-- TOC entry 3824 (class 0 OID 0)
-- Dependencies: 297
-- Name: password_reset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_id_seq', 48, true);


--
-- TOC entry 3825 (class 0 OID 0)
-- Dependencies: 270
-- Name: pregunta_encuesta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pregunta_encuesta_id_seq', 1, false);


--
-- TOC entry 3826 (class 0 OID 0)
-- Dependencies: 272
-- Name: respuesta_encuesta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.respuesta_encuesta_id_seq', 1, false);


--
-- TOC entry 3827 (class 0 OID 0)
-- Dependencies: 274
-- Name: rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_seq', 1, false);


--
-- TOC entry 3828 (class 0 OID 0)
-- Dependencies: 293
-- Name: tarea_tutoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tarea_tutoria_id_seq', 1, false);


--
-- TOC entry 3829 (class 0 OID 0)
-- Dependencies: 296
-- Name: tema_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tema_id_seq', 19, true);


--
-- TOC entry 3830 (class 0 OID 0)
-- Dependencies: 277
-- Name: tutoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tutoria_id_seq', 26, true);


--
-- TOC entry 3577 (class 2606 OID 17910)
-- Name: asistencia_tutoria asistencia_tutoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencia_tutoria
    ADD CONSTRAINT asistencia_tutoria_pkey PRIMARY KEY (id);


--
-- TOC entry 3553 (class 2606 OID 17588)
-- Name: carrera carrera_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera
    ADD CONSTRAINT carrera_pkey PRIMARY KEY (id);


--
-- TOC entry 3555 (class 2606 OID 17590)
-- Name: encuesta_satisfaccion encuesta_satisfaccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta_satisfaccion
    ADD CONSTRAINT encuesta_satisfaccion_pkey PRIMARY KEY (id);


--
-- TOC entry 3557 (class 2606 OID 17592)
-- Name: historial_cambios historial_cambios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_cambios
    ADD CONSTRAINT historial_cambios_pkey PRIMARY KEY (id);


--
-- TOC entry 3559 (class 2606 OID 17955)
-- Name: horario horario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horario
    ADD CONSTRAINT horario_pkey PRIMARY KEY (id);


--
-- TOC entry 3581 (class 2606 OID 23577)
-- Name: password_reset password_reset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset
    ADD CONSTRAINT password_reset_pkey PRIMARY KEY (id);


--
-- TOC entry 3561 (class 2606 OID 17596)
-- Name: pregunta_encuesta pregunta_encuesta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pregunta_encuesta
    ADD CONSTRAINT pregunta_encuesta_pkey PRIMARY KEY (id);


--
-- TOC entry 3563 (class 2606 OID 17598)
-- Name: respuesta_encuesta respuesta_encuesta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuesta_encuesta
    ADD CONSTRAINT respuesta_encuesta_pkey PRIMARY KEY (id);


--
-- TOC entry 3565 (class 2606 OID 17600)
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id);


--
-- TOC entry 3579 (class 2606 OID 17932)
-- Name: tarea_tutoria tarea_tutoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea_tutoria
    ADD CONSTRAINT tarea_tutoria_pkey PRIMARY KEY (id);


--
-- TOC entry 3567 (class 2606 OID 17602)
-- Name: tema tema_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tema
    ADD CONSTRAINT tema_pkey PRIMARY KEY (id);


--
-- TOC entry 3569 (class 2606 OID 17604)
-- Name: tutoria tutoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutoria
    ADD CONSTRAINT tutoria_pkey PRIMARY KEY (id);


--
-- TOC entry 3571 (class 2606 OID 17606)
-- Name: usuario usuario_correo_institucional_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_institucional_key UNIQUE (correo_institucional);


--
-- TOC entry 3573 (class 2606 OID 17608)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 3575 (class 2606 OID 17610)
-- Name: usuario_rol usuario_rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_rol
    ADD CONSTRAINT usuario_rol_pkey PRIMARY KEY (usuario_id, rol_id);


--
-- TOC entry 3582 (class 2606 OID 17731)
-- Name: encuesta_satisfaccion encuesta_satisfaccion_tutoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta_satisfaccion
    ADD CONSTRAINT encuesta_satisfaccion_tutoria_id_fkey FOREIGN KEY (tutoria_id) REFERENCES public.tutoria(id) ON DELETE CASCADE;


--
-- TOC entry 3594 (class 2606 OID 17916)
-- Name: asistencia_tutoria fk_estudiante_asistencia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencia_tutoria
    ADD CONSTRAINT fk_estudiante_asistencia FOREIGN KEY (estudiante_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 3595 (class 2606 OID 17911)
-- Name: asistencia_tutoria fk_tutoria_asistencia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencia_tutoria
    ADD CONSTRAINT fk_tutoria_asistencia FOREIGN KEY (tutoria_id) REFERENCES public.tutoria(id) ON DELETE CASCADE;


--
-- TOC entry 3596 (class 2606 OID 17933)
-- Name: tarea_tutoria fk_tutoria_tarea; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea_tutoria
    ADD CONSTRAINT fk_tutoria_tarea FOREIGN KEY (tutoria_id) REFERENCES public.tutoria(id) ON DELETE CASCADE;


--
-- TOC entry 3597 (class 2606 OID 17938)
-- Name: tarea_tutoria fk_usuario_asignador; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea_tutoria
    ADD CONSTRAINT fk_usuario_asignador FOREIGN KEY (asignada_por) REFERENCES public.usuario(id);


--
-- TOC entry 3583 (class 2606 OID 19066)
-- Name: historial_cambios historial_cambios_horario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_cambios
    ADD CONSTRAINT historial_cambios_horario_id_fkey FOREIGN KEY (horario_id) REFERENCES public.horario(id) ON DELETE CASCADE;


--
-- TOC entry 3584 (class 2606 OID 17741)
-- Name: historial_cambios historial_cambios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_cambios
    ADD CONSTRAINT historial_cambios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 3585 (class 2606 OID 17746)
-- Name: horario horario_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horario
    ADD CONSTRAINT horario_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 3598 (class 2606 OID 23578)
-- Name: password_reset password_reset_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset
    ADD CONSTRAINT password_reset_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- TOC entry 3586 (class 2606 OID 17751)
-- Name: respuesta_encuesta respuesta_encuesta_encuesta_satisfaccion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuesta_encuesta
    ADD CONSTRAINT respuesta_encuesta_encuesta_satisfaccion_id_fkey FOREIGN KEY (encuesta_satisfaccion_id) REFERENCES public.encuesta_satisfaccion(id) ON DELETE CASCADE;


--
-- TOC entry 3587 (class 2606 OID 17756)
-- Name: respuesta_encuesta respuesta_encuesta_pregunta_encuesta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuesta_encuesta
    ADD CONSTRAINT respuesta_encuesta_pregunta_encuesta_id_fkey FOREIGN KEY (pregunta_encuesta_id) REFERENCES public.pregunta_encuesta(id) ON DELETE CASCADE;


--
-- TOC entry 3588 (class 2606 OID 17761)
-- Name: tutoria tutoria_docente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutoria
    ADD CONSTRAINT tutoria_docente_id_fkey FOREIGN KEY (docente_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 3589 (class 2606 OID 17766)
-- Name: tutoria tutoria_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutoria
    ADD CONSTRAINT tutoria_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 3590 (class 2606 OID 17771)
-- Name: tutoria tutoria_tema_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutoria
    ADD CONSTRAINT tutoria_tema_id_fkey FOREIGN KEY (tema_id) REFERENCES public.tema(id);


--
-- TOC entry 3591 (class 2606 OID 17776)
-- Name: usuario usuario_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carrera(id) ON DELETE SET NULL;


--
-- TOC entry 3592 (class 2606 OID 17781)
-- Name: usuario_rol usuario_rol_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_rol
    ADD CONSTRAINT usuario_rol_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.rol(id) ON DELETE CASCADE;


--
-- TOC entry 3593 (class 2606 OID 17786)
-- Name: usuario_rol usuario_rol_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_rol
    ADD CONSTRAINT usuario_rol_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 3778 (class 0 OID 0)
-- Dependencies: 20
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 3779 (class 0 OID 0)
-- Dependencies: 292
-- Name: TABLE asistencia_tutoria; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.asistencia_tutoria TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.asistencia_tutoria TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.asistencia_tutoria TO service_role;


--
-- TOC entry 3781 (class 0 OID 0)
-- Dependencies: 291
-- Name: SEQUENCE asistencia_tutoria_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.asistencia_tutoria_id_seq TO anon;
GRANT ALL ON SEQUENCE public.asistencia_tutoria_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.asistencia_tutoria_id_seq TO service_role;


--
-- TOC entry 3782 (class 0 OID 0)
-- Dependencies: 262
-- Name: TABLE carrera; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.carrera TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.carrera TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.carrera TO service_role;


--
-- TOC entry 3784 (class 0 OID 0)
-- Dependencies: 263
-- Name: SEQUENCE carrera_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.carrera_id_seq TO anon;
GRANT ALL ON SEQUENCE public.carrera_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.carrera_id_seq TO service_role;


--
-- TOC entry 3785 (class 0 OID 0)
-- Dependencies: 264
-- Name: TABLE encuesta_satisfaccion; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.encuesta_satisfaccion TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.encuesta_satisfaccion TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.encuesta_satisfaccion TO service_role;


--
-- TOC entry 3787 (class 0 OID 0)
-- Dependencies: 265
-- Name: SEQUENCE encuesta_satisfaccion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.encuesta_satisfaccion_id_seq TO anon;
GRANT ALL ON SEQUENCE public.encuesta_satisfaccion_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.encuesta_satisfaccion_id_seq TO service_role;


--
-- TOC entry 3788 (class 0 OID 0)
-- Dependencies: 266
-- Name: TABLE historial_cambios; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.historial_cambios TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.historial_cambios TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.historial_cambios TO service_role;


--
-- TOC entry 3790 (class 0 OID 0)
-- Dependencies: 267
-- Name: SEQUENCE historial_cambios_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.historial_cambios_id_seq TO anon;
GRANT ALL ON SEQUENCE public.historial_cambios_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.historial_cambios_id_seq TO service_role;


--
-- TOC entry 3791 (class 0 OID 0)
-- Dependencies: 268
-- Name: TABLE horario; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.horario TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.horario TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.horario TO service_role;


--
-- TOC entry 3793 (class 0 OID 0)
-- Dependencies: 295
-- Name: SEQUENCE horario_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.horario_id_seq TO anon;
GRANT ALL ON SEQUENCE public.horario_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.horario_id_seq TO service_role;


--
-- TOC entry 3794 (class 0 OID 0)
-- Dependencies: 298
-- Name: TABLE password_reset; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.password_reset TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.password_reset TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.password_reset TO service_role;


--
-- TOC entry 3796 (class 0 OID 0)
-- Dependencies: 297
-- Name: SEQUENCE password_reset_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.password_reset_id_seq TO anon;
GRANT ALL ON SEQUENCE public.password_reset_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.password_reset_id_seq TO service_role;


--
-- TOC entry 3797 (class 0 OID 0)
-- Dependencies: 269
-- Name: TABLE pregunta_encuesta; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.pregunta_encuesta TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.pregunta_encuesta TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.pregunta_encuesta TO service_role;


--
-- TOC entry 3799 (class 0 OID 0)
-- Dependencies: 270
-- Name: SEQUENCE pregunta_encuesta_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.pregunta_encuesta_id_seq TO anon;
GRANT ALL ON SEQUENCE public.pregunta_encuesta_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.pregunta_encuesta_id_seq TO service_role;


--
-- TOC entry 3800 (class 0 OID 0)
-- Dependencies: 271
-- Name: TABLE respuesta_encuesta; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.respuesta_encuesta TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.respuesta_encuesta TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.respuesta_encuesta TO service_role;


--
-- TOC entry 3802 (class 0 OID 0)
-- Dependencies: 272
-- Name: SEQUENCE respuesta_encuesta_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.respuesta_encuesta_id_seq TO anon;
GRANT ALL ON SEQUENCE public.respuesta_encuesta_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.respuesta_encuesta_id_seq TO service_role;


--
-- TOC entry 3803 (class 0 OID 0)
-- Dependencies: 273
-- Name: TABLE rol; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.rol TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.rol TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.rol TO service_role;


--
-- TOC entry 3805 (class 0 OID 0)
-- Dependencies: 274
-- Name: SEQUENCE rol_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.rol_id_seq TO anon;
GRANT ALL ON SEQUENCE public.rol_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.rol_id_seq TO service_role;


--
-- TOC entry 3806 (class 0 OID 0)
-- Dependencies: 294
-- Name: TABLE tarea_tutoria; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tarea_tutoria TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tarea_tutoria TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tarea_tutoria TO service_role;


--
-- TOC entry 3808 (class 0 OID 0)
-- Dependencies: 293
-- Name: SEQUENCE tarea_tutoria_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tarea_tutoria_id_seq TO anon;
GRANT ALL ON SEQUENCE public.tarea_tutoria_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.tarea_tutoria_id_seq TO service_role;


--
-- TOC entry 3809 (class 0 OID 0)
-- Dependencies: 275
-- Name: TABLE tema; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tema TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tema TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tema TO service_role;


--
-- TOC entry 3811 (class 0 OID 0)
-- Dependencies: 296
-- Name: SEQUENCE tema_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tema_id_seq TO anon;
GRANT ALL ON SEQUENCE public.tema_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.tema_id_seq TO service_role;


--
-- TOC entry 3812 (class 0 OID 0)
-- Dependencies: 276
-- Name: TABLE tutoria; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tutoria TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tutoria TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tutoria TO service_role;


--
-- TOC entry 3814 (class 0 OID 0)
-- Dependencies: 277
-- Name: SEQUENCE tutoria_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tutoria_id_seq TO anon;
GRANT ALL ON SEQUENCE public.tutoria_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.tutoria_id_seq TO service_role;


--
-- TOC entry 3816 (class 0 OID 0)
-- Dependencies: 278
-- Name: TABLE usuario; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.usuario TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.usuario TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.usuario TO service_role;


--
-- TOC entry 3817 (class 0 OID 0)
-- Dependencies: 279
-- Name: TABLE usuario_rol; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.usuario_rol TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.usuario_rol TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.usuario_rol TO service_role;


--
-- TOC entry 3818 (class 0 OID 0)
-- Dependencies: 280
-- Name: TABLE vista_horarios_docentes; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.vista_horarios_docentes TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.vista_horarios_docentes TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.vista_horarios_docentes TO service_role;


--
-- TOC entry 2344 (class 826 OID 17830)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2347 (class 826 OID 17831)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2349 (class 826 OID 17832)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2350 (class 826 OID 17833)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2351 (class 826 OID 17834)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- TOC entry 2352 (class 826 OID 17835)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


-- Completed on 2025-05-21 21:51:49

--
-- PostgreSQL database dump complete
--

