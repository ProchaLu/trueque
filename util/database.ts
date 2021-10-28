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
      users;
  `;
  return users.map((user) => {
    // Convert the snake case favorite_color to favoriteColor
    return camelcaseKeys(user);
  });
}

export async function getUser(id: number) {
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
      (${username}, ${name}, ${passwordHash}, ${mail}, ${address})
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
