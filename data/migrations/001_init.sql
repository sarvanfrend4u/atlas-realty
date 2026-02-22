-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         TEXT NOT NULL,
    price         BIGINT NOT NULL,
    beds          SMALLINT,
    baths         SMALLINT,
    area_sqft     INTEGER,
    address       TEXT,
    neighborhood  TEXT,
    city          TEXT DEFAULT 'Chennai',
    lat           DOUBLE PRECISION NOT NULL,
    lng           DOUBLE PRECISION NOT NULL,
    property_type TEXT DEFAULT 'apartment',
    created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS listings_lat_lng_idx ON listings (lat, lng);

-- Seed data — 20 Chennai properties
INSERT INTO listings (title, price, beds, baths, area_sqft, address, neighborhood, lat, lng, property_type) VALUES
('Modern 3BHK in Sholinganallur',           8500000,  3, 2, 1350, 'Rajiv Gandhi Salai, Sholinganallur', 'Sholinganallur', 12.9010, 80.2279, 'apartment'),
('Spacious 3BHK in Anna Nagar',            12000000,  3, 3, 1800, '4th Avenue, Anna Nagar',              'Anna Nagar',     13.0850, 80.2101, 'apartment'),
('Premium 4BHK in T. Nagar',               18000000,  4, 3, 2200, 'Usman Road, T. Nagar',                'T. Nagar',       13.0418, 80.2341, 'apartment'),
('Luxury Penthouse in Adyar',              24000000,  4, 4, 2800, 'LB Road, Adyar',                      'Adyar',          13.0012, 80.2565, 'apartment'),
('Cozy 2BHK in Velachery',                  6700000,  2, 2, 1100, 'Velachery Main Road',                 'Velachery',      12.9815, 80.2209, 'apartment'),
('Affordable 2BHK in Porur',                5500000,  2, 1,  950, 'Arcot Road, Porur',                   'Porur',          13.0357, 80.1569, 'apartment'),
('3BHK Gated Community in Mogappair',       7200000,  3, 2, 1250, 'Mogappair West',                      'Mogappair',      13.0850, 80.1609, 'apartment'),
('Budget 2BHK in Perambur',                 4200000,  2, 1,  850, 'Perambur Barracks Road',              'Perambur',       13.1158, 80.2421, 'apartment'),
('Starter Home in Tambaram',                3800000,  2, 1,  800, 'GST Road, Tambaram',                  'Tambaram',       12.9249, 80.1000, 'apartment'),
('Sea View 3BHK near ECR',                  9500000,  3, 2, 1400, 'East Coast Road, Thiruvanmiyur',      'Thiruvanmiyur',  12.9828, 80.2594, 'apartment'),
('Premium 3BHK in Kilpauk',                14000000,  3, 2, 1600, 'Kilpauk Garden Road',                 'Kilpauk',        13.0750, 80.2350, 'apartment'),
('Luxury 4BHK in Nungambakkam',            21000000,  4, 3, 2500, 'Nungambakkam High Road',              'Nungambakkam',   13.0569, 80.2425, 'apartment'),
('3BHK in Perungudi IT Corridor',           7800000,  3, 2, 1300, 'OMR, Perungudi',                      'Perungudi',      12.9534, 80.2424, 'apartment'),
('Value 2BHK in Kelambakkam',               3500000,  2, 1,  750, 'Kelambakkam Main Road',               'Kelambakkam',    12.7845, 80.2204, 'apartment'),
('2BHK in Pallikaranai',                    5200000,  2, 2, 1000, 'Pallikaranai Main Road',              'Pallikaranai',   12.9391, 80.2113, 'apartment'),
('2BHK in Ambattur',                        4800000,  2, 1,  900, 'Ambattur Industrial Estate',          'Ambattur',       13.1143, 80.1548, 'apartment'),
('Budget 2BHK in Chromepet',                4400000,  2, 1,  850, 'GST Road, Chromepet',                 'Chromepet',      12.9516, 80.1426, 'apartment'),
('Heritage Villa in Mylapore',             35000000,  5, 5, 4000, 'R K Mutt Road, Mylapore',             'Mylapore',       13.0358, 80.2689, 'villa'),
('Premium 4BHK in Besant Nagar',           28000000,  4, 4, 3200, '3rd Avenue, Besant Nagar',            'Besant Nagar',   12.9990, 80.2686, 'apartment'),
('3BHK in Thoraipakkam',                    8800000,  3, 2, 1350, 'OMR, Thoraipakkam',                   'Thoraipakkam',   12.9289, 80.2334, 'apartment')
ON CONFLICT DO NOTHING;
