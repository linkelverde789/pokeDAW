create user admin with encrypted password 'admin';
create database pokemon with owner admin encoding 'utf8';
revoke all privileges on database pokemon from public;
grant all privileges on database pokemon to admin;
alter database pokemon set search_path to pokemonJS;

\connect pokemon;
drop schema if exists pokemonJS cascade;
create schema if not exists pokemonJS authorization admin;

create user app with encrypted password 'app';
grant connect on database pokemon to app;
grant usage on schema pokemonJS to app;
alter default privileges in schema pokemonJS
    grant select, insert, update, delete on tables to app;
alter default privileges in schema pokemonJS
    grant usage on sequences to app;
