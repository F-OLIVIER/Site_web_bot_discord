-- Initialisation de la db :
-- 1: sqlite3 ./database/databaseGvG.db
-- 2: .databases
-- 3: .quit
-- run query

-- Information de fonctionnement pour le bot discord
CREATE TABLE IF NOT EXISTS GestionBot( 
    ID INTEGER PRIMARY KEY,
    Allumage INTEGER, -- 0 on, 1 off
    IDMessageGvG VARCHAR(50)
);

-- Fiche personnage IG
CREATE TABLE IF NOT EXISTS Users( 
    ID INTEGER PRIMARY KEY,
    uuid INTEGER , 
    ConnectedSite INTEGER DEFAULT 0,

    DiscordID VARCHAR(50) NOT NULL,
    DiscordName VARCHAR(50) NOT NULL,
    DiscordBaseName VARCHAR(50) NOT NULL,
    DiscordRole VARCHAR(50),
    DiscordPhoto TEXT,

    GameCharacter_ID INTEGER DEFAULT 0,
    Lvl INTEGER,
    Influence INTEGER DEFAULT 700,

    EtatInscription INTEGER,
    NbEmojiInscription INTEGER,
    TrustIndicator INTEGER,
    MNDR INTEGER,
    NbGvGParticiped INTEGER, -- anciennement Assiduity
    NbTotalGvG INTEGER,
    DateLastGvGParticiped TEXT,
    
    FOREIGN KEY(GameCharacter_ID) REFERENCES ListGameCharacter(ID)
);

-- Liste des GVG (pour les Stats)
CREATE TABLE IF NOT EXISTS GvG( 
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER,
    -- Saison_ID INTEGER,
    DateGvG DATE, 
    Registered INTEGER, -- 0 non, 1 oui
    Participed INTEGER, -- présence discord : 0 non, 1 oui

    FOREIGN KEY(User_ID) REFERENCES Users(ID)
    -- FOREIGN KEY(Saison_ID) REFERENCES Saison(ID)
);

-- Information de saison
-- CREATE TABLE IF NOT EXISTS Saison( 
--     ID INTEGER PRIMARY KEY,
--     NameSaison VARCHAR(50),
--     DateDebut DATE,
--     DateFin DATE,
--     NbGvG INTEGER
-- );

-- liste des classes IG
CREATE TABLE IF NOT EXISTS ListGameCharacter( 
    ID INTEGER PRIMARY KEY,
    ClasseFR VARCHAR(50),
    ClasseEN VARCHAR(50) DEFAULT ""
);

