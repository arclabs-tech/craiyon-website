import { ImageEntry, TextEntry } from "@/lib/schemas";
import { createPool } from "mysql2"; // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from "kysely";

const dialect = new MysqlDialect({
  pool: createPool({
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    connectionLimit: 10,
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

interface Database {
  image_entries: ImageEntry;
  text_entries: TextEntry;
}

export const db = new Kysely<Database>({
  dialect,
});
