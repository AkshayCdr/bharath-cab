
CREATE TYPE role AS ENUM ('user','driver');

CREATE TABLE IF NOT EXISTS ACCOUNT(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_type role DEFAULT 'user',  
    username varchar(50),
    password varchar(255)
);



CREATE TABLE IF NOT EXISTS SESSION(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
);


CREATE TABLE IF NOT EXISTS "USER"(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    phone VARCHAR(20),
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
) ;

CREATE TYPE driver_status AS ENUM ('offline', 'online', 'onride');

CREATE TABLE IF NOT EXISTS DRIVER(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    phone VARCHAR(20),
    status driver_status DEFAULT 'offline',
    cab_type VARCHAR(50),
    cab_regno VARCHAR(50),
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
);

CREATE TYPE ride_status AS ENUM ('started', 'success', 'onride','pending');

CREATE TABLE IF NOT EXISTS RIDE(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    driver_id UUID,
    status ride_status DEFAULT 'pending',
    source POINT,
    destination POINT,
    eta INT CHECK (eta > 0),
    price INT CHECK (price > 0),
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    review TEXT, 
    FOREIGN KEY (user_id) REFERENCES "USER"(id),
    FOREIGN KEY (driver_id) REFERENCES DRIVER(id)
);