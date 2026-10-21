import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getBytes, ref, uploadBytes } from "firebase/storage";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { ADMIN_EMAIL } from "../../src/lib/firebase/constants";

const PROJECT_ID = "demo-hunain-humail";
const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));

const publishedContent = {
  status: "published" as const,
  order: 0,
  updatedAt: "2026-10-18T00:00:00.000Z",
  title: "Published",
};

const draftContent = {
  ...publishedContent,
  status: "draft" as const,
  title: "Draft",
};

const validMessage = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  topic: "Freelance",
  message: "I would like to build an agentic workflow.",
  createdAt: "2026-10-18T00:00:00.000Z",
};

let testEnv: RulesTestEnvironment;

function unauth() {
  return testEnv.unauthenticatedContext();
}

function admin(overrides?: { email?: string; email_verified?: boolean }) {
  return testEnv.authenticatedContext("admin", {
    email: overrides?.email ?? ADMIN_EMAIL,
    email_verified: overrides?.email_verified ?? true,
  });
}

describe("Firebase security rules", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        host: "127.0.0.1",
        port: 8080,
        rules: readFileSync(resolve(root, "firestore.rules"), "utf8"),
      },
      storage: {
        host: "127.0.0.1",
        port: 9199,
        rules: readFileSync(resolve(root, "storage.rules"), "utf8"),
      },
    });
  });

  afterEach(async () => {
    await testEnv.clearFirestore();
    await testEnv.clearStorage();
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it("lets anyone read published content and blocks drafts", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, "story", "pub"), publishedContent);
      await setDoc(doc(db, "story", "draft"), draftContent);
      await setDoc(doc(db, "profile", "main"), publishedContent);
      await setDoc(doc(db, "settings", "site"), publishedContent);
      await setDoc(doc(db, "now", "n1"), publishedContent);
      await setDoc(doc(db, "work", "w1"), publishedContent);
      await setDoc(doc(db, "writing", "wr1"), publishedContent);
      await setDoc(doc(db, "testimonials", "tm1"), publishedContent);
      await setDoc(doc(db, "testimonials", "tm-draft"), draftContent);
    });

    const db = unauth().firestore();
    await assertSucceeds(getDoc(doc(db, "story", "pub")));
    await assertFails(getDoc(doc(db, "story", "draft")));
    await assertSucceeds(getDoc(doc(db, "profile", "main")));
    await assertSucceeds(getDoc(doc(db, "settings", "site")));
    await assertSucceeds(getDoc(doc(db, "now", "n1")));
    await assertSucceeds(getDoc(doc(db, "work", "w1")));
    await assertSucceeds(getDoc(doc(db, "writing", "wr1")));
    await assertSucceeds(getDoc(doc(db, "testimonials", "tm1")));
    await assertFails(getDoc(doc(db, "testimonials", "tm-draft")));
  });

  it("allows only the verified admin to write content", async () => {
    const guest = unauth().firestore();
    await assertFails(setDoc(doc(guest, "story", "s1"), publishedContent));

    const other = admin({ email: "other@example.com" }).firestore();
    await assertFails(setDoc(doc(other, "story", "s1"), publishedContent));

    const unverified = admin({ email_verified: false }).firestore();
    await assertFails(
      setDoc(doc(unverified, "story", "s1"), publishedContent),
    );

    const db = admin().firestore();
    await assertSucceeds(setDoc(doc(db, "story", "s1"), publishedContent));
    await assertSucceeds(setDoc(doc(db, "story", "s2"), draftContent));
    await assertSucceeds(getDoc(doc(db, "story", "s2")));
  });

  it("validates public message creates and restricts reads", async () => {
    const guest = unauth().firestore();
    await assertSucceeds(addDoc(collection(guest, "messages"), validMessage));
    await assertFails(
      addDoc(collection(guest, "messages"), {
        ...validMessage,
        message: "short",
      }),
    );
    await assertFails(
      addDoc(collection(guest, "messages"), {
        ...validMessage,
        honeypot: "spam",
      }),
    );

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "messages", "m1"), validMessage);
    });

    await assertFails(getDoc(doc(guest, "messages", "m1")));
    await assertFails(updateDoc(doc(guest, "messages", "m1"), { topic: "x" }));
    await assertFails(updateDoc(doc(guest, "messages", "m1"), { read: true }));
    await assertFails(deleteDoc(doc(guest, "messages", "m1")));

    const db = admin().firestore();
    await assertSucceeds(getDoc(doc(db, "messages", "m1")));
    await assertFails(updateDoc(doc(db, "messages", "m1"), { topic: "Roles" }));
    await assertSucceeds(updateDoc(doc(db, "messages", "m1"), { read: true }));
    await assertSucceeds(deleteDoc(doc(db, "messages", "m1")));
  });

  it("lets anyone read images and only the admin write valid images", async () => {
    const image = new Uint8Array([1, 2, 3, 4]);
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await uploadBytes(
        ref(context.storage(), "images/cover.png"),
        image,
        { contentType: "image/png" },
      );
    });

    await assertSucceeds(
      getBytes(ref(unauth().storage(), "images/cover.png")),
    );
    await assertFails(
      uploadBytes(ref(unauth().storage(), "images/new.png"), image, {
        contentType: "image/png",
      }),
    );

    await assertSucceeds(
      uploadBytes(ref(admin().storage(), "images/admin.png"), image, {
        contentType: "image/png",
      }),
    );
    await assertFails(
      uploadBytes(ref(admin().storage(), "images/notes.txt"), image, {
        contentType: "text/plain",
      }),
    );
    await assertFails(
      uploadBytes(
        ref(admin().storage(), "images/huge.png"),
        new Uint8Array(5 * 1024 * 1024),
        { contentType: "image/png" },
      ),
    );
    await assertFails(
      uploadBytes(
        ref(admin({ email_verified: false }).storage(), "images/u.png"),
        image,
        { contentType: "image/png" },
      ),
    );
  });

  it("locks down blueprint leads and rate limits", async () => {
    await assertFails(
      setDoc(doc(unauth().firestore(), "blueprintLeads", "l1"), {
        email: "a@example.com",
      }),
    );
    await assertFails(getDoc(doc(unauth().firestore(), "blueprintLeads", "l1")));
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "blueprintLeads", "l1"), {
        email: "a@example.com",
        status: "new",
      });
    });
    await assertFails(getDoc(doc(unauth().firestore(), "blueprintLeads", "l1")));
    await assertSucceeds(getDoc(doc(admin().firestore(), "blueprintLeads", "l1")));
    await assertSucceeds(
      updateDoc(doc(admin().firestore(), "blueprintLeads", "l1"), {
        status: "contacted",
      }),
    );
    await assertFails(
      updateDoc(doc(admin().firestore(), "blueprintLeads", "l1"), {
        email: "other@example.com",
      }),
    );
    await assertFails(
      setDoc(doc(unauth().firestore(), "blueprintRateLimits", "k1"), { count: 1 }),
    );
  });

  it("allows optional blueprintLeadId on contact messages", async () => {
    await assertSucceeds(
      addDoc(collection(unauth().firestore(), "messages"), {
        ...validMessage,
        blueprintLeadId: "lead-abc",
      }),
    );
    await assertFails(
      addDoc(collection(unauth().firestore(), "messages"), {
        ...validMessage,
        blueprintLeadId: "",
      }),
    );
  });

  it("keeps the admin email aligned with the product rules", () => {
    expect(ADMIN_EMAIL).toBe("hunainhumail786@gmail.com");
  });

  it("lets only the verified admin create and delete CLI sessions", async () => {
    const payload = {
      refreshToken: "refresh-token",
      email: ADMIN_EMAIL,
      code: "AB12CD",
      createdAt: serverTimestamp(),
    };

    await assertFails(
      setDoc(doc(unauth().firestore(), "cliSessions", "s1"), payload),
    );
    await assertFails(
      setDoc(doc(admin({ email: "other@example.com" }).firestore(), "cliSessions", "s1"), payload),
    );
    await assertFails(
      setDoc(
        doc(admin().firestore(), "cliSessions", "s1"),
        { ...payload, email: "other@example.com" },
      ),
    );
    await assertSucceeds(
      setDoc(doc(admin().firestore(), "cliSessions", "s1"), payload),
    );
    await assertFails(
      updateDoc(doc(admin().firestore(), "cliSessions", "s1"), { code: "ZZZZZZ" }),
    );
    await assertFails(getDocs(collection(unauth().firestore(), "cliSessions")));
    await assertFails(deleteDoc(doc(unauth().firestore(), "cliSessions", "s1")));
    await assertSucceeds(deleteDoc(doc(admin().firestore(), "cliSessions", "s1")));
  });

  it("allows unauthenticated get of a CLI session only for ten minutes", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, "cliSessions", "fresh"), {
        refreshToken: "refresh-token",
        email: ADMIN_EMAIL,
        code: "AB12CD",
        createdAt: Timestamp.fromMillis(Date.now() - 60_000),
      });
      await setDoc(doc(db, "cliSessions", "stale"), {
        refreshToken: "refresh-token",
        email: ADMIN_EMAIL,
        code: "AB12CD",
        createdAt: Timestamp.fromMillis(Date.now() - 11 * 60_000),
      });
    });

    await assertSucceeds(getDoc(doc(unauth().firestore(), "cliSessions", "fresh")));
    await assertFails(getDoc(doc(unauth().firestore(), "cliSessions", "stale")));
  });

  it("lets anyone create a valid client health event and only the admin read it", async () => {
    const valid = {
      source: "client",
      type: "timeout",
      code: "functions/deadline-exceeded",
      message: "timeout",
      page: "/",
      ua: "TestAgent",
      sessionId: "tab-session-1",
      createdAt: serverTimestamp(),
    };
    const guest = unauth().firestore();
    const created = await assertSucceeds(
      addDoc(collection(guest, "healthEvents"), valid),
    );
    await assertFails(
      addDoc(collection(guest, "healthEvents"), { ...valid, source: "server" }),
    );
    await assertFails(
      addDoc(collection(guest, "healthEvents"), { ...valid, idea: "secret idea" }),
    );
    await assertFails(
      addDoc(collection(guest, "healthEvents"), {
        ...valid,
        message: "m".repeat(301),
      }),
    );
    await assertFails(
      addDoc(collection(guest, "healthEvents"), { ...valid, code: "c".repeat(81) }),
    );
    await assertFails(
      addDoc(collection(guest, "healthEvents"), { ...valid, sessionId: "" }),
    );
    await assertFails(
      addDoc(collection(guest, "healthEvents"), { ...valid, type: "" }),
    );
    await assertFails(
      addDoc(collection(guest, "healthEvents"), {
        source: valid.source,
        type: valid.type,
        message: valid.message,
        page: valid.page,
        ua: valid.ua,
        sessionId: valid.sessionId,
        createdAt: valid.createdAt,
      }),
    );
    await assertFails(
      addDoc(collection(guest, "healthEvents"), {
        ...valid,
        createdAt: "2026-01-01T00:00:00.000Z",
      }),
    );

    await assertFails(getDocs(collection(guest, "healthEvents")));
    await assertFails(getDoc(doc(guest, "healthEvents", created.id)));
    await assertSucceeds(getDoc(doc(admin().firestore(), "healthEvents", created.id)));
    await assertFails(
      updateDoc(doc(admin().firestore(), "healthEvents", created.id), {
        message: "changed",
      }),
    );
    await assertFails(deleteDoc(doc(admin().firestore(), "healthEvents", created.id)));
    await assertFails(deleteDoc(doc(guest, "healthEvents", created.id)));
  });
});
