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
        INSERT INTO GestionBot(Allumage,IDMessageGvG) VALUES(0,1206146217592225792)

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
        -- Unité Infanterie
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Hallebardiers',165,18,1,'Infanterie','T3','./img/unit/hallebardiers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Fils de Fenrir',175,18,0,'Infanterie','T3','./img/unit/filsFenrir.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Piquiers du Wuxing',155,18,0,'Infanterie','T3','./img/unit/piquiersWuxing.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Piquiers impériaux',240,24,1,'Infanterie','T4','./img/unit/piquiersImperiaux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Fortebraccio',235,24,0,'Infanterie','T4','./img/unit/piquiersFortebraccio.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Prévôts hallebardiers',230,24,1,'Infanterie','T4','./img/unit/prevot_hallebardier.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gardes du palais',235,24,1,'Infanterie','T4','./img/unit/gardesPalais.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Azaps',240,24,0,'Infanterie','T4','./img/unit/azaps.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Tseregs',235,24,0,'Infanterie','T4','./img/unit/tseregs.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Pillard fendeurs',240,24,0,'Infanterie','T4','./img/unit/pilardsFendeurs.jpg');	
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Housecarls',240,24,0,'Infanterie','T4','./img/unit/housecarls.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Claymores',245,24,0,'Infanterie','T4','./img/unit/claymores.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Paladin symmachéen',245,24,0,'Infanterie','T4','./img/unit/paladinsSymmacheens.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Berserkers',245,24,0,'Infanterie','T4','./img/unit/berserkers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Lanciers impériaux',230,24,1,'Infanterie','T4','./img/unit/lanciers_imperiaux.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Fidèles symmachéen',240,24,0,'Infanterie','T4','./img/unit/fidelesSymmacheens.jpg');	
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Mirmillons',245,24,0,'Infanterie','T4','./img/unit/mirmillons.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Vigile grisonnants',200,24,0,'Infanterie','T4','./img/unit/vigilesGrisonnants.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Javeliniers impériaux',240,24,1,'Infanterie','T4','./img/unit/javeliniersImperiaux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Prévôts javeliniers',230,24,1,'Infanterie','T4','./img/unit/prevotsJaveliniers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Prévôts lanciers',215,24,0,'Infanterie','T4','./img/unit/prevotsLanciers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Moines au croissant',250,24,0,'Infanterie','T4','./img/unit/moinesCroissant.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Onna-bugeishas',235,24,0,'Infanterie','T4','./img/unit/onnaBugeishas.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Hommes d''armes',215,24,0,'Infanterie','T4','./img/unit/hommesArmes.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Silahdars',320,30,0,'Infanterie','T5','./img/unit/silahdar.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Skjaldmös',310,30,0,'Infanterie','T5','./img/unit/valkyrie.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Fauchefers',315,30,0,'Infanterie','T5','./img/unit/fauchefer.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gardes modao',315,30,0,'Infanterie','T5','./img/unit/modao.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Samouraï sorochis',295,30,0,'Infanterie','T5','./img/unit/samouraisOrochis.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Zweihanders',310,30,0,'Infanterie','T5','./img/unit/Zweihanders.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Alchimistes',60,18,0,'Infanterie','T3','./img/unit/alchimistes.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Condottières',160,18,0,'Infanterie','T3','./img/unit/condottieres.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cornemuseurs',90,18,0,'Infanterie','T3','./img/unit/cornemuseurs.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Dimachères',165,18,0,'Infanterie','T3','./img/unit/dimacheres.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Écuyers',155,18,0,'Infanterie','T3','./img/unit/ecuyers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gardes Préfectoraux',170,18,1,'Infanterie','T3','./img/unit/gardesPrefectoraux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gardes varègues',290,30,0,'Infanterie','T5','./img/unit/gardesVaregues.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gardes de Wuwai',225,24,0,'Infanterie','T4','./img/unit/gardesWuwei.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gonfalonniers',225,24,0,'Infanterie','T4','./img/unit/gonfalonniers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Hashashins',295,30,0,'Infanterie','T5','./img/unit/hashashins.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Jangjus',170,30,0,'Infanterie','T3','./img/unit/jangjus.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Lanciers du dragon noir',80,20,0,'Infanterie','T3','./img/unit/lanciersDragonNoir.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Lanciers tête-de-fer',130,18,1,'Infanterie','T3','./img/unit/lanciersTeteDeFer.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Moines guerriers',145,18,0,'Infanterie','T3','./img/unit/moinesGuerriers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Naginata',125,20,0,'Infanterie','T3','./img/unit/naginata.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gardes royaux de Perceval',225,24,0,'Infanterie','T4','./img/unit/percevalJav.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Piquiers du dragon noir',80,20,0,'Infanterie','T3','./img/unit/piquiersDragonNoir.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Piquiers préfectoraux',165,18,0,'Infanterie','T3','./img/unit/piquiersPrefectoraux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Prévôts marteleurs',150,18,1,'Infanterie','T3','./img/unit/prevotsMarteleurs.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Chavaliers de la Reine',295,30,0,'Infanterie','T5','./img/unit/queenKnight.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Rétiaires',305,30,0,'Infanterie','T5','./img/unit/retiaires.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Ronins',145,18,0,'Infanterie','T3','./img/unit/ronins.jpg');

        -- Unité Distant
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Milice zykalienne',175,15,0,'Distant','T3','./img/unit/miliceZykalienne.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Pyro-archers',180,18,0,'Distant','T3','./img/unit/pyroArchers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Jannisaires',190,19,0,'Distant','T3','./img/unit/janissaires.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Schutzdieners',155,18,0,'Distant','T3','./img/unit/schutzdieners.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers gallos',245,24,0,'Distant','T4','./img/unit/archer_gallos.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers impériaux',255,24,0,'Distant','T4','./img/unit/archersImperiaux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arquebusiers du Krieskrat',255,24,1,'Distant','T4','./img/unit/arquebusiersKriegsrat.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arquebusiers impériaux',255,24,0,'Distant','T4','./img/unit/arquebusiersImperiaux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Siphonaros',330,30,0,'Distant','T5','./img/unit/siphonaros.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Falconetti',330,30,0,'Distant','T5','./img/unit/falconetti.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Veneurs',320,30,0,'Distant','T5','./img/unit/veneurs.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arbalétriers pavoiseurs',325,30,0,'Distant','T5','./img/unit/arbaletrier_pavoiseur.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arquebusiers tercios',310,30,0,'Distant','T5','./img/unit/arquebusiersTercios.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Grenadier de Shenji',315,30,0,'Distant','T5','./img/unit/grenadier_de_shenji.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arbalétriers avant-garde',160,18,0,'Distant','T3','./img/unit/arbaletriersAvantGarde.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arbalétriers à plumes',150,18,0,'Distant','T3','./img/unit/arbaletriersPlumes.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers avant-garde',150,18,0,'Distant','T3','./img/unit/archersAvantGarde.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers avant-garde',150,18,0,'Distant','T3','./img/unit/archersAvantGarde.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers de namkhan',180,18,0,'Distant','T3','./img/unit/archersNamkhan.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers préfectoraux',180,18,0,'Distant','T3','./img/unit/archersPrefectoraux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers vipères',155,18,0,'Distant','T3','./img/unit/archersViperes.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arquebusiers Ashigarus',205,24,0,'Distant','T4','./img/unit/arquebusiersAshigarus.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arquebusiers domaine',170,18,0,'Distant','T4','./img/unit/arquebusiersDomaine.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Faucheurs Épieurs des Mers',80,20,0,'Distant','T4','./img/unit/faucheursEpieursMers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Javeliniers du dragon noir',80,20,0,'Distant','T3','./img/unit/javeliniersDragonNoir.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Maîtres de la chu ko nu',175,18,0,'Distant','T3','./img/unit/maitresChuKoNu.jpg');

        -- Unité Cavalerie
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Chevaucheurs',180,18,0,'Cavalerie','T3','./img/unit/chevaucheurs.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Pionniers du Selem',150,18,0,'Cavalerie','T3','./img/unit/pionniersSelem.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Lancier avec esponton',240,24,0,'Cavalerie','T4','./img/unit/lanciersEsponton.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cavaliers lourds préfectoraux',240,24,0,'Cavalerie','T4','./img/unit/cavaliersLourdsPrefectoraux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Lanciers ribauds',240,24,0,'Cavalerie','T4','./img/unit/lanciersRibauds.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cavaliers kevthuuls',245,24,0,'Cavalerie','T4','./img/unit/cavaliersKevthuuls.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cyphaux',215,24,0,'Cavalerie','T4','./img/unit/cyphaux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Chamelier lanciers',225,24,0,'Cavalerie','T4','./img/unit/chameliersLanciers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Kriegsbruders',230,24,0,'Cavalerie','T4','./img/unit/kriegsbruders.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cataphractaires lanciers',310,30,0,'Cavalerie','T5','./img/unit/cataphractairesLanciers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Hussards ailés',315,30,0,'Cavalerie','T5','./img/unit/hussardsAiles.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Eclaireurs de Liao',315,30,0,'Cavalerie','T5','./img/unit/eclaireursLiao.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Kheshigs',310,30,0,'Cavalerie','T5','./img/unit/kheshigs.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Templiers',305,30,0,'Cavalerie','T5','./img/unit/templiers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Maître de la chu ko nu montés',305,30,0,'Cavalerie','T5','./img/unit/maitresChuKoNuMontes.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Bannerets',340,30,0,'Cavalerie','T5','./img/unit/bannerets.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cavaliers de Yanyuedao',320,30,0,'Cavalerie','T5','./img/unit/cavaliersYanyuedao.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cavaliers de Caradoc',195,18,0,'Cavalerie','T3','./img/unit/caradocCav.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cavaliers lourds de Xuanjia',305,30,0,'Cavalerie','T5','./img/unit/cavaliersLourdsXuanjia.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('khorchins',140,18,0,'Cavalerie','T3','./img/unit/khorchins.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Pyro-lanciers',285,30,0,'Cavalerie','T5','./img/unit/pyroLanciers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Yeomen',225,24,0,'Cavalerie','T4','./img/unit/yeomen.jpg');


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

