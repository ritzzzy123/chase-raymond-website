import { handleListingsRequest } from "./functions/api/listings.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/listings") {
      return handleListingsRequest(env);
    }

    return env.ASSETS.fetch(request);
  },
};
