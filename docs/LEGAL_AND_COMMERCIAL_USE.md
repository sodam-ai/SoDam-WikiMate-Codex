# 법률·저작권·라이선스·상업적 사용 가이드

> English follows the Korean guide. 이 문서는 2026-09-20 현재 저장소 파일을 기준으로 작성한 기술적 준수 안내이며 법률 자문이 아닙니다.

## 1. 확인된 사실

- 프로젝트의 선언 라이선스는 **Apache License 2.0**입니다.
- 저작권 표기는 `Copyright 2026 SoDam AI Studio`입니다.
- 루트와 배포 플러그인 폴더에 동일한 `LICENSE`와 `NOTICE`가 있습니다.
- `package.json`, Codex manifest, portable manifest는 모두 `Apache-2.0`을 선언합니다.
- 런타임 MCP 서버의 npm 운영 의존성은 없습니다. 설치된 npm 패키지는 검증용 개발 의존성입니다.
- 저장소에는 별도 `assets`, `public`, 이미지, 아이콘, 폰트, 영상 또는 음원 파일이 없습니다.
- `docs/original`의 PDF·HTML·Markdown은 포팅 전 문서 보존본이며 현재 기능·법률 상태를 보장하는 문서가 아닙니다.
- Git에서 무시되는 `plugins/wikimate/sandbox-vault`에는 더미 노트와 로컬 절대경로가 있는 실행 로그가 남을 수 있습니다. Git에는 포함되지 않지만 작업 폴더 전체를 ZIP으로 배포하면 들어갈 수 있습니다.

## 2. 왕초보용 결론

| 하고 싶은 일 | 프로젝트 코드 기준 | 반드시 지킬 것 |
|---|---|---|
| 개인적으로 실행 | 가능 | LICENSE 조건과 외부 서비스 약관 준수 |
| 회사 내부 사용 | 가능 | 개인정보·기밀·보안 정책과 Codex/Obsidian 약관 확인 |
| 코드 수정 | 가능 | 배포하는 수정 파일에 변경 사실 표시 |
| 복제·포크 | 가능 | 기존 저작권·라이선스·NOTICE 유지 |
| 소스·바이너리 재배포 | 가능 | LICENSE 제공, 관련 NOTICE 제공, 고지 유지 |
| 유료 판매·SaaS 운영 | 코드 라이선스상 가능 | 상표, 입력자료 권리, 외부 API 요금제·약관, 개인정보 법령 별도 확인 |
| 교육 자료 활용 | 가능 | 프로젝트 출처와 라이선스 표시, 제3자 원문은 별도 허락 확인 |
| 회사·고객사 납품 | 조건부 가능 | 계약, 보증·책임, 데이터 처리, 제3자 도구, 상표 사용을 법무/조달과 검토 |

Apache-2.0은 프로젝트 코드 사용 권한을 주지만 웹 문서, PDF, 고객 자료, 브랜드, 외부 API, AI 출력까지 자동으로 허가하지 않습니다.

## 3. Apache License 2.0 재배포 조건

공개, 납품, 판매 또는 재배포할 때 최소한 다음을 지킵니다.

1. 수령자에게 Apache License 2.0 사본을 제공합니다.
2. 적용되는 저작권·특허·상표·귀속 고지를 유지합니다.
3. 배포물에 `NOTICE`가 포함되므로 관련 NOTICE 고지를 읽을 수 있는 형태로 함께 제공합니다.
4. 수정한 파일에는 의미 있는 변경을 했다는 사실을 눈에 띄게 표시합니다.
5. 원본과 파생물에 적용되지 않는 고지는 제거할 수 있지만, 판단 근거를 기록합니다.
6. 프로젝트 이름이나 로고의 상표권·공식 제휴 권한은 부여되지 않습니다.
7. 소프트웨어는 AS-IS, 무보증으로 제공됩니다. 유료 지원·보증을 제공하면 자신의 명의와 책임으로만 제공합니다.

공식 원문: https://www.apache.org/licenses/LICENSE-2.0.txt

## 4. 이 라이선스가 포함하지 않는 권리

- 사용자가 수집한 웹 페이지, PDF, 책, 코드, 이미지, 고객 문서의 저작권
- Obsidian, Notion, OpenAI/Codex, 동기화 서비스의 소프트웨어·API·요금제 사용 권리
- `Wikimate`, `SoDam AI Studio`, `Obsidian`, `Notion`, `OpenAI` 등의 상표·로고 사용 권리
- 개인정보, 의료·재무·법률 정보, 영업비밀, 비공개 자료를 처리할 법적 근거
- AI 생성·보조 콘텐츠가 독점 저작권을 갖거나 타인의 저작물을 침해하지 않는다는 보장
- 고객에게 정확성, 무중단, 특정 결과, 비침해를 보증할 권한

