import { getAdminFirestore } from "../src/lib/firebase/admin";
import {
  buildSeedImportPayload,
} from "../src/lib/seed/importPayload";
import { chunkItems } from "../src/lib/utils/chunkItems";

async function seed(): Promise<void> {
  const db = getAdminFirestore();
  const payload = buildSeedImportPayload();

  for (const chunk of chunkItems(payload.documents)) {
    const batch = db.batch();
    for (const document of chunk) {
      batch.set(
        db.collection(document.collection).doc(document.id),
        document.data,
        { merge: true },
      );
    }
    await batch.commit();
  }

  const summary = Object.entries(payload.counts)
    .map(([name, count]) => `${name} ${count}`)
    .join(", ");
  process.stdout.write(`Seed complete (${summary}).\n`);
}

seed().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Seed failed";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
