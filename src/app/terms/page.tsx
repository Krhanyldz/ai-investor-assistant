import { PublicDisclosureLayout } from "@/features/legal/components/public-disclosure-layout";

export default function TermsPage() {
  return (
    <PublicDisclosureLayout title="Terms">
      <h2>Purpose and status</h2>
      <p>
        AI Investor Assistant is a pre-production research and education project. It is intended to help organize investment
        research workflows, demo portfolio views, watchlists, and future AI-assisted notes. It is not ready for production
        use and must receive professional legal review before launch.
      </p>
      <h2>No regulated financial service</h2>
      <p>
        The project does not provide brokerage services, custody, payment services, trade execution, order routing, or
        account opening. Nothing in the application is a personalized investment recommendation, legal advice, tax advice,
        suitability assessment, or fiduciary undertaking.
      </p>
      <h2>User responsibility</h2>
      <p>
        Users are responsible for independently verifying market data, issuer information, calculations, AI output, and any
        assumptions before relying on them. Users should seek qualified professional advice where investment, tax, legal, or
        jurisdiction-specific consequences matter.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not use the project to violate law, misrepresent AI output as a buy or sell instruction, attempt unauthorized
        access, disrupt the service, upload malicious content, or submit personal or sensitive information that is not needed
        for testing the application.
      </p>
      <h2>Data, demos, and availability</h2>
      <p>
        Finnhub is the current configured market-data source where live data is available. Other areas may contain clearly
        labelled demo or sample data. Features, data providers, calculations, route protection, and content may change or be
        removed during development, and service availability is not guaranteed.
      </p>
      <h2>Third-party services</h2>
      <p>
        Supabase is used for authentication and related database features. Finnhub may be used for configured market-data
        requests. Third-party service terms, availability, limits, and data quality may affect the application.
      </p>
      <h2>Legal review required</h2>
      <p>
        These terms are draft text for the AI Investor Assistant repository owned by Krhanyldz. Production launch is blocked
        until controller identity, private contact channel, processor list, retention schedule, applicable jurisdiction, and
        professional legal review are finalized.
      </p>
    </PublicDisclosureLayout>
  );
}
