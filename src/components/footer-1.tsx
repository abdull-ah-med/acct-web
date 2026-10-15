import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function Footer() {
  return (
    <footer className="site-footer page-width">
      <div className="footer-top">
        <div>
          <Link href="/" className="wordmark" aria-label="acct home">
            <Image
              src="/logo.svg"
              width={30}
              height={30}
              alt=""
              className="brand-icon"
            />
            <span>
              acct<span className="brand-period">.</span>
            </span>
          </Link>
          <p>acct keeps your GitHub accounts tied to their folders.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/docs">Documentation</Link>
          <a
            href="https://github.com/abdull-ah-med/acct"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight size={13} />
          </a>
          <a
            href="https://www.npmjs.com/package/acct-sh"
            target="_blank"
            rel="noreferrer"
          >
            npm <ArrowUpRight size={13} />
          </a>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} acct · MIT licensed</p>
        <p>
          Made by{" "}
          <a
            href="https://github.com/abdull-ah-med"
            target="_blank"
            rel="noreferrer"
          >
            Abdullah Ahmed <ArrowUpRight size={12} />
          </a>
        </p>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
