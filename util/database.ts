import camelcaseKeys from 'camelcase-keys';
import dotenvSafe from 'dotenv-safe';
import postgres from 'postgres';

export type All = {
  id: number;
  username: string;
  mail: string;
  address: string;
  item_name: string;
  image: string;
  item_price: number;
  description: string;
};

export type User = {
  id: number;
  username: string;
  name: string;
  mail: string;
  address: string | null;
};

export type Item = {
  id: number;
  userId: number;
  itemName: string;
  itemPrice: number;
  image: string;
  description: string;
  priceRange: number;
};

export type Wantlist = {
  userId: number;
  itemUserId: number;
  itemId: number;
};

export type Tradelist = {
  userId: number;
  itemUserId: number;
  itemId: number;
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

export async function getItemsFromUserId(userId: number) {
  if (!userId) return undefined;

  const items = await sql<[Item]>`
    SELECT
      *
    FROM
      items
    WHERE
      user_id = ${userId};
  `;

  return items.map((item) => {
    return camelcaseKeys(item);
  });
}

export async function deleteItemByItemId(id: number) {
  const items = await sql`
    DELETE FROM
      items
    WHERE
      id = ${id}
    RETURNING
      *;
  `;
  return camelcaseKeys(items[0]);
}

export async function getItemsNotUserId(userId: number) {
  if (!userId) return undefined;
  const items = await sql<[Item]>`
  SELECT
    *
  FROM
    items
  WHERE
    user_id NOT IN (${userId});
`;

  return items.map((item) => {
    return camelcaseKeys(item);
  });
}

export async function getItemsRandomNotUserId(userId: number) {
  if (!userId) return undefined;
  const items = await sql<[Item]>`
    SELECT
	    *
    FROM
	    items
    WHERE
      user_id NOT IN (${userId})
    ORDER BY
      RANDOM()
    LIMIT 1;
`;
  return camelcaseKeys(items[0]);
}

export async function getItemsRandomPriceRangeNotUserId(
  userId: number,
  priceMin: number,
  priceMax: number,
) {
  if (!priceMin || !priceMax || !userId) return undefined;
  const items = await sql<[Item]>`
  SELECT
    *
  FROM
    items
  WHERE
    user_id NOT IN (${userId}) AND item_price > ${priceMin} AND item_price < ${priceMax}
  ORDER BY
      RANDOM()
    LIMIT 1;
`;
  return camelcaseKeys(items[0]);
}

export async function getItemByItemId(itemId: number) {
  if (!itemId) return undefined;
  const [items] = await sql<[Item]>`
  SELECT
    *
  FROM
    items
  WHERE id = ${itemId};

  `;
  return camelcaseKeys(items);
}

// WANTLIST

export async function insertItemtoWantlist({
  userId,
  userExchangeItemId,
  itemUserId,
  itemId,
}: {
  userId: number;
  userExchangeItemId: number;
  itemUserId: number;
  itemId: number;
}) {
  const [wantlist] = await sql<[Wantlist]>`
      INSERT INTO wantlist
        (user_id, user_exchange_item_id, item_user_id, item_id)
      VALUES
        (${userId}, ${userExchangeItemId}, ${itemUserId},  ${itemId})
      RETURNING
        id,
        user_id,
        user_exchange_item_id,
        item_user_id,
        item_id;
    `;
  return camelcaseKeys(wantlist);
}

export async function getWantlistByUserId(userId: number) {
  if (!userId) return undefined;
  const wantlist = await sql<[Wantlist]>`
    SELECT
      *
    FROM
    wantlist
    WHERE user_id = ${userId};
  `;
  return wantlist.map((list) => {
    return camelcaseKeys(list);
  });
}

export async function getWantlistbyItemUserId(itemUserId: number) {
  if (!itemUserId) return undefined;
  const wantlist = await sql<Wantlist[]>`
    SELECT
      *
    FROM
      wantlist
    WHERE
      item_user_id = ${itemUserId};
  `;
  return wantlist.map((list) => {
    return camelcaseKeys(list);
  });
}

// JOINT TABLE

export async function getWantlistAll(userId: number, itemId: number) {
  if (!userId) return undefined;
  if (!itemId) return undefined;
  const [allList] = await sql<All[]>`
    SELECT
      users.id AS want_user_id,
      users.username AS want_user_name,
      users.mail AS want_user_mail,
      users.address AS want_user_address,
      items.id AS want_user_item_Id,
      items.item_name AS want_user_item_name,
      items.image AS want_user_item_Image,
      items.item_price AS want_user_item_price,
      items.description AS want_user_item_description
    FROM
    users,
      items
     WHERE
      users.id = ${userId} AND
      items.id = ${itemId}
  `;
  return camelcaseKeys(allList);
}

export async function getHavelistAll(userId: number, itemId: number) {
  if (!userId) return undefined;
  if (!itemId) return undefined;
  const [allList] = await sql<All[]>`
    SELECT
      users.id AS have_user_id,
      users.username AS have_user_name,
      users.mail AS have_user_mail,
      users.address AS have_user_address,
      items.id AS have_user_item_Id,
      items.item_name AS have_user_item_name,
      items.image AS have_user_item_Image,
      items.item_price AS have_user_item_price,
      items.description AS have_user_item_description
    FROM
    users,
      items
     WHERE
      users.id = ${userId} AND
      items.id = ${itemId}
  `;
  return camelcaseKeys(allList);
}

// TRADELIST

export async function insertItemtoTradelist({
  userId,
  userExchangeItemId,
  itemUserId,
  itemId,
}: {
  userId: number;
  userExchangeItemId: number;
  itemUserId: number;
  itemId: number;
}) {
  const [tradelist] = await sql<[Tradelist]>`
      INSERT INTO tradelist
        (user_id, user_exchange_item_id, item_user_id, item_id)
      VALUES
        (${userId}, ${userExchangeItemId}, ${itemUserId},  ${itemId})
      RETURNING
        id,
        user_id,
        user_exchange_item_id,
        item_user_id,
        item_id;
    `;
  return camelcaseKeys(tradelist);
}

export async function getTradelistByItemUserId(userId: number) {
  if (!userId) return undefined;
  const tradelist = await sql<[Tradelist]>`
    SELECT
      *
    FROM
    tradelist
    WHERE item_user_id = ${userId};
  `;
  return tradelist.map((list) => {
    return camelcaseKeys(list);
  });
}

export async function getTradelistByUserId(userId: number) {
  if (!userId) return undefined;
  const tradelist = await sql<[Tradelist]>`
    SELECT
      *
    FROM
    tradelist
    WHERE user_id = ${userId};
  `;
  return tradelist.map((list) => {
    return camelcaseKeys(list);
  });
}

export async function getTradelistByAllUserId(userId: number) {
  if (!userId) return undefined;
  const tradelist = await sql<[Tradelist]>`
    SELECT
      *
    FROM
    tradelist
    WHERE user_id = ${userId}
    OR
    item_user_id = ${userId}
  `;
  return tradelist.map((list) => {
    return camelcaseKeys(list);
  });
}

export async function getTradelistForUserWant(userId: number, itemId: number) {
  if (!userId) return undefined;
  if (!itemId) return undefined;
  const [allList] = await sql<All[]>`
  SELECT
    users.id AS want_user_id,
    users.username AS want_user_name,
    users.mail AS want_user_mail,
    users.address AS want_user_address,
    items.id AS want_user_item_Id,
    items.item_name AS want_user_item_name,
    items.image AS want_user_item_Image,
    items.item_price AS want_user_item_price,
    items.description AS want_user_item_description
  FROM
  users,
    items
   WHERE
    users.id = ${userId} AND
    items.id = ${itemId}
`;
  return camelcaseKeys(allList);
}

export async function getTradelistForUserHave(userId: number, itemId: number) {
  if (!userId) return undefined;
  if (!itemId) return undefined;
  const [allList] = await sql<All[]>`
  SELECT
    users.id AS have_user_id,
    users.username AS have_user_name,
    users.mail AS have_user_mail,
    users.address AS have_user_address,
    items.id AS have_user_item_Id,
    items.item_name AS have_user_item_name,
    items.image AS have_user_item_Image,
    items.item_price AS have_user_item_price,
    items.description AS have_user_item_description
  FROM
  users,
    items
   WHERE
    users.id = ${userId} AND
    items.id = ${itemId}
`;
  return camelcaseKeys(allList);
}
