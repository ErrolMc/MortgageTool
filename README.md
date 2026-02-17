# MortgageTool

A Next.js mortgage calculator app with two tools:

- **Mortgage Repayment Calculator** for standard repayment projections
- **Split Mortgage Calculator** for two-person deposit, repayment share, and equity split scenarios

The app is built with TypeScript, React, and Tailwind CSS.

## Features

- Calculate repayment amount by frequency (yearly, monthly, fortnightly, weekly)
- View principal vs interest breakdown at a selected point in the mortgage
- Track totals such as interest paid, principal repaid, equity, and remaining balance
- Model extra repayments
- Save/load/delete presets for regular and split mortgage scenarios

## Routes

- `/` – calculator landing page
- `/calculators/mortgage` – standard mortgage repayment calculator
- `/calculators/split-mortgage` – split mortgage calculator for two people

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Jest + Testing Library
- ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

- `npm run dev` – start development server (Turbopack)
- `npm run build` – create production build
- `npm run start` – run production server
- `npm run lint` – run ESLint
- `npm run format` – format project with Prettier
- `npm run format:check` – check formatting
- `npm run test` – run Jest tests
- `npm run test:watch` – run tests in watch mode
- `npm run test:coverage` – generate coverage report

## Project Structure

```text
src/
	app/
		calculators/
			mortgage/
			split-mortgage/
		src/
			calculations/
			types/
	components/ui/
	constants/
	hooks/
	calculations/__tests__/
```

## Testing

Run all tests:

```bash
npm test
```

Run coverage:

```bash
npm run test:coverage
```

## Notes

- Presets are managed by the app hooks and are intended for quick scenario comparison.
- This tool provides estimates and should not be treated as financial advice.
