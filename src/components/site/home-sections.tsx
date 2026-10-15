"use client";

import { useId, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Fingerprint,
  Folder,
  GitBranch,
  LockKeyhole,
  Terminal,
} from "lucide-react";
import { copyWithToast } from "@/lib/copy-toast";
import { faqs } from "@/lib/faq";

function tabKeys(event: KeyboardEvent<HTMLElement>) {
  const tabs = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  );
  const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
  let next: number;
  switch (event.key) {
    case "ArrowDown":
    case "ArrowRight":
      next = (current + 1) % tabs.length;
      break;
    case "ArrowUp":
    case "ArrowLeft":
      next = (current - 1 + tabs.length) % tabs.length;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = tabs.length - 1;
      break;
    default:
      return;
  }
  event.preventDefault();
  tabs[next]?.focus();
  tabs[next]?.click();
}
const features = [
  {
    icon: Fingerprint,
    title: "Git identity",
    heading: "Your commits use the profile’s name and email.",
    description:
      "Directory bindings set your Git identity through conditional includes, while a repository-local profile takes precedence when you need an exception.",
    detail:
      "Strict hooks check for identity mismatches before a commit, merge, or push, so a local override cannot silently use another profile’s email.",
    command:
      "$ git config user.name\nYour Name\n\n$ git config user.email\nyou@company.com",
    href: "/docs#trees",
  },
  {
    icon: LockKeyhole,
    title: "HTTPS and SSH",
    heading: "Your remote authenticates with the selected account.",
    description:
      "HTTPS uses the folder’s token through the credential helper, and SSH uses the key configured for that profile.",
    detail:
      "Before a push, acct verifies which GitHub account the remote authenticates as and compares it with the expected profile.",
    command: "$ acct whoami\n\n$ git push origin main",
    href: "/docs#profiles",
  },
  {
    icon: Terminal,
    title: "GitHub CLI",
    heading: "Your gh commands follow the folder you’re in.",
    description:
      "The shell hook, gh wrapper, or acct exec supplies the profile’s token without changing the global active account in GitHub CLI.",
    detail:
      "Use acct exec when you want to run a command with the resolved profile explicitly, including in scripts and coding-agent sessions.",
    command: "$ acct exec gh pr list\n\n$ acct exec gh issue list",
    href: "/docs#shell",
  },
];
export function Features() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const feature = features[selected];
  return (
    <section className="features-section section-space page-width" id="planes">
      <div className="section-intro">
        <h2>acct keeps your Git tools on the same account.</h2>
        <p>
          Git’s commit identity, remote authentication, and the GitHub CLI have
          separate settings. acct connects them to a profile for the directory
          you’re working in.
        </p>
      </div>
      <div className="tools-workbench">
        <div
          className="tools-tabs"
          role="tablist"
          aria-label="Git tools"
          aria-orientation="vertical"
          onKeyDown={tabKeys}
        >
          {features.map((item, index) => (
            <button
              type="button"
              role="tab"
              key={item.title}
              id={`${id}-tab-${index}`}
              aria-controls={`${id}-panel`}
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
            >
              <item.icon size={19} strokeWidth={1.5} />
              {item.title}
              <ArrowRight size={15} className="tool-tab-arrow" />
            </button>
          ))}
        </div>
        <div
          className="tool-panel"
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${selected}`}
          tabIndex={0}
        >
          <div className="tool-explanation">
            <h3>{feature.heading}</h3>
            <p>{feature.description}</p>
            <p>{feature.detail}</p>
            <Link className="text-link" href={feature.href}>
              Read the command reference <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="tool-example">
            <div className="example-context">
              <Folder size={14} />
              <span>~/Work/api</span>
              <span className="example-profile">work</span>
            </div>
            <pre>{feature.command}</pre>
            <span className="example-caption">
              Example commands for a folder bound to work
            </span>
          </div>
        </div>
      </div>
      <div className="feature-note">
        <LockKeyhole size={15} />
        <span>Credentials are stored on your machine in the OS keychain.</span>
        <a
          href="https://github.com/abdull-ah-med/acct/blob/main/docs/threat-model.md"
          target="_blank"
          rel="noreferrer"
        >
          Read the security model <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}
const shells = ["zsh", "bash", "fish", "PowerShell"] as const;
const hooks = {
  zsh: 'eval "$(acct hook zsh)"',
  bash: 'eval "$(acct hook bash)"',
  fish: "acct hook fish | source",
  PowerShell: "acct hook powershell | Out-String | Invoke-Expression",
};
const steps = [
  {
    title: "Install the CLI",
    heading: "Install acct with npm.",
    description:
      "You’ll need Node.js 20 or newer, Git, and GitHub CLI installed on your machine. Install acct globally so it’s available from any folder.",
    command: "npm install -g acct-sh",
    note: "The package is published on npm as acct-sh, and the command is acct.",
  },
  {
    title: "Create a profile",
    heading: "Bind your GitHub account to a directory.",
    description:
      "Run the guided setup in your terminal to create a profile, choose a directory, and install the Git includes and hooks. You can repeat it for each account you use.",
    command: "acct init",
    note: "Have your GitHub username, commit name, and commit email ready for the setup prompts.",
  },
  {
    title: "Connect your shell",
    heading: "Let new shell sessions follow your folder.",
    description:
      "Choose your shell and add its hook to your startup file. Load it in your current session, then check which profile applies to the directory you’re in.",
    command: "",
    note: "Bash refreshes at the next prompt; use acct exec or the gh wrapper when a command must resolve the folder immediately.",
  },
];
export function Setup() {
  const [selected, setSelected] = useState(0);
  const [shell, setShell] = useState<(typeof shells)[number]>("zsh");
  const [copied, setCopied] = useState(false);
  const id = useId();
  const step = steps[selected];
  const code = selected === 2 ? `${hooks[shell]}\nacct status` : step.command;
  async function copy() {
    if (await copyWithToast(code)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }
  return (
    <section className="setup-section" id="install">
      <div className="page-width">
        <div className="section-intro">
          <h2>Set up your profiles and connect your shell.</h2>
          <p>
            Guided setup creates a profile, binds a directory, and installs the
            Git includes and hooks. Connect your shell so gh follows that
            directory in new sessions.
          </p>
        </div>
        <div className="setup-workbench">
          <div
            className="setup-tabs"
            role="tablist"
            aria-label="Setup steps"
            onKeyDown={tabKeys}
          >
            {steps.map((item, index) => (
              <button
                type="button"
                role="tab"
                key={item.title}
                aria-label={item.title}
                id={`${id}-tab-${index}`}
                aria-controls={`${id}-panel`}
                aria-selected={selected === index}
                tabIndex={selected === index ? 0 : -1}
                onClick={() => {
                  setSelected(index);
                  setCopied(false);
                }}
              >
                <span aria-hidden>{index + 1}</span>
                {item.title}
                <ArrowRight size={15} aria-hidden />
              </button>
            ))}
          </div>
          <div
            className="setup-panel"
            role="tabpanel"
            id={`${id}-panel`}
            aria-labelledby={`${id}-tab-${selected}`}
            tabIndex={0}
          >
            <div className="setup-instruction">
              <h3>{step.heading}</h3>
              <p>{step.description}</p>
              {selected < 2 ? (
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    setSelected(selected + 1);
                    setCopied(false);
                    document
                      .getElementById(`${id}-tab-${selected + 1}`)
                      ?.focus();
                  }}
                >
                  Continue to {selected === 0 ? "profile setup" : "shell setup"}{" "}
                  <ArrowRight size={15} />
                </button>
              ) : (
                <Link href="/docs#shell" className="text-link">
                  Read about shell integration <ArrowUpRight size={15} />
                </Link>
              )}
            </div>
            <div className="setup-code-wrap">
              <div className="setup-code">
                <div className="code-toolbar">
                  <span>
                    <Terminal size={15} />
                    {selected === 2 ? shell : "Terminal"}
                  </span>
                  <button
                    type="button"
                    onClick={copy}
                    aria-label="Copy setup commands"
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                {selected === 2 && (
                  <div
                    className="shell-tabs"
                    role="group"
                    aria-label="Choose your shell"
                  >
                    {shells.map((item) => (
                      <button
                        type="button"
                        key={item}
                        aria-pressed={shell === item}
                        onClick={() => {
                          setShell(item);
                          setCopied(false);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
                <pre className="setup-command">
                  {code.split("\n").map((line, index) => (
                    <span key={index}>
                      <span aria-hidden>$ </span>
                      {line}
                      {index < code.split("\n").length - 1 ? "\n" : ""}
                    </span>
                  ))}
                </pre>
              </div>
              <p className="setup-context-note">{step.note}</p>
            </div>
          </div>
        </div>
        <p className="upgrade-note">
          <GitBranch size={16} />
          <span>
            After upgrading to 0.2.0, run <code>acct install</code> once to
            refresh your hooks while keeping your existing profiles and
            bindings.
          </span>
        </p>
      </div>
    </section>
  );
}
export function FAQ() {
  return (
    <section className="faq-section section-space page-width" id="faq">
      <div>
        <h2>Find answers to common questions about acct.</h2>
        <Link href="/docs" className="text-link">
          Read the documentation <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="faq-list">
        {faqs.map((item) => (
          <details key={item.question}>
            <summary>
              {item.question}
              <ChevronDown size={18} />
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