CREATE TABLE IF NOT EXISTS ListUnit(
    ID INTEGER PRIMARY KEY,
    Unit VARCHAR(50),
    InfuenceMax INTEGER,
    LvlMax INTEGER,
    Maitrise INTEGER, -- 0 (absence de maitrise), 1 (présence d 'une maitrise)
    TypeUnit VARCHAR(15), -- Infanterie, Distant, Cavalerie
    ForceUnit VARCHAR(5), -- T3, T4, T5
    Img TEXT DEFAULT ""
);

-- exemple Unit1 (Hallebardiers) = "18" // -1: n'a pas l'unité sinon le lvl de l'unit
CREATE TABLE IF NOT EXISTS Caserne( 
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER not NULL,
    Unit1 INTEGER DEFAULT "",
    Unit2 INTEGER DEFAULT "",
    Unit3 INTEGER DEFAULT "",
    Unit4 INTEGER DEFAULT "",
    Unit5 INTEGER DEFAULT "",
    Unit6 INTEGER DEFAULT "",
    Unit7 INTEGER DEFAULT "",
    Unit8 INTEGER DEFAULT "",
    Unit9 INTEGER DEFAULT "",
    Unit10 INTEGER DEFAULT "",
    Unit11 INTEGER DEFAULT "",
    Unit12 INTEGER DEFAULT "",
    Unit13 INTEGER DEFAULT "",
    Unit14 INTEGER DEFAULT "",
    Unit15 INTEGER DEFAULT "",
    Unit16 INTEGER DEFAULT "",
    Unit17 INTEGER DEFAULT "",
    Unit18 INTEGER DEFAULT "",
    Unit19 INTEGER DEFAULT "",
    Unit20 INTEGER DEFAULT "",
    Unit21 INTEGER DEFAULT "",
    Unit22 INTEGER DEFAULT "",
    Unit23 INTEGER DEFAULT "",
    Unit24 INTEGER DEFAULT "",
    Unit25 INTEGER DEFAULT "",
    Unit26 INTEGER DEFAULT "",
    Unit27 INTEGER DEFAULT "",
    Unit28 INTEGER DEFAULT "",
    Unit29 INTEGER DEFAULT "",
    Unit30 INTEGER DEFAULT "",
    Unit31 INTEGER DEFAULT "",
    Unit32 INTEGER DEFAULT "",
    Unit33 INTEGER DEFAULT "",
    Unit34 INTEGER DEFAULT "",
    Unit35 INTEGER DEFAULT "",
    Unit36 INTEGER DEFAULT "",
    Unit37 INTEGER DEFAULT "",
    Unit38 INTEGER DEFAULT "",
    Unit39 INTEGER DEFAULT "",
    Unit40 INTEGER DEFAULT "",
    Unit41 INTEGER DEFAULT "",
    Unit42 INTEGER DEFAULT "",
    Unit43 INTEGER DEFAULT "",
    Unit44 INTEGER DEFAULT "",
    Unit45 INTEGER DEFAULT "",
    Unit46 INTEGER DEFAULT "",
    Unit47 INTEGER DEFAULT "",
    Unit48 INTEGER DEFAULT "",
    Unit49 INTEGER DEFAULT "",
    Unit50 INTEGER DEFAULT "",
    Unit51 INTEGER DEFAULT "",
    Unit52 INTEGER DEFAULT "",
    Unit53 INTEGER DEFAULT "",
    Unit54 INTEGER DEFAULT "",
    Unit55 INTEGER DEFAULT "",
    Unit56 INTEGER DEFAULT "",
    Unit57 INTEGER DEFAULT "",
    Unit58 INTEGER DEFAULT "",
    Unit59 INTEGER DEFAULT "",
    Unit60 INTEGER DEFAULT "",
    Unit61 INTEGER DEFAULT "",
    Unit62 INTEGER DEFAULT "",
    Unit63 INTEGER DEFAULT "",
    Unit64 INTEGER DEFAULT "",
    Unit65 INTEGER DEFAULT "",
    Unit66 INTEGER DEFAULT "",
    Unit67 INTEGER DEFAULT "",

    FOREIGN KEY(User_ID) REFERENCES Users(ID)
);

CREATE TABLE IF NOT EXISTS GroupGvG( 
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER,

    GroupNumber INTEGER,
    Unit1 TEXT,
    Unit2 TEXT,
    Unit3 TEXT,
    Unit4 TEXT,

    FOREIGN KEY(User_ID) REFERENCES Users(ID)
);

-- exemple Unit1 (Hallebardiers) // 0: ne maitrise pas, 1: maitrise en cour, 2: maitrise compléte
CREATE TABLE IF NOT EXISTS CaserneMaitrise( 
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER not NULL,
    Unit1 INTEGER DEFAULT "",
    Unit2 INTEGER DEFAULT "",
    Unit3 INTEGER DEFAULT "",
    Unit4 INTEGER DEFAULT "",
    Unit5 INTEGER DEFAULT "",
    Unit6 INTEGER DEFAULT "",
    Unit7 INTEGER DEFAULT "",
    Unit8 INTEGER DEFAULT "",
    Unit9 INTEGER DEFAULT "",
    Unit10 INTEGER DEFAULT "",
    Unit11 INTEGER DEFAULT "",
    Unit12 INTEGER DEFAULT "",
    Unit13 INTEGER DEFAULT "",
    Unit14 INTEGER DEFAULT "",
    Unit15 INTEGER DEFAULT "",
    Unit16 INTEGER DEFAULT "",
    Unit17 INTEGER DEFAULT "",
    Unit18 INTEGER DEFAULT "",
    Unit19 INTEGER DEFAULT "",
    Unit20 INTEGER DEFAULT "",
    Unit21 INTEGER DEFAULT "",
    Unit22 INTEGER DEFAULT "",
    Unit23 INTEGER DEFAULT "",
    Unit24 INTEGER DEFAULT "",
    Unit25 INTEGER DEFAULT "",
    Unit26 INTEGER DEFAULT "",
    Unit27 INTEGER DEFAULT "",
    Unit28 INTEGER DEFAULT "",
    Unit29 INTEGER DEFAULT "",
    Unit30 INTEGER DEFAULT "",
    Unit31 INTEGER DEFAULT "",
    Unit32 INTEGER DEFAULT "",
    Unit33 INTEGER DEFAULT "",
    Unit34 INTEGER DEFAULT "",
    Unit35 INTEGER DEFAULT "",
    Unit36 INTEGER DEFAULT "",
    Unit37 INTEGER DEFAULT "",
    Unit38 INTEGER DEFAULT "",
    Unit39 INTEGER DEFAULT "",
    Unit40 INTEGER DEFAULT "",
    Unit41 INTEGER DEFAULT "",
    Unit42 INTEGER DEFAULT "",
    Unit43 INTEGER DEFAULT "",
    Unit44 INTEGER DEFAULT "",
    Unit45 INTEGER DEFAULT "",
    Unit46 INTEGER DEFAULT "",
    Unit47 INTEGER DEFAULT "",
    Unit48 INTEGER DEFAULT "",
    Unit49 INTEGER DEFAULT "",
    Unit50 INTEGER DEFAULT "",
    Unit51 INTEGER DEFAULT "",
    Unit52 INTEGER DEFAULT "",
    Unit53 INTEGER DEFAULT "",
    Unit54 INTEGER DEFAULT "",
    Unit55 INTEGER DEFAULT "",
    Unit56 INTEGER DEFAULT "",
    Unit57 INTEGER DEFAULT "",
    Unit58 INTEGER DEFAULT "",
    Unit59 INTEGER DEFAULT "",
    Unit60 INTEGER DEFAULT "",
    Unit61 INTEGER DEFAULT "",
    Unit62 INTEGER DEFAULT "",
    Unit63 INTEGER DEFAULT "",
    Unit64 INTEGER DEFAULT "",
    Unit65 INTEGER DEFAULT "",
    Unit66 INTEGER DEFAULT "",
    Unit67 INTEGER DEFAULT "",

    FOREIGN KEY(User_ID) REFERENCES Users(ID)
);

