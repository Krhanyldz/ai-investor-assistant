import Link from "next/link";
import { PublicDisclosureLayout } from "@/features/legal/components/public-disclosure-layout";

export default function PrivacyPolicyPage() {
  return (
    <PublicDisclosureLayout title="Privacy Policy">
      <h2>Project and contact</h2>
      <p>
        This draft describes the current AI Investor Assistant project. Repository owner: Krhanyldz. Contact URL:{" "}
        <Link href="https://github.com/Krhanyldz">https://github.com/Krhanyldz</Link>. Do not post personal, financial, or
        sensitive information in a public GitHub issue.
      </p>
      <h2>Data currently processed</h2>
      <p>
        The application uses Supabase authentication and database storage. Current account data may include email address,
        display name, profile creation timestamp, profile update timestamp, Supabase auth cookies, session data, manually
        entered portfolio positions, and saved watchlist symbols. The app records the consent version and acceptance
        timestamp for authenticated users.
      </p>
      <p>
        For signed-out visitors, consent may be stored locally in the browser as accepted status, consent version, and ISO
        acceptance timestamp. Finnhub market-data requests and OpenAI research requests may be made on the server when those
        providers are configured.
      </p>
      <h2>AI and market data</h2>
      <p>
        When AI research is requested and configured, asset symbols, optional user research questions, and supplied market
        data context are sent from the server to OpenAI to generate structured research output. Where live market data is
        available, Finnhub is the configured source; in local development, fallback mock data is clearly labelled.
      </p>
      <h2>Data minimization and user requests</h2>
      <p>
        The project should collect only data needed for authentication, consent, and tested product workflows. Users may seek
        access, correction, or deletion through the project contact URL, but a private production contact channel must be
        established before launch.
      </p>
      <h2>No sale of personal data</h2>
      <p>
        The current project does not sell personal data. Any production advertising, analytics, sharing, or data-sale model
        would require a new review and updated disclosures before use.
      </p>
      <h2>Open legal items</h2>
      <p>
        Production launch is blocked until controller identity, private contact channel, processor list, retention schedule,
        hosting and international-transfer details, applicable legal bases, and professional legal review are finalized. This
        draft does not state a company address, registration number, DPO, retention period, legal basis, or jurisdiction.
      </p>
    </PublicDisclosureLayout>
  );
}
