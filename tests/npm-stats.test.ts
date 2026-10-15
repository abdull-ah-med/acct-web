import assert from "node:assert/strict";
import { test } from "node:test";
import { getNpmStats } from "../src/lib/npm-stats.ts";

async function fixture(
  created: string,
  periods: Record<string, number | "fail" | "partial">,
  check: () => Promise<void>,
) {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url === "https://registry.npmjs.org/acct-sh")
      return Response.json({
        "dist-tags": { latest: "0.2.0" },
        time: { created },
      });
    if (url === "https://api.npmjs.org/downloads/point/last-day/acct-sh")
      return Response.json({
        downloads: 5,
        start: "2026-10-14",
        end: "2026-10-14",
        package: "acct-sh",
      });
    const period = url.split("/point/")[1]?.split("/acct-sh")[0];
    assert.ok(period in periods, `Unexpected range ${period}`);
    const count = periods[period];
    if (count === "fail") return new Response("", { status: 503 });
    const [start, end] = period.split(":");
    return Response.json({
      downloads: count === "partial" ? 10 : count,
      start: count === "partial" ? "2026-10-01" : start,
      end,
      package: "acct-sh",
    });
  };
  try {
    await check();
  } finally {
    globalThis.fetch = original;
  }
}
test("total downloads start at package creation and end at the latest complete npm day", async () => {
  await fixture(
    "2026-08-08T19:04:05.364Z",
    { "2026-08-08:2026-10-14": 2424 },
    async () => {
      assert.deepEqual(await getNpmStats(), {
        version: "0.2.0",
        downloads: 2424,
        since: "2026-08-08",
        through: "2026-10-14",
      });
    },
  );
});
test("lifetime totals sum non-overlapping ranges below npm’s 18-month limit", async () => {
  await fixture(
    "2024-10-15T10:00:00Z",
    { "2024-10-15:2025-10-14": 100, "2025-10-15:2026-10-14": 200 },
    async () => {
      assert.equal((await getNpmStats()).downloads, 300);
    },
  );
});
test("a failed historical range is never displayed as a complete total", async () => {
  await fixture(
    "2024-10-15T10:00:00Z",
    { "2024-10-15:2025-10-14": "fail", "2025-10-15:2026-10-14": 200 },
    async () => {
      const result = await getNpmStats();
      assert.equal(result.downloads, null);
      assert.equal(result.version, "0.2.0");
    },
  );
});
test("an upstream-clamped range is never displayed as an all-time total", async () => {
  await fixture(
    "2026-08-08T19:04:05.364Z",
    { "2026-08-08:2026-10-14": "partial" },
    async () => {
      assert.equal((await getNpmStats()).downloads, null);
    },
  );
});

test("malformed registry metadata produces an unavailable state without breaking the page", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) =>
    String(input).includes("registry.npmjs.org")
      ? Response.json({
          "dist-tags": { latest: { invalid: true } },
          time: { created: 42 },
        })
      : Response.json({
          downloads: 5,
          start: "2026-10-14",
          end: "2026-10-14",
          package: "acct-sh",
        });
  try {
    assert.deepEqual(await getNpmStats(), {
      version: null,
      downloads: null,
      since: null,
      through: "2026-10-14",
    });
  } finally {
    globalThis.fetch = original;
  }
});
