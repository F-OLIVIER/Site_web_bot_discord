-- Initialisation manuel de la db :
-- 1: sqlite3 ./database/databaseGvG.db
-- 2: .databases
-- 3: .quit
-- run query
CREATE TABLE IF NOT EXISTS GestionBot (
    ID INTEGER PRIMARY KEY,
    Allumage INTEGER DEFAULT 0, -- 0 on, 1 off
    IDMessageGvG VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Users (
    ID INTEGER PRIMARY KEY,
    uuid INTEGER,
    uuidApp INTEGER DEFAULT 0,
    ConnectedSite INTEGER DEFAULT 0,
    DiscordID VARCHAR(50) NOT NULL,
    DiscordName VARCHAR(50) NOT NULL,
    DiscordBaseName VARCHAR(50) NOT NULL,
    DiscordRole VARCHAR(50),
    DiscordPhoto TEXT,
    GameCharacter_ID INTEGER DEFAULT 0,
    Lvl INTEGER DEFAULT 0,
    Influence INTEGER DEFAULT 700,
    EtatInscription INTEGER DEFAULT 0,
    TrustIndicator INTEGER DEFAULT 0,
    MNDR INTEGER DEFAULT 0,
    NbGvGParticiped INTEGER DEFAULT 0,
    NbTotalGvG INTEGER DEFAULT 0,
    DateLastGvGParticiped TEXT default "",
    FOREIGN KEY (GameCharacter_ID) REFERENCES ListGameCharacter (ID)
);

CREATE TABLE IF NOT EXISTS GroupGvG (
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER NOT NULL,
    GroupNumber INTEGER NOT NULL,
    Unit1 VARCHAR(50) DEFAULT "",
    Unit2 VARCHAR(50) DEFAULT "",
    Unit3 VARCHAR(50) DEFAULT "",
    Unit4 VARCHAR(50) DEFAULT "",
    FOREIGN KEY (User_ID) REFERENCES Users (ID)
);

CREATE TABLE IF NOT EXISTS GroupTypeAtt (
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER NOT NULL,
    GroupNumber INTEGER NOT NULL,
    Unit1 VARCHAR(50) DEFAULT "",
    Unit2 VARCHAR(50) DEFAULT "",
    Unit3 VARCHAR(50) DEFAULT "",
    Unit4 VARCHAR(50) DEFAULT "",
    FOREIGN KEY (User_ID) REFERENCES Users (ID)
);

CREATE TABLE IF NOT EXISTS GroupTypeDef (
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER NOT NULL,
    GroupNumber INTEGER NOT NULL,
    Unit1 VARCHAR(50) DEFAULT "",
    Unit2 VARCHAR(50) DEFAULT "",
    Unit3 VARCHAR(50) DEFAULT "",
    Unit4 VARCHAR(50) DEFAULT "",
    FOREIGN KEY (User_ID) REFERENCES Users (ID)
);

CREATE TABLE IF NOT EXISTS NameGroupGvG (
    ID INTEGER PRIMARY KEY,
    GroupNumber INTEGER NOT NULL,
    NameGroup VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS HistoryGvG (
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER NOT NULL,
    DateGvG VARCHAR(50) NOT NULL,
    Valid INTEGER NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES Users (ID)
);

CREATE TABLE IF NOT EXISTS ListGameCharacter (
    ID INTEGER PRIMARY KEY,
    ClasseFR VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS ListUnit (
    ID INTEGER PRIMARY KEY,
    Unit VARCHAR(50),
    InfuenceMax INTEGER,
    LvlMax INTEGER,
    Maitrise INTEGER DEFAULT 0, -- 0 (absence de maitrise), 1 (présence d 'une maitrise)
    TypeUnit VARCHAR(15), -- Infanterie, Distant, Cavalerie
    ForceUnit VARCHAR(5), -- T3, T4, T5
    Img TEXT DEFAULT ""
);

CREATE TABLE IF NOT EXISTS Caserne (
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER NOT NULL,
    Unit1 INTEGER DEFAULT 0,
    Unit2 INTEGER DEFAULT 0,
    Unit3 INTEGER DEFAULT 0,
    Unit4 INTEGER DEFAULT 0,
    Unit5 INTEGER DEFAULT 0,
    Unit6 INTEGER DEFAULT 0,
    Unit7 INTEGER DEFAULT 0,
    Unit8 INTEGER DEFAULT 0,
    Unit9 INTEGER DEFAULT 0,
    Unit10 INTEGER DEFAULT 0,
    Unit11 INTEGER DEFAULT 0,
    Unit12 INTEGER DEFAULT 0,
    Unit13 INTEGER DEFAULT 0,
    Unit14 INTEGER DEFAULT 0,
    Unit15 INTEGER DEFAULT 0,
    Unit16 INTEGER DEFAULT 0,
    Unit17 INTEGER DEFAULT 0,
    Unit18 INTEGER DEFAULT 0,
    Unit19 INTEGER DEFAULT 0,
    Unit20 INTEGER DEFAULT 0,
    Unit21 INTEGER DEFAULT 0,
    Unit22 INTEGER DEFAULT 0,
    Unit23 INTEGER DEFAULT 0,
    Unit24 INTEGER DEFAULT 0,
    Unit25 INTEGER DEFAULT 0,
    Unit26 INTEGER DEFAULT 0,
    Unit27 INTEGER DEFAULT 0,
    Unit28 INTEGER DEFAULT 0,
    Unit29 INTEGER DEFAULT 0,
    Unit30 INTEGER DEFAULT 0,
    Unit31 INTEGER DEFAULT 0,
    Unit32 INTEGER DEFAULT 0,
    Unit33 INTEGER DEFAULT 0,
    Unit34 INTEGER DEFAULT 0,
    Unit35 INTEGER DEFAULT 0,
    Unit36 INTEGER DEFAULT 0,
    Unit37 INTEGER DEFAULT 0,
    Unit38 INTEGER DEFAULT 0,
    Unit39 INTEGER DEFAULT 0,
    Unit40 INTEGER DEFAULT 0,
    Unit41 INTEGER DEFAULT 0,
    Unit42 INTEGER DEFAULT 0,
    Unit43 INTEGER DEFAULT 0,
    Unit44 INTEGER DEFAULT 0,
    Unit45 INTEGER DEFAULT 0,
    Unit46 INTEGER DEFAULT 0,
    Unit47 INTEGER DEFAULT 0,
    Unit48 INTEGER DEFAULT 0,
    Unit49 INTEGER DEFAULT 0,
    Unit50 INTEGER DEFAULT 0,
    Unit51 INTEGER DEFAULT 0,
    Unit52 INTEGER DEFAULT 0,
    Unit53 INTEGER DEFAULT 0,
    Unit54 INTEGER DEFAULT 0,
    Unit55 INTEGER DEFAULT 0,
    Unit56 INTEGER DEFAULT 0,
    Unit57 INTEGER DEFAULT 0,
    Unit58 INTEGER DEFAULT 0,
    Unit59 INTEGER DEFAULT 0,
    Unit60 INTEGER DEFAULT 0,
    Unit61 INTEGER DEFAULT 0,
    Unit62 INTEGER DEFAULT 0,
    Unit63 INTEGER DEFAULT 0,
    Unit64 INTEGER DEFAULT 0,
    Unit65 INTEGER DEFAULT 0,
    Unit66 INTEGER DEFAULT 0,
    Unit67 INTEGER DEFAULT 0,
    Unit68 INTEGER DEFAULT 0,
    Unit69 INTEGER DEFAULT 0,
    Unit70 INTEGER DEFAULT 0,
    Unit71 INTEGER DEFAULT 0,
    Unit72 INTEGER DEFAULT 0,
    Unit73 INTEGER DEFAULT 0,
    Unit74 INTEGER DEFAULT 0,
    Unit75 INTEGER DEFAULT 0,
    Unit76 INTEGER DEFAULT 0,
    Unit77 INTEGER DEFAULT 0,
    Unit78 INTEGER DEFAULT 0,
    Unit79 INTEGER DEFAULT 0,
    Unit80 INTEGER DEFAULT 0,
    Unit81 INTEGER DEFAULT 0,
    Unit82 INTEGER DEFAULT 0,
    Unit83 INTEGER DEFAULT 0,
    Unit84 INTEGER DEFAULT 0,
    Unit85 INTEGER DEFAULT 0,
    Unit86 INTEGER DEFAULT 0,
    Unit87 INTEGER DEFAULT 0,
    Unit88 INTEGER DEFAULT 0,
    Unit89 INTEGER DEFAULT 0,
    Unit90 INTEGER DEFAULT 0,
    Unit91 INTEGER DEFAULT 0,
    Unit92 INTEGER DEFAULT 0,
    Unit93 INTEGER DEFAULT 0,
    Unit94 INTEGER DEFAULT 0,
    Unit95 INTEGER DEFAULT 0,
    Unit96 INTEGER DEFAULT 0,
    Unit97 INTEGER DEFAULT 0,
    Unit98 INTEGER DEFAULT 0,
    Unit99 INTEGER DEFAULT 0,
    FOREIGN KEY (User_ID) REFERENCES Users (ID)
);

CREATE TABLE IF NOT EXISTS CaserneMaitrise (
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER NOT NULL,
    Unit1 INTEGER DEFAULT 0,
    Unit2 INTEGER DEFAULT 0,
    Unit3 INTEGER DEFAULT 0,
    Unit4 INTEGER DEFAULT 0,
    Unit5 INTEGER DEFAULT 0,
    Unit6 INTEGER DEFAULT 0,
    Unit7 INTEGER DEFAULT 0,
    Unit8 INTEGER DEFAULT 0,
    Unit9 INTEGER DEFAULT 0,
    Unit10 INTEGER DEFAULT 0,
    Unit11 INTEGER DEFAULT 0,
    Unit12 INTEGER DEFAULT 0,
    Unit13 INTEGER DEFAULT 0,
    Unit14 INTEGER DEFAULT 0,
    Unit15 INTEGER DEFAULT 0,
    Unit16 INTEGER DEFAULT 0,
    Unit17 INTEGER DEFAULT 0,
    Unit18 INTEGER DEFAULT 0,
    Unit19 INTEGER DEFAULT 0,
    Unit20 INTEGER DEFAULT 0,
    Unit21 INTEGER DEFAULT 0,
    Unit22 INTEGER DEFAULT 0,
    Unit23 INTEGER DEFAULT 0,
    Unit24 INTEGER DEFAULT 0,
    Unit25 INTEGER DEFAULT 0,
    Unit26 INTEGER DEFAULT 0,
    Unit27 INTEGER DEFAULT 0,
    Unit28 INTEGER DEFAULT 0,
    Unit29 INTEGER DEFAULT 0,
    Unit30 INTEGER DEFAULT 0,
    Unit31 INTEGER DEFAULT 0,
    Unit32 INTEGER DEFAULT 0,
    Unit33 INTEGER DEFAULT 0,
    Unit34 INTEGER DEFAULT 0,
    Unit35 INTEGER DEFAULT 0,
    Unit36 INTEGER DEFAULT 0,
    Unit37 INTEGER DEFAULT 0,
    Unit38 INTEGER DEFAULT 0,
    Unit39 INTEGER DEFAULT 0,
    Unit40 INTEGER DEFAULT 0,
    Unit41 INTEGER DEFAULT 0,
    Unit42 INTEGER DEFAULT 0,
    Unit43 INTEGER DEFAULT 0,
    Unit44 INTEGER DEFAULT 0,
    Unit45 INTEGER DEFAULT 0,
    Unit46 INTEGER DEFAULT 0,
    Unit47 INTEGER DEFAULT 0,
    Unit48 INTEGER DEFAULT 0,
    Unit49 INTEGER DEFAULT 0,
    Unit50 INTEGER DEFAULT 0,
    Unit51 INTEGER DEFAULT 0,
    Unit52 INTEGER DEFAULT 0,
    Unit53 INTEGER DEFAULT 0,
    Unit54 INTEGER DEFAULT 0,
    Unit55 INTEGER DEFAULT 0,
    Unit56 INTEGER DEFAULT 0,
    Unit57 INTEGER DEFAULT 0,
    Unit58 INTEGER DEFAULT 0,
    Unit59 INTEGER DEFAULT 0,
    Unit60 INTEGER DEFAULT 0,
    Unit61 INTEGER DEFAULT 0,
    Unit62 INTEGER DEFAULT 0,
    Unit63 INTEGER DEFAULT 0,
    Unit64 INTEGER DEFAULT 0,
    Unit65 INTEGER DEFAULT 0,
    Unit66 INTEGER DEFAULT 0,
    Unit67 INTEGER DEFAULT 0,
    Unit68 INTEGER DEFAULT 0,
    Unit69 INTEGER DEFAULT 0,
    Unit70 INTEGER DEFAULT 0,
    Unit71 INTEGER DEFAULT 0,
    Unit72 INTEGER DEFAULT 0,
    Unit73 INTEGER DEFAULT 0,
    Unit74 INTEGER DEFAULT 0,
    Unit75 INTEGER DEFAULT 0,
    Unit76 INTEGER DEFAULT 0,
    Unit77 INTEGER DEFAULT 0,
    Unit78 INTEGER DEFAULT 0,
    Unit79 INTEGER DEFAULT 0,
    Unit80 INTEGER DEFAULT 0,
    Unit81 INTEGER DEFAULT 0,
    Unit82 INTEGER DEFAULT 0,
    Unit83 INTEGER DEFAULT 0,
    Unit84 INTEGER DEFAULT 0,
    Unit85 INTEGER DEFAULT 0,
    Unit86 INTEGER DEFAULT 0,
    Unit87 INTEGER DEFAULT 0,
    Unit88 INTEGER DEFAULT 0,
    Unit89 INTEGER DEFAULT 0,
    Unit90 INTEGER DEFAULT 0,
    Unit91 INTEGER DEFAULT 0,
    Unit92 INTEGER DEFAULT 0,
    Unit93 INTEGER DEFAULT 0,
    Unit94 INTEGER DEFAULT 0,
    Unit95 INTEGER DEFAULT 0,
    Unit96 INTEGER DEFAULT 0,
    Unit97 INTEGER DEFAULT 0,
    Unit98 INTEGER DEFAULT 0,
    Unit99 INTEGER DEFAULT 0,
    FOREIGN KEY (User_ID) REFERENCES Users (ID)
);

CREATE TABLE IF NOT EXISTS ListEvent (
    ID INTEGER PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Descriptions VARCHAR(4000) NOT NULL,
    Dates VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS EventInscripted (
    ID INTEGER PRIMARY KEY,
    IDevent INTEGER NOT NULL,
    User_ID INTEGER NOT NULL,
    FOREIGN KEY (IDevent) REFERENCES ListEvent (ID),
    FOREIGN KEY (User_ID) REFERENCES Users (ID)
);

CREATE TABLE IF NOT EXISTS HouseScreen (
    ID INTEGER PRIMARY KEY,
    Screen TEXT DEFAULT "",
    DescriptionScreen VARCHAR(500) DEFAULT ""
);
