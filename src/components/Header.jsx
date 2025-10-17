import {
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
} from "lucide-react";
import {
  getPrimaryContact,
  getActiveAnnouncement,
  getActiveSocials,
} from "../data/siteConfig";

export default function Header() {
  const phone = getPrimaryContact("phone");
  const email = getPrimaryContact("email");
  const announce = getActiveAnnouncement("en");
  const socials = getActiveSocials();

  return (
    <header className="hidden xl:block w-full h-auto bg-[#23293C] text-white px-8 py-2">
      <div className="flex items-center justify-between gap-4 py-2">
        {/* Left — Phone & Email */}
        <div className="flex items-center gap-6">
          {phone && (
            <a
              href={`tel:${phone.value}`}
              className="group inline-flex items-center gap-2 text-zinc-100 hover:text-white"
              aria-label={`Call ${phone.display}`}
            >
              <Phone className="h-4 w-4 opacity-90 group-hover:opacity-100" />
              <span className="h6">{phone.display}</span>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email.value}`}
              className="items-center gap-2 text-zinc-100 hover:text-white md:inline-flex"
              aria-label={`Email ${email.display}`}
            >
              <Mail className="h-4 w-4 opacity-90 group-hover:opacity-100" />
              <span className="h6">{email.display}</span>
            </a>
          )}
        </div>

        {/* Center — Announcement */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          {announce ? (
            <span className="h6 text-center text-zinc-100">
              {announce.message}
            </span>
          ) : (
            <span className="sr-only">No active announcement</span>
          )}
        </div>

        {/* Right — Socials */}
        <div className="ml-auto flex items-center gap-3">
          <span className="h6 text-zinc-200 sm:inline">Follow Us :</span>
          <nav aria-label="Social links" className="flex items-center gap-3">
            {socials.map((s) => {
              const iconSize = "h-4 w-4";
              const btn =
                "inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40";
              switch (s.platform) {
                case "instagram":
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className={btn}
                      aria-label="Instagram"
                    >
                      <Instagram className={iconSize} />
                    </a>
                  );
                case "facebook":
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className={btn}
                      aria-label="Facebook"
                    >
                      <Facebook className={iconSize} />
                    </a>
                  );
                case "youtube":
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className={btn}
                      aria-label="YouTube"
                    >
                      <Youtube className={iconSize} />
                    </a>
                  );
                case "twitter":
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className={btn}
                      aria-label="Twitter / X"
                    >
                      <Twitter className={iconSize} />
                    </a>
                  );
                default:
                  return null;
              }
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
