--
-- PostgreSQL database dump
--

-- Dumped from database version 11.22 (Debian 11.22-0+deb10u2)
-- Dumped by pg_dump version 11.22 (Debian 11.22-0+deb10u2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: role_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_type AS ENUM (
    'Apprenant',
    'Formateur',
    'Administrateur'
);


ALTER TYPE public.role_type OWNER TO postgres;

--
-- Name: ajout_presence_apprenant(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ajout_presence_apprenant() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Pour chaque séance de la formation de l'apprenant, créer une présence si elle n'existe pas
    INSERT INTO presence (idseance, idapprenant, est_present)
    SELECT s.idseance, NEW.idapprenant, false
    FROM seance s
    WHERE s.idformation = NEW.idformation
      AND NOT EXISTS (
          SELECT 1
          FROM presence p
          WHERE p.idseance = s.idseance
            AND p.idapprenant = NEW.idapprenant
      );

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.ajout_presence_apprenant() OWNER TO postgres;

--
-- Name: ajout_presence_auto(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ajout_presence_auto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Insérer dans presence pour tous les apprenants de la formation associée à la séance
    INSERT INTO presence (idseance, idapprenant, est_present)
    SELECT NEW.idseance, a.idapprenant, false
    FROM apprenant a
    WHERE a.idformation = NEW.idformation;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.ajout_presence_auto() OWNER TO postgres;

--
-- Name: ajout_presence_auto_sans_doublon(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ajout_presence_auto_sans_doublon() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Insérer uniquement si la présence pour cette séance n'existe pas encore
    INSERT INTO presence (idseance, idapprenant, est_present)
    SELECT NEW.idseance, a.idapprenant, false
    FROM apprenant a
    WHERE a.idformation = NEW.idformation
      AND NOT EXISTS (
          SELECT 1
          FROM presence p
          WHERE p.idseance = NEW.idseance
            AND p.idapprenant = a.idapprenant
      );

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.ajout_presence_auto_sans_doublon() OWNER TO postgres;

--
-- Name: generer_presence_par_defaut(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generer_presence_par_defaut() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO presence (idseance, idapprenant, est_present)
  SELECT NEW.idseance, i.idutilisateur, false
  FROM inscription i
  WHERE i.idformation = NEW.idformation
    AND i.statut = 'confirmé';
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.generer_presence_par_defaut() OWNER TO postgres;

--
-- Name: maj_etat_accompagnement(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.maj_etat_accompagnement() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.datefin < CURRENT_DATE THEN
    NEW.etat := 'terminé';
  ELSE
    NEW.etat := 'en cours';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.maj_etat_accompagnement() OWNER TO postgres;

--
-- Name: maj_etat_formation(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.maj_etat_formation() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.datefin < CURRENT_DATE THEN
        NEW.etat := 'Terminée';
    ELSE
        NEW.etat := 'Disponible';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.maj_etat_formation() OWNER TO postgres;

--
-- Name: maj_etat_suivi_accompagnement(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.maj_etat_suivi_accompagnement() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO suivi_accompagnement(idaccompagnement, etat_suivi, date_suivi)
  VALUES (NEW.idaccompagnement, NEW.etat, CURRENT_DATE);
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.maj_etat_suivi_accompagnement() OWNER TO postgres;

--
-- Name: maj_updated_at_accompagnement(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.maj_updated_at_accompagnement() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.maj_updated_at_accompagnement() OWNER TO postgres;

--
-- Name: maj_updated_at_suivi(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.maj_updated_at_suivi() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.maj_updated_at_suivi() OWNER TO postgres;

--
-- Name: maj_updated_at_suivi_accompagnement(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.maj_updated_at_suivi_accompagnement() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.maj_updated_at_suivi_accompagnement() OWNER TO postgres;

--
-- Name: sync_etat_suivi_accompagnement(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sync_etat_suivi_accompagnement() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE suivi_accompagnement
  SET etat_suivi = NEW.etat,
      updated_at = CURRENT_TIMESTAMP
  WHERE idaccompagnement = NEW.idaccompagnement;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.sync_etat_suivi_accompagnement() OWNER TO postgres;

--
-- Name: verif_accompagnement_non_termine(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verif_accompagnement_non_termine() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  etat_accomp VARCHAR(20);
BEGIN
  SELECT etat INTO etat_accomp
  FROM accompagnement
  WHERE idaccompagnement = NEW.idaccompagnement;

  
  IF etat_accomp = 'terminé' THEN
    RAISE EXCEPTION '❌ Impossible d’ajouter ou modifier un suivi : l’accompagnement (%) est déjà terminé.', NEW.idaccompagnement;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.verif_accompagnement_non_termine() OWNER TO postgres;

--
-- Name: verif_dates_accompagnement(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verif_dates_accompagnement() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  debut_form DATE;
  fin_form DATE;
BEGIN
  SELECT datedebut, datefin INTO debut_form, fin_form
  FROM formation
  WHERE idformation = NEW.idformation;

  IF NEW.datedebut < debut_form THEN
    RAISE EXCEPTION '❌ L’accompagnement commence avant le début de la formation (%).', debut_form;
  END IF;

  IF NEW.datefin < NEW.datedebut THEN
    RAISE EXCEPTION '❌ La date de fin est antérieure à la date de début.';
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.verif_dates_accompagnement() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: accompagnement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accompagnement (
    idaccompagnement integer NOT NULL,
    idapprenant integer,
    idformateur integer,
    type character varying(20) NOT NULL,
    objectifs text,
    datedebut date NOT NULL,
    datefin date,
    idformation integer,
    etat character varying(20) DEFAULT 'En cours'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.accompagnement OWNER TO postgres;

--
-- Name: accompagnement_idaccompagnement_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accompagnement_idaccompagnement_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accompagnement_idaccompagnement_seq OWNER TO postgres;

--
-- Name: accompagnement_idaccompagnement_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accompagnement_idaccompagnement_seq OWNED BY public.accompagnement.idaccompagnement;


--
-- Name: administrateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrateur (
    idutilisateur integer NOT NULL,
    poste character varying(15) NOT NULL
);


ALTER TABLE public.administrateur OWNER TO postgres;

--
-- Name: apprenant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.apprenant (
    idutilisateur integer NOT NULL,
    filiere character varying(15) NOT NULL,
    niveau character varying(15) NOT NULL
);


ALTER TABLE public.apprenant OWNER TO postgres;

--
-- Name: evaluation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluation (
    idevaluation integer NOT NULL,
    idapprenant integer,
    idformation integer,
    idformateur integer,
    note numeric(5,2),
    commentaire text,
    dateevaluation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT evaluation_note_check CHECK (((note >= (0)::numeric) AND (note <= (20)::numeric)))
);


ALTER TABLE public.evaluation OWNER TO postgres;

--
-- Name: evaluation_idevaluation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluation_idevaluation_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.evaluation_idevaluation_seq OWNER TO postgres;

--
-- Name: evaluation_idevaluation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluation_idevaluation_seq OWNED BY public.evaluation.idevaluation;


--
-- Name: formateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formateur (
    idutilisateur integer NOT NULL,
    specialite character varying(15) NOT NULL
);


ALTER TABLE public.formateur OWNER TO postgres;

--
-- Name: formation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formation (
    idformation integer NOT NULL,
    titre character varying(20) NOT NULL,
    description text,
    duree interval,
    datedebut date,
    datefin date,
    etat character varying(20) DEFAULT 'Disponible'::character varying,
    CONSTRAINT chk_etat CHECK (((etat)::text = ANY ((ARRAY['Disponible'::character varying, 'Terminée'::character varying])::text[])))
);


ALTER TABLE public.formation OWNER TO postgres;

--
-- Name: formation_formateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formation_formateur (
    idformation integer NOT NULL,
    idformateur integer NOT NULL
);


ALTER TABLE public.formation_formateur OWNER TO postgres;

--
-- Name: formation_idformation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.formation_idformation_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.formation_idformation_seq OWNER TO postgres;

--
-- Name: formation_idformation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.formation_idformation_seq OWNED BY public.formation.idformation;


--
-- Name: inscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inscription (
    idinscription integer NOT NULL,
    idutilisateur integer,
    idformation integer,
    dateinscription timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'En attente'::character varying
);


ALTER TABLE public.inscription OWNER TO postgres;

--
-- Name: inscription_idinscription_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inscription_idinscription_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inscription_idinscription_seq OWNER TO postgres;

--
-- Name: inscription_idinscription_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inscription_idinscription_seq OWNED BY public.inscription.idinscription;


--
-- Name: presence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.presence (
    idpresence integer NOT NULL,
    idseance integer NOT NULL,
    idapprenant integer NOT NULL,
    est_present boolean DEFAULT false
);


ALTER TABLE public.presence OWNER TO postgres;

--
-- Name: presence_idpresence_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.presence_idpresence_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.presence_idpresence_seq OWNER TO postgres;

--
-- Name: presence_idpresence_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.presence_idpresence_seq OWNED BY public.presence.idpresence;


--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    idrole integer NOT NULL,
    nomrole character varying(15) NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_idrole_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_idrole_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_idrole_seq OWNER TO postgres;

--
-- Name: role_idrole_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_idrole_seq OWNED BY public.role.idrole;


--
-- Name: seance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seance (
    idseance integer NOT NULL,
    idformation integer NOT NULL,
    date_seance date NOT NULL
);


ALTER TABLE public.seance OWNER TO postgres;

--
-- Name: seance_idseance_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seance_idseance_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.seance_idseance_seq OWNER TO postgres;

--
-- Name: seance_idseance_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seance_idseance_seq OWNED BY public.seance.idseance;


--
-- Name: suivi_accompagnement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suivi_accompagnement (
    idsuivi integer NOT NULL,
    idaccompagnement integer,
    date_suivi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    commentaire text,
    progression numeric(5,2),
    remarque_formateur text,
    created_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.suivi_accompagnement OWNER TO postgres;

--
-- Name: suivi_accompagnement_idsuivi_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suivi_accompagnement_idsuivi_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.suivi_accompagnement_idsuivi_seq OWNER TO postgres;

--
-- Name: suivi_accompagnement_idsuivi_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suivi_accompagnement_idsuivi_seq OWNED BY public.suivi_accompagnement.idsuivi;


--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    idutilisateur integer NOT NULL,
    nom character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    motdepasse character varying(255) NOT NULL,
    idrole integer,
    datecreation timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- Name: utilisateur_idutilisateur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateur_idutilisateur_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilisateur_idutilisateur_seq OWNER TO postgres;

--
-- Name: utilisateur_idutilisateur_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateur_idutilisateur_seq OWNED BY public.utilisateur.idutilisateur;


--
-- Name: accompagnement idaccompagnement; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accompagnement ALTER COLUMN idaccompagnement SET DEFAULT nextval('public.accompagnement_idaccompagnement_seq'::regclass);


--
-- Name: evaluation idevaluation; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation ALTER COLUMN idevaluation SET DEFAULT nextval('public.evaluation_idevaluation_seq'::regclass);


--
-- Name: formation idformation; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formation ALTER COLUMN idformation SET DEFAULT nextval('public.formation_idformation_seq'::regclass);


--
-- Name: inscription idinscription; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription ALTER COLUMN idinscription SET DEFAULT nextval('public.inscription_idinscription_seq'::regclass);


--
-- Name: presence idpresence; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence ALTER COLUMN idpresence SET DEFAULT nextval('public.presence_idpresence_seq'::regclass);


--
-- Name: role idrole; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN idrole SET DEFAULT nextval('public.role_idrole_seq'::regclass);


--
-- Name: seance idseance; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seance ALTER COLUMN idseance SET DEFAULT nextval('public.seance_idseance_seq'::regclass);


--
-- Name: suivi_accompagnement idsuivi; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suivi_accompagnement ALTER COLUMN idsuivi SET DEFAULT nextval('public.suivi_accompagnement_idsuivi_seq'::regclass);


--
-- Name: utilisateur idutilisateur; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN idutilisateur SET DEFAULT nextval('public.utilisateur_idutilisateur_seq'::regclass);


--
-- Data for Name: accompagnement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accompagnement (idaccompagnement, idapprenant, idformateur, type, objectifs, datedebut, datefin, idformation, etat, created_at, updated_at) FROM stdin;
1	1	2	coaching	pousser les etudiant	2025-11-12	2025-12-12	1	en cours	2025-11-07 21:42:16.853139	2025-11-07 21:42:16.853139
\.


--
-- Data for Name: administrateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrateur (idutilisateur, poste) FROM stdin;
3	coordo
\.


--
-- Data for Name: apprenant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.apprenant (idutilisateur, filiere, niveau) FROM stdin;
6	gestion	M1
1	economie	M1
\.


--
-- Data for Name: evaluation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluation (idevaluation, idapprenant, idformation, idformateur, note, commentaire, dateevaluation) FROM stdin;
\.


--
-- Data for Name: formateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formateur (idutilisateur, specialite) FROM stdin;
2	RH
\.


--
-- Data for Name: formation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formation (idformation, titre, description, duree, datedebut, datefin, etat) FROM stdin;
2	PostgreSQL	Découverte des bases de données relationnelles	00:00:05	2025-11-10	2025-11-15	Disponible
3	JS	initiation aux JS	00:00:05	2025-11-10	2025-11-15	Disponible
4	python	manipulation des fichiers	00:00:02	2025-11-06	2025-11-07	Disponible
5	c#	initiation	00:00:02	2025-11-08	2025-11-10	Disponible
6	SQL	apprendre la requete	00:00:02	2025-11-12	2025-11-13	Disponible
1	pascal	debuter en pascal	00:00:02	2025-11-11	2025-11-12	Disponible
\.


--
-- Data for Name: formation_formateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formation_formateur (idformation, idformateur) FROM stdin;
1	2
3	2
4	2
5	2
6	2
\.


--
-- Data for Name: inscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inscription (idinscription, idutilisateur, idformation, dateinscription, statut) FROM stdin;
4	6	2	2025-11-03 19:50:44.461161	confirmé
3	1	2	2025-10-31 20:25:23.069554	refusé
2	1	3	2025-10-31 20:24:51.9736	confirmé
1	1	1	2025-10-31 17:48:29.696748	confirmé
5	1	5	2025-11-06 00:00:00	confirmé
7	1	6	2025-11-11 00:42:46.201311	refusé
6	1	4	2025-11-10 23:38:04.557629	refusé
\.


--
-- Data for Name: presence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.presence (idpresence, idseance, idapprenant, est_present) FROM stdin;
1	3	1	t
2	17	1	f
3	17	1	f
4	18	1	f
5	18	1	f
6	19	1	f
7	19	1	f
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (idrole, nomrole) FROM stdin;
1	Apprenant
2	Formateur
3	Administrateur
\.


--
-- Data for Name: seance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seance (idseance, idformation, date_seance) FROM stdin;
3	1	2025-11-01
5	4	2025-11-06
6	4	2025-11-06
7	4	2025-11-06
8	3	2025-11-01
16	5	2025-11-08
17	5	2025-11-08
18	5	2025-11-09
19	3	2025-11-12
20	4	2025-11-08
\.


--
-- Data for Name: suivi_accompagnement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suivi_accompagnement (idsuivi, idaccompagnement, date_suivi, commentaire, progression, remarque_formateur, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur (idutilisateur, nom, email, motdepasse, idrole, datecreation) FROM stdin;
2	Jean Jacque	jean@gmail.com	$2b$10$kroaOcaKX76TLupXV56m1OYC3wcnwqhZA629J5QMQAlzMOvvO8nqq	2	2025-10-25 21:10:00.954682
3	Francia	frnacia@gmail.com	$2b$10$ciQCL5EPClmSdf6e3z.t5.bflVWkwMge8DqcvCoo.gWX7KpkcEZ12	3	2025-10-25 21:11:26.311052
6	tojo allonzo	tojo@gmail.com	$2b$10$5PgkBG0GLuMhO6SESGki/OPpipGeR2vFcVv45elufLVvdHCnM7.gW	1	2025-11-03 19:48:50.430198
1	Erhard Bouboul	erhard@gmail.com	$2b$10$Xe0ANQmB9rs7pB9L5hSbeOYQTYu2gCXLz8GRg.cMQ.VGBWNis.dve	1	2025-10-25 21:08:45.417041
\.


--
-- Name: accompagnement_idaccompagnement_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accompagnement_idaccompagnement_seq', 1, true);


--
-- Name: evaluation_idevaluation_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluation_idevaluation_seq', 1, false);


--
-- Name: formation_idformation_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formation_idformation_seq', 6, true);


--
-- Name: inscription_idinscription_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inscription_idinscription_seq', 7, true);


--
-- Name: presence_idpresence_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.presence_idpresence_seq', 7, true);


--
-- Name: role_idrole_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_idrole_seq', 14, true);


--
-- Name: seance_idseance_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seance_idseance_seq', 20, true);


--
-- Name: suivi_accompagnement_idsuivi_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suivi_accompagnement_idsuivi_seq', 1, false);


--
-- Name: utilisateur_idutilisateur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateur_idutilisateur_seq', 6, true);


--
-- Name: accompagnement accompagnement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accompagnement
    ADD CONSTRAINT accompagnement_pkey PRIMARY KEY (idaccompagnement);


--
-- Name: apprenant apprenant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apprenant
    ADD CONSTRAINT apprenant_pkey PRIMARY KEY (idutilisateur);


--
-- Name: evaluation evaluation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation
    ADD CONSTRAINT evaluation_pkey PRIMARY KEY (idevaluation);


--
-- Name: administrateur fadministrateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrateur
    ADD CONSTRAINT fadministrateur_pkey PRIMARY KEY (idutilisateur);


--
-- Name: formateur formateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formateur
    ADD CONSTRAINT formateur_pkey PRIMARY KEY (idutilisateur);


--
-- Name: formation_formateur formation_formateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formation_formateur
    ADD CONSTRAINT formation_formateur_pkey PRIMARY KEY (idformation, idformateur);


--
-- Name: formation formation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formation
    ADD CONSTRAINT formation_pkey PRIMARY KEY (idformation);


--
-- Name: inscription inscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_pkey PRIMARY KEY (idinscription);


--
-- Name: presence presence_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_pkey PRIMARY KEY (idpresence);


--
-- Name: role role_nomrole_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_nomrole_key UNIQUE (nomrole);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (idrole);


--
-- Name: seance seance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seance
    ADD CONSTRAINT seance_pkey PRIMARY KEY (idseance);


--
-- Name: suivi_accompagnement suivi_accompagnement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suivi_accompagnement
    ADD CONSTRAINT suivi_accompagnement_pkey PRIMARY KEY (idsuivi);


--
-- Name: utilisateur utilisateur_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_email_key UNIQUE (email);


--
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (idutilisateur);


--
-- Name: apprenant trig_ajout_presence_apprenant; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trig_ajout_presence_apprenant AFTER INSERT ON public.apprenant FOR EACH ROW EXECUTE PROCEDURE public.ajout_presence_apprenant();


--
-- Name: accompagnement trig_etat_accompagnement; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trig_etat_accompagnement BEFORE INSERT OR UPDATE ON public.accompagnement FOR EACH ROW EXECUTE PROCEDURE public.maj_etat_accompagnement();


--
-- Name: suivi_accompagnement trig_etat_suivi_accompagnement; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trig_etat_suivi_accompagnement BEFORE INSERT OR UPDATE ON public.suivi_accompagnement FOR EACH ROW EXECUTE PROCEDURE public.maj_etat_suivi_accompagnement();


--
-- Name: seance trig_generer_presence; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trig_generer_presence AFTER INSERT ON public.seance FOR EACH ROW EXECUTE PROCEDURE public.generer_presence_par_defaut();


--
-- Name: accompagnement trig_init_suivi_accompagnement; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trig_init_suivi_accompagnement AFTER INSERT ON public.accompagnement FOR EACH ROW EXECUTE PROCEDURE public.maj_etat_suivi_accompagnement();


--
-- Name: seance trig_presence_par_defaut; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trig_presence_par_defaut AFTER INSERT ON public.seance FOR EACH ROW EXECUTE PROCEDURE public.generer_presence_par_defaut();


--
-- Name: accompagnement trig_update_suivi; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trig_update_suivi AFTER UPDATE OF etat ON public.accompagnement FOR EACH ROW EXECUTE PROCEDURE public.sync_etat_suivi_accompagnement();


--
-- Name: accompagnement trig_updated_at_accompagnement; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trig_updated_at_accompagnement BEFORE UPDATE ON public.accompagnement FOR EACH ROW EXECUTE PROCEDURE public.maj_updated_at_accompagnement();


--
-- Name: suivi_accompagnement trig_updated_at_suivi; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trig_updated_at_suivi BEFORE UPDATE ON public.suivi_accompagnement FOR EACH ROW EXECUTE PROCEDURE public.maj_updated_at_suivi();


--
-- Name: suivi_accompagnement trig_updated_at_suivi_accompagnement; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trig_updated_at_suivi_accompagnement BEFORE UPDATE ON public.suivi_accompagnement FOR EACH ROW EXECUTE PROCEDURE public.maj_updated_at_suivi_accompagnement();


--
-- Name: suivi_accompagnement trig_verif_accompagnement_non_termine; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trig_verif_accompagnement_non_termine BEFORE INSERT OR UPDATE ON public.suivi_accompagnement FOR EACH ROW EXECUTE PROCEDURE public.verif_accompagnement_non_termine();


--
-- Name: formation trigger_maj_etat; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_maj_etat BEFORE INSERT OR UPDATE ON public.formation FOR EACH ROW EXECUTE PROCEDURE public.maj_etat_formation();


--
-- Name: accompagnement accompagnement_idapprenant_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accompagnement
    ADD CONSTRAINT accompagnement_idapprenant_fkey FOREIGN KEY (idapprenant) REFERENCES public.utilisateur(idutilisateur) ON DELETE CASCADE;


--
-- Name: accompagnement accompagnement_idformateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accompagnement
    ADD CONSTRAINT accompagnement_idformateur_fkey FOREIGN KEY (idformateur) REFERENCES public.utilisateur(idutilisateur) ON DELETE SET NULL;


--
-- Name: apprenant apprenant_idutilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apprenant
    ADD CONSTRAINT apprenant_idutilisateur_fkey FOREIGN KEY (idutilisateur) REFERENCES public.utilisateur(idutilisateur) ON DELETE CASCADE;


--
-- Name: evaluation evaluation_idapprenant_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation
    ADD CONSTRAINT evaluation_idapprenant_fkey FOREIGN KEY (idapprenant) REFERENCES public.utilisateur(idutilisateur) ON DELETE CASCADE;


--
-- Name: evaluation evaluation_idformateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation
    ADD CONSTRAINT evaluation_idformateur_fkey FOREIGN KEY (idformateur) REFERENCES public.utilisateur(idutilisateur) ON DELETE SET NULL;


--
-- Name: evaluation evaluation_idformation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation
    ADD CONSTRAINT evaluation_idformation_fkey FOREIGN KEY (idformation) REFERENCES public.formation(idformation) ON DELETE CASCADE;


--
-- Name: administrateur fadministrateur_idutilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrateur
    ADD CONSTRAINT fadministrateur_idutilisateur_fkey FOREIGN KEY (idutilisateur) REFERENCES public.utilisateur(idutilisateur) ON DELETE CASCADE;


--
-- Name: accompagnement fk_accompagnement_formation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accompagnement
    ADD CONSTRAINT fk_accompagnement_formation FOREIGN KEY (idformation) REFERENCES public.formation(idformation);


--
-- Name: formateur formateur_idutilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formateur
    ADD CONSTRAINT formateur_idutilisateur_fkey FOREIGN KEY (idutilisateur) REFERENCES public.utilisateur(idutilisateur) ON DELETE CASCADE;


--
-- Name: formation_formateur formation_formateur_idformateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formation_formateur
    ADD CONSTRAINT formation_formateur_idformateur_fkey FOREIGN KEY (idformateur) REFERENCES public.formateur(idutilisateur) ON DELETE CASCADE;


--
-- Name: formation_formateur formation_formateur_idformation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formation_formateur
    ADD CONSTRAINT formation_formateur_idformation_fkey FOREIGN KEY (idformation) REFERENCES public.formation(idformation) ON DELETE CASCADE;


--
-- Name: inscription inscription_idformation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_idformation_fkey FOREIGN KEY (idformation) REFERENCES public.formation(idformation) ON DELETE CASCADE;


--
-- Name: inscription inscription_idutilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscription
    ADD CONSTRAINT inscription_idutilisateur_fkey FOREIGN KEY (idutilisateur) REFERENCES public.utilisateur(idutilisateur) ON DELETE CASCADE;


--
-- Name: presence presence_idapprenant_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_idapprenant_fkey FOREIGN KEY (idapprenant) REFERENCES public.apprenant(idutilisateur);


--
-- Name: presence presence_idseance_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presence
    ADD CONSTRAINT presence_idseance_fkey FOREIGN KEY (idseance) REFERENCES public.seance(idseance);


--
-- Name: seance seance_idformation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seance
    ADD CONSTRAINT seance_idformation_fkey FOREIGN KEY (idformation) REFERENCES public.formation(idformation);


--
-- Name: suivi_accompagnement suivi_accompagnement_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suivi_accompagnement
    ADD CONSTRAINT suivi_accompagnement_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.formateur(idutilisateur);


--
-- Name: suivi_accompagnement suivi_accompagnement_idaccompagnement_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suivi_accompagnement
    ADD CONSTRAINT suivi_accompagnement_idaccompagnement_fkey FOREIGN KEY (idaccompagnement) REFERENCES public.accompagnement(idaccompagnement) ON DELETE CASCADE;


--
-- Name: utilisateur utilisateur_idrole_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_idrole_fkey FOREIGN KEY (idrole) REFERENCES public.role(idrole);


--
-- PostgreSQL database dump complete
--

