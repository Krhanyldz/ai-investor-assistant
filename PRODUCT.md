# AI Investor Assistant

## 1. Product Vision

AI Investor Assistant is an AI-powered financial research platform for individual investors. It helps users understand stocks, ETFs, valuation, risks, financial data, and market context.

The product is not:
- a broker
- a trading platform
- a financial adviser
- a personalized portfolio manager
- a source of guaranteed predictions

## 2. Target Users

Primary users:
- individual long-term investors
- students and beginners learning financial research
- users who want a clearer alternative to complex professional terminals
- users who value explainability over hype

## 3. Core Product Principles

- Explainable over opaque
- Evidence over opinion
- Research over recommendations
- Clear uncertainty
- Source transparency
- Data freshness visibility
- Simple but professional UX
- Mobile and desktop usability
- Privacy and security by default
- No dark patterns

## 4. Core Features

- Stock research
- ETF research
- Company financial metrics
- Market data
- Watchlists
- Manual portfolio tracking
- AI-generated research summaries
- Bull and bear cases
- Risk factors
- Catalysts
- Source citations
- Confidence and evidence-quality indicators

## 5. Product Boundaries

The platform must not:
- provide personalized buy, sell, hold, short, leverage, or allocation instructions
- guarantee returns
- execute trades
- connect to brokerage accounts in the MVP
- encourage users to invest borrowed money
- hide data sources or timestamps
- present demo data as real market data

## 6. AI Behavior Rules

The AI must:
- separate facts, estimates, and interpretation
- show sources
- show timestamps
- state uncertainty
- refuse personalized investment advice
- avoid absolute language
- never invent financial data
- clearly mark unavailable data
- explain why it reached a conclusion

Required refusal text:

“I can help you research the asset, its valuation, risks, financials, scenarios, and alternatives, but I cannot provide a personalized investment recommendation.”

## 7. Legal and Trust Principles

- This platform is for research, education, and informational purposes
- AI outputs may contain errors
- Financial data may be delayed or inaccurate
- Users must independently verify important information
- The platform should include clear disclaimers and consent records
- Legal documents require review by qualified German/EU lawyers before launch
- A disclaimer does not replace regulatory compliance

## 8. Design Principles

- Premium dark financial interface
- Calm, professional, information-dense design
- No unnecessary animations
- No fake urgency
- No casino-like gamification
- Clear loading, error, and empty states
- Demo data must always be labeled
- Accessibility and keyboard navigation

## 9. Technical Principles

- Feature-based architecture
- Strong TypeScript typing
- Provider-neutral market data services
- Server-side secret handling
- Reusable components
- Automated tests
- Lint, test, and build must pass before merge
- One issue per branch
- Pull request review before merging
- No secrets in Git

## 10. MVP Scope

- Dashboard
- Stock research page
- ETF research page
- Search
- Watchlist
- Manual portfolio
- Market data integration
- AI research summaries
- Authentication
- Compliance and consent layer

## 11. Out of Scope for MVP

- Trade execution
- Brokerage integration
- Automated portfolio rebalancing
- Personalized financial advice
- Tax reporting
- Social trading
- Crypto trading
- Options trading
- Leverage recommendations

## 12. Success Criteria

- Users can research an asset quickly
- Sources and timestamps are always visible
- The product never disguises AI output as certainty
- The architecture supports adding providers and features without major rewrites
- The interface is usable on mobile and desktop
- Users understand the platform is a research tool, not an adviser
