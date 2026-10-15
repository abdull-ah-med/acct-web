export const faqs = [
  {
    question: "Does this change my global GitHub account?",
    answer:
      "acct leaves your global gh account unchanged by resolving a profile for your directory and supplying its token through the shell hook, the gh wrapper, or acct exec.",
  },
  {
    question: "Where do my tokens live?",
    answer:
      "Tokens are stored in your OS keychain by default, using macOS Keychain, Windows Credential Manager, or Linux Secret Service. Headless and CI environments can explicitly opt into a plaintext file backend with mode 0600, while config.yaml contains settings rather than tokens.",
  },
  {
    question: "What happens outside a bound folder?",
    answer:
      "Outside a bound folder, acct does not inherit a profile, and installed strict hooks and the managed HTTPS helper refuse operations that require one. The gh wrapper passes unbound calls through silently, while direct acct exec explains that gh is unmanaged there.",
  },
  {
    question: "Will it work with my existing Git hooks?",
    answer:
      "Installation chains your previous hooks and uses a global hooksPath by default. For a repository with its own local hooksPath, run acct install --repo to generate a separate chain, and uninstall restores the recorded previous paths.",
  },
  {
    question: "Can I use different profiles in linked worktrees?",
    answer:
      "Strict mode refuses a worktree when Git and acct disagree about the profile for its working directory and common Git directory. You can resolve the conflict by aligning the bindings or moving the worktree, with acct doctor providing the exact diagnosis.",
  },
  {
    question: "Does it guarantee every commit is correct?",
    answer:
      "Client hooks provide advisory checks because they can be bypassed, so mandatory enforcement requires server-side rules. Pre-commit checks effective identity, and pre-push re-checks every outgoing commit and the authenticated account. Post-commit only chains existing hooks, which means commits in repositories that are never pushed are not re-checked.",
  },
  // JetBrains documents its credential-helper override and opt-in here:
  // https://youtrack.jetbrains.com/articles/SUPPORT-A-2678/Remote-git-operations-in-the-IDE-override-credential-helper-option
  {
    question: "Does acct work with IDEs and editors?",
    answer:
      "acct applies to Git operations from IDEs and editors that use the Git installation you configured with acct. In JetBrains IDEs, enable Use credential helper under Settings → Version Control → Git for HTTPS authentication. Vim and Neovim can use it through shell commands or Git plugins that invoke that Git installation. An IDE’s own GitHub sign-in stays separate, and gh commands in IDE tasks should use acct exec or the shell integration.",
  },
];
