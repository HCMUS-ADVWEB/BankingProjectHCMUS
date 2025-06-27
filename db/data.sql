--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.0

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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (user_id, username, password, email, phone, full_name, address, dob, role, is_active, created_at, updated_at) FROM stdin;
92edbffe-d9da-44e4-873b-43843306aed4	customer1	$2a$10$bUGlttf8gbQDz/24gfVmKuhbOvWjtC5Sg/b.kRj/owEXZ2TNeAACi	nguyenthienan261103@gmail.com	0900000001	Nguyễn Văn A	123 Đường A	1990-01-01	CUSTOMER	t	2025-05-23 02:20:08.135217	2025-05-23 02:20:08.135217
97b6bcaa-acbb-4820-83b9-4754bc73a98d	customer2	$2a$10$saWR2jjO1L3l3g4Ei4FK3uYzvjhoYaqDbckbLYN1CYjJuLVC/eiWu	nguyenhungyen0000@gmail.com	0900000002	Trần Thị B	456 Đường B	1992-02-02	CUSTOMER	t	2025-05-23 02:20:08.135217	2025-05-23 02:20:08.135217
e640fb04-3874-461c-a591-6d3e55582970	customer3	$2a$10$bUGlttf8gbQDz/24gfVmKuhbOvWjtC5Sg/b.kRj/owEXZ2TNeAACi	customer3@gmail.com	0000000001	Nguyễn Thị Minh	Dong Tam Street	2003-01-01	CUSTOMER	t	2025-06-13 05:25:19.920714	2025-06-13 05:25:19.920714
b0745dbb-8287-4b3d-9afb-ca0de61ab24c	admin1	$2a$10$bUGlttf8gbQDz/24gfVmKuhbOvWjtC5Sg/b.kRj/owEXZ2TNeAACi	admin@example.com	0911735614	Lê Thị Kim Dung	321 Đường D, P4, TPHCM	2003-04-04	ADMIN	t	2025-05-23 02:20:08.135217	2025-06-23 09:32:44.130505
cacbc60b-10a9-44d2-946b-4c30d3f38d2b	admin2	$2a$10$xv3nXxiSTfjZsM1qLjzYFevj99fYSWRx0qiBXvXqLBsdCIAixKBQW	admin2@example.com	0123000347	Admin Kiet	HCMUS	2005-06-22	ADMIN	t	2025-06-23 05:04:54.020909	2025-06-27 04:23:51.151114
d24d8bc4-5608-4043-9df8-e70a5f75dc90	admin3	$2a$10$hLSG6Jgrgp1.jxzj7.LXzeUEe0NPNomLsKsieumnVHMluX.3wNfYi	a@gmail.com	0902000056	Admin Vinh 	HCM City	2003-01-01	ADMIN	t	2025-06-24 18:09:24.366121	2025-06-27 04:23:30.559477
e4d83490-9b85-4c3a-a543-65bfadedf6af	employee1	$2a$10$bUGlttf8gbQDz/24gfVmKuhbOvWjtC5Sg/b.kRj/owEXZ2TNeAACi	employee1@example.com	0900000003	Phạm Văn Cung	789 Đường C	1985-03-03	EMPLOYEE	t	2025-05-23 02:20:08.135217	2025-06-27 05:17:07.954527
9955acf0-5f12-4fb9-b555-99522c831d89	employee2	$2a$10$mepTAm7sQCfwz/WmTFYvYOH9PTxkpGeEkFPkevK4YzVHoeKHBtmB2	employee6@gmail.com	0908588555	Employee Nam	TPHCM	2003-01-30	EMPLOYEE	t	2025-06-27 04:39:38.444669	2025-06-27 05:11:02.567579
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.accounts (account_id, account_number, balance, user_id, account_type, is_active, created_at, updated_at) FROM stdin;
da608047-0df2-4af5-bc03-329cdcf46ea7	5873906278933357	1240000	e640fb04-3874-461c-a591-6d3e55582970	PAYMENT	t	2025-06-13 05:25:19.920714	2025-06-13 05:25:19.920714
fdce5ee8-2765-4580-8e19-78fcf19c8c0e	9704214212222	78980000	97b6bcaa-acbb-4820-83b9-4754bc73a98d	PAYMENT	t	2025-05-23 02:20:08.135217	2025-05-23 02:20:08.135217
416b19a0-253b-4171-afd2-5f9dfd8362cd	9704390632656	12758000	92edbffe-d9da-44e4-873b-43843306aed4	PAYMENT	t	2025-05-23 02:20:08.135217	2025-05-23 02:20:08.135217
\.


--
-- Data for Name: banks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.banks (bank_id, bank_code, bank_name, public_key, api_endpoint, security_type, secret_key, is_active, created_at, updated_at) FROM stdin;
a3447ac2-b51d-4c47-b178-06b2f1a77160	SCB	Banking HCMUS G1	MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgetSh5vpIq6nrQNZ2Y7k9VyZze9lfLr3CIKrkyaXHUseWpj2nmBa9Lf22gNZA2wXd0y+SXGg/Hk21JRHw40kwCFGBRpR5kRqdUfFy5HG+J2ch4tLb8h4wolNBmn84f1qrjGZ0TZNpxqFUoF/MjfSjiEWW0tAcwNItsy+XpMsLrwIDAQAB	https://internet-bankingr.onrender.com	RSA	nhom1_secret_key_hash	t	2025-06-14 13:33:36.109779	2025-06-14 13:33:36.109779
79f642f1-5130-4e00-bc71-ae92d5417294	FAK	Phantom HCMUS G0	MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsSXsIExLtlQS4D4pMLjvfOfg518u9zgePmB+cagHQEI1geTvmnwCrQtzethfXrm16qMRY8dyYCJu0FJqLMGdqOW27EsbHQf0OnKE8JS97S9R+J4YvVixtlGxnUfRdBtWuaQFU4ouuBaJF5ZIwaWCS7/eeIs+9AEju6QYj9UIjrwIDAQAB	https://internet-bankingr.onrender.com	RSA	fake_secret_key_hash	t	2025-06-23 19:42:23.792609	2025-06-23 19:42:23.792609
\.

