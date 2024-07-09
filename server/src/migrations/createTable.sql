BEGIN;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('todo', 'doing', 'blocked', 'done');
    END IF;
END
$$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
        CREATE TYPE role AS ENUM ('user', 'driver');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS ACCOUNT(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_type role DEFAULT 'user',
    username VARCHAR(50),
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS SESSION(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
);

CREATE TABLE IF NOT EXISTS "USER"(
    account_id UUID PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    phone VARCHAR(20),
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
);


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'driver_status') THEN
        CREATE TYPE driver_status AS ENUM ('offline', 'online', 'onride');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS DRIVER(
    account_id UUID PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    phone VARCHAR(20),
    status driver_status DEFAULT 'offline',
    cab_type VARCHAR(50),
    cab_regno VARCHAR(50),
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
);


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ride_status') THEN
        CREATE TYPE ride_status AS ENUM ('started', 'success', 'onride', 'pending','requested');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS RIDE(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    driver_id UUID,
    status ride_status DEFAULT 'pending',
    source POINT,
    destination POINT,
    eta INT CHECK (eta > 0),
    price INT CHECK (price > 0),
    rating SMALLINT CHECK (rating >= 0 AND rating <= 5),
    review TEXT,
    FOREIGN KEY (user_id) REFERENCES "USER"(account_id),
    FOREIGN KEY (driver_id) REFERENCES DRIVER(account_id)
);

COMMIT;
