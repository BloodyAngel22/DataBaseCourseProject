--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: get_number_excellent_students(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_number_excellent_students() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    excellent_count INTEGER;
BEGIN
    SELECT COUNT(m.mark) INTO excellent_count
    FROM mark m
    WHERE m.mark = 'отлично';

    RETURN excellent_count;
END;
$$;


ALTER FUNCTION public.get_number_excellent_students() OWNER TO postgres;

--
-- Name: get_students_and_groups_with_good_marks(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_students_and_groups_with_good_marks() RETURNS TABLE("Оценка" character varying, "Студент" text, "Группа" character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
	RETURN QUERY
  SELECT m.mark, (s.surname || ' ' || s.firstname || ' ' || s.patronymic) as Студент, s.group_name from mark m
  join student s on m.student_id = s.id
  where mark in ('отлично', 'хорошо');
  
  Raise NOTICE 'успешно';
END;
$$;


ALTER FUNCTION public.get_students_and_groups_with_good_marks() OWNER TO postgres;

--
-- Name: hello_world(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.hello_world() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    RAISE NOTICE 'Hello, World!';
END;
$$;


ALTER FUNCTION public.hello_world() OWNER TO postgres;

--
-- Name: hello_world2(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.hello_world2() RETURNS text
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN 'Hello, World!';
END;
$$;


ALTER FUNCTION public.hello_world2() OWNER TO postgres;

--
-- Name: insert_new_cabinet(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insert_new_cabinet(name character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO cabinet (room_name) VALUES (name);
    RAISE NOTICE 'Успешно';
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'Такой ключ уже существует.';
    WHEN others THEN 
        RAISE NOTICE 'Произошла ошибка: %', SQLERRM;
END;
$$;


ALTER FUNCTION public.insert_new_cabinet(name character varying) OWNER TO postgres;

--
-- Name: insert_student(character varying, character varying, character varying, integer, date, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insert_student(firstname character varying, surname character varying, patronymic character varying, course integer, birth_date date, group_name character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    current_count INT;
BEGIN
    BEGIN
        SELECT COUNT(*) INTO current_count 
        FROM student s
        WHERE s.group_name = group_name;

        IF current_count >= 3 THEN
            RAISE EXCEPTION 'Нельзя добавить студента: группа % уже содержит максимальное количество студентов.', group_name;
        END IF;

        INSERT INTO student (firstname, surname, patronymic, course, birthdate, group_name) 
        VALUES (firstname, surname, patronymic, course, birth_date, group_name);
        
        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END;
END;
$$;


ALTER FUNCTION public.insert_student(firstname character varying, surname character varying, patronymic character varying, course integer, birth_date date, group_name character varying) OWNER TO postgres;

--
-- Name: insert_student_2(character varying, character varying, character varying, integer, date, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insert_student_2(firstname_d character varying, surname_d character varying, patronymic_d character varying, course_d integer, birth_date_d date, group_name_d character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    current_count INT;
BEGIN
    SELECT COUNT(*) INTO current_count 
    FROM student s
    WHERE s.group_name = group_name_d;

    IF current_count >= 3 THEN
        RAISE EXCEPTION 'Нельзя добавить студента: группа % уже содержит максимальное количество студентов.', group_name_d;
    END IF;

    INSERT INTO student (firstname, surname, patronymic, course, birthdate, group_name) 
    VALUES (firstname_d, surname_d, patronymic_d, course_d, birth_date_d, group_name_d);
    
END;
$$;


ALTER FUNCTION public.insert_student_2(firstname_d character varying, surname_d character varying, patronymic_d character varying, course_d integer, birth_date_d date, group_name_d character varying) OWNER TO postgres;

--
-- Name: log_new_discipline(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_new_discipline() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
	insert into discipline_log (discipline, created_at)
  values (NEW.name, NOW());
  return NEW;
 end;
 $$;


ALTER FUNCTION public.log_new_discipline() OWNER TO postgres;

--
-- Name: pow(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.pow(a integer, b integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    counter INT := 0;
    res int := 1;
BEGIN
	If b < 0 then
  b := -b;
  end if;
  
    WHILE counter < b LOOP
        counter := counter + 1;
        res := a * res;
    END LOOP;
    
    Return res;
END;
$$;


ALTER FUNCTION public.pow(a integer, b integer) OWNER TO postgres;

--
-- Name: update_cabinet(character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.update_cabinet(IN p_old_room_name character varying, IN p_new_room_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Проверка, существует ли старое имя
    IF NOT EXISTS (SELECT 1 FROM cabinet WHERE room_name = p_old_room_name) THEN
        RAISE EXCEPTION 'Cabinet with room_name "%" does not exist', p_old_room_name;
    ELSE
        -- Обновление имени кабинета
        UPDATE cabinet
        SET room_name = p_new_room_name
        WHERE room_name = p_old_room_name;
    END IF;
END;
$$;


ALTER PROCEDURE public.update_cabinet(IN p_old_room_name character varying, IN p_new_room_name character varying) OWNER TO postgres;

--
-- Name: update_department_name(character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.update_department_name(IN p_old_name character varying, IN p_new_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Проверяем, существует ли запись с заданным старым именем в таблице department
    IF NOT EXISTS (SELECT 1 FROM department WHERE name = p_old_name) THEN
        RAISE EXCEPTION 'Department with name "%" does not exist', p_old_name;
    END IF;

    -- Обновляем имя департамента в таблице department
    UPDATE department
    SET name = p_new_name
    WHERE name = p_old_name;
END;
$$;


ALTER PROCEDURE public.update_department_name(IN p_old_name character varying, IN p_new_name character varying) OWNER TO postgres;

--
-- Name: update_discipline_name(character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.update_discipline_name(IN p_old_name character varying, IN p_new_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Проверяем, существует ли запись с заданным старым именем в таблице discipline
    IF NOT EXISTS (SELECT 1 FROM discipline WHERE name = p_old_name) THEN
        RAISE EXCEPTION 'Discipline with name "%" does not exist', p_old_name;
    END IF;

    -- Обновляем имя дисциплины в таблице discipline
    UPDATE discipline
    SET name = p_new_name
    WHERE name = p_old_name;

    -- Каскадное обновление в таблице exam_discipline произойдёт автоматически благодаря ON UPDATE CASCADE
END;
$$;


ALTER PROCEDURE public.update_discipline_name(IN p_old_name character varying, IN p_new_name character varying) OWNER TO postgres;

--
-- Name: update_group_details(character varying, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.update_group_details(IN p_old_name character varying, IN p_new_name character varying, IN p_new_department_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Проверяем, существует ли запись с заданным старым именем в таблице "group"
    IF NOT EXISTS (SELECT 1 FROM "group" WHERE name = p_old_name) THEN
        RAISE EXCEPTION 'Group with name "%" does not exist', p_old_name;
    END IF;

    -- Обновляем как имя группы, так и название департамента
    UPDATE "group"
    SET name = p_new_name,
        department_name = p_new_department_name
    WHERE name = p_old_name;
END;
$$;


ALTER PROCEDURE public.update_group_details(IN p_old_name character varying, IN p_new_name character varying, IN p_new_department_name character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cabinet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cabinet (
    room_name character varying(20) NOT NULL
);


ALTER TABLE public.cabinet OWNER TO postgres;

--
-- Name: department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department (
    name character varying(100) NOT NULL
);


ALTER TABLE public.department OWNER TO postgres;

--
-- Name: TABLE department; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.department IS 'Кафедра';


--
-- Name: discipline; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discipline (
    name character varying(100) NOT NULL
);


ALTER TABLE public.discipline OWNER TO postgres;

--
-- Name: discipline_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discipline_log (
    discipline character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.discipline_log OWNER TO postgres;

--
-- Name: event_form; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_form (
    type character varying(20) NOT NULL
);


ALTER TABLE public.event_form OWNER TO postgres;

--
-- Name: TABLE event_form; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.event_form IS 'Форма проведения предмета';


--
-- Name: exam_discipline; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_discipline (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    discipline_name character varying(100) NOT NULL,
    event_datetime timestamp without time zone NOT NULL,
    lecturer_id uuid NOT NULL,
    cabinet_room_name character varying(20) NOT NULL,
    event_form_type character varying(20) NOT NULL
);


ALTER TABLE public.exam_discipline OWNER TO postgres;

--
-- Name: TABLE exam_discipline; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.exam_discipline IS 'Экзамеционная дисциплина';


--
-- Name: group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."group" (
    name character varying(100) NOT NULL,
    department_name character varying(100) NOT NULL
);


ALTER TABLE public."group" OWNER TO postgres;

--
-- Name: lecturer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lecturer (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    firstname character varying(100) NOT NULL,
    surname character varying(100) NOT NULL,
    patronymic character varying(100),
    birthdate date NOT NULL,
    department_name character varying(100) NOT NULL
);


ALTER TABLE public.lecturer OWNER TO postgres;

--
-- Name: TABLE lecturer; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.lecturer IS 'Преподаватель';


--
-- Name: mark; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mark (
    mark character varying(20) NOT NULL,
    student_id uuid NOT NULL,
    statement_id uuid NOT NULL
);


ALTER TABLE public.mark OWNER TO postgres;

--
-- Name: statement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statement (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    exam_discipline_id uuid NOT NULL,
    session_year smallint NOT NULL,
    date_issued date NOT NULL,
    CONSTRAINT session_year_check CHECK ((session_year > 1900))
);


ALTER TABLE public.statement OWNER TO postgres;

--
-- Name: TABLE statement; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.statement IS 'Ведомость';


--
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    firstname character varying(100) NOT NULL,
    surname character varying(100) NOT NULL,
    patronymic character varying(100),
    course smallint NOT NULL,
    birthdate date NOT NULL,
    group_name character varying(100) NOT NULL,
    CONSTRAINT course_check CHECK (((course > 0) AND (course < 10)))
);


ALTER TABLE public.student OWNER TO postgres;

--
-- Name: vw_lecturer_data; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_lecturer_data AS
 SELECT (((((surname)::text || ' '::text) || (firstname)::text) || ' '::text) || (patronymic)::text) AS "ФИО Преподавателя",
    department_name AS "Кафедра"
   FROM public.lecturer l;


ALTER VIEW public.vw_lecturer_data OWNER TO postgres;

--
-- Data for Name: cabinet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cabinet (room_name) FROM stdin;
408
302
аудитория А
А 316
425
412
216
210
6
1
аудитория Б
аудитория В
413
415
420
2
\.


--
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.department (name) FROM stdin;
информационные технологии
прикладная математика
биология и экология
экономика и управление
иностранные языки
deprty4
dept
test
deprt3456
\.


--
-- Data for Name: discipline; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.discipline (name) FROM stdin;
архитектура вычислительных систем
программирование в среде .net
базы данных
экономика
теория автоматов и формальных языков
информатика
философия
право
test
new discipline
алгоритмы и структуры данных
объектно-ориентированное программирование
разработка веб-приложений
сетевые технологии
макроэкономика
маркетинг
анализ данных
психология
биология
английский язык
высшая математика
физика
disp
\.


--
-- Data for Name: discipline_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.discipline_log (discipline, created_at) FROM stdin;
философия	2024-11-02 09:44:11.861323
право	2024-11-02 09:49:25.193752
test	2024-11-07 12:13:46.686002
new disc	2024-12-10 20:33:02.168912
1	2024-12-15 17:51:25.238584
new discipline	2024-12-16 15:29:16.146414
алгоритмы и структуры данных	2024-12-16 15:47:47.848869
объектно-ориентированное программирование	2024-12-16 15:48:38.061042
разработка веб-приложений	2024-12-16 15:48:57.357282
сетевые технологии	2024-12-16 15:49:19.827508
макроэкономика	2024-12-16 15:49:45.113632
маркетинг	2024-12-16 15:50:03.218008
физика	2024-12-16 15:50:20.693976
анализ данных	2024-12-16 15:50:34.686697
психология	2024-12-16 15:51:08.683892
биология	2024-12-17 17:34:59.223978
английский язык	2024-12-17 17:51:57.142703
высшая математика	2024-12-17 18:31:43.578892
disp	2024-12-19 12:38:47.570557
\.


--
-- Data for Name: event_form; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_form (type) FROM stdin;
экзамен
зачет
\.


--
-- Data for Name: exam_discipline; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exam_discipline (id, discipline_name, event_datetime, lecturer_id, cabinet_room_name, event_form_type) FROM stdin;
c74f08d8-e733-43ad-a254-933463210004	программирование в среде .net	2025-01-20 13:30:00	4bdc2321-f8b8-447b-9f26-53ab5cfd692d	302	экзамен
33869e2d-278b-4d04-bdbd-587483eb8ef5	архитектура вычислительных систем	2024-12-20 09:00:00	77c2834c-8096-481d-b1e7-99fa5ebc7173	425	зачет
7775a422-5aa2-45da-af4f-a1befdee4b14	экономика	2024-12-24 12:20:00	55429e32-05b1-49e8-9dd1-e878399ec6b2	А 316	зачет
ce4703dc-9262-47e7-af03-57d410edd137	теория автоматов и формальных языков	2025-01-20 14:30:00	77c2834c-8096-481d-b1e7-99fa5ebc7173	425	экзамен
c56279a1-1579-4041-992b-a273bc63be45	экономика	2025-01-21 15:30:00	78a3f671-adac-48f6-8f1f-33b66c095bf5	аудитория А	экзамен
a9ec8700-7632-42bc-825d-678a7da01b6f	теория автоматов и формальных языков	2025-01-23 19:00:00	77c2834c-8096-481d-b1e7-99fa5ebc7173	А 316	экзамен
dbcec418-17e1-41e8-9a28-1623bff9cc6f	программирование в среде .net	2024-12-27 12:15:00	4bdc2321-f8b8-447b-9f26-53ab5cfd692d	425	зачет
8e03597a-3e2f-4301-9a33-b142086d94a0	экономика	2024-12-27 12:15:00	55429e32-05b1-49e8-9dd1-e878399ec6b2	аудитория А	зачет
70cf7919-6e44-4d18-b8e5-7726b850288f	теория автоматов и формальных языков	2024-12-18 14:20:00	77c2834c-8096-481d-b1e7-99fa5ebc7173	А 316	зачет
ba5623e3-4e00-44d5-9595-d1e4dd47ec33	test	2025-01-12 17:50:00	77c2834c-8096-481d-b1e7-99fa5ebc7173	210	экзамен
17a12dcc-a34d-4433-91f6-345aab654dd3	макроэкономика	2025-01-12 12:00:00	729f6255-dabf-4302-b4fd-ca2647558843	аудитория Б	экзамен
1c45c416-4b6d-45ea-8f17-aefaf385f5d6	маркетинг	2025-01-13 15:00:00	ec4dd50b-aa21-41d2-a6fc-5676c83a6436	аудитория В	экзамен
f3d333e9-d816-43dc-ac17-888831eccf3c	биология	2025-01-30 19:00:00	1b8409e3-3738-47ce-b9ee-ae3590f406ec	аудитория В	экзамен
71cee560-c27b-4355-ae7c-41638e924a6a	биология	2025-01-29 15:00:00	c2024232-136c-4b3e-989f-f1b64675faf2	аудитория В	экзамен
4a9deed9-aeac-40af-a0a8-0b34ce90a333	анализ данных	2025-01-26 13:20:00	55ee423d-49e3-4e66-973b-8984ef0bf277	А 316	экзамен
687ba956-0a9d-4fcd-94e4-63baf5df6ca6	английский язык	2025-01-20 10:00:00	47aaf337-ff9a-4852-905b-ae78b622573d	412	экзамен
1457d7aa-16dc-49fd-a64a-c99fb06bf06b	английский язык	2025-01-05 14:30:00	908ad93f-dd03-48ee-b4e7-5b9e86ac6b66	аудитория Б	экзамен
6d845521-a863-4e56-a819-f26ce77ea5b4	макроэкономика	2025-01-07 12:00:00	55429e32-05b1-49e8-9dd1-e878399ec6b2	аудитория В	экзамен
ece6ac2d-d7df-4401-b858-deb0ea111e53	высшая математика	2025-01-08 08:30:00	e96ca6eb-edac-49ce-96a0-ecdec2493654	А 316	экзамен
7174837e-6dbb-446a-a42d-8b375e991576	базы данных	2025-01-14 12:05:00	4bdc2321-f8b8-447b-9f26-53ab5cfd692d	408	экзамен
3e2c3c47-3635-497b-ba23-daaac884d5b7	архитектура вычислительных систем	2025-01-09 16:00:00	e9293439-fa0b-40b4-b62e-8d19cb58f09e	аудитория А	экзамен
\.


--
-- Data for Name: group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."group" (name, department_name) FROM stdin;
о-22-ивт-2-по-б	информационные технологии
о-22-при-1-рпс-б	информационные технологии
о-24-би-цэ-б	экономика и управление
о-23-пи-уп-б	экономика и управление
о-23-ук-укс-б	прикладная математика
test	биология и экология
о-22-ивт-1-по-б	информационные технологии
о-23-ивт-2-по-б	информационные технологии
о-22-при-2-рпс-б	информационные технологии
о-23-био-хим-2-по	биология и экология
о-22-био-эк-3-рк	биология и экология
о-22-био-хим-2-по	биология и экология
о-23-био-хим-1-по	биология и экология
о-22-био-ген-2-цн	биология и экология
о-22-био-ген-1-цн	биология и экология
о-24-био-эк-1-тп	биология и экология
о-23-мат-стат-1-лс	прикладная математика
о-22-мат-лог-1-цн	прикладная математика
о-22-мат-тео-1-эф	прикладная математика
test3453	deprty4
\.


--
-- Data for Name: lecturer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lecturer (id, firstname, surname, patronymic, birthdate, department_name) FROM stdin;
4bdc2321-f8b8-447b-9f26-53ab5cfd692d	Владислав	Федотов	Алексеевич	1974-09-05	информационные технологии
e9293439-fa0b-40b4-b62e-8d19cb58f09e	Святослав	Иванов	Олегович	1983-04-13	прикладная математика
78a3f671-adac-48f6-8f1f-33b66c095bf5	Гавриил	Быков	Романович	1971-08-31	экономика и управление
77c2834c-8096-481d-b1e7-99fa5ebc7173	Анатолий	Воробьёв	Семёнович	1978-11-02	информационные технологии
55429e32-05b1-49e8-9dd1-e878399ec6b2	Василиса	Жукова	Станиславовна	1985-06-26	экономика и управление
9758354d-b42e-45a3-b99f-3a2a12b121cc	t	t	t	1974-02-02	dept
5a7c5da8-06e9-4cc6-b8e6-2be0d2978e04	Алексей	Иванов	Викторович	1975-05-13	иностранные языки
47aaf337-ff9a-4852-905b-ae78b622573d	Ольга	Смирнова	Николаевна	1980-05-01	иностранные языки
f6437168-42ef-4e7d-81da-614fea5a13b9	Константин	Фёдоров	Игоревич	1979-07-20	прикладная математика
a4dee9ed-99d7-4213-b03b-e0f38b29c01d	Александр	Белов	Юрьевич	1975-01-21	прикладная математика
729f6255-dabf-4302-b4fd-ca2647558843	Максим	Соколов	Владимирович	1983-03-30	экономика и управление
908ad93f-dd03-48ee-b4e7-5b9e86ac6b66	Светлана	Белова	Владимировна	1994-04-06	иностранные языки
ec4dd50b-aa21-41d2-a6fc-5676c83a6436	Ирина	Фёдорова	Константиновна	1990-01-13	экономика и управление
1b8409e3-3738-47ce-b9ee-ae3590f406ec	Артемий	Чернов	Владимирович	1990-05-05	биология и экология
c2024232-136c-4b3e-989f-f1b64675faf2	Сергей	Горбунов	Ильич	1901-03-04	биология и экология
98e20e58-30be-455f-b070-5a3851d5da35	Олег	Гаврилов	Викторович	1988-02-12	прикладная математика
55ee423d-49e3-4e66-973b-8984ef0bf277	Ирина	Климова	Павловна	1993-06-13	прикладная математика
e96ca6eb-edac-49ce-96a0-ecdec2493654	Дарья	Некрасова	Васильевна	1975-07-11	прикладная математика
\.


--
-- Data for Name: mark; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mark (mark, student_id, statement_id) FROM stdin;
отлично	784ebd4e-fbb5-448d-89a9-99a11ebd9156	b665ec2e-8545-4e0c-ada5-0e818340787b
хорошо	784ebd4e-fbb5-448d-89a9-99a11ebd9156	49d593ef-425e-495b-8ee0-03ebca1ea9ca
хорошо	4ba73f57-cda3-4512-8687-b8e5c38bea15	acad28a6-8798-48d4-acb9-455f39b86e6a
зачет	b09de6e8-e383-433d-9acd-c5da8eb96294	22a2ba12-9b0e-4fff-9d55-5adee28cb4c9
не зачтено	e02eb0d6-f81e-41cf-b809-eb68be083aca	22a2ba12-9b0e-4fff-9d55-5adee28cb4c9
не зачтено	b09de6e8-e383-433d-9acd-c5da8eb96294	18b7cc76-c0df-4805-a830-f8d7c600af3e
хорошо	6bfe70aa-b109-40f3-93e6-57b8e83fd8f2	5c04d901-b955-4a03-8aab-243ec80a975c
хорошо	e632e7c8-dc71-495c-888d-5d9227ba3643	8fec1ad0-d0b8-47e2-a3e9-19f44dc6a6d3
зачет	e632e7c8-dc71-495c-888d-5d9227ba3643	c9301abb-b326-4300-bb93-6a4b70e50b42
зачет	6bfe70aa-b109-40f3-93e6-57b8e83fd8f2	58459ac3-7c97-422c-8055-475e53df6f77
удовлетворительно	e02eb0d6-f81e-41cf-b809-eb68be083aca	acad28a6-8798-48d4-acb9-455f39b86e6a
неудовлетворительно	e02eb0d6-f81e-41cf-b809-eb68be083aca	49d593ef-425e-495b-8ee0-03ebca1ea9ca
не зачтено	145031bf-7939-42d8-a937-5935923241a3	58459ac3-7c97-422c-8055-475e53df6f77
удовлетворительно	9b011d98-7593-46c1-bd30-2a748ce22040	acad28a6-8798-48d4-acb9-455f39b86e6a
удовлетворительно	9b011d98-7593-46c1-bd30-2a748ce22040	5e94c622-1f7a-4b2b-8b9c-ca3a4c9687d6
неудовлетворительно	9b011d98-7593-46c1-bd30-2a748ce22040	fa1f9f62-31e1-4934-801f-cf3fdcba4fba
отлично	e174fdbe-5ad3-4def-84db-739ca53b9fad	5e94c622-1f7a-4b2b-8b9c-ca3a4c9687d6
отлично	e632e7c8-dc71-495c-888d-5d9227ba3643	fa1f9f62-31e1-4934-801f-cf3fdcba4fba
отлично	cb7c8db9-366f-46c4-a3ea-136fbed27aa2	8fec1ad0-d0b8-47e2-a3e9-19f44dc6a6d3
отлично	cb7c8db9-366f-46c4-a3ea-136fbed27aa2	acad28a6-8798-48d4-acb9-455f39b86e6a
отлично	cb7c8db9-366f-46c4-a3ea-136fbed27aa2	49d593ef-425e-495b-8ee0-03ebca1ea9ca
неудовлетворительно	b7398213-1b07-441e-8981-065e540e041c	555558bf-2424-43b7-996f-c84cdcb24c6e
неудовлетворительно	79edcffa-44a2-48c5-bf58-8942fc8eb4b8	bd376606-6cb9-4490-9825-13fd2197cafc
отлично	49c0066a-345d-42a5-868b-e1cb7e75bef8	555558bf-2424-43b7-996f-c84cdcb24c6e
неудовлетворительно	e632e7c8-dc71-495c-888d-5d9227ba3643	5e853605-4ef7-4eda-8411-e53d911df7ec
неудовлетворительно	7804f3c8-9254-41d3-9888-b3f8343361fb	92e70933-eeab-4725-bef8-e9cc531541dc
неудовлетворительно	49c0066a-345d-42a5-868b-e1cb7e75bef8	35ec8914-c887-40ec-ae3a-8c88a6569d79
отлично	e174fdbe-5ad3-4def-84db-739ca53b9fad	7be81b70-0dee-416b-b6d0-2498da864914
отлично	e99c89a6-3364-4172-bfa4-0a4150b2b22f	7be81b70-0dee-416b-b6d0-2498da864914
отлично	afc91740-8fc4-40e6-84cf-d6ef913b9586	7be81b70-0dee-416b-b6d0-2498da864914
хорошо	da4217c1-3124-46af-a70e-d762872f838c	5c04d901-b955-4a03-8aab-243ec80a975c
хорошо	b7398213-1b07-441e-8981-065e540e041c	58459ac3-7c97-422c-8055-475e53df6f77
неудовлетворительно	4ba73f57-cda3-4512-8687-b8e5c38bea15	9becd391-e2f6-4084-b537-5c766edd1b1a
\.


--
-- Data for Name: statement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statement (id, exam_discipline_id, session_year, date_issued) FROM stdin;
b665ec2e-8545-4e0c-ada5-0e818340787b	7174837e-6dbb-446a-a42d-8b375e991576	2025	2025-01-02
acad28a6-8798-48d4-acb9-455f39b86e6a	ce4703dc-9262-47e7-af03-57d410edd137	2025	2025-01-04
22a2ba12-9b0e-4fff-9d55-5adee28cb4c9	33869e2d-278b-4d04-bdbd-587483eb8ef5	2024	2024-12-10
18b7cc76-c0df-4805-a830-f8d7c600af3e	7775a422-5aa2-45da-af4f-a1befdee4b14	2024	2024-12-13
5c04d901-b955-4a03-8aab-243ec80a975c	a9ec8700-7632-42bc-825d-678a7da01b6f	2025	2025-01-05
8fec1ad0-d0b8-47e2-a3e9-19f44dc6a6d3	c56279a1-1579-4041-992b-a273bc63be45	2025	2025-01-06
c9301abb-b326-4300-bb93-6a4b70e50b42	dbcec418-17e1-41e8-9a28-1623bff9cc6f	2024	2024-12-10
4af7cfba-0829-41d0-bcd0-20e3710d1985	8e03597a-3e2f-4301-9a33-b142086d94a0	2024	2024-12-12
58459ac3-7c97-422c-8055-475e53df6f77	70cf7919-6e44-4d18-b8e5-7726b850288f	2024	2024-12-10
be1dac45-f661-4ca2-873c-803c1d5b9484	ba5623e3-4e00-44d5-9595-d1e4dd47ec33	2025	2025-01-31
5e94c622-1f7a-4b2b-8b9c-ca3a4c9687d6	17a12dcc-a34d-4433-91f6-345aab654dd3	2025	2025-01-05
fa1f9f62-31e1-4934-801f-cf3fdcba4fba	1c45c416-4b6d-45ea-8f17-aefaf385f5d6	2025	2025-01-05
555558bf-2424-43b7-996f-c84cdcb24c6e	f3d333e9-d816-43dc-ac17-888831eccf3c	2025	2025-01-20
bd376606-6cb9-4490-9825-13fd2197cafc	71cee560-c27b-4355-ae7c-41638e924a6a	2025	2025-01-20
9becd391-e2f6-4084-b537-5c766edd1b1a	4a9deed9-aeac-40af-a0a8-0b34ce90a333	2025	2025-01-20
5e853605-4ef7-4eda-8411-e53d911df7ec	687ba956-0a9d-4fcd-94e4-63baf5df6ca6	2025	2025-01-15
92e70933-eeab-4725-bef8-e9cc531541dc	1457d7aa-16dc-49fd-a64a-c99fb06bf06b	2025	2025-01-01
35ec8914-c887-40ec-ae3a-8c88a6569d79	6d845521-a863-4e56-a819-f26ce77ea5b4	2025	2025-01-01
7be81b70-0dee-416b-b6d0-2498da864914	ece6ac2d-d7df-4401-b858-deb0ea111e53	2025	2025-01-05
49d593ef-425e-495b-8ee0-03ebca1ea9ca	c74f08d8-e733-43ad-a254-933463210004	2025	2025-01-02
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student (id, firstname, surname, patronymic, course, birthdate, group_name) FROM stdin;
784ebd4e-fbb5-448d-89a9-99a11ebd9156	Виталий	Некрасов	Вадимович	3	2004-09-16	о-22-ивт-2-по-б
4ba73f57-cda3-4512-8687-b8e5c38bea15	Александр	Комиссаров	Денисович	3	2004-06-30	о-22-при-1-рпс-б
e02eb0d6-f81e-41cf-b809-eb68be083aca	Степан	Калашников	Михайлович	1	2006-10-17	о-24-би-цэ-б
b09de6e8-e383-433d-9acd-c5da8eb96294	Демьян	Рыбаков	Тимофеевич	2	2005-12-22	о-23-ук-укс-б
9b011d98-7593-46c1-bd30-2a748ce22040	Вячеслав	Русаков	Германнович	3	2004-09-01	о-22-ивт-2-по-б
b7a6a07e-4768-4b2e-a49f-73bd54798779	Тамара	Ефремова	Александровна	3	2003-05-15	о-22-ивт-2-по-б
79edcffa-44a2-48c5-bf58-8942fc8eb4b8	Мартина	Новикова	Львовна	2	2005-11-16	о-23-ук-укс-б
a82211ea-f465-4e7a-bdf1-cecf951f787b	Мария	Тимофеева	Эминовна	1	2004-06-04	о-24-би-цэ-б
e632e7c8-dc71-495c-888d-5d9227ba3643	Егор	Родионов	Владимирович	3	2004-10-01	о-22-при-1-рпс-б
6bfe70aa-b109-40f3-93e6-57b8e83fd8f2	Максим	Григорьев	Юрьевич	2	2005-12-05	о-23-ук-укс-б
145031bf-7939-42d8-a937-5935923241a3	t	t	t	1	2004-01-01	о-22-ивт-2-по-б
cb7c8db9-366f-46c4-a3ea-136fbed27aa2	Максим	Смирнов	Сергеевич	3	2005-11-07	о-22-ивт-1-по-б
e174fdbe-5ad3-4def-84db-739ca53b9fad	Алексей	Кузнецов	Игоревич	2	2006-05-01	о-23-ивт-2-по-б
b7398213-1b07-441e-8981-065e540e041c	Татьяна	Попова	Попова	3	2004-08-25	о-22-при-2-рпс-б
b03d1486-32e8-4651-ae3c-c0b0c36a5700	Илья	Рябов	Николаевич	2	2005-01-01	о-23-био-хим-2-по
da4217c1-3124-46af-a70e-d762872f838c	Владимир	Тарасов	Андреевич	3	2004-09-05	о-22-био-эк-3-рк
030fefd3-6c94-47ea-81a4-eab2c729d8bd	Виктория	Чистякова	Михайловна	3	2004-05-23	о-22-био-ген-1-цн
49c0066a-345d-42a5-868b-e1cb7e75bef8	Ирина	Филатова	Владимировна	1	2006-06-20	о-24-био-эк-1-тп
8f40556d-5d11-4a77-9001-a29478d48cd5	Елена	Панова	Вячеславовна	2	2005-04-10	о-23-мат-стат-1-лс
e99c89a6-3364-4172-bfa4-0a4150b2b22f	Алина	Ковальчук	Дмитриевна	3	2004-01-06	о-22-мат-лог-1-цн
afc91740-8fc4-40e6-84cf-d6ef913b9586	Олеся	Калинина	Борисовна	3	2004-03-07	о-22-мат-тео-1-эф
7804f3c8-9254-41d3-9888-b3f8343361fb	Юлия	Щербакова	Сергеевна	2	2006-02-28	о-23-био-хим-1-по
\.


--
-- Name: cabinet cabinet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cabinet
    ADD CONSTRAINT cabinet_pkey PRIMARY KEY (room_name);


--
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (name);


--
-- Name: discipline_log discipline_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discipline_log
    ADD CONSTRAINT discipline_log_pkey PRIMARY KEY (discipline);


--
-- Name: discipline discipline_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discipline
    ADD CONSTRAINT discipline_pkey PRIMARY KEY (name);


--
-- Name: event_form event_form_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_form
    ADD CONSTRAINT event_form_pkey PRIMARY KEY (type);


--
-- Name: exam_discipline exam_discipline_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_discipline
    ADD CONSTRAINT exam_discipline_pkey PRIMARY KEY (id);


--
-- Name: group group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (name);


--
-- Name: lecturer lecturer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lecturer
    ADD CONSTRAINT lecturer_pkey PRIMARY KEY (id);


--
-- Name: mark mark_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mark
    ADD CONSTRAINT mark_pkey PRIMARY KEY (student_id, statement_id);


--
-- Name: statement statement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statement
    ADD CONSTRAINT statement_pkey PRIMARY KEY (id);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- Name: statement unique_exam_discipline; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statement
    ADD CONSTRAINT unique_exam_discipline UNIQUE (exam_discipline_id);


--
-- Name: statement unique_statement; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statement
    ADD CONSTRAINT unique_statement UNIQUE (exam_discipline_id, session_year, date_issued);


--
-- Name: discipline after_insert_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER after_insert_trigger AFTER INSERT ON public.discipline FOR EACH ROW EXECUTE FUNCTION public.log_new_discipline();


--
-- Name: exam_discipline exam_discipline_cabinet_room_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_discipline
    ADD CONSTRAINT exam_discipline_cabinet_room_name_fkey FOREIGN KEY (cabinet_room_name) REFERENCES public.cabinet(room_name) ON UPDATE CASCADE;


--
-- Name: exam_discipline exam_discipline_discipline_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_discipline
    ADD CONSTRAINT exam_discipline_discipline_name_fkey FOREIGN KEY (discipline_name) REFERENCES public.discipline(name) ON UPDATE CASCADE;


--
-- Name: exam_discipline exam_discipline_event_form_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_discipline
    ADD CONSTRAINT exam_discipline_event_form_id_fkey FOREIGN KEY (event_form_type) REFERENCES public.event_form(type);


--
-- Name: exam_discipline exam_discipline_lecturer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_discipline
    ADD CONSTRAINT exam_discipline_lecturer_id_fkey FOREIGN KEY (lecturer_id) REFERENCES public.lecturer(id);


--
-- Name: group group_department_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_department_name_fkey FOREIGN KEY (department_name) REFERENCES public.department(name) ON UPDATE CASCADE;


--
-- Name: lecturer lecturer_department_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lecturer
    ADD CONSTRAINT lecturer_department_name_fkey FOREIGN KEY (department_name) REFERENCES public.department(name) ON UPDATE CASCADE;


--
-- Name: mark mark_statement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mark
    ADD CONSTRAINT mark_statement_id_fkey FOREIGN KEY (statement_id) REFERENCES public.statement(id);


--
-- Name: mark mark_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mark
    ADD CONSTRAINT mark_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: statement statement_exam_discipline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statement
    ADD CONSTRAINT statement_exam_discipline_id_fkey FOREIGN KEY (exam_discipline_id) REFERENCES public.exam_discipline(id);


--
-- Name: student student_group_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_group_name_fkey FOREIGN KEY (group_name) REFERENCES public."group"(name) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--

