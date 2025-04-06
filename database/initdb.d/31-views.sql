\connect pokemon;
create view pokeplay_pokemondle as 
    select pokemon.id_pokemon, name, type1, type2, generation, height, weight, colour, evolution_state, can_evolve
            from pokemon inner join basic_information using (id_pokemon);

create view pokeplay_guess as 
        select id_pokemon, name from pokemon;

create view pokeplay_entry as
        select id_pokemon, name, description_en, description_es
                from pokemon inner join basic_information
                using (id_pokemon);

create view pokedex_general as
        select id_pokemon, name, type1, type2 from pokemon;

CREATE VIEW pokedex_global AS
  WITH chain AS (
    SELECT 
      b1.id_pokemon AS id_1,
      p1.name AS pokemon_1,
      b2.id_pokemon AS id_2,
      p2.name AS pokemon_2,
      b3.id_pokemon AS id_3,
      p3.name AS pokemon_3
    FROM basic_information b1
    LEFT JOIN basic_information b2 
      ON b1.next_evolution_id = b2.id_pokemon 
        AND b2.evolution_state = 2
    LEFT JOIN basic_information b3 
      ON b2.next_evolution_id = b3.id_pokemon 
        AND b3.evolution_state = 3
    LEFT JOIN pokemon p1 
      ON p1.id_pokemon = b1.id_pokemon
    LEFT JOIN pokemon p2 
      ON p2.id_pokemon = b2.id_pokemon
    LEFT JOIN pokemon p3 
      ON p3.id_pokemon = b3.id_pokemon
    WHERE b1.evolution_state = 1
  )
  SELECT 
    p.id_pokemon,
    p.name,
    p.type1,
    p.type2,
    p.base_attack,
    p.base_special_attack,
    p.base_defense,
    p.base_special_defense,
    p.base_speed,
    p.base_hp,
    b.generation,
    b.specie_es,
    b.specie_en,
    b.height,
    b.weight,
    b.colour,
    b.evolution_state,
    b.can_evolve,
    b.next_evolution_id,
    b.description_en,
    b.description_es,
    c.id_1 AS evolution_id_1,
    c.pokemon_1 AS evolution_pokemon_1,
    c.id_2 AS evolution_id_2,
    c.pokemon_2 AS evolution_pokemon_2,
    c.id_3 AS evolution_id_3,
    c.pokemon_3 AS evolution_pokemon_3
  FROM pokemon p
  JOIN basic_information b 
    ON p.id_pokemon = b.id_pokemon
  LEFT JOIN chain c 
    ON (b.id_pokemon = c.id_1 
        OR b.id_pokemon = c.id_2 
        OR b.id_pokemon = c.id_3);

CREATE VIEW evolution_lines AS
  SELECT 
    b1.id_pokemon AS id_1,
    p1.name AS pokemon_1,
    b2.id_pokemon AS id_2,
    p2.name AS pokemon_2,
    b3.id_pokemon AS id_3,
    p3.name AS pokemon_3
  FROM basic_information b1
  LEFT JOIN basic_information b2 
    ON b1.next_evolution_id = b2.id_pokemon 
    AND b2.evolution_state = 2
  LEFT JOIN basic_information b3 
    ON b2.next_evolution_id = b3.id_pokemon 
    AND b3.evolution_state = 3
  JOIN pokemon p1 ON p1.id_pokemon = b1.id_pokemon
  LEFT JOIN pokemon p2 ON p2.id_pokemon = b2.id_pokemon
  LEFT JOIN pokemon p3 ON p3.id_pokemon = b3.id_pokemon
  WHERE b1.evolution_state = 1;

create view communitydex_general as 
  select name, id_community_pokemon, type1, type2, sprite, id_user from community_pokemon;

create view communitydex_global as 
  select community_pokemon.*, users.username from community_pokemon inner join users using (id_user);

create view pokedex_moves as 
        select id_pokemon, moves.*
            from moves inner join move_pokemon using (id_move);

create view pokedex_ability as 
        select pokemon_abilities.type, pokemon_abilities.id_pokemon, abilities.*
              from abilities inner join pokemon_abilities using (id_ability);

create view view_catched as
        select pokemon.*, catched_pokemon.id_user
          from pokemon inner join catched_pokemon using (id_pokemon);

create view view_favourites as
        select pokemon.*, favourite_pokemon.id_user
          from pokemon inner join favourite_pokemon using (id_pokemon);

