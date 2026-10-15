import assert from "node:assert/strict";
import { test } from "node:test";
import { getReleases } from "../src/lib/releases.ts";

async function withUpstream(
  changelog: string | null,
  releases: unknown[],
  check: () => Promise<void>,
) {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("CHANGELOG.md"))
      return new Response(changelog, {
        status: changelog === null ? 503 : 200,
      });
    if (url.includes("api.github.com")) return Response.json(releases);
    if (url.includes("registry.npmjs.org"))
      return Response.json({ version: "0.2.0" });
    throw new Error(`Unexpected URL: ${url}`);
  };
  try {
    await check();
  } finally {
    globalThis.fetch = original;
  }
}
test("release bullets retain wrapped lines and every item beyond the sixth", async () => {
  await withUpstream(
    "## [0.2.0] - 2026-10-12\n### Changed\n- Hooks install globally and chain existing hooks,\n  including repository hooks and previous hooksPath.\n- Second change\n- Third change\n- Fourth change\n- Fifth change\n- Sixth change\n- Seventh change\n",
    [],
    async () => {
      const payload = await getReleases();
      assert.equal(
        payload.releases[0].sections[0].items[0],
        "Hooks install globally and chain existing hooks, including repository hooks and previous hooksPath.",
      );
      assert.equal(payload.releases[0].sections[0].items.length, 7);
      assert.equal(payload.releases[0].sections[0].items[6], "Seventh change");
    },
  );
});
test("release upgrade instructions before section headings remain visible", async () => {
  await withUpstream(
    "## [0.2.0] - 2026-10-12\nRun `acct install` after upgrading.\nProfiles carry over unchanged.\n\n### Changed\n- New hooks\n",
    [],
    async () => {
      const payload = await getReleases();
      assert.deepEqual(payload.releases[0].sections[0], {
        title: "Overview",
        items: [
          "Run acct install after upgrading. Profiles carry over unchanged.",
        ],
      });
    },
  );
});
test("GitHub fallback retains release body when the changelog is unavailable", async () => {
  await withUpstream(
    null,
    [
      {
        tag_name: "v0.2.0",
        html_url: "https://github.com/abdull-ah-med/acct/releases/tag/v0.2.0",
        published_at: "2026-10-12T12:00:00Z",
        prerelease: false,
        draft: false,
        body: "### Fixed\n- Full release notes\n  without truncation.\n",
      },
    ],
    async () => {
      const payload = await getReleases();
      assert.deepEqual(payload.releases[0].sections, [
        { title: "Fixed", items: ["Full release notes without truncation."] },
      ]);
    },
  );
});
