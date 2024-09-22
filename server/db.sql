USE marvel_game;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    image_url VARCHAR(255),
    attack INT NOT NULL,
    defense INT NOT NULL,
    cost INT NOT NULL
);

CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player1_id INT NOT NULL,
    player2_id INT NOT NULL,
    winner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player1_id) REFERENCES users (id),
    FOREIGN KEY (player2_id) REFERENCES users (id),
    FOREIGN KEY (winner_id) REFERENCES users (id)
);

ALTER TABLE users DROP COLUMN avatar_url;

CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    player1_id INT,
    player2_id INT,
    status VARCHAR(50) DEFAULT 'waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player1_id) REFERENCES users (id),
    FOREIGN KEY (player2_id) REFERENCES users (id)
);

INSERT INTO
    cards (
        id,
        name,
        image_url,
        attack,
        defense,
        cost
    )
VALUES (
        1,
        'Iron Man',
        '/images/iron_man.jpg',
        90,
        70,
        5
    ),
    (
        2,
        'Thanos',
        '/images/thanos.png',
        100,
        90,
        7
    ),
    (
        3,
        'Captain America',
        '/images/captain_america.png',
        80,
        85,
        6
    ),
    (
        4,
        'Hulk',
        '/images/hulk.jpg',
        95,
        60,
        5
    ),
    (
        5,
        'Thor',
        '/images/thor.jpg',
        95,
        80,
        6
    ),
    (
        6,
        'Black Widow',
        '/images/black_widow.png',
        70,
        60,
        4
    ),
    (
        7,
        'Spider Man',
        '/images/spider_man.jpg',
        85,
        75,
        5
    ),
    (
        8,
        'Doctor Strange',
        '/images/doctor_strange.png',
        90,
        80,
        6
    ),
    (
        9,
        'Scarlet Witch',
        '/images/scarlet_witch.png',
        95,
        70,
        6
    ),
    (
        10,
        'Vision',
        '/images/vision.jpg',
        85,
        80,
        5
    ),
    (
        11,
        'Black Panther',
        '/images/black_panther.png',
        85,
        85,
        6
    ),
    (
        12,
        'Ant Man',
        '/images/ant_man.png',
        75,
        65,
        4
    ),
    (
        13,
        'Hawkeye',
        '/images/hawkeye.png',
        70,
        60,
        3
    ),
    (
        14,
        'Captain Marvel',
        '/images/captain_marvel.jpg',
        100,
        90,
        7
    ),
    (
        15,
        'Loki',
        '/images/loki.jpg',
        85,
        75,
        5
    ),
    (
        16,
        'Winter Soldier',
        '/images/winter_soldier.png',
        80,
        70,
        4
    ),
    (
        17,
        'Star Lord',
        '/images/star_lord.png',
        75,
        65,
        4
    ),
    (
        18,
        'Gamora',
        '/images/gamora.png',
        85,
        70,
        5
    ),
    (
        19,
        'Groot',
        '/images/groot.png',
        70,
        80,
        4
    ),
    (
        20,
        'Rocket Raccoon',
        '/images/rocket_raccoon.png',
        80,
        65,
        4
    );