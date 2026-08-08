"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import FadeContent from "@/components/FadeContent";

export default function FAQs() {
  const faqItems = [
    {
      id: "item-1",
      question: "What does acct actually do?",
      answer:
        "It ties a GitHub account (name, email, token, SSH key, gh) to a folder on your machine. When you work inside that folder, those credentials are used. When you leave, they are not.",
    },
    {
      id: "item-2",
      question: "How is this different from gh auth switch?",
      answer:
        "gh auth switch changes your account for the whole machine. acct changes it by directory, so work and personal trees stay isolated without remembering to flip a switch.",
    },
    {
      id: "item-3",
      question: "Where are tokens stored?",
      answer:
        "In your OS keychain, not in config files. CI can opt into a locked-down file backend if you set that explicitly.",
    },
    {
      id: "item-4",
      question: "What if I open a folder that is not bound?",
      answer:
        "acct treats it as unbound. It will not reuse another profile's account. In strict mode, operations that need a profile are blocked instead of guessing.",
    },
    {
      id: "item-5",
      question: "Which shells work?",
      answer:
        "bash, zsh, fish, and PowerShell. Add the hook to your shell startup so every session re-resolves from the current directory.",
    },
  ];

  return (
    <section id="faq" className="scroll-mt-24 px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeContent>
          <div className="grid gap-12 md:grid-cols-2 md:gap-10">
            <div>
              <p className="mb-3 font-mono text-xs tracking-[0.18em] text-base-content/45 uppercase">
                FAQ
              </p>
              <h2 className="font-display max-w-sm text-balance text-3xl font-semibold tracking-tight text-base-content sm:text-4xl">
                Common questions, plain answers.
              </h2>
            </div>

            <div>
              <Accordion className="w-full">
                {faqItems.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="border-dashed border-base-content/15"
                  >
                    <AccordionTrigger className="cursor-pointer text-left text-base hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-base leading-relaxed text-base-content/60">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <p className="mt-6 text-sm text-base-content/50">
                Want the deep rules? Read the{" "}
                <Link
                  href="https://github.com/acct-sh/acct/blob/main/docs/invariants.md"
                  className="text-base-content font-medium underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  invariants
                </Link>{" "}
                and{" "}
                <Link
                  href="https://github.com/acct-sh/acct/blob/main/docs/threat-model.md"
                  className="text-base-content font-medium underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  threat model
                </Link>
                .
              </p>
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