## 5. 외부 서비스와 자료

### Codex/OpenAI

Codex 사용에는 사용자의 계정 유형에 맞는 OpenAI 약관과 정책이 별도로 적용됩니다. 회사·개발자 사용자는 입력 권리를 확보하고 출력의 정확성·적합성을 평가해야 합니다. API 키를 판매·공유하거나 사용 제한을 우회하면 안 됩니다.

- https://openai.com/policies/
- https://openai.com/policies/services-agreement/
- https://openai.com/policies/service-terms/

### Obsidian

2026-09-20 확인 기준 Obsidian은 개인·상업·비영리 목적에 무료 사용을 허용하고 유료 Commercial License는 선택적 지원 수단으로 안내합니다. 앱, Sync, Publish 등 각 서비스의 조건은 바뀔 수 있으므로 납품 직전에 다시 확인합니다.

- https://obsidian.md/license
- https://obsidian.md/terms
- https://obsidian.md/pricing

### Notion

Notion은 선택 기능이며 핵심 Wikimate 서버가 직접 호출하지 않습니다. 연결할 경우 최종 사용자 동의, 최소 권한, 데이터 보관·삭제, 토큰 보호, API 제한과 Developer Terms를 별도로 준수합니다.

- https://www.notion.so/notion/Terms-and-Privacy-28ffdd083dc3473e9c2da6ec011b58ac
- https://www.notion.so/Developer-Terms-ba4131408d0844e08330da2cbb225c20

### 사용자가 수집하는 자료

공개 URL이라는 이유만으로 저장, 대량 복제, AI 입력, 재배포 또는 판매 권리가 생기지 않습니다. 접근 통제·유료벽·robots 정책을 우회하지 말고 인용 범위, 라이선스, 계약, 개인정보와 영업비밀 여부를 확인합니다.

## 6. AI 생성·보조 콘텐츠

프로젝트의 코드·문서·프롬프트와 Wikimate가 만든 노트에는 AI가 생성하거나 수정한 내용이 포함될 수 있습니다. 최종 공개·판매·납품 전 사람이 다음을 확인해야 합니다.

- 사실 정확성, 보안 취약점과 라이선스 헤더
- 학습·입력 자료를 사용할 권리
- 기존 코드·문서·이미지·캐릭터·상표와의 실질적 유사성
- 국가별 AI 산출물 저작권 보호 가능성과 인간 기여 기록
- 고객 계약의 AI 사용·고지·비밀유지 요구

AI 출력의 소유권, 등록 가능성, 비침해 여부는 관할법과 사실관계에 따라 달라지므로 보장하지 않습니다.

## 7. 저장소 자료 점검 결과

| 대상 | 확인 결과 | 조치/주의 |
|---|---|---|
| 코드·문서 | Apache-2.0 선언 | LICENSE와 NOTICE 유지 |
| npm 운영 의존성 | 없음 | 런타임에 node_modules를 묶지 않음 |
| npm 개발 의존성 | 직접 1개, 전체 93개 | `THIRD_PARTY_NOTICES.md` 참조 |
| 이미지·아이콘·폰트·영상·음원 | 저장소에서 발견되지 않음 | 이후 추가 시 출처·라이선스 기록 |
| 예제 환경 변수 | 값이 비어 있거나 더미 경로 | 실제 토큰 커밋 금지 |
| 테스트 볼트 | Git 무시, 더미 문구 | 폴더 전체 ZIP 배포 전 제외 확인 |
| 원본 PDF·HTML·문서 | 보존 자료 | `docs/original/README.md` 경고와 함께 배포 여부 결정 |
| 상표·브랜드 | 이름 참조만 확인 | 등록·소유·사용 허락 여부는 별도 확인 |
| 개인정보·비공개 도메인 | 추적 대상 파일에서 실제 이메일·토큰·개인 경로 미발견 | 배포 직전 보안 스캔 재실행 |

## 8. 배포 우선순위

### Must Have

