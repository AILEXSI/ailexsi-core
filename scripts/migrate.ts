/**
 * Run Event Store migration against DATABASE_URL.
 */
import { createDb, migrate } from "../packages/infrastructure/persistence/src/index.js";

async function main() {
  const { client } = createDb();
  try {
    await migrate(client);
    console.log("Migration complete: events table + indexes ready.");
  } finally {
    await client.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
