# Security

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting for this repository
(Security → Advisories → Report a vulnerability). Do not open a public issue for an
unfixed vulnerability, and do not include real credentials or user data in a report.

## Automated checks

Every push to `main`, every pull request, and a weekly scheduled run execute the
defensive pipeline:

- dataset validation (`npm run validate`)
- secret scanning of tracked files
- static security checks and API invariant checks
- API authorization and input-validation regression tests
- production dependency audit (`npm audit --omit=dev`)
- dependency review on pull requests
- CodeQL JavaScript/TypeScript analysis with `security-extended`

Run the same local checks with `npm run security`.

## Scope and limitations

The app tracks one fixed user and stores study progress, not credentials. The optional
`SYNC_TOKEN` protects the sync API; use HTTPS and a strong token for any public
deployment. State is not encrypted at rest by the app.

The audit job reports high-severity findings but only fails on critical findings, because
the current `@vercel/blob` dependency chain includes known high-severity transitive
advisories. New high-severity dependencies introduced in a pull request are blocked by
dependency review. Set `AUDIT_FAIL_ON_HIGH=1` to make high findings blocking in a local
or stricter CI run.

Secret scanning covers the current working tree, not full git history. If a credential is
ever committed, revoke and rotate it first, then purge it from history.
