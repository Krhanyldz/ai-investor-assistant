import { consentText } from "@/features/consent/data/consent";

export function AIDisclaimer() {
  return (
    <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm leading-7 text-zinc-400">
      <p className="font-medium text-zinc-300">AI disclaimer</p>
      <p className="mt-2">{consentText.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {consentText.links.map((link) => (
          <a key={link.href} href={link.href} className="text-sm font-medium text-zinc-300 underline underline-offset-4">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
