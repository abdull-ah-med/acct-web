export type CommandFlag = {
  name: string;
  required?: boolean;
  body: string;
};

export type CommandDoc = {
  id: string;
  name: string;
  synopsis: string;
  body: string;
  example: string;
  flags?: CommandFlag[];
  notes?: string[];
};

export type CommandGroup = {
  id: string;
  label: string;
  intro: string;
  commands: CommandDoc[];
};

export const docsGroups: CommandGroup[] = [
  {
    id: "start",
    label: "Start",
    intro: "Install the package, then run acct for guided setup.",
    commands: [
      {
        id: "acct",
        name: "acct",
        synopsis: "acct [--help] [--version]",
        body: "Running acct in a terminal opens guided setup, while non-interactive processes receive the tip sheet; --help lists every command.",
        example: `npm install -g acct-sh
acct
acct --help`,
      },
      {
        id: "init",
        name: "acct init",
        synopsis:
          "acct init --id <id> --user <githubUser> --email <email> --name <name> [options]",
        body: "Run without flags for guided setup, or provide the profile fields to create a profile, bind a directory tree, and install identity includes and global chaining hooks non-interactively.",
        example: `acct init \\
  --id work \\
  --user your-work-user \\
  --email you@company.com \\
  --name "Your Name" \\
  --bind ~/Work`,
        flags: [
          {
            name: "--id <id>",
            required: true,
            body: "Profile id, e.g. work or personal.",
          },
          {
            name: "--user <githubUser>",
            required: true,
            body: "GitHub username for this profile.",
          },
          {
            name: "--email <email>",
            required: true,
            body: "Commit email (user.email).",
          },
          {
            name: "--name <name>",
            required: true,
            body: "Commit name (user.name).",
          },
          {
            name: "--host <host>",
            body: "Use this GitHub host, which defaults to github.com.",
          },
          {
            name: "--protocol <https|ssh>",
            body: "Choose the preferred clone protocol, which defaults to https.",
          },
          {
            name: "--bind <dir>",
            body: "Bind this directory tree, or use the current directory when omitted.",
          },
          {
            name: "--import-gh",
            body: "Optionally seed the OS keychain from gh auth token --user; HTTPS and acct exec already follow gh for that user.",
          },
          {
            name: "--global-hooks",
            body: "Compatibility flag: installation already uses global chaining hooks by default.",
          },
          {
            name: "--force",
            body: "Compatibility flag: existing hooks are chained instead of overwritten.",
          },
        ],
        notes: [
          "New profiles start in strict enforce mode.",
          "After init, persist the shell hook in your startup file. Bash refreshes at the next prompt; use acct exec or the gh wrapper for cd followed immediately by gh.",
        ],
      },
    ],
  },
  {
    id: "profiles",
    label: "Profiles",
    intro: "A profile is one GitHub user, git identity, and credential set.",
    commands: [
      {
        id: "profile-add",
        name: "acct profile add",
        synopsis:
          "acct profile add --id <id> --user <githubUser> --email <email> --name <name> [options]",
        body: "Create a profile without binding a folder, then connect it to a directory with acct bind.",
        example: `acct profile add \\
  --id personal \\
  --user you-home \\
  --email you@home \\
  --name "Your Name"`,
        flags: [
          { name: "--id <id>", required: true, body: "Profile id." },
          {
            name: "--user <githubUser>",
            required: true,
            body: "GitHub username.",
          },
          { name: "--email <email>", required: true, body: "Commit email." },
          { name: "--name <name>", required: true, body: "Commit name." },
          {
            name: "--host <host>",
            body: "Use this GitHub host, which defaults to github.com.",
          },
          {
            name: "--protocol <https|ssh>",
            body: "Choose the preferred protocol, which defaults to https.",
          },
          {
            name: "--import-gh",
            body: "Import a token from gh into the OS keychain.",
          },
        ],
      },
      {
        id: "profile-list",
        name: "acct profile list",
        synopsis: "acct profile list",
        body: "Print every profile as id, user@host, email, and protocol.",
        example: "acct profile list",
      },
      {
        id: "profile-show",
        name: "acct profile show",
        synopsis: "acct profile show <id>",
        body: "Print one profile as JSON with its token omitted.",
        example: "acct profile show work",
      },
      {
        id: "profile-remove",
        name: "acct profile remove",
        synopsis: "acct profile remove <id>",
        body: "Remove a profile after unbinding its directories. Secrets and SSH keys shared by other profiles are preserved.",
        example: "acct profile remove work",
      },
      {
        id: "profile-token",
        name: "acct profile token",
        synopsis: "acct profile token <id> (--import-gh | --stdin)",
        body: "Store a token in the OS keychain. One of --import-gh or --stdin is required.",
        example: `acct profile token work --import-gh
printf '%s' "$PAT" | acct profile token work --stdin`,
        flags: [
          {
            name: "--import-gh",
            body: "Import from gh auth token --user and keep following gh on refresh.",
          },
          {
            name: "--stdin",
            body: "Read a personal access token from stdin and set followGh to false so gh will not overwrite it.",
          },
        ],
        notes: [
          "Default path: HTTPS and acct exec follow gh auth token --user. After gh auth refresh you usually do not need --import-gh again.",
          "Use --stdin for a dedicated PAT that must not track gh.",
        ],
      },
      {
        id: "profile-ssh-key",
        name: "acct profile ssh-key",
        synopsis:
          "acct profile ssh-key <id> (--generate | --path <path>) [--protocol https|ssh]",
        body: "Generate an ed25519 key for the profile, or attach an existing private key. The scoped HTTPS helper stays installed for SSH profiles too.",
        example: `acct profile ssh-key work --generate
acct profile ssh-key work --path ~/.ssh/id_work`,
        flags: [
          {
            name: "--generate",
            body: "Create an ed25519 key and select SSH as the preferred protocol.",
          },
          { name: "--path <path>", body: "Attach an existing private key." },
          {
            name: "--protocol <https|ssh>",
            body: "Set the preferred protocol; generating a key defaults to ssh when this is omitted.",
          },
        ],
      },
    ],
  },
  {
    id: "trees",
    label: "Trees",
    intro:
      "Longest matching bound path wins. Leave the tree and that account stops applying.",
    commands: [
      {
        id: "bind",
        name: "acct bind",
        synopsis: "acct bind <dir> <profileId> [--enforce strict|warn|off]",
        body: "Map a canonical directory tree to a profile. Bind a repository root or a parent tree; a subdirectory inside a repository is rejected. Installed identity includes are refreshed automatically.",
        example: "acct bind ~/Personal personal",
        flags: [
          {
            name: "--enforce <mode>",
            body: "Override enforce for this binding only: strict, warn, or off.",
          },
        ],
      },
      {
        id: "rebind",
        name: "acct rebind",
        synopsis: "acct rebind <old> <new>",
        body: "Move a binding and its nested binding subtree to a new canonical directory. Doctor reports missing or moved paths.",
        example: "acct rebind ~/OldWork ~/Work",
      },
      {
        id: "local-set",
        name: "acct local set",
        synopsis: "acct local set [profileId] [--unbound]",
        body: "Set the repository-root .acct marker and matching local Git identity include. An empty profile explicitly unbinds the repository. A marker below the root is ignored and diagnosed.",
        example: "acct local set work\nacct local set --unbound",
        flags: [
          {
            name: "--unbound",
            body: "Explicitly unbind this repository, even inside a bound parent tree.",
          },
        ],
      },
      {
        id: "local-clear",
        name: "acct local clear",
        synopsis: "acct local clear",
        body: "Remove the root-local marker and only acct's local identity include, returning to directory binding resolution.",
        example: "acct local clear",
      },
      {
        id: "unbind",
        name: "acct unbind",
        synopsis: "acct unbind <dir>",
        body: "Remove a directory’s profile binding while keeping the profile itself.",
        example: "acct unbind ~/Downloads",
      },
    ],
  },
  {
    id: "inspect",
    label: "Inspect",
    intro: "When something feels off, run these before changing config.",
    commands: [
      {
        id: "status",
        name: "acct status",
        synopsis: "acct status [--profile <id>]",
        body: "Show how the current directory resolves, including its binding, profile, identity, token presence, and authenticated account. When errors are found, explain the problem and suggested commands, indicate whether commit or push can proceed, and exit with code 1.",
        example: "acct status",
        flags: [
          {
            name: "--profile <id>",
            body: "Use this profile for the gh account while Git HTTPS continues to follow the directory binding or .acct marker.",
          },
        ],
        notes: [
          "Git authentication ignores ambient ACCT_PROFILE and prints a warning if it disagrees with the current directory.",
        ],
      },
      {
        id: "whoami",
        name: "acct whoami",
        synopsis: "acct whoami [--profile <id>]",
        body: "Print expected GitHub user, actual login, and commit email. Exit codes: 0 for a match, 1 for a mismatch, 2 when the principal is unknown or the directory is unbound.",
        example: "acct whoami",
        flags: [
          {
            name: "--profile <id>",
            body: "Explicit profile for the gh plane.",
          },
        ],
      },
      {
        id: "doctor",
        name: "acct doctor",
        synopsis: "acct doctor [--online]",
        body: "Inspect helper order, hook coverage, stale shims, missing bindings, tokens, and keyring availability. The default offline check makes no API calls and does not persist token values from gh, although first access may migrate existing plaintext secrets.",
        example: `acct doctor
acct doctor --online`,
        flags: [
          {
            name: "--online",
            body: "Call gh api to verify ambient GH_TOKEN against the cwd profile.",
          },
        ],
      },
      {
        id: "ssh-test",
        name: "acct ssh-test",
        synopsis: "acct ssh-test <id>",
        body: "Test SSH auth for a profile against github.com using that profile's key.",
        example: "acct ssh-test work",
      },
    ],
  },
  {
    id: "run",
    label: "Run",
    intro:
      "These commands supply GH_TOKEN for gh, while Git HTTPS continues to follow the directory binding.",
    commands: [
      {
        id: "exec",
        name: "acct exec",
        synopsis:
          "acct exec [--profile <id>] [--allow-cross-profile] <command...>",
        body: "Run a command with the profile’s GH_TOKEN while Git HTTPS follows the directory binding or .acct marker. Commands that mutate global gh authentication, including gh auth switch, login, and token, are refused.",
        example: `acct exec gh pr list
acct exec --profile work --allow-cross-profile gh api user`,
        flags: [
          {
            name: "--profile <id>",
            body: "Supply this profile’s token for gh while leaving the Git credential helper’s directory resolution in place.",
          },
          {
            name: "--allow-cross-profile",
            body: "Required when --profile differs from the cwd binding.",
          },
        ],
      },
      {
        id: "clone",
        name: "acct clone",
        synopsis: "acct clone <url> [git-clone-args...] [--profile <id>]",
        body: "Clone with the selected profile environment. Git HTTPS credentials still follow the directory binding, not GH_TOKEN. Unknown profiles and strict worktree conflicts are refused.",
        example: "acct clone https://github.com/org/repo.git",
        flags: [
          {
            name: "--profile <id>",
            body: "Supply GH_TOKEN for helpers that honor it while Git continues to use the directory binding.",
          },
        ],
      },
    ],
  },
  {
    id: "enforce",
    label: "Enforce",
    intro:
      "Choose whether identity mismatches block an operation, produce a warning, or receive no enforcement, with local settings taking precedence.",
    commands: [
      {
        id: "enforce-cmd",
        name: "acct enforce",
        synopsis: "acct enforce <strict|warn|off|on>",
        body: "Set the default enforcement mode, using on as an alias for strict, or override a specific binding with acct bind --enforce.",
        example: "acct enforce strict",
        notes: [
          "In strict, a missing profile token or mismatched gh principal blocks push.",
          "Commits use the name and email selected by Git’s conditional includes, while unmanaged gh commands can still use another account.",
        ],
      },
      {
        id: "install-cmd",
        name: "acct install",
        synopsis: "acct install [--repo] [--global] [--force]",
        body: "Wire scoped Git identity and global v3 chaining hooks. Use --repo for a repository with a local hooksPath override; its previous local path is baked into separate repository shims.",
        example: "acct install",
        flags: [
          {
            name: "--repo",
            body: "Install per-repository hooks that chain the previous local hooksPath.",
          },
          {
            name: "--global",
            body: "Compatibility flag: installation already uses global chaining hooks by default.",
          },
          {
            name: "--force",
            body: "Compatibility flag: existing hooks are chained, not overwritten.",
          },
        ],
      },
      {
        id: "uninstall",
        name: "acct uninstall",
        synopsis: "acct uninstall [--restore-backup]",
        body: "Remove managed includes and restore recorded hook paths only where acct owns the shims. Per-repository shim directories are removed. Existing OS credential helpers can still answer for GitHub; review the uninstall warning.",
        example: "acct uninstall --restore-backup",
        flags: [
          {
            name: "--restore-backup",
            body: "Restore the pre-acct gitconfig backup if one exists.",
          },
        ],
      },
    ],
  },
  {
    id: "shell",
    label: "Shell",
    intro:
      "The hook resolves the profile from the current directory on each prompt after stripping any previously exported ACCT_PROFILE.",
    commands: [
      {
        id: "hook",
        name: "acct hook",
        synopsis: "acct hook <bash|zsh|fish|powershell>",
        body: "Print a hook to load from your shell startup file so changing directories refreshes the profile environment or clears it outside bound folders.",
        example: `eval "$(acct hook zsh)"
eval "$(acct hook bash)"
acct hook fish | source
acct hook powershell | Out-String | Invoke-Expression`,
      },
      {
        id: "shell-env",
        name: "acct shell-env",
        synopsis: "acct shell-env [--powershell | --fish]",
        body: "Print environment exports for the current directory’s profile, which the shell hook normally handles for you.",
        example: "acct shell-env",
        flags: [
          { name: "--powershell", body: "Emit PowerShell syntax." },
          { name: "--fish", body: "Emit native Fish syntax." },
        ],
      },
      {
        id: "wrap-install",
        name: "acct wrap-install",
        synopsis: "acct wrap-install",
        body: "Install optional PATH shims that invoke gh as acct exec gh, then add the wrap-path export to your shell.",
        example: `acct wrap-install
eval "$(acct wrap-path)"`,
      },
      {
        id: "wrap-path",
        name: "acct wrap-path",
        synopsis: "acct wrap-path [--powershell | --fish]",
        body: "Print the PATH export for wrapper shims, installing them first if they are missing.",
        example: 'eval "$(acct wrap-path)"',
        flags: [
          { name: "--powershell", body: "Emit PowerShell syntax." },
          { name: "--fish", body: "Emit native Fish syntax." },
        ],
      },
    ],
  },
  {
    id: "internal",
    label: "Internal",
    intro:
      "Git hooks call these commands automatically; run them by hand only when debugging their behavior.",
    commands: [
      {
        id: "hook-run",
        name: "acct hook-run",
        synopsis:
          "acct hook-run <pre-commit|pre-merge-commit|pre-push> [remote] [url]",
        body: "Pre-commit and pre-merge-commit check effective identity. Pre-push checks every outgoing recorded identity and the actual remote authentication. Post-commit only chains existing hooks; it has no hook-run entry.",
        example: "acct hook-run pre-push",
      },
    ],
  },
];

