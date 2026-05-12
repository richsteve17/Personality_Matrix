import { runOaiCompat } from "./oaiCompat.js";

export async function runChat(opts) {
  return runOaiCompat("gpt", "https://api.openai.com/v1", opts);
}
