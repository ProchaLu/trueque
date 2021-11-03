import camelcaseKeys from 'camelcase-keys';
import dotenvSafe from 'dotenv-safe';
import postgres from 'postgres';

export type User = {
  id: number;
  username: string;
  name: string;
  mail: string;
  address: string | null;
};

export type Item = {
  id: number;
  itemName: string;
  itemPrice: number;
  image: string;
  description: string;
  priceRange: number;
};

export type Session = {
  id: number;
  token: string;
  userId: number;
  expiryTimestamp: Date;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

dotenvSafe.config();

declare module globalThis {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let __postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production') {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    // When we're in development, make sure that we connect only
    // once to the database
    if (!globalThis.__postgresSqlClient) {
      globalThis.__postgresSqlClient = postgres();
    }
    sql = globalThis.__postgresSqlClient;
  }

  return sql;
}

// Connect to PostgreSQL
const sql = connectOneTimeToDatabase();

export async function getUsers() {
  const users = await sql<User[]>`
    SELECT
      id,
      name,
      username,
      mail,
      address
    FROM
      users
  `;
  return users.map((user) => {
    // Convert the snake case favorite_color to favoriteColor
    return camelcaseKeys(user);
  });
}

export async function getUser(id: number) {
  if (!id) return undefined;

  const [user] = await sql<[User]>`
    SELECT
      id,
      name,
      username,
      mail,
      address
    FROM
      users
    WHERE
      id = ${id};
  `;
  return camelcaseKeys(user);
}

export async function getUserWithPasswordHashByUsername(username: string) {
  const [user] = await sql<[UserWithPasswordHash | undefined]>`
    SELECT
      id,
      name,
      username,
      mail,
      address,
      password_hash
    FROM
      users
    WHERE
      username = ${username};
  `;
  return user && camelcaseKeys(user);
}

export async function getUserBySessionToken(sessionToken: string | undefined) {
  if (!sessionToken) return undefined;

  const [user] = await sql<[User | undefined]>`
    SELECT
      users.id,
      users.username,
      users.name,
      users.mail,
      users.address
    FROM
      sessions,
      users
    WHERE
      sessions.token = ${sessionToken} AND
      sessions.user_id = users.id
  `;
  return user && camelcaseKeys(user);
}

export async function createUser({
  name,
  username,
  mail,
  address,
}: {
  name: string;
  username: string;
  mail: string;
  address: string;
}) {
  const users = await sql`
    INSERT INTO users
      (username, name, mail, address)
    VALUES
      (${username}, ${name}, ${mail}, ${address})
    RETURNING
      id,
      name,
      username,
      mail,
      address
  `;
  return camelcaseKeys(users[0]);
}

export async function insertUser({
  username,
  passwordHash,
  name,
  mail,
  address,
}: {
  username: string;
  passwordHash: string;
  name: string;
  mail: string;
  address: string;
}) {
  const [user] = await sql<[User]>`
    INSERT INTO users
      (username, password_hash, name, mail, address)
    VALUES
      (${username}, ${passwordHash},${name}, ${mail}, ${address})
    RETURNING
      id,
      username,
      name,
      mail,
      address;
  `;
  return camelcaseKeys(user);
}

export async function updateUserById(
  id: number,
  {
    name,
    username,
    mail,
    address,
  }: {
    username: string;
    name: string;
    mail: string;
    address: string;
  },
) {
  const users = await sql`
    UPDATE
      users
    SET
      username = ${username},
      name = ${name},
      mail = ${mail},
      address = ${address}
    WHERE
      id = ${id}
    RETURNING
      id,
      name,
      username,
      mail,
      address
  `;
  return camelcaseKeys(users[0]);
}

export async function deleteUserById(id: number) {
  const users = await sql`
    DELETE FROM
      users
    WHERE
      id = ${id}
    RETURNING
      id,
      name,
      username,
      mail,
      address
  `;
  return camelcaseKeys(users[0]);
}

export async function createSession(token: string, userId: number) {
  const [session] = await sql<[Session]>`
  INSERT INTO sessions
    (token, user_id)
  VALUES
  (${token}, ${userId})
  RETURNING
  *
`;
  return camelcaseKeys(session);
}

export async function deleteExpiredSession() {
  const sessions = await sql<Session[]>`
  DELETE FROM
  sessions
  WHERE expiry_timestamp < NOW()
  RETURNING *
  `;
  return sessions.map((session) => camelcaseKeys(session))[0];
}

export async function deleteSessionByToken(token: string) {
  const sessions = await sql<Session[]>`
    DELETE FROM
      sessions
    WHERE
      token = ${token}
    RETURNING *
  `;
  return sessions.map((session) => camelcaseKeys(session))[0];
}

export async function getValidSessionByToken(token: string) {
  if (!token) return undefined;

  const [session] = await sql<[Session | undefined]>`
    SELECT
    *
    FROM
    sessions
    WHERE
    token = ${token} and
    expiry_timestamp > NOW()
  `;
  return session && camelcaseKeys(session);
}

export async function deleteExpiredSessions() {
  const sessions = await sql<Session[]>`
    DELETE FROM
      sessions
    WHERE
      expiry_timestamp < NOW()
    RETURNING *
  `;

  return sessions.map((session) => camelcaseKeys(session));
}

// ITEMS

export async function insertItem({
  itemName,
  userId,
  image,
  itemPrice,
  priceRange,
  description,
}: {
  itemName: string;
  userId: number;
  image: string;
  itemPrice: number;
  priceRange: number;
  description: string;
}) {
  const [item] = await sql<[Item]>`
    INSERT INTO items
      (item_name, user_id, image, item_price, price_range, description)
    VALUES
      (${itemName}, ${userId}, ${image}, ${itemPrice}, ${priceRange}, ${description})
    RETURNING
      id,
      item_name,
      user_id,
      image,
      item_price,
      price_range,
      description;
  `;
  return camelcaseKeys(item);
}