export const resolutionSteps = [
  {
    n: "1",
    title: "CLI --profile",
    body: "An explicit profile applies to gh, status, and exec for the current process, while Git HTTPS still follows the directory.",
  },
  {
    n: "2",
    title: "Nearest .acct",
    body: "acct searches upward from the Git worktree root, or the current directory outside Git, and ignores markers below the repository root. An empty profile explicitly unbinds the repository.",
  },
  {
    n: "3",
    title: "Longest binding",
    body: "The longest canonical directory binding wins, with strict mode refusing conflicts between a worktree and its common Git directory.",
  },
  {
    n: "4",
    title: "Unbound",
    body: "When no profile applies, strict mode blocks managed operations that require an identity.",
  },
];

export const envVars = [
  {
    name: "ACCT_FOLLOW_GH",
    body: "Set 0 / false / off to stop following gh auth token --user. File backend already does not follow gh unless you set 1.",
  },
  {
    name: "ACCT_SECRET_BACKEND",
    body: "Set file on CI or headless hosts without a keyring to store plaintext secrets.json in the config directory with mode 0600.",
  },
  {
    name: "ACCT_CONFIG_DIR",
    body: "Override the config directory, which defaults to ~/.config/acct, %APPDATA%\\acct on Windows, or $XDG_CONFIG_HOME/acct.",
  },
  {
    name: "ACCT_PROFILE",
    body: "The shell hook exports this profile id as a status hint, while the credential helper and hooks resolve from directory bindings or the repository-root .acct marker.",
  },
  {
    name: "ACCT_SKIP_POSTINSTALL",
    body: "Skip the npm postinstall tip sheet, which is also suppressed automatically in CI.",
  },
  {
    name: "ACCT_NODE_PATH",
    body: "Override the Node binary recorded in Git hooks, which otherwise use process.execPath rather than searching PATH.",
  },
  {
    name: "ACCT_DEBUG",
    body: "Print sanitized debug lines to stderr with token values replaced by [REDACTED].",
  },
];

