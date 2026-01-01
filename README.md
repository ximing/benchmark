# Benchmark

A monorepo project using pnpm workspace, TypeScript, Prettier, ESLint, and Turbo.

## Project Structure

```
benchmark/
├── apps/              # Application packages
├── packages/          # Shared packages
│   └── shared/       # Example shared package
├── .eslintrc.json    # ESLint configuration
├── .prettierrc.json  # Prettier configuration
├── tsconfig.json     # TypeScript configuration
├── turbo.json        # Turbo configuration
└── pnpm-workspace.yaml  # pnpm workspace configuration
```

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Available Scripts

- `pnpm dev` - Start development mode for all packages
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Type check all packages

## Tech Stack

- **Package Manager**: pnpm with workspace support
- **Build System**: Turbo for fast, incremental builds
- **Language**: TypeScript
- **Code Quality**: ESLint + Prettier

## Adding New Packages

### Add a new app

Create a new directory under `apps/` with a `package.json`:

```json
{
  "name": "@benchmark/your-app",
  "version": "1.0.0",
  "private": true
}
```

### Add a new shared package

Create a new directory under `packages/` with a `package.json`:

```json
{
  "name": "@benchmark/your-package",
  "version": "1.0.0",
  "private": true
}
```

## License

MIT