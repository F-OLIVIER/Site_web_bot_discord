-- Initialisation de la db :
-- 1: sqlite3 ./database/databaseGvG.db
-- 2: .databases
-- 3: .quit
-- run query

-- Information de fonctionnement pour le bot discord
CREATE TABLE GestionBot( 
    ID INTEGER PRIMARY KEY,
    Allumage INTEGER, -- 0 on, 1 off
    IDMessageGvG VARCHAR(50)
);
INSERT INTO GestionBot(Allumage,IDMessageGvG) VALUES(0,1206146217592225792);


-- Fiche personnage IG
CREATE TABLE Users( 
    ID INTEGER PRIMARY KEY,
    uuid INTEGER , 
    ConnectedSite INTEGER,

    DiscordID VARCHAR(50) NOT NULL,
    DiscordName VARCHAR(50) NOT NULL,
    DiscordBaseName VARCHAR(50) NOT NULL,
    DiscordRole VARCHAR(50),
    DiscordPhoto TEXT,

    GameCharacter_ID INTEGER,
    Lvl INTEGER,
    Influence INTEGER,

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
CREATE TABLE GvG( 
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
CREATE TABLE Saison( 
    ID INTEGER PRIMARY KEY,
    NameSaison VARCHAR(50),
    DateDebut DATE,
    DateFin DATE,
    NbGvG INTEGER
);

-- liste des classes IG
CREATE TABLE ListGameCharacter( 
    ID INTEGER PRIMARY KEY,
    ClasseFR VARCHAR(50),
    ClasseEN VARCHAR(50)
);
-- Insertion automatique de la liste des classes lors de la création de la databases
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Arc court','Short bow');
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Arc long','Long bow');
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Lames jumelles','Twin blades (dual blade)');
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Épée courte & bouclier','Short sword & shield');
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Épée longue & bouclier','Long sword & shield');
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Guandao','Guandao');
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Hache d''arme','Weapon ax (poleaxe)');
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Lance','Spear');
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Mousquet','Musket');
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Nodashi','Nodashi');
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Masse de guerre','Mass of war');
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Dague à chaine (cimeterre)','Chain dart (scimitar)');
INSERT INTO ListGameCharacter(ClasseFR,ClasseEN) VALUES('Pique','Pike');


CREATE TABLE ListUnit(
    ID INTEGER PRIMARY KEY,
    Unit VARCHAR(50),
    InfuenceMax INTEGER,
    LvlMax INTEGER,
    TypeUnit VARCHAR(15), -- Infanterie, Distant, Cavalerie
    ForceUnit VARCHAR(5) -- T3, T4, T5
);
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Hallebardiers',175,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Piquiers préfectoraux',185,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Gardes préfectoraux',180,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Lanciers têtes de fer',155,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Fils de Fenrir',175,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Dimachères',175,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Wuxin',170,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Piquiers impériaux',240,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Fortebraccio',235,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Prévôts hallebardiers',230,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Garde du palais',235,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Azaps',240,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Tseregs',235,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Pillard fendeur',240,24,'Infanterie','T4');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Housecarls',240,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Claymores',245,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Garde varégues',315,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Gonfanonniers',225,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Paladin symmachéen',245,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Berserkers',245,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Lanciers impériaux',230,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Fidèles symmachéen',240,24,'Infanterie','T4');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Mirmillon',245,24,'Infanterie','T4');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Vigile grisonant',240,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Javeliniers impériaux',240,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Prévôts javeliniers',230,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Moines au croissant',250,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Onna-bugeishas',215,24,'Infanterie','T4');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Hommes d''armes',215,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Silahdars',320,30,'Infanterie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Skjalmös',310,30,'Infanterie','T5');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Fauchefers',315,30,'Infanterie','T5');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Gardes modao',315,30,'Infanterie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Rétiaires',320,30,'Infanterie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Samouraï sorochis',290,30,'Infanterie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Zweihanders',300,30,'Infanterie','T5');

INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Milice zykalienne',175,15,'Distant','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Pyro-archers',180,18,'Distant','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Jannisaires',190,19,'Distant','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Schutzdieners',155,18,'Distant','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Archers gallos',245,24,'Distant','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Archers impériaux',255,24,'Distant','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Arquebusiers du Krieskrat',255,24,'Distant','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Arquebusiers impériaux',255,24,'Distant','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Siphonaros',330,30,'Distant','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Falconetti',330,30,'Distant','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Veneurs',320,30,'Distant','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Arbalétriers pavoiseurs',325,30,'Distant','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Arquebusiers tercios',310,30,'Distant','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Grenadier de Shenji',315,30,'Distant','T5');

INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Chevaucheurs',180,18,'Cavalerie','T3');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Cavalier de selem',180,18,'Cavalerie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Lancier avec Esponton',240,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Cavaliers lourds préfectoraux',240,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Lanciers ribauds',240,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Cavaliers kevthuuls',245,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Cavalerie sipho',245,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Chamelier',225,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Kriegsbruders',220,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Cataphractaires lanciers',310,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Hussards ailés',315,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Eclaireurs de Liao',315,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Kheshigs',310,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Templiers',305,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Chu ko nu montés',305,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Bannerets',340,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Cavaliers de Yanyuedao',320,30,'Cavalerie','T5');

-- exemple Unit1 (Hallebardiers) = "18" // -1: n'a pas l'unité sinon le lvl de l'unit
CREATE TABLE CaserneInfanterie( 
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER,
    Unit1 INTEGER,
    Unit2 INTEGER,
    Unit3 INTEGER,
    Unit4 INTEGER,
    Unit5 INTEGER,
    Unit6 INTEGER,
    Unit7 INTEGER,
    Unit8 INTEGER,
    Unit9 INTEGER,
    Unit10 INTEGER,
    Unit11 INTEGER,
    Unit12 INTEGER,
    Unit13 INTEGER,
    Unit14 INTEGER,
    Unit15 INTEGER,
    Unit16 INTEGER,
    Unit17 INTEGER,
    Unit18 INTEGER,
    Unit19 INTEGER,
    Unit20 INTEGER,
    Unit21 INTEGER,
    Unit22 INTEGER,
    Unit23 INTEGER,
    Unit24 INTEGER,
    Unit25 INTEGER,
    Unit26 INTEGER,
    Unit27 INTEGER,
    Unit28 INTEGER,
    Unit29 INTEGER,
    Unit30 INTEGER,
    Unit31 INTEGER,
    Unit32 INTEGER,
    Unit33 INTEGER,
    Unit34 INTEGER,
    Unit35 INTEGER,
    Unit36 INTEGER,
    Unit37 INTEGER,
    Unit38 INTEGER,
    Unit39 INTEGER,
    Unit40 INTEGER,
    Unit41 INTEGER,
    Unit42 INTEGER,
    Unit43 INTEGER,
    Unit44 INTEGER,
    Unit45 INTEGER,
    Unit46 INTEGER,
    Unit47 INTEGER,
    Unit48 INTEGER,
    Unit49 INTEGER,
    Unit50 INTEGER,
    Unit51 INTEGER,
    Unit52 INTEGER,
    Unit53 INTEGER,
    Unit54 INTEGER,
    Unit55 INTEGER,
    Unit56 INTEGER,
    Unit57 INTEGER,
    Unit58 INTEGER,
    Unit59 INTEGER,
    Unit60 INTEGER,
    Unit61 INTEGER,
    Unit62 INTEGER,
    Unit63 INTEGER,
    Unit64 INTEGER,
    Unit65 INTEGER,
    Unit66 INTEGER,
    Unit67 INTEGER,

    FOREIGN KEY(User_ID) REFERENCES Users(ID)
);
