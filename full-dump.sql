PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('f2fe991a-aa7d-48b0-95bf-fda071250b0f','b27706c66933a54343249e2a8f70c1fa5632b2f3f454a88d4dcedaf984f7e08b',1750780549102,'20250623160802_init',NULL,NULL,1750780549084,1);
INSERT INTO _prisma_migrations VALUES('19db0d0d-a1bd-48b9-bac2-3dc2ca92d9fc','2d05ce0ec26c6b649dea720a041c1ab29efa0e958291630ddbdbd2b3ee309f1c',1750780558040,'20250624155558_init',NULL,NULL,1750780558026,1);
CREATE TABLE IF NOT EXISTS "Products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "isSale" BOOLEAN NOT NULL DEFAULT false,
    "isBestSelling" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "view" INTEGER NOT NULL
, "prevPrice" INTEGER);
INSERT INTO Products ("id", "image", "title", "Description", "price", "slug", "isSale", "isBestSelling", "category", "createAt", "view", "prevPrice"),
VALUES('cmcapqdcv0001j7kb32kuqk7h','snake-plant','Snake Plant','Hardy, low-light tolerant plant with upright sword-like leaves.',15,'snake-plant',0,0,'indoor_plants',1750780880671,0,NULL),
('cmcaqaz350002j7kbe50e07pc','zz-plant','ZZ Plant','Glossy leaves, very drought-tolerant, perfect for beginners.',18,'zz-plant',0,0,'indoor_plants',1750781841954,0,NULL),
('cmcaqbhtf0003j7kb5yqsvi1y','peace-lily','Peace Lily','Lush leaves with white blooms, purifies air, needs indirect light.',20,'peace-lily',0,0,'indoor_plants',1750781866227,1,NULL),
('cmcaqbyx50004j7kbutazgwdq','pothos','Pothos','Fast-growing vine, trailing or hanging, adaptable to many conditions.',12,'pothos',1,0,'indoor_plants',1750781888393,1,NULL),
('cmcaqci5p0005j7kb05qvwo12','spider-plant','Spider Plant','Produces baby "spiderettes", good air purifier, easy to grow',10,'spider-plant',0,0,'indoor_plants',1750781913325,1,NULL),
('cmcaqcvkg0008j7kbmt19lj8z','rubber-plant','Rubber Plant','Bold foliage, prefers bright indirect light, fast-growing.',22,'rubber-plant',1,0,'indoor_plants',1750781930704,3,24),
('cmcaqd6fj0009j7kb9fqv61ju','chinese-evergreen','Chinese Evergreen','Colorful foliage, very tolerant of low light and humidity.',14,'chinese-evergreen',0,0,'indoor_plants',1750781944783,1,NULL),
('cmcaqdghv000aj7kbesmuetxr','parlor-palm','Parlor Palm','Elegant feathery fronds, thrives in low-light indoor spaces.',16,'parlor-palm',0,0,'indoor_plants',1750781957827,0,NULL),
('cmcaqduxw000bj7kbzr3y5ie2','dieffenbachia','Dieffenbachia','Broad variegated leaves, needs medium light, fast-growing.',13,'dieffenbachia',0,0,'indoor_plants',1750781976548,0,NULL),
('cmcaqe65e000cj7kb2vjnelo2','calathea','Calathea','Striking patterned leaves, thrives in humidity, perfect for indoors.',18,'calathea',0,0,'indoor_plants',1750781991074,0,NULL),
('cmcdgv3s00001j7s03b1t2vph','lavender','Lavender','Fragrant purple blooms, attracts bees, loves full sun.',8,'lavender',1,0,'outdoor_plants',1750947383521,3,10),
('cmcdgvne10002j7s0cxnv8g0u','rosemary','Rosemary','Edible herb, aromatic foliage, drought-tolerant.',7,'rosemary',0,0,'outdoor_plants',1750947408938,1,NULL),
('cmcdgw6dt0004j7s0av60u6r5','marigold','Marigold','Bright orange or yellow flowers, repels pests, good for gardens.',8,'marigold',0,0,'outdoor_plants',1750947433554,0,NULL),
('cmcdgwiu70005j7s0jnwk7nhd','bougainvillea','Bougainvillea','Vining plant with papery blooms, needs full sunlight.',15,'bougainvillea',0,0,'outdoor_plants',1750947449695,0,NULL),
('cmcdgwxyt0006j7s0sp7v3i1z','hibiscus','Hibiscus','Large vibrant flowers, tropical feel, attracts hummingbirds.',18,'hibiscus',1,0,'outdoor_plants',1750947469301,14,17),
('cmcdgxi9p0007j7s0kmu1yos3','geranium','Geranium','Colorful blooms, heat-tolerant, popular balcony plant.',12,'geranium',1,0,'outdoor_plants',1750947495613,0,10),
('cmcdgxtsc0008j7s0gdj6hagt','boxwood','Boxwood','Evergreen shrub, great for shaping and hedges.',18,'boxwood',1,0,'outdoor_plants',1750947510540,0,20),
('cmcdgy6gx0009j7s0old5wonu','petunia','Petunia','Seasonal flowering plant with trailing growth, vibrant colors.',8,'petunia',0,0,'outdoor_plants',1750947526977,0,NULL),
('cmcdgyosi000aj7s00fpf9h89','gardenia','Gardenia','White aromatic flowers, glossy green leaves, partial sun.',17,'gardenia',0,0,'outdoor_plants',1750947550723,0,NULL),
('cmcdgz0rg000bj7s0n0y9dq4h','oleander','Oleander','Tough flowering shrub, thrives in dry climates.',14,'oleander',0,0,'outdoor_plants',1750947566236,0,NULL),
CREATE TABLE IF NOT EXISTS "admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "specialCode" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "personCode" TEXT NOT NULL
);
INSERT INTO admin VALUES('cmcas1il80000j7u854ud98xn','7777','gela','');
CREATE UNIQUE INDEX "Products_slug_key" ON "Products"("slug");
CREATE UNIQUE INDEX "admin_specialCode_key" ON "admin"("specialCode");
COMMIT;
