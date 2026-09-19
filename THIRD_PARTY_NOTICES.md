# Third-Party Software and Service Notices / 제3자 소프트웨어·서비스 고지

> Audit date / 점검일: 2026-09-20. This is an inventory and compliance aid, not a modification of the Apache License and not legal advice.

## Runtime / 실행 환경

`npm ls --omit=dev --all` reports no production npm dependencies. The Wikimate MCP runtime uses Node.js standard-library modules and does not bundle `node_modules`.

`npm ls --omit=dev --all` 결과 npm 운영 의존성은 없습니다. Wikimate MCP 런타임은 Node.js 표준 라이브러리를 사용하며 `node_modules`를 번들하지 않습니다.

Node.js itself is installed separately by the user and contains components under multiple licenses. Review the notices shipped with the exact Node.js distribution used for delivery: https://github.com/nodejs/node/blob/main/LICENSE

Node.js는 사용자가 별도로 설치하며 여러 라이선스의 구성요소를 포함합니다. 납품에 사용하는 정확한 Node.js 배포판의 고지를 확인하십시오.

## Development dependency / 개발 의존성

| Package | Installed version | Use | Declared license | Source |
|---|---:|---|---|---|
| `@modelcontextprotocol/sdk` | `1.29.0` | Verification and MCP smoke tests only | MIT | https://github.com/modelcontextprotocol/typescript-sdk |

The installed SDK includes its own `LICENSE` file. If you redistribute `node_modules`, compiled bundles, or copied SDK code, include the applicable third-party license texts and rerun the license analysis for that artifact.

설치된 SDK에는 자체 `LICENSE`가 있습니다. `node_modules`, 번들 또는 SDK 코드를 재배포한다면 해당 제3자 라이선스 본문을 포함하고 실제 배포물을 다시 검사하십시오.

## Full installed development tree / 전체 설치 개발 트리

Independent `license-checker` summary:

| Result | Count |
|---|---:|
| MIT | 83 |
| ISC | 7 |
| BSD-3-Clause | 2 |
| BSD-2-Clause | 1 |
| Project reported as `UNLICENSED` | 1 |

No GPL, AGPL, LGPL, SSPL, or other copyleft identifier was found in the installed dependency tree. This is a tool result, not a legal compatibility guarantee.

The single `UNLICENSED` result is the local `wikimate@0.10.0` package because it is marked `private: true`; its actual license is declared as `Apache-2.0` in `package.json`, `LICENSE`, and the plugin manifests.

설치 트리에서는 GPL·AGPL·LGPL·SSPL 계열 식별자가 발견되지 않았습니다. 이는 도구 결과이며 법적 호환성을 보장하지 않습니다. `UNLICENSED` 1건은 `private: true`인 로컬 프로젝트를 도구가 그렇게 표시한 것이며 실제 선언은 Apache-2.0입니다.

## Optional external tools and services / 선택적 외부 도구·서비스

The documentation mentions `notesmd-cli`, `mcp-obsidian`, Notion integrations, Obsidian, Codex/OpenAI, and user-selected sync services. They are not npm runtime dependencies bundled by this repository. Their current versions, licenses, plans, API terms, privacy terms, and branding rules must be checked when selected.

문서에 언급된 `notesmd-cli`, `mcp-obsidian`, Notion 연동, Obsidian, Codex/OpenAI, 동기화 서비스는 이 저장소가 번들하는 npm 런타임 의존성이 아닙니다. 실제 선택 시점의 버전·라이선스·요금제·API 약관·개인정보·브랜드 규칙을 따로 확인해야 합니다.

See / 자세한 안내: [`docs/LEGAL_AND_COMMERCIAL_USE.md`](docs/LEGAL_AND_COMMERCIAL_USE.md)
