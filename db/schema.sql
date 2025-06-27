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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.accounts (
    account_id uuid DEFAULT gen_random_uuid() NOT NULL,
    account_number character varying(255) NOT NULL,
    balance double precision DEFAULT 0 NOT NULL,
    user_id uuid NOT NULL,
    account_type character varying(50) DEFAULT 'PAYMENT'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT accounts_account_type_check CHECK (((account_type)::text = 'PAYMENT'::text))
);


ALTER TABLE public.accounts OWNER TO neondb_owner;

--
-- Name: banks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.banks (
    bank_id uuid DEFAULT gen_random_uuid() NOT NULL,
    bank_code character varying(50) NOT NULL,
    bank_name character varying(255) NOT NULL,
    public_key text NOT NULL,
    api_endpoint character varying(255) NOT NULL,
    security_type character varying(10) NOT NULL,
    secret_key character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT banks_security_type_check CHECK (((security_type)::text = ANY ((ARRAY['RSA'::character varying, 'PGP'::character varying, 'OTHER'::character varying])::text[])))
);


ALTER TABLE public.banks OWNER TO neondb_owner;

--
-- Name: debt_reminders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.debt_reminders (
    debt_reminder_id uuid DEFAULT gen_random_uuid() NOT NULL,
    creator_id uuid NOT NULL,
    debtor_id uuid NOT NULL,
    amount double precision NOT NULL,
    message text,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    cancelled_reason text,
    transaction_id uuid,
    CONSTRAINT debt_reminders_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'PAID'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.debt_reminders OWNER TO neondb_owner;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notifications (
    notification_id uuid NOT NULL,
    user_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    read boolean DEFAULT false NOT NULL,
    version integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.notifications OWNER TO neondb_owner;

--
-- Name: recipients; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.recipients (
    recipient_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    recipient_account_number character varying(255) NOT NULL,
    recipient_name character varying(255) NOT NULL,
    bank_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    nick_name character varying(255)
);


ALTER TABLE public.recipients OWNER TO neondb_owner;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.refresh_tokens (
    refresh_token_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO neondb_owner;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.transactions (
    transaction_id uuid DEFAULT gen_random_uuid() NOT NULL,
    transaction_type character varying(50) NOT NULL,
    from_bank_id uuid,
    from_account_id uuid,
    from_account_number character varying(255),
    to_bank_id uuid,
    to_account_id uuid,
    to_account_number character varying(255),
    amount double precision NOT NULL,
    fee double precision DEFAULT 0 NOT NULL,
    fee_type character varying(10) DEFAULT 'SENDER'::character varying NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT transactions_fee_type_check CHECK (((fee_type)::text = ANY ((ARRAY['SENDER'::character varying, 'RECEIVER'::character varying])::text[]))),
    CONSTRAINT transactions_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'COMPLETED'::character varying, 'FAILED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT transactions_transaction_type_check CHECK (((transaction_type)::text = ANY ((ARRAY['INTERNAL_TRANSFER'::character varying, 'INTERBANK_TRANSFER'::character varying, 'DEBT_PAYMENT'::character varying, 'DEPOSIT'::character varying])::text[])))
);


ALTER TABLE public.transactions OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    address text NOT NULL,
    dob date NOT NULL,
    role character varying(50) DEFAULT 'CUSTOMER'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['CUSTOMER'::character varying, 'ADMIN'::character varying, 'EMPLOYEE'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: accounts accounts_account_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_account_number_key UNIQUE (account_number);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (account_id);


--
-- Name: banks banks_bank_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_bank_code_key UNIQUE (bank_code);


--
-- Name: banks banks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_pkey PRIMARY KEY (bank_id);


--
-- Name: debt_reminders debt_reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.debt_reminders
    ADD CONSTRAINT debt_reminders_pkey PRIMARY KEY (debt_reminder_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- Name: recipients recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.recipients
    ADD CONSTRAINT recipients_pkey PRIMARY KEY (recipient_id);


--
-- Name: refresh_tokens refresh_tokens_pk; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pk PRIMARY KEY (refresh_token_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: accounts fk_accounts_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: debt_reminders fk_debt_reminders_creator; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.debt_reminders
    ADD CONSTRAINT fk_debt_reminders_creator FOREIGN KEY (creator_id) REFERENCES public.users(user_id);


--
-- Name: debt_reminders fk_debt_reminders_debtor; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.debt_reminders
    ADD CONSTRAINT fk_debt_reminders_debtor FOREIGN KEY (debtor_id) REFERENCES public.users(user_id);


--
-- Name: debt_reminders fk_debt_reminders_transaction; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.debt_reminders
    ADD CONSTRAINT fk_debt_reminders_transaction FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id);


--
-- Name: recipients fk_recipients_bank; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.recipients
    ADD CONSTRAINT fk_recipients_bank FOREIGN KEY (bank_id) REFERENCES public.banks(bank_id);


--
-- Name: recipients fk_recipients_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.recipients
    ADD CONSTRAINT fk_recipients_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: transactions fk_transactions_from_account; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fk_transactions_from_account FOREIGN KEY (from_account_id) REFERENCES public.accounts(account_id);


--
-- Name: transactions fk_transactions_from_bank; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fk_transactions_from_bank FOREIGN KEY (from_bank_id) REFERENCES public.banks(bank_id);


--
-- Name: transactions fk_transactions_to_account; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fk_transactions_to_account FOREIGN KEY (to_account_id) REFERENCES public.accounts(account_id);


--
-- Name: transactions fk_transactions_to_bank; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fk_transactions_to_bank FOREIGN KEY (to_bank_id) REFERENCES public.banks(bank_id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: refresh_tokens refresh_tokens_users_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_users_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

