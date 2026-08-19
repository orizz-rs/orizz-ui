import { readFile } from 'node:fs/promises'

const [esmEntry, commonJsEntry, serverEsmEntry, serverCommonJsEntry, stylesheet] =
  await Promise.all([
    readFile(new URL('../dist/index.js', import.meta.url), 'utf8'),
    readFile(new URL('../dist/index.cjs', import.meta.url), 'utf8'),
    readFile(new URL('../dist/index.server.js', import.meta.url), 'utf8'),
    readFile(new URL('../dist/index.server.cjs', import.meta.url), 'utf8'),
    readFile(new URL('../dist/orizz-ui.css', import.meta.url), 'utf8'),
  ])

const checks = [
  {
    passed: esmEntry.includes("import './orizz-ui.css';"),
    message: 'ES module entry does not auto-import orizz-ui.css.',
  },
  {
    passed: commonJsEntry.includes("require('./orizz-ui.css');"),
    message: 'CommonJS entry does not auto-require orizz-ui.css.',
  },
  {
    passed: !serverEsmEntry.includes('orizz-ui.css'),
    message: 'Node ES module entry unexpectedly imports orizz-ui.css.',
  },
  {
    passed: !serverCommonJsEntry.includes('orizz-ui.css'),
    message: 'Node CommonJS entry unexpectedly requires orizz-ui.css.',
  },
  {
    passed:
      esmEntry.includes('from "react";') &&
      !esmEntry.includes('from "lucide-react";'),
    message:
      'Browser entry must externalize React and bundle the selected Lucide icons.',
  },
  {
    passed:
      commonJsEntry.includes('require("react")') &&
      !commonJsEntry.includes('require("lucide-react")'),
    message:
      'CommonJS entry must externalize React and bundle the selected Lucide icons.',
  },
  {
    passed: stylesheet.includes('--orizz-color-brand:'),
    message: 'Built stylesheet does not contain the design tokens.',
  },
  {
    passed: stylesheet.includes('[data-theme=dark]'),
    message: 'Built stylesheet does not contain the dark theme.',
  },
  {
    passed: stylesheet.includes('font-family:Bai Jamjuree'),
    message: 'Built stylesheet does not contain Bai Jamjuree.',
  },
  {
    passed:
      (stylesheet.match(/font-family:var\(--orizz-font-sans\)/g)?.length ?? 0) >=
      13,
    message: 'Built components do not consistently apply Bai Jamjuree.',
  },
]

const failures = checks.filter((check) => !check.passed)

if (failures.length > 0) {
  throw new Error(failures.map((failure) => failure.message).join('\n'))
}

console.log('Verified automatic CSS, themes, tokens, and font in dist.')
