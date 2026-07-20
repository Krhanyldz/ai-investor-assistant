import { PublicDisclosureLayout } from "@/features/legal/components/public-disclosure-layout";

export default function RiskDisclosurePage() {
  return (
    <PublicDisclosureLayout title="Risk Disclosure">
      <h2>Investment loss</h2>
      <p>
        Investing involves risk, including possible total loss of invested capital. Asset values can fall quickly and may not
        recover. Past performance does not predict future results.
      </p>
      <h2>Market and asset risks</h2>
      <p>
        Relevant risks may include volatility, liquidity, currency, concentration, issuer, sector, interest-rate, inflation,
        operational, regulatory, and broad market risks. Different jurisdictions may create different tax, legal, reporting,
        and eligibility consequences.
      </p>
      <h2>Data and estimates</h2>
      <p>
        Market data may be delayed, incomplete, stale, or incorrect. Finnhub is the current configured market-data source
        where live data is available. Demo calculations, sample portfolio values, risk labels, and estimates are not account
        statements and may not reflect real holdings or executable prices.
      </p>
      <h2>Independent verification</h2>
      <p>
        Users must verify information independently before making decisions. Professional investment, tax, or legal advice
        may be appropriate where personal circumstances, suitability, jurisdiction, or significant financial exposure are
        involved.
      </p>
    </PublicDisclosureLayout>
  );
}
