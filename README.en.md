# SoDam-WikiMate for Codex

> A local-first Codex plugin that safely collects web material and notes, then organizes, queries, checks, links, classifies, and summarizes them as Obsidian-compatible Markdown knowledge.

- Project version: `0.10.0`
- Codex plugin build: `0.10.0+codex.20260919174618`
- Primary language: Korean
- 한국어: [README.md](README.md) · [README.html](README.html)
- HTML documentation: [README.en.html](README.en.html)
- License: Apache License 2.0

> Public repository: `https://github.com/sodam-ai/SoDam-WikiMate-Codex` · Original project: `https://github.com/sodam-ai/SoDam-WikiMate`

## Table of contents

1. [One-sentence explanation](#1-one-sentence-explanation)
2. [Current scope](#2-current-scope)
3. [Prerequisites and required software](#3-prerequisites-and-required-software)
4. [Download and installation](#4-download-and-installation)
5. [Quick start](#5-quick-start)
6. [Running and using Wikimate](#6-running-and-using-wikimate)
7. [Commands and tools](#7-commands-and-tools)
8. [Main workflows](#8-main-workflows)
9. [Note layout and data model](#9-note-layout-and-data-model)
10. [File and document locations](#10-file-and-document-locations)
11. [Architecture and operation](#11-architecture-and-operation)
12. [Security and data flow](#12-security-and-data-flow)
13. [Update summary](#13-update-summary)
14. [Development and verification commands](#14-development-and-verification-commands)
15. [Troubleshooting](#15-troubleshooting)
16. [FAQ](#16-faq)
17. [Legal, copyright, licensing, and commercial use](#17-legal-copyright-licensing-and-commercial-use)
18. [Current verification status and limits](#18-current-verification-status-and-limits)

## 1. One-sentence explanation

Wikimate lets you ask Codex to organize material in your knowledge vault, shows the proposed changes first, and writes Markdown notes only after approval.

Key terms in plain language:

- **Codex**: the AI work environment that interprets your request and performs work.
- **Plugin**: the package that adds Wikimate capabilities to Codex.
- **MCP server**: a small local program that carries requests between Codex and local file functions.
- **Vault**: the folder in which Obsidian stores Markdown notes.
- **Markdown**: a readable plain-text document format using the `.md` extension.
- **dry-run**: a safety preview that shows intended changes without changing files.

This project is not a hosted web service or a mobile application. It runs with Codex on your computer, and notes are stored in a local folder you choose.

## 2. Current scope

### What it can do

- Collect web pages, text extracted from PDFs, or typed notes into new Markdown files
- Discover available Obsidian vaults
- Detect duplicates, broken links, orphan notes, and missing required frontmatter
- Archive notes instead of deleting them, or safely replace links
- Suggest related notes, add reciprocal links, and build MOC related sections
- Suggest and apply a folder, tags, importance, project, and status after approval
- Suggest and apply summaries of at most 200 characters
- Optionally create an atomic note without altering the source body
- Display recent run records
- Optionally store a page ID or URL returned by a separately connected Notion tool

### What it does not do

- It does not permanently delete existing notes automatically.
- It does not edit existing notes without explicit approval.
- It is not a secret manager for passwords, API keys, or tokens.
- The core Wikimate MCP server does not call the Notion API or create Notion database rows.
- It cannot register arbitrary plugin-defined slash commands such as `/wikimate` when Codex does not support them.
- It does not run directly on a phone or tablet.

## 3. Prerequisites and required software

### Required

| Item | Requirement | How to check |
|---|---|---|
| Computer | Windows, macOS, or Linux | Must be able to run Codex and Node.js |
| Codex | Codex CLI or desktop app, signed in | Run `codex --version` |
| Node.js | Version 18 or newer | Run `node --version` |
| Project folder | The complete repository | It must contain `plugins/wikimate` |
| Notes folder | A folder you can write to | You must be able to create and edit files |

### First-time setup

1. Visit the [official Codex page](https://openai.com/codex/) to choose the installation method for your computer, install Codex, and sign in. Terminal users can consult the [official Codex CLI guide](https://learn.chatgpt.com/docs/codex/cli). Availability and setup can vary by operating system and account.
2. Download and install the appropriate package from the [official Node.js download page](https://nodejs.org/en/download). Open a new terminal after installation and run `node --version` to check that the version is at least 18. Node.js installers usually include npm; if you plan to run development checks, also run `npm --version`.
3. Create a folder for your notes. Back up important existing notes to a separate location first. Then follow the plugin installation steps in section 4.

### Optional

| Software | When it is useful | Can Wikimate work without it? |
|---|---|---|
| Obsidian | Viewing notes and auto-detecting vaults | Yes, with an explicit folder path |
| `notesmd-cli` | Using a supported CLI path for Obsidian notes | Yes, the safe filesystem path is used when unavailable |
| Notion | Maintaining an additional Notion index | Yes, local Markdown is independent |
| Git | Cloning, history, and developer updates | Optional for installing an existing folder |
| npm | Installing development dependencies and running all checks | Runtime core has no external production dependency |

### Mobile devices

Wikimate runs on the computer where Codex is installed. You may view the resulting Markdown on a phone through a sync method you choose, such as Obsidian Sync, iCloud, OneDrive, or Syncthing. Sync services are not part of Wikimate; review their security, pricing, and conflict behavior separately.

## 4. Download and installation

### 4.1 Install from GitHub

Run the following in PowerShell or a terminal. Keep quotation marks around paths containing spaces.

```powershell
codex plugin marketplace add sodam-ai/SoDam-WikiMate-Codex
codex plugin add wikimate@wikimate-codex
```

After installation, open a **new Codex task** so the skills and MCP configuration are reloaded. Continuing only in an existing conversation may retain an old cache.

Verify installation:

```powershell
codex plugin list
codex mcp list
```

A healthy installation shows `wikimate@wikimate-codex` as enabled and lists the `wikimate` MCP server.

### 4.2 Download the project

Clone the Codex port with Git:

```powershell
git clone https://github.com/sodam-ai/SoDam-WikiMate-Codex.git
```

Without Git, use **Code → Download ZIP** on GitHub.

### 4.3 Install from a local folder

Replace the path below with the folder where you downloaded the repository.

```powershell
codex plugin marketplace add "D:\path\to\SoDam-WikiMate-Codex"
codex plugin add wikimate@wikimate-codex
```


### 4.4 MCP-only manual alternative

Use this only when you need the MCP tools without plugin skills and the startup hook.

```powershell
codex mcp add wikimate -- node D:\path\to\SoDam-WikiMate-Codex\plugins\wikimate\mcp\server.mjs
```

To pass a vault path:

```powershell
codex mcp add wikimate --env OBSIDIAN_VAULT_PATH=D:/MyVault -- node D:\path\to\SoDam-WikiMate-Codex\plugins\wikimate\mcp\server.mjs
```

This registers only the MCP tools. It does not install Wikimate skills, routing guidance, or the SessionStart safety context.

### 4.5 Removal and updates

Remove the plugin:

```powershell
codex plugin remove wikimate@wikimate-codex
```

After updating the local source, reinstall:

```powershell
codex plugin add wikimate@wikimate-codex
```

Then open a new Codex task. Maintainers should update and validate the cachebuster in the plugin manifest before distribution; users should not edit that field manually.

## 5. Quick start

1. Open the intended vault in Obsidian, or prepare the folder's absolute path.
2. Install the plugin and open a new Codex task.
3. Open `/skills` and select `wikimate`.
4. Ask something like:

```text
Collect this in D:\Notes\MyVault with the title "Test material."
Body: This is a Wikimate installation test note.
Show me a preview first.
```

5. Check the proposed path, title, summary, and tags.
6. Only if they are correct, say: “Approved. Save it for real.”
7. Ask Codex to read the saved file back and verify its title, body, and links.

Begin with a disposable test vault that contains no personal information.

## 6. Running and using Wikimate

### Recommended entry points

- Open `/skills` and select `wikimate` or a task-specific `wikimate-*` skill
- Type `$wikimate`, `$wikimate-lint`, or `$wikimate-link` directly
- Ask naturally: “Use Wikimate to check this vault.”

Codex does not currently let plugins register arbitrary slash commands such as `/wikimate`. Original command templates remain under `plugins/wikimate/commands/` for compatibility review and history, but the actual entry point is `/skills` or `$skill-name`.

| Previous expression | Use in Codex |
|---|---|
| `/wikimate` | `/skills` → `wikimate`, or `$wikimate` |
| `/wikimate-lint` | `$wikimate-lint` |
| `/wikimate-link` | `$wikimate-link` |
| `/wikimate-classify` | `$wikimate-classify` |
| `/wikimate-summarize` | `$wikimate-summarize` |

### Environment variables

| Name | Meaning | Note |
|---|---|---|
| `OBSIDIAN_VAULT_PATH` | Absolute path of the default vault | Most explicit and least ambiguous |
| `OBSIDIAN_VAULT_NAME` | Name of a vault to auto-detect | Ambiguous when names are duplicated |
| `NOTION_RESEARCH_DB_ID` | Optional research database ID | Not consumed directly by the core server |
| `NOTION_RUNLOG_DB_ID` | Optional run-log database ID | Used only by a separate Notion connection |

`.env.example` documents variable names only. The server does not automatically load a `.env` file; pass values through operating-system variables or Codex MCP configuration. Never put real tokens or passwords in `.env`, README files, logs, or Git commits.

## 7. Commands and tools

### 7.1 Eight provided skills

| Skill | Purpose |
|---|---|
| `wikimate` | Top-level entry point that routes a request to the correct specialist skill |
| `wikimate-organize` | Collection and organization workflow |
| `wikimate-query` | Find evidence notes and answer with citations |
| `wikimate-lint` | Check duplicates, broken links, orphans, and metadata |
| `wikimate-link` | Suggest related notes, links, and MOCs |
| `wikimate-classify` | Classify folder, tags, importance, status, and project |
| `wikimate-summarize` | Suggest a short summary and atomic note |
| `wikimate-reviewer` | Review the final change and safety properties |

### 7.2 Eight MCP tools

| Tool | Key input | Default behavior |
|---|---|---|
| `wikimate_collect` | `title`; optional `url`, `text`, `summary`, `tags`, `importance`, `vault`, `vault_path`, `folder`, `dry_run` | Plan or create a note; `dry_run=true` by default |
| `wikimate_vaults` | None | List available vaults |
| `wikimate_lint` | Optional `vault`, `vault_path` | Read-only quality check |
| `wikimate_fix` | `action`, `note`; optional `from`, `to`, vault, `dry_run` | `archive` or `replace_link` |
| `wikimate_runlog` | Optional vault and `limit` | Recent run records; default 20 |
| `wikimate_link` | `action`; optional `note`, `topic`, `targets`, `reason`, `kind`, `notion_id`, vault, `dry_run` | Suggest, link, build MOC, or store Notion ID |
| `wikimate_classify` | `action`, `note`; optional `folder`, `tags`, `importance`, `status`, `project`, vault, `dry_run` | Suggest or apply classification |
| `wikimate_summarize` | `action`, `note`; optional `summary`, `atomic_note`, vault, `dry_run` | Suggest or apply summary changes |

Input boundaries:

- `importance`: 1 through 5
- `kind`: `related` or `reference`
- `summary`: no more than 200 characters when applied
- `classify.folder`: one of `00_Inbox`, `10_Projects`, `20_Resources`, `30_Notes`, `40_Drafts`
- `classify.status`: one of `inbox`, `draft`, `done`; change status only on an explicit user request
- `link.action`: `suggest`, `add_links`, `build_moc`, `set_notion_id`
- `classify.action` and `summarize.action`: `suggest` or `apply`

## 8. Main workflows

### 8.1 Collect material

1. Resolve the vault by name or absolute path.
2. Prepare the source URL, title, and complete body text.
3. Use `dry_run=true` to inspect the filename, folder, frontmatter, and duplicate status.
4. The user approves the plan.
5. Use `dry_run=false` to write the new file atomically.
6. Read the saved file back and verify it.
7. Only when needed, create an index through a separate Notion connection and store the returned ID or URL.

### 8.2 Query and answer

1. Search candidate notes using the question's key terms.
2. Confirm that each source file exists and is readable.
3. Separate evidence notes and cite their files in the answer.
4. Exclude missing files and broken Notion index entries from evidence.

### 8.3 Check and fix

1. Run the read-only `wikimate_lint` check.
2. Group findings into duplicates, broken links, orphans, and missing frontmatter.
3. Present fixes one note at a time.
4. Back up and edit only approved notes.
5. Move removals to `99_Archive` instead of deleting them.
6. Rerun checks for the original issue and regressions.

### 8.4 Links and MOCs

1. Use `suggest` to find candidates without writing.
2. Propose no more than five normal links and give a reason for each.
3. After approval, use `add_links` with `related` or `reference`.
4. `build_moc` updates only the relevant section and is not subject to the five-link limit.

### 8.5 Classify

1. Use `suggest` for a folder, tags, importance, project, and status.
2. The user reviews each value.
3. Use `apply` for approved values only.
4. `90_Templates` and `99_Archive` are excluded from automatic classification.

### 8.6 Summarize

1. Read the body and suggest a summary of at most 200 characters.
2. When useful, suggest a separate atomic note while retaining the source.
3. Apply only approved summary and atomic-note changes.
4. Never edit or delete the original body.
5. Use `wikimate-reviewer` for important material.

## 9. Note layout and data model

Recommended vault folders:

```text
00_Inbox/       Newly collected, unclassified material
10_Projects/    Active project material
20_Resources/   Reference material
30_Notes/       Organized knowledge notes
40_Drafts/      Drafts
90_Templates/   Templates
99_Archive/     Material retained instead of deleted
```

Recommended frontmatter fields:

| Field | Meaning |
|---|---|
| `title` | Human-readable title |
| `type` | `note` or `moc` |
| `status` | `inbox`, `draft`, or `done` |
| `project` | Related project |
| `source` | Source URL or attribution |
| `summary` | Summary of at most 200 characters |
| `importance` | Importance from 1 to 5 |
| `tags` | Search tags |
| `related` | Links to related notes |
| `source_hash` | Hash used to avoid duplicate collection |
| `notion_id` | Optional Notion page ID or URL |
| `created`, `updated` | Creation and update times |

## 10. File and document locations

| Path | Purpose |
|---|---|
| `.agents/plugins/marketplace.json` | Local Codex marketplace definition |
| `plugins/wikimate/.codex-plugin/plugin.json` | Codex plugin manifest |
| `plugins/wikimate/plugin.json` | Portable plugin metadata |
| `plugins/wikimate/.mcp.json` | MCP server registration |
| `plugins/wikimate/hooks/` | Session-start safety context and hook |
| `plugins/wikimate/skills/` | Eight Codex skills |
| `plugins/wikimate/commands/` | Preserved original command templates; not direct slash registrations |
| `plugins/wikimate/mcp/server.mjs` | Local MCP entry point |
| `plugins/wikimate/mcp/lib/` | Collection, checks, fixes, links, classification, and summary implementation |
| `plugins/wikimate/templates/note.md` | Note template |
| `plugins/wikimate/scripts/` | Verification, security, smoke, and E2E scripts |
| `plugins/wikimate/references/design/` | PRD and design material |
| `docs/CODEX_SETUP.md` | Additional Codex setup information |
| `docs/original/` | Pre-port archived documents and commands; not the current state |
| `docs/LEGAL_AND_COMMERCIAL_USE.md` | Legal, copyright, release, and client-delivery checklist |
| `THIRD_PARTY_NOTICES.md` | Actual dependencies and optional external-service notices |
| `AGENTS.md` | Project work rules |
| `DEVELOPMENT.md` | Developer guide |
| `LICENSE`, `NOTICE` | License text and notices |
| `README.md`, `README.html` | Korean user guide |
| `README.en.md`, `README.en.html` | English user guide |

Operational files created inside a vault:

- `.wikimate/runlog.jsonl`: local run history
- `.wikimate/backups/`: backups made before editing an existing note
- `.wikimate/write.lock`: concurrent-write lock

Do not manually edit these internal files during normal operation.

## 11. Architecture and operation

```text
User
  ↓ natural language, /skills, $wikimate-*
Codex skill router
  ↓ structured tool request
Local MCP server (stdio JSON-RPC)
  ↓ input validation → path validation → dry-run/approval → write lock
notesmd-cli (when available and vault identity is verified) or safe filesystem path
  ↓
Obsidian Markdown vault
  ├─ notes
  └─ .wikimate/{runlog.jsonl, backups, write.lock}

Optional path: Codex → separate Notion connection → Notion → store returned ID/URL in note
```

The MCP server communicates with Codex over standard input and output, so it does not open a normal web port. File changes use a vault-level lock and atomic replacement through a temporary file.

## 12. Security and data flow

### Safety controls

- External document content is treated as untrusted data, not as executable instructions.
- New collection and mutation tools default to `dry_run=true`.
- Existing-note changes require explicit approval per note.
- Removal means moving to `99_Archive`, not permanent deletion.
- A recovery copy is created under `.wikimate/backups` before editing.
- `.wikimate/write.lock` prevents concurrent processes from writing; only stale locks owned by dead processes are recovered.
- Canonical real paths block vault escape through `..`, absolute paths, UNC paths, symbolic links, and junctions.
- Normal note operations cannot target `.obsidian` or `.wikimate` internals.
- Filename collisions create a safe suffix instead of overwriting.
- `source_hash` reduces duplicate collection.
- Error sanitization prevents a failed external CLI message from exposing the full note body.

### Where data goes

| Situation | Data flow |
|---|---|
| Core MCP features | Codex process on the computer ↔ local MCP ↔ user-selected local vault |
| Codex conversation | Governed by the data settings for the active Codex/OpenAI account and organization |
| Optional Notion use | Sent to Notion only when connected and approved; Notion terms apply |
| Mobile sync | Sent through the user's separate sync service; that service's terms apply |

“Local MCP file handling” does not mean the entire AI workflow is fully offline. Process secrets, government IDs, health, legal, financial, and customer-confidential data only after checking applicable law and organizational policy, and only to the minimum extent needed.

### Operational recommendations

- Do not connect multiple Wikimate servers to one vault at the same time.
- Back up the complete vault before bulk changes.
- Avoid automatically editing a file while a person is editing it in Obsidian.
- Give a Notion connection least privilege to only the required databases.
- Never commit `.env`, tokens, certificates, private keys, or database credentials.

## 13. Update summary

<details>
<summary><strong>Open the v0.10.0 Codex port summary</strong></summary>

- Added a Codex local marketplace and `.codex-plugin` layout
- Added eight skills and eight MCP tools
- Mapped the original command intent to `/skills` and `$wikimate-*` entry points
- Preserved original command templates for compatibility review
- Added SessionStart safety context and vault discovery
- Strengthened the dry-run → approval → write → read-back workflow
- Added or strengthened cross-process locking, atomic writes, backups, and run logs
- Blocked vault escape through symbolic links and junctions
- Sanitized external CLI errors to avoid exposing note bodies
- Verified MCP smoke behavior, security checks, and installed-cache identity (see Section 18 for dates and scope)
- Separated the public Codex repository from local verification scope, with real user-vault writes and live Notion integration listed as environment-specific checks

</details>

## 14. Development and verification commands

There is no root `package.json`; run package commands from `plugins/wikimate`.

```powershell
cd plugins\wikimate
npm ci
npm run verify
node scripts\smoke-server.mjs
node scripts\smoke-tools.mjs
npm run security-check
npm audit --audit-level=moderate

cd ..\..
node validate-codex.mjs
git diff --check
```

- No separate `build` script: this is buildless JavaScript ESM.
- No separate `typecheck` script: this is not a TypeScript project.
- No separate `lint` script: functional verification, syntax checks, security checks, and Git whitespace checks are combined.
- `npm audit` requires network access to the npm security registry. A network error is not the same as a reported vulnerability.

## 15. Troubleshooting

| Symptom | Likely cause | Safe resolution order |
|---|---|---|
| Plugin is not listed | Wrong marketplace root or missing installation | Confirm repository root → add marketplace → add plugin → run `codex plugin list` |
| Skills are missing | Existing task cache | Confirm plugin is enabled → open a new Codex task → inspect `/skills` |
| MCP server is missing | Node PATH, relative path, or manifest issue | Run `node --version` → `codex mcp list` → from the project, check `node plugins/wikimate/mcp/server.mjs` syntax/startup |
| No vault is found | No Obsidian config or duplicate names | Open a vault in Obsidian → set `OBSIDIAN_VAULT_PATH` or give the absolute path in the request |
| No file after preview | Expected `dry_run=true` behavior | Review the plan, then explicitly approve a real write |
| `VAULT_BUSY` | Another process is writing | Wait → close duplicate Codex/MCP processes → retry. Do not delete the lock until all writers are stopped |
| Path access denied | Outside-vault path, `..`, junction, or protected internals | Use a normal path inside the vault; do not disable the guard |
| Collection skipped as duplicate | Matching `source_hash` exists | Review the existing note; distinguish source or content only if a new note is truly needed |
| Numeric filename suffix | Collision protection | Expected no-overwrite behavior; compare the two files |
| Nothing appears in Notion | Core server does not write Notion directly | Check the separate Notion connection and database permission → approve indexing → store returned ID |
| Korean path or spaces fail | Shell quoting issue | Wrap the entire path in double quotation marks and retry in PowerShell |
| Cannot run on mobile | Desktop local plugin | Run it on the computer and view results through an approved sync method |
| `npm audit` fails | Network/registry error or a vulnerability | Read the exact error → retry after network recovery → analyze package impact if a vulnerability is reported |

For a repeatable problem, share only: operating system, Codex and Node versions, the command, a short sanitized error, and the affected relative path. Do not share full note bodies, tokens, `.env`, or an entire home-directory path.

## 16. FAQ

### Q. Does it delete existing notes?

No. The default policy prohibits hard deletion; approved removals move to `99_Archive`.

### Q. Must Obsidian always be open?

No when using an explicit vault path. Auto-discovery is more reliable when Obsidian configuration exists.

### Q. Is a Notion account required?

No. Notion is optional and local Markdown features work independently.

### Q. Does all data stay on my computer?

Local MCP file I/O stays local. Codex conversations follow Codex/OpenAI settings, and data may leave the computer when you explicitly use Notion or a sync service.

### Q. Can I use the original `/wikimate` slash command?

Codex does not currently register arbitrary plugin-defined slash commands. Select `wikimate` from `/skills` or use `$wikimate`.

### Q. Can I run it directly on a phone?

The plugin runs on a computer. Synced Markdown results can be viewed in mobile Obsidian or another Markdown application.

### Q. Can it edit an existing note?

Yes, through preview, explicit approval, backup, and atomic-write steps. Summarization never rewrites the original body.

### Q. Can several people use the same vault concurrently?

The lock reduces automation conflicts but cannot resolve every human-edit or external-sync conflict. Avoid editing the same file simultaneously and define team backup and merge rules.

### Q. Where are logs and backups?

In `.wikimate/runlog.jsonl` and `.wikimate/backups/` inside the vault. The design avoids logging sensitive bodies, but the user controls access permissions and retention.

### Q. What does “saved successfully” mean?

It means more than receiving a successful write response: the saved file was read back and its title, body, and metadata were confirmed against the plan.

## 17. Legal, copyright, licensing, and commercial use

> This section is technical compliance guidance, not legal advice. Obligations vary by jurisdiction, organization, and material. Consult qualified legal counsel for commercial distribution or sensitive-data processing.

For the detailed release checklist and the separation between verified facts and legal-review items, also read the [legal, copyright, license, and commercial-use guide](docs/LEGAL_AND_COMMERCIAL_USE.md) and [third-party software and service notices](THIRD_PARTY_NOTICES.md).

### Project code

This project is provided under the **Apache License 2.0** in `LICENSE`. It generally permits personal, educational, research, internal business, and commercial use, as well as modification, reproduction, derivative works, and distribution, subject to conditions including:

- Include a copy of the Apache 2.0 license with distributions.
- Retain applicable copyright, patent, trademark, and attribution notices.
- When a `NOTICE` file is supplied, carry the relevant notices in a readable form.
- Mark files to which you made significant changes.
- Apache 2.0 does not grant trademark rights. Do not imply official approval or affiliation through names or logos such as SoDam, WikiMate, Obsidian, or Notion.
- The software is provided without warranty. Users remain responsible for backups and production validation.
- The limitation of liability is set out in Section 8 of `LICENSE`; applicable law or a separate written agreement may take precedence. This is not an unconditional exemption from every liability.

The English license controls: [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0), [Apache License FAQ](https://www.apache.org/foundation/license-faq.html).

### Commercial use

The Wikimate code itself may be used commercially when you comply with Apache 2.0. The following rights remain separate:

1. **Collected source material**: copyrights and site terms for web pages, PDFs, books, images, and customer documents remain with their owners. Public availability does not itself grant rights to reproduce, redistribute, or submit material to AI.
2. **Personal and confidential data**: assess lawful basis, notice or consent, data minimization, retention, deletion requests, cross-border transfer, and organizational security rules.
3. **Obsidian**: as checked on 2026-09-20, its official license and pricing pages describe use for personal, commercial, and nonprofit purposes without a mandatory paid commercial license, while offering a paid support license. Policies can change; recheck [Obsidian License Overview](https://obsidian.md/license) and [Obsidian Pricing](https://obsidian.md/pricing) before organizational deployment.
4. **Notion**: when connected, Notion service terms, privacy policy, and Developer Terms apply separately. Do not collect, store, alter, or delete integration data without end-user consent, and do not solicit user tokens. See [Notion Terms and Privacy](https://www.notion.so/notion/Terms-and-Privacy-28ffdd083dc3473e9c2da6ec011b58ac) and [Notion Developer Terms](https://www.notion.so/Developer-Terms-ba4131408d0844e08330da2cbb225c20).
5. **Codex/OpenAI and sync services**: separately review the terms, account type, organizational data controls, and retention policy.
6. **Third-party packages and materials**: before redistribution, inspect the actual version, source, license, and commercial-use terms of each package and any fonts, images, icons, or templates used. This project's license does not override third-party terms. Check external API plans and AI-model usage policies separately.

### Beginner use matrix

| Use | Guidance |
|---|---|
| Modify, copy, or fork | Allowed. Retain notices and mark distributed files with material changes |
| Redistribute or sell | Allowed. Provide LICENSE and relevant NOTICE material; clear third-party rights separately |
| Internal company or educational use | Allowed. Follow organizational AI, security, and privacy policies |
| SaaS or client delivery | Conditionally allowed. Separately review contract, data processing, external APIs, trademarks, and warranties |
| Use Wikimate/SoDam names or logos as your brand | Not granted by Apache-2.0. Separate rights clearance and permission are required |
| Redistribute customer documents, web sources, images, or characters | Outside the project license. Permission or another lawful basis is required |

### AI-generated or AI-assisted content

Code, documentation, prompts, and notes may contain AI-generated or AI-edited material. Before publication, sale, or delivery, a person must review accuracy, security, provenance, licenses, similarity to existing works, code, images, characters, and marks, and copyrightability under applicable law. Exclusive ownership, registrability, and non-infringement are not guaranteed.

### Legal/professional review required

This repository alone cannot establish the legal identity and rights basis behind `SoDam AI Studio`, contribution terms for other Git contributors, trademark status of `Wikimate` or `SoDam AI Studio`, client contract terms, regulated-data compliance, or commercial redistribution rights in collected source material.

The local archive `docs/original/CHECKPOINT.original.md` contains a personal computer path, so it is excluded from Git tracking and public distribution. The file remains in the original working folder. Before sharing a ZIP of the entire folder, review this file, its paths, and its rights separately.

### Checklist before collecting material

- Do I have permission to store, summarize, and transform this material?
- Am I avoiding circumvention of robots policies, paywalls, access controls, and site terms?
- Does it contain personal data, trade secrets, or health, financial, or legal information?
- Am I collecting only what is necessary, with a retention and deletion plan?
- If I publish or sell the summary, will I satisfy source attribution, quotation, and license duties?
- Does the workflow comply with customer or organizational AI and cross-border-transfer policies?

If any answer is unclear, stop collection and consult the rights holder or legal/security staff.

## 18. Current verification status and limits

Rechecked in this worktree on 2026-09-23 (Node.js 26):

- Reproducible dependency installation passed
- 236 core checks passed
- 18 MCP smoke checks passed
- 127 Codex-port checks passed
- Syntax checks for 30 JavaScript modules and `git diff --check` passed
- Security scan: all 93 tracked and non-ignored untracked files inspected, no suspicious patterns
- `npm audit --audit-level=moderate`: zero known vulnerabilities

Node.js 18/20 compatibility, the official plugin validator, installed-cache hashes, registered-vault discovery, and the 5,000-note performance figures are records from earlier checks. **They were not rerun in this review and must not be used as current-pass evidence.**

Environment-specific checks still required before final deployment:

- No write was performed against the user's real vault during this documentation step, to protect data.
- Live Notion create/read/update was not run because it is optional and requires account permissions.
- This local CLI/MCP plugin has no browser screen or responsive mobile UI.
- Remote GitHub Actions results for this worktree's unmerged changes were not checked in this review.
- This worktree has 89 pre-existing Git changes, and `main` has only an `upstream` remote pointing to the **original** `SoDam-WikiMate` repository. This differs from the public Codex port repository, so do not push this checkout with its current remote configuration.

Before deployment, use a test vault to run collect → approve → write → read-back → lint → backup restoration once, and have a person confirm the publication repository, branch, and legal notices.
