import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { onCall } from "firebase-functions/v2/https";
import {
  BLUEPRINT_DAILY_CAP,
  BLUEPRINT_HASH_SALT,
  BLUEPRINT_LIMIT_PER_EMAIL_HOUR,
  BLUEPRINT_LIMIT_PER_IP_HOUR,
  BLUEPRINT_MODEL,
  DEADLINE_MS,
  GEMINI_API_KEY,
  REGION,
} from "./config";
import { createGenerateBlueprintHandler } from "./generateBlueprint";
import { createGeminiLlm } from "./geminiClient";
import { clientIp, hmacHex } from "./hash";
import { createLeadStore } from "./leadStore";
import { createLinkHandler } from "./linkBlueprintContact";

initializeApp();
setGlobalOptions({ region: REGION, maxInstances: 5 });

const corsOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://hunain-humail-webapp.web.app",
  "https://hunain-humail-webapp.firebaseapp.com",
];

export const generateBlueprint = onCall(
  {
    enforceAppCheck: true,
    secrets: [GEMINI_API_KEY, BLUEPRINT_HASH_SALT],
    timeoutSeconds: 30,
    memory: "256MiB",
    cors: corsOrigins,
  },
  (request) => {
    const db = getFirestore();
    const store = createLeadStore(db);
    const salt = BLUEPRINT_HASH_SALT.value();
    const handler = createGenerateBlueprintHandler({
      llm: createGeminiLlm(GEMINI_API_KEY.value(), BLUEPRINT_MODEL.value()),
      store,
      hash: {
        ip: clientIp,
        hmac: (value) => hmacHex(value, salt),
      },
      now: () => new Date(),
      limits: {
        perIpHour: BLUEPRINT_LIMIT_PER_IP_HOUR.value(),
        perEmailHour: BLUEPRINT_LIMIT_PER_EMAIL_HOUR.value(),
        dailyCap: BLUEPRINT_DAILY_CAP.value(),
      },
      modelId: BLUEPRINT_MODEL.value(),
      deadlineMs: DEADLINE_MS,
    });
    return handler(request);
  },
);

export const linkBlueprintContact = onDocumentCreated(
  {
    document: "messages/{messageId}",
    region: REGION,
  },
  createLinkHandler(getFirestore()),
);
