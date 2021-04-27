DROP TABLE IF EXISTS make;
CREATE TABLE make (
    id SERIAL PRIMARY KEY,
    product VARCHAR(255),
    price VARCHAR(255),
    image VARCHAR(255),
    discription VARCHAR(255)
)