- 깨끗한 공개 전용 저장소·브랜치 확정
- `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md` 포함
- 변경 파일의 변경 사실 표시와 저작권 고지 유지
- `npm run security-check`, 의존성 감사, 라이선스 스캔 재실행
- ignored 파일과 로컬 테스트 볼트를 제외한 Git 추적 파일만으로 배포물 생성
- 입력자료·샘플·스크린샷·브랜드·개인정보 권리 확인
- 고객 납품 시 데이터 처리, 보증, 책임 제한, 지원 범위를 계약에 반영

### Should Have

- SBOM 또는 릴리스별 의존성 라이선스 보고서 보관
- 기여자 DCO/CLA 또는 기여 정책 결정
- AI 보조 사용 기록과 사람 검토 기록 보관
- 개인정보 보관 기간, 삭제, 침해 대응 절차 작성

### Could Have

- 상표 검색·등록과 브랜드 사용 가이드
- 기업용 보안·개인정보 영향평가
- 자동 SBOM/라이선스 검사 CI

## 9. 법무/전문가 검토 필요

- `SoDam AI Studio`가 법인·개인·브랜드 중 무엇인지와 저작권 보유 권한
- Git 이력의 다른 기여자 및 AI 보조 기여에 대한 권리·기여 조건
- `Wikimate`·`SoDam AI Studio` 명칭의 상표 등록·충돌·사용 허락 범위
- 고객사 납품 계약의 보증, 면책, 손해배상, 유지보수, 개인정보 처리 조항
- 수집 자료의 인용·요약·재배포가 관할법상 허용되는지
- 의료·금융·법률·아동·생체정보 등 규제 데이터 처리 여부
- 국가 간 데이터 이전, 수출통제, 제재 대상 지역 제공 여부

---

# Legal, Copyright, License, and Commercial-Use Guide

> This guide reflects repository files reviewed on 2026-09-20. It is technical compliance guidance, not legal advice.

## 1. Verified facts

- The declared project license is **Apache License 2.0**.
- The copyright notice is `Copyright 2026 SoDam AI Studio`.
- Identical `LICENSE` and `NOTICE` files exist at the repository root and in the distributable plugin directory.
- `package.json`, the Codex manifest, and the portable manifest declare `Apache-2.0`.
- The runtime MCP server has no npm production dependency. Installed npm packages are development-only verification dependencies.
- No separate assets, public folder, images, icons, fonts, video, or audio files were found.
- PDF, HTML, and Markdown under `docs/original` are pre-port archives and do not establish the current functional or legal state.
- The Git-ignored `plugins/wikimate/sandbox-vault` may contain dummy notes and a run log with a local absolute path. Git excludes it, but a ZIP of the working folder may not.

## 2. Beginner summary

| Intended use | Project-code position | Required checks |
|---|---|---|
| Personal execution | Allowed | Follow LICENSE and external-service terms |
| Internal company use | Allowed | Review privacy, confidentiality, security, and Codex/Obsidian terms |
| Modify code | Allowed | Mark materially changed files when distributing |
| Copy or fork | Allowed | Retain copyright, license, and NOTICE material |
| Redistribute source or binaries | Allowed | Provide LICENSE, relevant NOTICE, and retained notices |
| Sell or operate a SaaS | Allowed by the code license | Separately verify trademarks, input rights, API plans and terms, and privacy law |
| Use in training material | Allowed | Attribute the project; separately clear third-party source material |
| Deliver to a company or client | Conditionally allowed | Review contract, warranty/liability, data processing, third-party tools, and trademarks with legal/procurement staff |

Apache-2.0 licenses the project code. It does not automatically license collected documents, customer data, brands, external APIs, or AI output.

## 3. Apache License 2.0 redistribution conditions

For publication, delivery, sale, or redistribution:

1. Give recipients a copy of Apache License 2.0.
2. Retain applicable copyright, patent, trademark, and attribution notices.
3. Because this distribution includes `NOTICE`, provide relevant NOTICE attribution in a readable form.
4. Prominently state that you changed files containing material modifications.
5. You may omit notices that do not apply to the derivative work, but record the reason.
6. No trademark or official-affiliation right is granted for project names or logos.
7. The software is provided AS IS, without warranty. Any paid support or warranty must be offered only on your own behalf and responsibility.

Official text: https://www.apache.org/licenses/LICENSE-2.0.txt

## 4. Rights not included

