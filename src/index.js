const GITHUB_JSON_URL = "https://raw.githubusercontent.com/albinchristo04/cricv1/refs/heads/main/api.json";

export default {
  async fetch(request, env) {
    let cached = await env.MY_KV.get("api.json");
    if (cached) {
      return new Response(cached, {
        headers: { "content-type": "application/json" }
      });
    }

    const res = await fetch(GITHUB_JSON_URL);
    const data = await res.text();
    await env.MY_KV.put("api.json", data);

    return new Response(data, {
      headers: { "content-type": "application/json" }
    });
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(updateJson(env));
  }
};

async function updateJson(env) {
  const res = await fetch(GITHUB_JSON_URL);
  if (res.ok) {
    const data = await res.text();
    await env.MY_KV.put("api.json", data);
    console.log("✅ KV updated from GitHub");
  } else {
    console.error("❌ Failed to fetch api.json from GitHub");
  }
}