/** Plain markdown of the command reference — for clipboard and /docs.md (LLMs). */
export function formatDocsMarkdown(siteUrl: string): string {
  const docs = `${siteUrl}/docs`;
  const md = `${siteUrl}/docs.md`;
  const lines: string[] = [
    "# acct command reference",
    "",
    "> acct connects each folder to a GitHub account so commit identity and managed authentication follow your directory.",
    "",
    `- Human docs: ${docs}`,
    `- This file: ${md}`,
    "- npm package: `acct-sh`",
    "- CLI binary: `acct` (also installs `git-credential-acct`)",
    "- Repo: https://github.com/abdull-ah-med/acct",
    "",
    "acct adds directory-based account resolution around GitHub CLI’s authentication.",
    "",
    "Do not confuse acct with `gh auth switch` (global), git `user.name`/`user.email` alone (identity ≠ auth), or GitHub Apps.",
    "",
    "## Install",
    "",
    "```bash",
    "npm install -g acct-sh",
    "acct",
    "```",
    "",
    "Bare `acct` opens guided setup in a terminal (non-TTY prints tips). For non-interactive setup:",
    "",
    "```bash",
    "acct init \\",
    "  --id work \\",
    "  --user your-work-user \\",
    "  --email you@company.com \\",
    '  --name "Your Name" \\',
    "  --bind ~/Work",
    "",
    'eval "$(acct hook zsh)"',
    "```",
    "",
    "`--import-gh` is optional on init. HTTPS and `acct exec` follow `gh auth token --user` for that profile. Use `--import-gh` to seed the keychain immediately, or `--stdin` for a PAT that must not track gh.",
    "",
    "## Upgrading to 0.2.0",
    "",
    "Run `acct install` once after upgrading to regenerate scoped includes and v3 hooks. Profiles and bindings retain schema version 1. Use `acct install --repo` for a local hooksPath override. Existing hooks are chained; uninstall restores recorded paths.",
    "",
    "## Resolution order",
    "",
    "acct resolves a profile from the directory and root-local marker; ambient `ACCT_PROFILE` does not override Git HTTPS credentials or hooks.",
    "",
  ];

  for (const step of resolutionSteps) {
    lines.push(`${step.n}. **${step.title}** — ${step.body}`);
  }

  lines.push(
    "",
    "Repository-root `.acct` is YAML `{ profile: work }`. An empty `profile` means this tree is unbound, even inside a bound parent.",
    "",
  );

  for (const group of docsGroups) {
    lines.push(`## ${group.label}`, "", group.intro, "");
    for (const command of group.commands) {
      lines.push(
        `### \`${command.name}\``,
        "",
        `\`${command.synopsis}\``,
        "",
        command.body,
        "",
      );
      lines.push("```bash", command.example, "```", "");
      if (command.flags?.length) {
        lines.push("Flags:", "");
        for (const flag of command.flags) {
          const req = flag.required ? " (required)" : "";
          lines.push(`- \`${flag.name}\`${req}: ${flag.body}`);
        }
        lines.push("");
      }
      if (command.notes?.length) {
        lines.push("Notes:", "");
        for (const note of command.notes) {
          lines.push(`- ${note}`);
        }
        lines.push("");
      }
    }
  }

  lines.push(
    "## Environment",
    "",
    "Config: `config.yaml` under the config dir (`~/.config/acct`, `%APPDATA%\\acct` on Windows, or `$XDG_CONFIG_HOME/acct`). Tokens live in the OS keychain, never in that file. File backend: `ACCT_SECRET_BACKEND=file` → `secrets.json` (mode 0600).",
    "",
  );
  for (const item of envVars) {
    lines.push(`- \`${item.name}\`: ${item.body}`);
  }
  lines.push(
    "",
    "## Further reading",
    "",
    "- Invariants: https://github.com/abdull-ah-med/acct/blob/main/docs/invariants.md",
    "- Threat model: https://github.com/abdull-ah-med/acct/blob/main/docs/threat-model.md",
    `- LLM index: ${siteUrl}/llms.txt`,
    "",
  );

  return lines.join("\n");
}

export function docsAssistantPrompt(siteUrl: string): string {
  return [
    "You are helping with acct (npm: acct-sh), a CLI that binds a folder to one GitHub account so commits, HTTPS, SSH, and gh follow the current directory.",
    "",
    "I copied the full command reference to the clipboard. Use that as the source of truth for commands, flags, examples, resolution order, and env vars.",
    "",
    `If you can fetch URLs, prefer ${siteUrl}/docs.md (markdown) or ${siteUrl}/docs (HTML).`,
    "",
    "Wait for my question, or ask what I want to set up.",
  ].join("\n");
}
