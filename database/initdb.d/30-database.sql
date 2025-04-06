\connect pokemon;

CREATE TABLE "pokemon" (
    "id_pokemon" SERIAL PRIMARY KEY,
    "type1" VARCHAR(255) CHECK ("type1" IN (
        'Steel', 'Water', 'Bug', 'Dragon', 'Electric', 'Ghost', 'Fire', 'Fairy', 'Ice',
        'Fighting', 'Normal', 'Grass', 'Psychic', 'Rock', 'Dark', 'Ground', 'Poison', 'Flying'
    )),
    "type2" VARCHAR(255) CHECK ("type2" IN (
        'Steel', 'Water', 'Bug', 'Dragon', 'Electric', 'Ghost', 'Fire', 'Fairy', 'Ice',
        'Fighting', 'Normal', 'Grass', 'Psychic', 'Rock', 'Dark', 'Ground', 'Poison', 'Flying'
    )),
    "name" VARCHAR(255) NOT NULL,
    "base_attack" SMALLINT NOT NULL,
    "base_special_attack" SMALLINT NOT NULL,
    "base_defense" SMALLINT NOT NULL,
    "base_special_defense" SMALLINT NOT NULL,
    "base_speed" SMALLINT NOT NULL,
    "base_hp" SMALLINT NOT NULL
);

CREATE TABLE "basic_information" (
    "id_pokemon" INT NOT NULL,
    "generation" INT NOT NULL CHECK ("generation" BETWEEN 1 AND 9),
    "specie_es" VARCHAR(255) NOT NULL,
    "specie_en" VARCHAR(255) NOT NULL,
    "height" double PRECISION  NOT NULL,
    "weight" double PRECISION NOT NULL,
    "colour" varchar(12) NOT NULL,
    "evolution_state" INT NOT NULL CHECK ("evolution_state" BETWEEN 1 AND 3),
    "can_evolve" boolean not null,
    "next_evolution_id" int,
    "description_en" text not null,
    "description_es" text not null,
    PRIMARY KEY("id_pokemon"),
    FOREIGN KEY ("id_pokemon") REFERENCES "pokemon"("id_pokemon"),
    FOREIGN KEY ("next_evolution_id") REFERENCES "pokemon"("id_pokemon")
);

CREATE TABLE "abilities" (
    "id_ability" SERIAL PRIMARY KEY,
    "name_es" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_es" TEXT NOT NULL
);

CREATE TABLE "pokemon_abilities" (
    "id_pokemon" INT NOT NULL,
    "id_ability" INT NOT NULL,
    "type" VARCHAR(255) NOT NULL DEFAULT 'primary' CHECK ("type" IN ('primary', 'hidden')),
    PRIMARY KEY("id_pokemon", "id_ability"),
    FOREIGN KEY ("id_pokemon") REFERENCES "pokemon"("id_pokemon"),
    FOREIGN KEY ("id_ability") REFERENCES "abilities"("id_ability")
);

CREATE TABLE "moves" (
    "id_move" SERIAL PRIMARY KEY,
    "name_es" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "description_es" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "accuracy" INT,
    "power" INT,
    "type" VARCHAR(255) NOT NULL CHECK ("type" IN (
        'steel', 'water', 'bug', 'dragon', 'electric', 'ghost', 'fire', 'fairy', 'ice',
    'fighting', 'normal', 'grass', 'psychic', 'rock', 'dark', 'ground', 'poison', 'flying'
    )),
    "category" VARCHAR(255) NOT NULL CHECK ("category" IN ('physical', 'special', 'status'))
);

CREATE TABLE "move_pokemon" (
    "id_pokemon" INT NOT NULL,
    "id_move" INT NOT NULL,
    PRIMARY KEY("id_pokemon", "id_move"),
    FOREIGN KEY ("id_pokemon") REFERENCES "pokemon"("id_pokemon"),
    FOREIGN KEY ("id_move") REFERENCES "moves"("id_move")
);

CREATE TABLE "users" (
    "id_user" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL UNIQUE,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" TEXT NOT NULL
);

CREATE TABLE "favourite_pokemon" (
    "id_user" INT NOT NULL,
    "id_pokemon" INT NOT NULL,
    PRIMARY KEY("id_user", "id_pokemon"),
    FOREIGN KEY ("id_user") REFERENCES "users"("id_user"),
    FOREIGN KEY ("id_pokemon") REFERENCES "pokemon"("id_pokemon")
);

CREATE TABLE "catched_pokemon" (
    "id_user" INT NOT NULL,
    "id_pokemon" INT NOT NULL,
    PRIMARY KEY("id_user", "id_pokemon"),
    FOREIGN KEY ("id_user") REFERENCES "users"("id_user"),
    FOREIGN KEY ("id_pokemon") REFERENCES "pokemon"("id_pokemon")
);

