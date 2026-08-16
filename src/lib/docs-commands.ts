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
    intro: "Install the package, then run bare acct for the tip sheet.",
    commands: [
      {
        id: "acct",
        name: "acct",
        synopsis: "acct [--help] [--version]",
        body: "With no arguments, prints the welcome tip sheet (npm hides postinstall output). Use --help for the full command list.",
        example: `npm install -g acct-sh
acct
acct --help`,
      },
      {
        id: "init",
        name: "acct init",
        synopsis:
          "acct init --id <id> --user <githubUser> --email <email> --name <name> [options]",
        body: "Create a profile, bind a directory tree, wire includeIf identity, and install enforce hooks. This is the usual first command after install.",
        example: `acct init \\
  --id work \\
  --user your-work-user \\
  --email you@company.com \\
  --name "Your Name" \\
  --bind ~/Work`,
        flags: [
          { name: "--id <id>", required: true, body: "Profile id, e.g. work or personal." },
          { name: "--user <githubUser>", required: true, body: "GitHub username for this profile." },
          { name: "--email <email>", required: true, body: "Commit email (user.email)." },
          { name: "--name <name>", required: true, body: "Commit name (user.name)." },
          { name: "--host <host>", body: "GitHub host. Default github.com." },
          { name: "--protocol <https|ssh>", body: "Preferred clone style. Default https." },
          { name: "--bind <dir>", body: "Directory tree to bind. Default: current directory." },
          {
            name: "--import-gh",
            body: "Seed the OS keychain from gh auth token --user. Optional — HTTPS and acct exec already follow gh for that user.",
          },
          {
            name: "--global-hooks",
            body: "Set core.hooksPath globally. Discouraged; replaces hooks in every repo.",
          },
          {
            name: "--force",
            body: "Overwrite an existing non-acct core.hooksPath in the bind directory.",
          },
        ],
        notes: [
          "New profiles start in strict enforce mode.",
          "After init, add a shell hook so gh follows the directory on every cd.",
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
        body: "Create a profile without binding a folder. Bind it afterwards with acct bind.",
        example: `acct profile add \\
  --id personal \\
  --user you-home \\
  --email you@home \\
  --name "Your Name"`,
        flags: [
          { name: "--id <id>", required: true, body: "Profile id." },
          { name: "--user <githubUser>", required: true, body: "GitHub username." },
          { name: "--email <email>", required: true, body: "Commit email." },
          { name: "--name <name>", required: true, body: "Commit name." },
          { name: "--host <host>", body: "GitHub host. Default github.com." },
          { name: "--protocol <https|ssh>", body: "Preferred protocol. Default https." },
          { name: "--import-gh", body: "Import a token from gh into the OS keychain." },
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
        body: "Print one profile as JSON. Does not include the token.",
        example: "acct profile show work",
      },
      {
        id: "profile-remove",
        name: "acct profile remove",
        synopsis: "acct profile remove <id>",
        body: "Delete the profile, its stored token, and includeIf artifacts. Bindings that pointed at it should be unbound first.",
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
            body: "Read a PAT from stdin. Sets followGh: false so gh will not overwrite it.",
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
        synopsis: "acct profile ssh-key <id> (--generate | --path <path>) [--protocol https|ssh]",
        body: "Generate an ed25519 key for the profile, or attach an existing private key. HTTPS isolation stays installed unless you pass --protocol.",
        example: `acct profile ssh-key work --generate
acct profile ssh-key work --path ~/.ssh/id_work`,
        flags: [
          { name: "--generate", body: "Create an ed25519 key. Defaults protocol to ssh." },
          { name: "--path <path>", body: "Attach an existing private key." },
          {
            name: "--protocol <https|ssh>",
            body: "Set preferred protocol. Generate defaults to ssh if omitted.",
          },
        ],
      },
    ],
  },
  {
    id: "trees",
    label: "Trees",
    intro: "Longest matching bound path wins. Leave the tree and that account stops applying.",
    commands: [
      {
        id: "bind",
        name: "acct bind",
        synopsis: "acct bind <dir> <profileId> [--enforce strict|warn|off]",
        body: "Map a directory tree to an existing profile and refresh includeIf rules.",
        example: "acct bind ~/Personal personal",
        flags: [
          {
            name: "--enforce <mode>",
            body: "Override enforce for this binding only: strict, warn, or off.",
          },
        ],
      },
      {
        id: "unbind",
        name: "acct unbind",
        synopsis: "acct unbind <dir>",
        body: "Remove a directory → profile binding. The profile itself is kept.",
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
        body: "Dump how cwd resolved: reason, binding, profile, identity, token presence, and the auth principal. If unhealthy, prints what is wrong, commands to run, and whether commit or push will go through. Exits 1 on error findings.",
        example: "acct status",
        flags: [
          {
            name: "--profile <id>",
            body: "Show this profile for the gh principal. Does not rebind git HTTPS — directory / .acct still win.",
          },
        ],
        notes: [
          "Ambient ACCT_PROFILE is ignored for git auth. A warning is printed if it disagrees with cwd.",
        ],
      },
      {
        id: "whoami",
        name: "acct whoami",
        synopsis: "acct whoami [--profile <id>]",
        body: "One line: expected GitHub user vs actual login vs commit email. Prints unbound outside a bound tree. Exits 1 on mismatch.",
        example: "acct whoami",
        flags: [{ name: "--profile <id>", body: "Explicit profile for the gh plane." }],
      },
      {
        id: "doctor",
        name: "acct doctor",
        synopsis: "acct doctor [--online]",
        body: "Scan credential-helper competition, missing install blocks, orphan bindings, sticky GH_TOKEN, enforce fallthrough, and keyring availability. Also diagnoses the cwd profile when unhealthy.",
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
    intro: "Git HTTPS always follows the directory. These inject GH_TOKEN for gh only.",
    commands: [
      {
        id: "exec",
        name: "acct exec",
        synopsis: "acct exec [--profile <id>] [--allow-cross-profile] <command...>",
        body: "Run a command with the profile GH_TOKEN. Refuses gh auth switch / login / token because those mutate global gh state. Git HTTPS still follows cwd / .acct, not --profile.",
        example: `acct exec gh pr list
acct exec --profile work --allow-cross-profile gh api user`,
        flags: [
          {
            name: "--profile <id>",
            body: "Inject this profile's token for gh. Does not rebind the git credential helper.",
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
        synopsis: "acct clone <url> [dir] [--profile <id>]",
        body: "git clone with the cwd profile's GH_TOKEN in the environment. Git credentials still follow the directory binding.",
        example: "acct clone https://github.com/org/repo.git",
        flags: [
          {
            name: "--profile <id>",
            body: "Inject GH_TOKEN for helpers that honor it. Git still uses the cwd binding.",
          },
        ],
      },
    ],
  },
  {
    id: "enforce",
    label: "Enforce",
    intro: "strict blocks, warn prints, off does nothing. Local always beats global.",
    commands: [
      {
        id: "enforce-cmd",
        name: "acct enforce",
        synopsis: "acct enforce <strict|warn|off|on>",
        body: "Set the default enforcement mode. on is an alias for strict. A binding can override this with acct bind --enforce.",
        example: "acct enforce strict",
        notes: [
          "In strict, a missing profile token or mismatched gh principal blocks push.",
          "A commit still uses includeIf name/email, not gh. Raw gh without acct exec can still be the wrong user — that is the leak risk.",
        ],
      },
      {
        id: "install-cmd",
        name: "acct install",
        synopsis: "acct install [--global] [--force]",
        body: "Wire includeIf git identity and set core.hooksPath on the current repo (local by default).",
        example: "acct install",
        flags: [
          {
            name: "--global",
            body: "Set core.hooksPath globally. Discouraged; replaces hooks in every repo.",
          },
          {
            name: "--force",
            body: "Overwrite an existing non-acct core.hooksPath in this repo.",
          },
        ],
      },
      {
        id: "uninstall",
        name: "acct uninstall",
        synopsis: "acct uninstall [--restore-backup]",
        body: "Remove the acct-managed gitconfig block and unset global core.hooksPath. OS helpers (osxkeychain, wincred, libsecret) may still answer for github.com — doctor will say so.",
        example: "acct uninstall --restore-backup",
        flags: [
          { name: "--restore-backup", body: "Restore the pre-acct gitconfig backup if one exists." },
        ],
      },
    ],
  },
  {
    id: "shell",
    label: "Shell",
    intro: "The hook re-resolves from cwd on every prompt. Sticky ACCT_PROFILE is stripped.",
    commands: [
      {
        id: "hook",
        name: "acct hook",
        synopsis: "acct hook <bash|zsh|fish|powershell>",
        body: "Print a shell hook. Eval it from your shell startup so cd rebinds env (or clears it when unbound).",
        example: `eval "$(acct hook zsh)"
eval "$(acct hook bash)"
acct hook fish | source
acct hook powershell | Out-String | Invoke-Expression`,
      },
      {
        id: "shell-env",
        name: "acct shell-env",
        synopsis: "acct shell-env [--powershell]",
        body: "Print env exports for the cwd profile. Used by the shell hook; you rarely run this yourself.",
        example: "acct shell-env",
        flags: [{ name: "--powershell", body: "Emit PowerShell syntax." }],
      },
      {
        id: "wrap-install",
        name: "acct wrap-install",
        synopsis: "acct wrap-install",
        body: "Install optional PATH shims so gh is invoked as acct exec gh. Then add the wrap-path export to your shell.",
        example: `acct wrap-install
eval "$(acct wrap-path)"`,
      },
      {
        id: "wrap-path",
        name: "acct wrap-path",
        synopsis: "acct wrap-path [--powershell]",
        body: "Print the PATH export for wrap shims. Installs the shims if they are missing.",
        example: 'eval "$(acct wrap-path)"',
        flags: [{ name: "--powershell", body: "Emit PowerShell syntax." }],
      },
    ],
  },
  {
    id: "internal",
    label: "Internal",
    intro: "Called by git hooks. Do not run these by hand unless you are debugging.",
    commands: [
      {
        id: "hook-run",
        name: "acct hook-run",
        synopsis: "acct hook-run <pre-commit|pre-push>",
        body: "Internal entry for enforce hooks. pre-commit checks commit identity; pre-push checks auth. On failure, prints the block message plus a status diagnosis.",
        example: "acct hook-run pre-push",
      },
    ],
  },
];

export const resolutionSteps = [
  { n: "1", title: "CLI --profile", body: "Explicit, process-local. Affects gh / status / exec. Does not rebind git HTTPS." },
  { n: "2", title: "Nearest .acct", body: "Walks up from cwd. An empty profile in that file means unbound and wins over parent bindings." },
  { n: "3", title: "Longest binding", body: "Directory trees from acct bind / init. More specific paths beat broader ones." },
  { n: "4", title: "Unbound", body: "No acct identity. Strict mode blocks managed ops instead of guessing." },
];

export const envVars = [
  {
    name: "ACCT_FOLLOW_GH",
    body: "Set 0 / false / off to stop following gh auth token --user. File backend already does not follow gh unless you set 1.",
  },
  {
    name: "ACCT_SECRET_BACKEND",
    body: "Set file for plaintext secrets.json under the config dir (mode 0600). Use in CI / headless hosts without a keyring.",
  },
  {
    name: "ACCT_CONFIG_DIR",
    body: "Override the config directory. Default: ~/.config/acct, %APPDATA%\\acct on Windows, or $XDG_CONFIG_HOME/acct.",
  },
  {
    name: "ACCT_PROFILE",
    body: "Ambient profile id. Ignored for git credential helper and hooks. Directory / .acct win. The shell hook strips this before resolve.",
  },
  {
    name: "ACCT_SKIP_POSTINSTALL",
    body: "Skip the npm postinstall tip sheet. Also skipped in CI.",
  },
  {
    name: "ACCT_NODE_PATH",
    body: "Override the node binary baked into git hooks. Hooks otherwise use process.execPath, never which node.",
  },
  {
    name: "ACCT_DEBUG",
    body: "Print sanitized debug lines to stderr. Token values are always [REDACTED].",
  },
];