create view all_names as
        select pokemon.name, pokemon.id_pokemon from pokemon;

CREATE VIEW pokemon_member_all AS
SELECT 
    pokemon.name AS pokemon_name,
    pokemon_member.id_user AS id_user,
    pokemon_member.id_pokemon_member AS id_pokemon_member,
    pokemon_member.id_pokemon,
    pokemon_member.name AS pokemon_member_name,
    pokemon_member.id_ability,
    pokemon_member.nature,
    pokemon_member.attack_ev,
    pokemon_member.special_attack_ev,
    pokemon_member.defense_ev,
    pokemon_member.special_defense_ev,
    pokemon_member.speed_ev,
    pokemon_member.hp_ev,
    pokemon_member.attack_iv,
    pokemon_member.special_attack_iv,
    pokemon_member.defense_iv,
    pokemon_member.special_defense_iv,
    pokemon_member.speed_iv,
    pokemon_member.hp_iv,
    pokemon_member.id_item AS pokemon_member_id_item,
    pokemon_member.level,
    items.name_en AS item_name_en,
    items.name_es AS item_name_es,
    items.description_en AS item_description_en,
    items.description_es AS item_description_es,
    items.holdable,
    moves.id_move AS id_move,
    moves.name_en AS move_name_en,
    moves.name_es AS move_name_es,
    moves.description_en AS move_description_en,
    moves.description_es AS move_description_es,
    moves.accuracy,
    moves.power,
    moves.type AS move_type,
    moves.category,
    pokemon_member_move.position AS move_position
FROM 
    pokemon
INNER JOIN 
    pokemon_member USING (id_pokemon)
INNER JOIN 
    items USING (id_item)
INNER JOIN 
    pokemon_member_move USING (id_pokemon_member)
INNER JOIN 
    moves USING (id_move);

CREATE VIEW pokemon_member_stats AS
SELECT 
    pokemon.name AS pokemon_name,
    pokemon_member.id_pokemon_member AS id_pokemon_member,
    pokemon_member.id_user AS id_user,
    pokemon_member.id_pokemon,
    pokemon_member.name AS pokemon_member_name,
    pokemon_member.id_ability,
    pokemon_member.nature,
    pokemon_member.attack_ev,
    pokemon_member.special_attack_ev,
    pokemon_member.defense_ev,
    pokemon_member.special_defense_ev,
    pokemon_member.speed_ev,
    pokemon_member.hp_ev,
    pokemon_member.attack_iv,
    pokemon_member.special_attack_iv,
    pokemon_member.defense_iv,
    pokemon_member.special_defense_iv,
    pokemon_member.speed_iv,
    pokemon_member.hp_iv,
    pokemon_member.id_item AS pokemon_member_id_item,
    pokemon_member.level,
    items.name_en AS item_name_en,
    items.name_es AS item_name_es,
    items.description_en AS item_description_en,
    items.description_es AS item_description_es,
    items.holdable,
    abilities.name_es as ability_name_es,
    abilities.description_es as ability_description_es,
    abilities.name_en as ability_name_en,
    abilities.description_en as ability_description_en
FROM 
    pokemon
INNER JOIN 
    pokemon_member USING (id_pokemon)
INNER JOIN 
    items USING (id_item)
INNER JOIN
    abilities using (id_ability);


CREATE VIEW pokemon_member_moves AS
SELECT 
    moves.id_move AS id_move,
    moves.name_en AS move_name_en,
    moves.name_es AS move_name_es,
    moves.description_en AS move_description_en,
    moves.description_es AS move_description_es,
    moves.accuracy,
    moves.power,
    moves.type AS move_type,
    moves.category,
    pokemon_member_move.id_pokemon_member AS id_pokemon_member,
    pokemon_member_move.position AS move_position,
    pokemon_member.id_user AS id_user
FROM 
    moves
INNER JOIN 
    pokemon_member_move USING (id_move)
INNER JOIN
    pokemon_member USING (id_pokemon_member);


CREATE VIEW pokemon_team_members AS
select
  pokemon_member.name,
  pokemon_member.id_pokemon,
  pokemon_member.id_pokemon_member,
  teams.name as team_name,
  teams.user_id,
  teams.id_team,
  teams.created_time,
  pokemon_team.position
from pokemon_member 
  inner join pokemon_team using (id_pokemon_member)
  inner join teams using (id_team);
