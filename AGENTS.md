# AGENTS.md

## Project context

This repository contains the frontend application for a Job Board project.

- Frontend repository: `E:\repos\personal\job-board-app`
- Backend repository: `E:\repos\personal\job-board`
- Backend API contract: `E:\repos\personal\job-board\docs\API_CONTRACT.md`

The frontend and backend are independent repositories. Do not assume they share a root directory, Git history, or development lifecycle.

Before implementing or changing API integrations, read the backend API contract at the path above. Treat it as the source of truth for endpoints, request and response structures, authentication, permissions, validation rules, and business behavior.

The API contract is read-only from the frontend repository. Do not modify it.

## Entry points

- `index.html` → `src/main.tsx`: placeholder for the future real application.
- `mock.html` → `src/mock/main.tsx`: current visual design mock.
- `vite.config.ts` builds both entries.

Keep the mock isolated. Do not put mock UI in `src/main.tsx` or import `src/mock/**` from the real application.

## Commands

- `npm run dev`: starts the development server.
- The mock is available at `http://localhost:5173/mock.html`.
- `npm run build`: runs `tsc -b && vite build`.
- `npm run lint`: runs ESLint.

There is no separate typecheck script; the build includes TypeScript checking.

For preview checks:

- `npm run preview -- --port 4173 --strictPort`
- Open `/mock.html`.
- Stop the preview process when finished.

## Technology and conventions

- React + Vite + TypeScript.
- Tailwind CSS v4, using its CSS-first configuration.
- Design tokens are defined in `src/styles/index.css` under `@theme`.
- Inter is loaded locally through `@fontsource-variable/inter`. Do not replace it with Google Fonts or an external CDN.
- Use React Router when implementing application navigation.
- Use the native `fetch` API for backend requests unless a concrete requirement justifies another solution.

TypeScript is configured in strict mode:

- Avoid `any`.
- Prefer explicit and accurate types.
- Do not use type assertions to hide errors.
- Keep components focused and reasonably small.

## Architecture guidelines

Keep responsibilities separated:

- UI components should focus on presentation.
- Pages should compose the relevant components.
- Domain logic should remain outside presentation components when appropriate.
- API communication should be centralized rather than duplicated across components.
- Reuse components when there is a real need, but avoid premature abstractions.

Follow the existing project structure and conventions before introducing new patterns.

Do not add dependencies without a clear reason. Explain the need before introducing a significant new library or architectural tool.

## Design guidelines

The intended visual direction is:

- Minimal, modern, and professional.
- Light theme.
- White background and clean surfaces.
- Subtle borders and shadows.
- Balanced information density and clear visual hierarchy.
- Consistent spacing, typography, and component behavior.

Avoid:

- Decorative gradients.
- Excessive shadows.
- Unnecessary animations.
- Nested cards without a clear purpose.
- Visual elements that do not improve usability.

Use the existing design tokens instead of introducing arbitrary colors or styles.

## Mock constraints

The mock is visual-only.

- Do not add routing, authentication, API calls, persistence, or real submission flows to the mock.
- Do not treat mock data as the source of truth for backend behavior.
- Keep the responsive behavior: list/detail switching below `md`, two panels from `md` up, and the mobile back button.

Mock offer data must follow the actual backend API contract.

The public offer fields are:

- `id`
- `title`
- `description`
- `category`
- `seniority`
- `workMode`
- `workday`
- `contractType`
- `status`
- `createdAt`
- `updatedAt`
- `companyName` in public responses

Do not introduce unsupported fields such as location, separate responsibilities, or separate requirements.

The supported search and filter fields are:

- `q`: searches title, description, and company name.
- `category`
- `seniority`
- `workMode`
- `workday`
- `contractType`

“Ya postulado” must be derived from the candidate's applications, not stored as an offer property.

The application request body supports only:

- `candidateName`
- `phone`

Do not invent unsupported application fields or states.

## Backend integration and security

The backend API contract is the source of truth. Do not assume or invent endpoints, fields, enum values, permissions, or business rules.

Before implementing an integration:

1. Read the relevant section of `E:\repos\personal\job-board\docs\API_CONTRACT.md`.
2. Check the expected request and response structures.
3. Respect the authentication and authorization requirements.
4. Handle the documented error responses.
5. Keep frontend types aligned with the contract.

Security rules:

- Never trust frontend state for authorization.
- Do not assume that hiding a button or route protects a resource.
- Never send or accept user IDs, roles, or ownership data as a substitute for backend authorization.
- Do not expose passwords, password hashes, JWT secrets, or sensitive tokens in logs or UI.
- Do not store sensitive credentials unnecessarily.
- Do not bypass backend validation or permissions.

Do not change backend entities, migrations, database schema, API behavior, or the API contract as part of a frontend task.

If the frontend requires a backend capability that is not documented, report the gap and ask before proposing a contract change.

## Working rules

Before making changes:

1. Inspect the relevant existing files and understand the current implementation.
2. Read the API contract when the task involves backend behavior or data.
3. Identify the scope of the requested task.
4. Do not implement future project stages unless explicitly requested.

During implementation:

- Keep changes focused on the requested task.
- Preserve existing working behavior.
- Do not overwrite or discard unrelated changes.
- Avoid unnecessary refactoring.
- Do not modify the backend repository unless explicitly authorized.

After implementation:

1. Run `npm run build`.
2. Run `npm run lint`.
3. Report the files changed.
4. Report any dependencies added or removed.
5. Report the checks performed and their results.
6. Mention any remaining limitations or decisions that require approval.

If an important requirement is ambiguous, ask before making assumptions.
