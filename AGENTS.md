# Commands

- `yarn lint` - run ESLint checks.
- `yarn test` - run Jest tests.
- `yarn build` - run production build.

# Code Style

- Keep imports at top of file; no inline imports.
- Always alphabetize where lint rules apply:
  - import declarations
  - named import/export specifiers
  - object keys (including destructured params/patterns)
  - TypeScript interface and object type members
  - union and intersection type constituents
- If order is behaviorally significant, keep the original order and add a local ESLint disable comment with a short reason.

# Canonical Examples

- Good:

```ts
const { email, firstName, lastName } = user;
type Address = { city: string; state: string; zip: string };
import { Button, Card, Modal } from '@/components/ui';
```

- Bad:

```ts
const { lastName, email, firstName } = user;
type Address = { zip: string; city: string; state: string };
import { Modal, Button, Card } from '@/components/ui';
```

# Boundaries

- Always: run `yarn lint` after style-impacting edits.
- Ask first: broad autofix across the full repo.
- Never: disable sorting rules globally to avoid fixing local ordering issues.