CREATE TABLE "community_pokemon" (
    "id_community_pokemon" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "type1" VARCHAR(255) CHECK ("type1" IN (
        'Steel', 'Water', 'Bug', 'Dragon', 'Electric', 'Ghost', 'Fire', 'Fairy', 'Ice',
        'Fighting', 'Normal', 'Grass', 'Psychic', 'Rock', 'Dark', 'Ground', 'Poison', 'Flying'
    )),
    "type2" VARCHAR(255) CHECK ("type2" IN (
        'Steel', 'Water', 'Bug', 'Dragon', 'Electric', 'Ghost', 'Fire', 'Fairy', 'Ice',
        'Fighting', 'Normal', 'Grass', 'Psychic', 'Rock', 'Dark', 'Ground', 'Poison', 'Flying'
    )),
    "description" TEXT NOT NULL,
    "specie" VARCHAR(255) NOT NULL,
    "height" DECIMAL(8, 2) NOT NULL,
    "weight" DECIMAL(8, 2) NOT NULL,
    "id_user" INT NOT NULL,
    "sprite" text not null,
    FOREIGN KEY ("id_user") REFERENCES "users"("id_user")
);

CREATE TABLE "items" (
    "id_item" SERIAL PRIMARY KEY,
    "name_en" VARCHAR(255) NOT NULL,
    "name_es" VARCHAR(255) NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_es" TEXT NOT NULL,
    "holdable" BOOLEAN NOT NULL
);
CREATE TABLE "teams" (
    "id_team" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users"("id_user")
);


CREATE TABLE pokemon_member (
    "id_pokemon_member" SERIAL PRIMARY KEY,
    "id_pokemon" int NOT NULL,
    "id_user" int not null,
    "name" TEXT NOT NULL,
    "id_ability" int NOT NULL,
    "nature" TEXT CHECK ("nature" IN (
        'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
        'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
        'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
        'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
        'Calm', 'Gentle', 'Careful', 'Sassy', 'Quirky'
    )) NOT NULL,

    "attack_ev" SMALLINT NOT NULL CHECK ("attack_ev" BETWEEN 0 AND 252),
    "special_attack_ev" SMALLINT NOT NULL CHECK ("special_attack_ev" BETWEEN 0 AND 252),
    "defense_ev" SMALLINT NOT NULL CHECK ("defense_ev" BETWEEN 0 AND 252),
    "special_defense_ev" SMALLINT NOT NULL CHECK ("special_defense_ev" BETWEEN 0 AND 252),
    "speed_ev" SMALLINT NOT NULL CHECK ("speed_ev" BETWEEN 0 AND 252),
    "hp_ev" SMALLINT NOT NULL CHECK ("hp_ev" BETWEEN 0 AND 252),

    "attack_iv" SMALLINT NOT NULL CHECK ("attack_iv" BETWEEN 0 AND 31),
    "special_attack_iv" SMALLINT NOT NULL CHECK ("special_attack_iv" BETWEEN 0 AND 31),
    "defense_iv" SMALLINT NOT NULL CHECK ("defense_iv" BETWEEN 0 AND 31),
    "special_defense_iv" SMALLINT NOT NULL CHECK ("special_defense_iv" BETWEEN 0 AND 31),
    "speed_iv" SMALLINT NOT NULL CHECK ("speed_iv" BETWEEN 0 AND 31),
    "hp_iv" SMALLINT NOT NULL CHECK ("hp_iv" BETWEEN 0 AND 31),

    "id_item" int,
    level INT NOT NULL DEFAULT 100 CHECK (level BETWEEN 1 AND 100),
    FOREIGN KEY ("id_ability") REFERENCES "abilities" ("id_ability") ON DELETE CASCADE,
    FOREIGN KEY ("id_item") REFERENCES "items" ("id_item") ON DELETE CASCADE,
    FOREIGN KEY ("id_user") REFERENCES "users" ("id_user") ON DELETE CASCADE
);

CREATE TABLE pokemon_team (
    "id_pokemon_member" int NOT NULL,
    "id_team" int NOT NULL,
    "position" SMALLINT CHECK ("position" BETWEEN 1 AND 6) NOT NULL,
    PRIMARY KEY ("id_pokemon_member", "id_team"),
    FOREIGN KEY ("id_pokemon_member") REFERENCES "pokemon_member" ("id_pokemon_member") ON DELETE CASCADE,
    FOREIGN KEY ("id_team") REFERENCES "teams" ("id_team") ON DELETE CASCADE
);

CREATE TABLE pokemon_member_move (
    "id_pokemon_member" int NOT NULL,
    "id_move" INT NOT NULL,
    "position" SMALLINT CHECK ("position" BETWEEN 1 AND 4) NOT NULL,
    PRIMARY KEY ("id_pokemon_member", "position"),
    FOREIGN KEY ("id_pokemon_member") REFERENCES "pokemon_member" ("id_pokemon_member") ON DELETE CASCADE,
    FOREIGN KEY ("id_move") REFERENCES "moves" ("id_move") ON DELETE CASCADE 
);


-- CREATE TABLE "sprites" (
--     "id_pokemon" INT NOT NULL,
--     "id_version" INT NOT NULL,
--     "front_sprite" TEXT NOT NULL,
--     "back_sprite" TEXT NOT NULL,
--     "front_sprite_shiny" TEXT,
--     "back_sprite_shiny" TEXT,
--     PRIMARY KEY("id_pokemon", "id_version"),
--     FOREIGN KEY ("id_pokemon") REFERENCES "pokemon"("id_pokemon"),
--     FOREIGN KEY ("id_version") REFERENCES "versions"("id_version")
-- );