- Copyright in collected webpages, PDFs, books, code, images, or customer documents
- Rights to Obsidian, Notion, OpenAI/Codex, or sync-service software, APIs, and plans
- Trademark or logo rights in names such as `Wikimate`, `SoDam AI Studio`, `Obsidian`, `Notion`, or `OpenAI`
- A lawful basis to process personal, health, financial, legal, confidential, or trade-secret data
- A guarantee that AI-assisted content is copyrightable or non-infringing
- Authority to warrant accuracy, uninterrupted operation, a specific result, or non-infringement to a customer

## 5. External services and material

### Codex/OpenAI

OpenAI terms and policies applicable to the user's account type apply separately. Business and developer users must have the required rights in input and evaluate output accuracy and suitability. Do not sell or share API keys or circumvent usage restrictions.

- https://openai.com/policies/
- https://openai.com/policies/services-agreement/
- https://openai.com/policies/service-terms/

### Obsidian

As checked on 2026-09-20, Obsidian permits free personal, commercial, and nonprofit use and describes the paid Commercial License as optional support. Terms for the application, Sync, Publish, and other services may change; recheck them immediately before delivery.

- https://obsidian.md/license
- https://obsidian.md/terms
- https://obsidian.md/pricing

### Notion

Notion is optional and is not called directly by the core Wikimate server. If connected, separately comply with end-user consent, least privilege, retention/deletion, token protection, API limits, and the Developer Terms.

- https://www.notion.so/notion/Terms-and-Privacy-28ffdd083dc3473e9c2da6ec011b58ac
- https://www.notion.so/Developer-Terms-ba4131408d0844e08330da2cbb225c20

### User-collected material

A public URL does not itself grant permission to store, reproduce at scale, submit to AI, redistribute, or sell its content. Do not bypass access controls, paywalls, or robots policies. Review quotation scope, licenses, contracts, privacy, and trade-secret status.

## 6. AI-generated or AI-assisted content

Project code, documentation, prompts, and notes produced by Wikimate may contain AI-generated or AI-edited material. Before publication, sale, or delivery, a person must review:

- factual accuracy, security defects, and license headers;
- rights to training and input material;
- substantial similarity to existing code, documents, images, characters, and marks;
- copyrightability of AI output in the relevant jurisdiction and evidence of human contribution; and
- contractual AI-use, disclosure, and confidentiality requirements.

No guarantee is made that AI output is exclusively owned, registrable, or non-infringing.

## 7. Repository-material review

| Target | Result | Action |
|---|---|---|
| Code and documentation | Apache-2.0 declared | Retain LICENSE and NOTICE |
| npm production dependencies | None | Do not bundle node_modules in the runtime |
| npm development dependencies | One direct, 93 total | See `THIRD_PARTY_NOTICES.md` |
| Images, icons, fonts, video, audio | None found | Record source and license for future additions |
| Example environment file | Empty values or dummy path | Never commit real tokens |
| Test vault | Git-ignored dummy material | Confirm exclusion from whole-folder ZIPs |
| Original PDF/HTML/docs | Archived material | Decide distribution with the warning in `docs/original/README.md` |
| Trademarks and brands | Name references only | Verify registration, ownership, and permission separately |
| Personal/private material | No real email, token, or personal path found in tracked files | Rerun the security scan before release |

## 8. Release priority

### Must Have

- Choose a clean public repository and branch.
- Include `LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md`.
- Mark changed files and preserve applicable notices.
- Rerun the security, dependency, and license checks.
- Build releases only from tracked files, excluding ignored test vaults.
- Clear rights for input material, samples, screenshots, brands, and personal data.
- Address data processing, warranties, liability limits, and support in customer contracts.

### Should Have

- Retain an SBOM or release-specific dependency-license report.
- Decide on DCO/CLA or contribution terms.
- Retain AI-assistance and human-review records.
- Document privacy retention, deletion, and incident response.

### Could Have

- Conduct trademark clearance and publish a brand-use guide.
- Conduct enterprise security and privacy impact assessments.
- Automate SBOM and license checks in CI.

## 9. Legal/professional review required

- Whether `SoDam AI Studio` is a legal entity, individual, or brand and has authority to hold the stated copyright
- Rights and contribution terms for other Git-history contributors and AI-assisted contributions
- Trademark registration, conflicts, and permitted use for `Wikimate` and `SoDam AI Studio`
- Customer-delivery terms for warranties, indemnity, damages, maintenance, and data processing
- Whether quotation, summarization, and redistribution of collected material are lawful in the relevant jurisdiction
- Regulated health, finance, legal, child, or biometric data processing
- Cross-border data transfers, export controls, and sanctioned-region delivery
