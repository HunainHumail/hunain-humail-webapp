---
name: create-component
description: Create an atomic-design component with tokens, types, tests and barrel export.
---
1. Pick the level (atom/molecule/organism/template) per `10-atomic-design.mdc`.
2. Create `src/components/<level>/<Name>/{<Name>.tsx,<Name>.test.tsx,index.ts}`.
3. Typed props interface `<Name>Props`; accept `className`; forward refs for interactive atoms.
4. Style with DLS tokens via Tailwind theme only; support dark/light.
5. Accessible by default (semantic element, labels, focus ring).
6. No data fetching or Firebase imports; logic arrives as props or via hooks.
7. Export from the level barrel `src/components/<level>/index.ts`.
