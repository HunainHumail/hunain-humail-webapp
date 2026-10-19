import { readFileSync } from "node:fs";
import { stdin as stdinStream } from "node:process";

export async function readJsonInput(file: string): Promise<unknown> {
  const raw =
    file === "-"
      ? await readStdin()
      : readFileSync(file, "utf8");
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error(`Could not parse JSON from ${file === "-" ? "stdin" : file}`);
  }
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stdinStream.on("data", (chunk: Buffer | string) => {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    });
    stdinStream.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    stdinStream.on("error", (error: Error) => {
      reject(error);
    });
  });
}

export function asDocumentList(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}

export function writeLine(stream: NodeJS.WriteStream, text: string): void {
  stream.write(`${text}\n`);
}
