# SoDam-WikiMate for Codex

> Codex에서 웹 자료와 메모를 안전하게 수집하고, Obsidian Markdown 지식으로 정리·검색·검사·연결·분류·요약하는 로컬 우선 플러그인입니다.

- 프로젝트 버전: `0.10.0`
- Codex 플러그인 빌드: `0.10.0+codex.20260919174618`
- 기본 언어: 한국어
- English: [README.en.md](README.en.md) · [README.en.html](README.en.html)
- HTML 문서: [README.html](README.html)
- 라이선스: Apache License 2.0

> 공개 저장소: `https://github.com/sodam-ai/SoDam-WikiMate-Codex` · 원본 프로젝트: `https://github.com/sodam-ai/SoDam-WikiMate`

## 목차

1. [처음 보는 분을 위한 한 줄 설명](#1-처음-보는-분을-위한-한-줄-설명)
2. [현재 구현 범위](#2-현재-구현-범위)
3. [사전 준비물과 필요 프로그램](#3-사전-준비물과-필요-프로그램)
4. [다운로드와 설치](#4-다운로드와-설치)
5. [빠른 시작](#5-빠른-시작)
6. [실행과 사용 방법](#6-실행과-사용-방법)
7. [명령어와 도구](#7-명령어와-도구)
8. [주요 워크플로우](#8-주요-워크플로우)
9. [노트 구조와 데이터 모델](#9-노트-구조와-데이터-모델)
10. [파일과 문서 위치](#10-파일과-문서-위치)
11. [아키텍처와 작동 원리](#11-아키텍처와-작동-원리)
12. [보안과 데이터 흐름](#12-보안과-데이터-흐름)
13. [업데이트 내용 요약](#13-업데이트-내용-요약)
14. [개발·검증 명령](#14-개발검증-명령)
15. [문제와 오류 대처](#15-문제와-오류-대처)
16. [FAQ](#16-faq)
17. [법률·저작권·라이선스·상업적 사용](#17-법률저작권라이선스상업적-사용)
18. [현재 검증 상태와 한계](#18-현재-검증-상태와-한계)

## 1. 처음 보는 분을 위한 한 줄 설명

Wikimate는 사용자가 Codex에게 “이 자료를 내 지식 저장소에 정리해 줘”라고 말하면, 먼저 변경 계획을 보여 주고 승인을 받은 뒤 Markdown 노트를 쓰는 도구입니다.

용어를 쉽게 풀면 다음과 같습니다.

- **Codex**: 사용자의 말을 이해하고 작업을 진행하는 AI 작업 환경입니다.
- **플러그인**: Codex에 Wikimate 기능을 추가하는 묶음입니다.
- **MCP 서버**: Codex와 로컬 파일 기능 사이에서 요청을 전달하는 작은 로컬 프로그램입니다.
- **Vault(볼트)**: Obsidian이 Markdown 노트를 보관하는 폴더입니다.
- **Markdown**: 메모장처럼 읽을 수 있는 `.md` 텍스트 문서 형식입니다.
- **dry-run(미리 보기)**: 실제 파일을 바꾸지 않고 예정된 변경만 보여 주는 안전 단계입니다.

이 프로젝트는 웹 서비스나 모바일 앱이 아닙니다. 사용자의 컴퓨터에서 Codex와 함께 실행되며, 결과 노트는 사용자가 지정한 로컬 폴더에 저장됩니다.

## 2. 현재 구현 범위

### 할 수 있는 일

- 웹 페이지, PDF에서 추출한 텍스트, 직접 입력한 메모를 새 Markdown 노트로 수집
- 사용 가능한 Obsidian 볼트 검색
- 중복 노트, 끊어진 링크, 고립 노트, 필수 frontmatter 누락 검사
- 노트를 삭제하지 않고 보관 폴더로 이동하거나 링크를 안전하게 교체
- 관련 노트 추천, 상호 링크 추가, MOC(Map of Content) 관련 섹션 구성
- 노트의 폴더·태그·중요도·프로젝트·상태 추천 및 승인 후 적용
- 200자 이하 요약 추천 및 승인 후 적용
- 원문을 훼손하지 않는 선택적 원자 노트 생성
- 최근 실행 기록 확인
- 선택적으로 별도 Notion 연결 도구가 만든 페이지 ID/URL을 노트에 기록

### 하지 않는 일

- 기존 노트를 자동으로 영구 삭제하지 않습니다.
- 사용자 승인 없이 기존 노트를 자동 수정하지 않습니다.
- 비밀번호, API 키, 토큰을 관리하거나 저장하는 비밀 관리자가 아닙니다.
- Wikimate 핵심 MCP 서버가 Notion API를 직접 호출하거나 Notion 데이터베이스 행을 만들지 않습니다.
- Codex가 정의하지 않은 임의의 플러그인 슬래시 명령(`/wikimate` 등)을 새로 등록하지 않습니다.
- 휴대전화나 태블릿에서 플러그인 자체를 직접 실행하지 않습니다.

## 3. 사전 준비물과 필요 프로그램

### 필수

| 항목 | 요구 사항 | 확인 방법 |
|---|---|---|
| 컴퓨터 | Windows, macOS 또는 Linux | Codex와 Node.js를 실행할 수 있어야 합니다. |
| Codex | Codex CLI 또는 Codex 데스크톱, 로그인 완료 | 터미널에서 `codex --version` |
| Node.js | 18 이상 | `node --version` |
| 프로젝트 폴더 | 이 저장소의 전체 파일 | 폴더 안에 `plugins/wikimate`가 있어야 합니다. |
| 노트 폴더 | 쓰기 권한이 있는 폴더 | 파일을 만들고 수정할 수 있어야 합니다. |

### 처음 설치하는 순서

1. [Codex 공식 안내](https://openai.com/codex/)에서 자신의 컴퓨터에 맞는 Codex 설치 방법을 확인하고 설치한 뒤 로그인합니다. 터미널 사용자는 [Codex CLI 공식 설명](https://learn.chatgpt.com/docs/codex/cli)을 참고하세요. 설치 방법과 이용 가능 조건은 운영체제·계정에 따라 달라질 수 있습니다.
2. [Node.js 공식 다운로드](https://nodejs.org/en/download)에서 운영체제에 맞는 설치 프로그램을 받아 설치합니다. 설치를 마친 뒤 터미널을 새로 열어 `node --version`을 실행하고 18 이상인지 확인합니다. Node.js 설치 프로그램에는 일반적으로 npm도 포함되지만, 개발 검증을 할 계획이라면 `npm --version`으로 별도 확인하세요.
3. 노트를 저장할 폴더를 만듭니다. 중요한 기존 노트가 있다면 먼저 별도 위치에 백업합니다. 설치가 끝나면 아래 4장의 플러그인 설치 방법으로 진행합니다.

### 선택 사항

| 프로그램 | 언제 필요한가 | 없어도 되는가 |
|---|---|---|
| Obsidian | 노트를 화면으로 보고 볼트를 자동 탐지할 때 | 예. 명시적 폴더 경로로 핵심 기능 사용 가능 |
| `notesmd-cli` | 지원되는 CLI 경로로 Obsidian 노트를 다룰 때 | 예. 확인되지 않으면 안전한 파일 시스템 경로 사용 |
| Notion | 별도의 Notion 색인을 함께 운영할 때 | 예. 로컬 Markdown 기능과 무관 |
| Git | 복제, 변경 이력, 개발 업데이트 | 이미 받은 폴더를 설치만 할 때는 선택 |
| npm | 개발 의존성 설치와 전체 검증 | 런타임 핵심은 외부 패키지 없이 실행 가능 |

### 모바일 기기

Wikimate 실행은 Codex가 설치된 컴퓨터에서 수행합니다. 휴대전화에서는 Obsidian Sync, iCloud, OneDrive, Syncthing 등 사용자가 선택한 동기화 수단으로 Markdown 결과를 볼 수 있습니다. 동기화 서비스는 Wikimate의 일부가 아니므로 해당 서비스의 보안, 비용, 충돌 정책을 별도로 확인해야 합니다.

## 4. 다운로드와 설치

### 4.1 GitHub에서 설치

PowerShell 또는 터미널에서 다음을 실행합니다. 경로에 공백이 있으면 따옴표를 유지합니다.

```powershell
codex plugin marketplace add sodam-ai/SoDam-WikiMate-Codex
codex plugin add wikimate@wikimate-codex
```

설치 후 **새 Codex 작업을 열어야** 스킬과 MCP 구성이 다시 로드됩니다. 기존 대화 창만 계속 사용하면 이전 캐시가 남을 수 있습니다.

설치 확인:

```powershell
codex plugin list
codex mcp list
```

정상 상태에서는 `wikimate@wikimate-codex`가 활성화되고 `wikimate` MCP 서버가 표시됩니다.

### 4.2 프로젝트 다운로드

Git으로 Codex 포팅본을 내려받으려면 다음을 실행합니다.

```powershell
git clone https://github.com/sodam-ai/SoDam-WikiMate-Codex.git
```

Git을 사용하지 않으면 GitHub 저장소의 **Code → Download ZIP**으로 받을 수 있습니다.

### 4.3 로컬 폴더에서 설치

내려받은 폴더를 직접 설치하려면 아래 경로를 실제 저장 위치로 바꿉니다.

```powershell
codex plugin marketplace add "D:\path\to\SoDam-WikiMate-Codex"
codex plugin add wikimate@wikimate-codex
```


### 4.4 MCP만 수동 등록하는 대체 방법

플러그인 스킬과 시작 훅이 필요 없고 MCP 도구만 사용할 때의 대안입니다.

```powershell
codex mcp add wikimate -- node D:\경로\SoDam-WikiMate-Codex\plugins\wikimate\mcp\server.mjs
```

볼트 경로를 함께 전달하려면:

```powershell
codex mcp add wikimate --env OBSIDIAN_VAULT_PATH=D:/MyVault -- node D:\경로\SoDam-WikiMate-Codex\plugins\wikimate\mcp\server.mjs
```

이 방식은 MCP 도구만 등록하며 Wikimate 스킬, 라우팅 설명, SessionStart 안전 안내는 설치하지 않습니다.

### 4.5 제거와 업데이트

플러그인 제거:

```powershell
codex plugin remove wikimate@wikimate-codex
```

로컬 소스가 업데이트된 뒤 다시 설치:

```powershell
codex plugin add wikimate@wikimate-codex
```

그다음 새 Codex 작업을 엽니다. 개발자는 플러그인 manifest의 cachebuster를 갱신하고 검증한 뒤 배포해야 하며, 사용자가 manifest를 임의 편집하는 방식은 권장하지 않습니다.

## 5. 빠른 시작

1. Obsidian에서 사용할 볼트를 열거나, 사용할 폴더의 전체 경로를 준비합니다.
2. 위 설치 명령을 실행하고 새 Codex 작업을 엽니다.
3. Codex 입력창에서 `/skills`를 열어 `wikimate`를 선택합니다.
4. 다음처럼 요청합니다.

```text
D:\Notes\MyVault에 "테스트 자료"라는 제목으로 이 내용을 수집해 줘.
본문: 이것은 Wikimate 설치 확인용 메모입니다.
먼저 미리 보기만 보여 줘.
```

5. Codex가 제안한 대상 경로, 제목, 요약, 태그를 확인합니다.
6. 내용이 맞을 때만 “승인, 실제로 저장해 줘”라고 말합니다.
7. 저장 후 파일을 다시 읽어 제목, 본문, 링크가 맞는지 확인하게 합니다.

처음에는 개인 정보가 없고 복구 가능한 테스트 볼트에서 시작하십시오.

## 6. 실행과 사용 방법

### 권장 호출 방식

- `/skills`를 열고 `wikimate` 또는 목적별 `wikimate-*` 스킬을 선택
- 입력창에 `$wikimate`, `$wikimate-lint`, `$wikimate-link`처럼 직접 입력
- 자연어로 “Wikimate로 이 볼트를 검사해 줘”라고 요청

Codex는 플러그인이 임의로 추가한 `/wikimate` 같은 슬래시 명령을 지원하지 않습니다. 원래 명령 템플릿은 호환성 확인과 이력 보존을 위해 `plugins/wikimate/commands/`에 남아 있지만 실행 진입점은 `/skills` 또는 `$스킬이름`입니다.

| 예전 표현 | Codex에서 사용할 표현 |
|---|---|
| `/wikimate` | `/skills` → `wikimate`, 또는 `$wikimate` |
| `/wikimate-lint` | `$wikimate-lint` |
| `/wikimate-link` | `$wikimate-link` |
| `/wikimate-classify` | `$wikimate-classify` |
| `/wikimate-summarize` | `$wikimate-summarize` |

### 환경 변수

| 이름 | 의미 | 주의 |
|---|---|---|
| `OBSIDIAN_VAULT_PATH` | 기본 볼트의 전체 경로 | 가장 명확하고 충돌이 적음 |
| `OBSIDIAN_VAULT_NAME` | 자동 탐지할 볼트 이름 | 같은 이름이 여러 개면 모호할 수 있음 |
| `NOTION_RESEARCH_DB_ID` | 선택적 연구 DB 식별자 | Wikimate 핵심 서버가 직접 읽지는 않음 |
| `NOTION_RUNLOG_DB_ID` | 선택적 실행 기록 DB 식별자 | 별도 Notion 연결에서만 사용 |

`.env.example`은 이름을 설명하는 예시일 뿐입니다. 서버는 `.env` 파일을 자동으로 읽지 않으므로 운영체제 환경 변수나 Codex MCP 설정으로 전달해야 합니다. 실제 토큰과 비밀번호는 `.env`, README, 로그, Git 커밋에 넣지 마십시오.

## 7. 명령어와 도구

### 7.1 제공 스킬 8개

| 스킬 | 역할 |
|---|---|
| `wikimate` | 요청을 올바른 전문 스킬로 안내하는 최상위 진입점 |
| `wikimate-organize` | 수집과 정리 흐름 |
| `wikimate-query` | 근거 노트를 찾아 인용하며 답변 |
| `wikimate-lint` | 중복·끊어진 링크·고립·메타데이터 검사 |
| `wikimate-link` | 관련 노트 추천, 링크와 MOC 구성 |
| `wikimate-classify` | 폴더·태그·중요도·상태 분류 |
| `wikimate-summarize` | 짧은 요약과 원자 노트 제안 |
| `wikimate-reviewer` | 변경 결과와 안전성 재검토 |

### 7.2 MCP 도구 8개

| 도구 | 핵심 입력 | 기본 동작 |
|---|---|---|
| `wikimate_collect` | `title`; 선택: `url`, `text`, `summary`, `tags`, `importance`, `vault`, `vault_path`, `folder`, `dry_run` | 새 노트 계획 또는 생성. `dry_run=true` 기본 |
| `wikimate_vaults` | 없음 | 사용 가능한 볼트 목록 조회 |
| `wikimate_lint` | 선택: `vault`, `vault_path` | 읽기 전용 품질 검사 |
| `wikimate_fix` | `action`, `note`; 선택: `from`, `to`, 볼트, `dry_run` | `archive` 또는 `replace_link` |
| `wikimate_runlog` | 선택: 볼트, `limit` | 최근 실행 기록. 기본 20개 |
| `wikimate_link` | `action`; 선택: `note`, `topic`, `targets`, `reason`, `kind`, `notion_id`, 볼트, `dry_run` | 추천·링크·MOC·Notion ID 기록 |
| `wikimate_classify` | `action`, `note`; 선택: `folder`, `tags`, `importance`, `status`, `project`, 볼트, `dry_run` | 분류 추천 또는 적용 |
| `wikimate_summarize` | `action`, `note`; 선택: `summary`, `atomic_note`, 볼트, `dry_run` | 요약 추천 또는 적용 |

입력 경계:

- `importance`: 1~5
- `kind`: `related` 또는 `reference`
- `summary`: 적용 시 200자 이하
- `classify.folder`: `00_Inbox`, `10_Projects`, `20_Resources`, `30_Notes`, `40_Drafts` 중 하나
- `classify.status`: `inbox`, `draft`, `done` 중 하나이며 상태 변경은 사용자가 명시적으로 요청할 때만 적용
- `link.action`: `suggest`, `add_links`, `build_moc`, `set_notion_id`
- `classify.action`, `summarize.action`: `suggest` 또는 `apply`

## 8. 주요 워크플로우

### 8.1 자료 수집

1. 사용할 볼트를 이름 또는 전체 경로로 확정합니다.
2. 출처 URL, 제목, 본문 전체를 준비합니다.
3. `dry_run=true`로 파일명, 폴더, frontmatter, 중복 여부를 확인합니다.
4. 사용자가 계획을 승인합니다.
5. `dry_run=false`로 새 파일을 원자적으로 씁니다.
6. 저장한 파일을 다시 읽어 결과를 확인합니다.
7. 필요한 경우에만 별도 Notion 연결로 색인을 만들고 반환된 ID/URL을 기록합니다.

### 8.2 질의와 답변

1. 질문의 핵심어로 후보 노트를 찾습니다.
2. 실제 파일이 존재하고 읽을 수 있는지 확인합니다.
3. 근거가 되는 노트를 구분해 답변하고 출처 파일을 표시합니다.
4. 파일이 없거나 깨진 Notion 색인은 근거에서 제외합니다.

### 8.3 검사와 수정

1. `wikimate_lint`로 읽기 전용 검사를 수행합니다.
2. 발견 사항을 중복, 끊어진 링크, 고립, frontmatter 누락으로 나눕니다.
3. 수정 제안을 노트 단위로 보여 줍니다.
4. 승인된 노트만 백업 후 수정합니다.
5. 삭제 대신 `99_Archive`로 이동합니다.
6. 다시 검사하여 문제가 사라졌고 새 문제가 생기지 않았는지 확인합니다.

### 8.4 연결과 MOC

1. `suggest`로 관련 후보를 읽기 전용으로 찾습니다.
2. 일반 링크는 최대 5개를 이유와 함께 제안합니다.
3. 승인 뒤 `add_links`로 `related` 또는 `reference` 링크를 추가합니다.
4. MOC는 `build_moc`로 관련 섹션만 갱신하며 일반 링크의 5개 제한을 적용하지 않습니다.

### 8.5 분류

1. `suggest`로 폴더, 태그, 중요도, 프로젝트, 상태를 제안합니다.
2. 사용자가 하나씩 확인합니다.
3. `apply`로 승인된 값만 반영합니다.
4. `90_Templates`와 `99_Archive`는 자동 분류 대상이 아닙니다.

### 8.6 요약

1. 노트 본문을 읽어 200자 이하 요약을 제안합니다.
2. 필요한 경우 원문을 그대로 둔 채 별도 원자 노트를 제안합니다.
3. 승인된 요약과 원자 노트만 적용합니다.
4. 원본 본문은 수정하거나 삭제하지 않습니다.
5. 중요한 자료는 `wikimate-reviewer`로 최종 확인합니다.

## 9. 노트 구조와 데이터 모델

권장 볼트 폴더:

```text
00_Inbox/       새로 들어온 미분류 자료
10_Projects/    진행 중인 프로젝트 자료
20_Resources/   참고 자료
30_Notes/       정리된 지식 노트
40_Drafts/      초안
90_Templates/   템플릿
99_Archive/     삭제 대신 보관한 자료
```

권장 frontmatter 필드:

| 필드 | 의미 |
|---|---|
| `title` | 사람이 읽는 제목 |
| `type` | `note` 또는 `moc` |
| `status` | `inbox`, `draft`, `done` |
| `project` | 관련 프로젝트 |
| `source` | 원문 URL 또는 출처 |
| `summary` | 200자 이하 요약 |
| `importance` | 1~5 중요도 |
| `tags` | 검색용 태그 목록 |
| `related` | 관련 노트 링크 |
| `source_hash` | 같은 원문 중복 방지용 해시 |
| `notion_id` | 선택적 Notion 페이지 ID 또는 URL |
| `created`, `updated` | 생성·수정 시각 |

## 10. 파일과 문서 위치

| 경로 | 용도 |
|---|---|
| `.agents/plugins/marketplace.json` | 로컬 Codex 마켓플레이스 정의 |
| `plugins/wikimate/.codex-plugin/plugin.json` | Codex 플러그인 manifest |
| `plugins/wikimate/plugin.json` | 휴대 가능한 플러그인 메타데이터 |
| `plugins/wikimate/.mcp.json` | MCP 서버 등록 정보 |
| `plugins/wikimate/hooks/` | 세션 시작 안전 문맥과 훅 |
| `plugins/wikimate/skills/` | 8개 Codex 스킬 |
| `plugins/wikimate/commands/` | 원래 명령 템플릿 보존본; 직접 슬래시 등록 아님 |
| `plugins/wikimate/mcp/server.mjs` | 로컬 MCP 진입점 |
| `plugins/wikimate/mcp/lib/` | 수집·검사·수정·연결·분류·요약 구현 |
| `plugins/wikimate/templates/note.md` | 노트 템플릿 |
| `plugins/wikimate/scripts/` | 검증, 보안 검사, smoke/E2E 스크립트 |
| `plugins/wikimate/references/design/` | PRD와 설계 자료 |
| `docs/CODEX_SETUP.md` | 추가 Codex 설정 설명 |
| `docs/original/` | 포팅 전 원본 문서와 명령 자료; 현재 상태가 아님 |
| `docs/LEGAL_AND_COMMERCIAL_USE.md` | 법률·저작권·배포·납품 체크리스트 |
| `THIRD_PARTY_NOTICES.md` | 실제 의존성과 선택적 외부 서비스 고지 |
| `AGENTS.md` | 프로젝트 작업 규칙 |
| `DEVELOPMENT.md` | 개발자 안내 |
| `LICENSE`, `NOTICE` | 라이선스 원문과 고지 |
| `README.md`, `README.html` | 한국어 사용 설명서 |
| `README.en.md`, `README.en.html` | 영어 사용 설명서 |

볼트 안에서 생성되는 운영 파일:

- `.wikimate/runlog.jsonl`: 로컬 실행 기록
- `.wikimate/backups/`: 기존 노트 수정 전 백업
- `.wikimate/write.lock`: 동시 쓰기 충돌 방지 잠금

이 내부 파일은 사용자가 직접 편집하지 않는 것이 안전합니다.

## 11. 아키텍처와 작동 원리

```text
사용자
  ↓ 자연어, /skills, $wikimate-*
Codex 스킬 라우터
  ↓ 구조화된 도구 요청
로컬 MCP 서버 (표준 입출력 JSON-RPC)
  ↓ 입력 검증 → 경로 검증 → dry-run/승인 → 쓰기 잠금
notesmd-cli(사용 가능하고 볼트가 명확할 때) 또는 안전한 파일 시스템 처리
  ↓
Obsidian Markdown 볼트
  ├─ 실제 노트
  └─ .wikimate/{runlog.jsonl, backups, write.lock}

선택 경로: Codex → 별도 Notion 연결 → Notion → 반환된 ID/URL만 노트에 기록
```

MCP 서버는 표준 입출력으로 Codex와 통신하므로 일반 웹 포트를 열지 않습니다. 파일 쓰기는 임시 파일을 거쳐 교체하는 원자적 방식과 볼트 단위 잠금을 사용합니다.

## 12. 보안과 데이터 흐름

### 안전 장치

- 외부 문서 내용은 신뢰하지 않는 데이터로 처리하며 그 안의 지시를 실행 명령으로 간주하지 않습니다.
- 새 수집과 변경 도구는 기본적으로 `dry_run=true`입니다.
- 기존 노트 변경은 노트별 명시적 승인이 필요합니다.
- 영구 삭제 대신 `99_Archive`로 이동합니다.
- 수정 전 `.wikimate/backups`에 복구본을 만듭니다.
- `.wikimate/write.lock`으로 여러 프로세스의 동시 쓰기를 막고, 종료된 프로세스의 오래된 잠금만 복구합니다.
- 실제 경로를 정규화하여 `..`, 절대경로, UNC 경로, 심볼릭 링크·junction을 이용한 볼트 탈출을 차단합니다.
- `.obsidian`과 `.wikimate` 내부를 일반 노트처럼 조작하지 못하게 차단합니다.
- 같은 파일명이 있으면 덮어쓰지 않고 안전한 접미사를 붙입니다.
- `source_hash`로 같은 원문의 중복 수집을 줄입니다.
- 오류 메시지를 정리해 실패한 외부 CLI가 노트 전체 내용을 로그에 노출하지 않게 합니다.

### 데이터가 어디로 가는가

| 상황 | 데이터 흐름 |
|---|---|
| 핵심 MCP 기능 | 컴퓨터의 Codex 프로세스 ↔ 로컬 MCP ↔ 사용자가 지정한 로컬 볼트 |
| Codex 대화 | 사용 중인 Codex/OpenAI 계정과 조직 설정의 데이터 처리 정책 적용 |
| 선택적 Notion 사용 | 사용자가 연결·승인한 경우에만 Notion으로 전송; Notion 약관 적용 |
| 모바일 동기화 | 사용자가 선택한 별도 동기화 서비스로 전송; 해당 서비스 약관 적용 |

따라서 “MCP 파일 처리 부분이 로컬”이라는 말이 “전체 AI 작업이 완전 오프라인”이라는 뜻은 아닙니다. 비밀정보, 주민등록번호, 의료·법률·고객 기밀은 조직 정책과 관련 법률을 확인한 뒤 최소한으로 처리하십시오.

### 운영 권고

- 하나의 볼트에 여러 Wikimate 서버를 동시에 연결하지 마십시오.
- 대량 작업 전 볼트 전체를 별도 위치에 백업하십시오.
- Obsidian에서 사람이 편집 중인 같은 파일을 동시에 자동 수정하지 마십시오.
- Notion 연결은 필요한 두 데이터베이스에만 최소 권한을 부여하십시오.
- `.env`, 토큰, 인증서, 개인 키, DB 접속 정보는 Git에 커밋하지 마십시오.

## 13. 업데이트 내용 요약

<details>
<summary><strong>v0.10.0 Codex 포팅 업데이트 펼치기</strong></summary>

- Codex 로컬 마켓플레이스 및 `.codex-plugin` 구조 추가
- 8개 스킬과 8개 MCP 도구 구성
- 원래 명령 의도를 `/skills`와 `$wikimate-*` 진입 방식으로 연결
- 원본 명령 템플릿을 호환성 검토 자료로 보존
- SessionStart 안전 문맥과 볼트 탐지 추가
- dry-run → 사용자 승인 → 실제 쓰기 → 재읽기 검증 흐름 강화
- 교차 프로세스 쓰기 잠금, 원자적 쓰기, 백업, 실행 기록 추가·강화
- 심볼릭 링크와 junction을 포함한 볼트 경로 이탈 방지
- 외부 CLI 오류에서 노트 본문이 노출되지 않도록 오류 정리
- MCP smoke, 보안 스캔, 설치 캐시 일치 검증 수행(검증 시점과 범위는 18절 참고)
- 공개 Codex 포팅 저장소와 로컬 검증 범위를 구분하고, 실제 사용자 볼트·실시간 Notion 연동은 환경별 확인 사항으로 명시

</details>

## 14. 개발·검증 명령

프로젝트 루트에는 `package.json`이 없으며, 명령은 `plugins/wikimate`에서 실행합니다.

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

- 별도 `build` 스크립트 없음: JavaScript ESM을 직접 실행하는 buildless 구조입니다.
- 별도 `typecheck` 스크립트 없음: TypeScript 프로젝트가 아닙니다.
- 별도 `lint` 스크립트 없음: 기능 검증, 구문 검사, 보안 검사, Git 공백 검사를 조합합니다.
- `npm audit`은 npm 보안 레지스트리 네트워크에 접속해야 합니다. 네트워크 실패와 취약점 발견은 서로 다른 결과입니다.

## 15. 문제와 오류 대처

| 증상 | 가능한 원인 | 안전한 해결 순서 |
|---|---|---|
| 플러그인이 목록에 없음 | 마켓플레이스 경로 오류 또는 설치 누락 | 프로젝트 최상위 경로를 다시 확인 → `codex plugin marketplace add` → `codex plugin add` → `codex plugin list` |
| 스킬이 보이지 않음 | 기존 작업의 캐시 | 플러그인 활성화 확인 → 새 Codex 작업 열기 → `/skills` 확인 |
| MCP 서버가 보이지 않음 | Node.js PATH, 상대 경로, manifest 문제 | `node --version` → `codex mcp list` → 프로젝트에서 `node plugins/wikimate/mcp/server.mjs` 구문 실행 확인 |
| 볼트가 검색되지 않음 | Obsidian 설정 없음 또는 이름 중복 | Obsidian에서 볼트 열기 → `OBSIDIAN_VAULT_PATH` 또는 요청에 전체 경로 지정 |
| 미리 보기 후 파일이 없음 | `dry_run=true`의 정상 동작 | 계획을 확인한 뒤 명시적으로 실제 저장 승인 |
| `VAULT_BUSY` | 다른 프로세스가 쓰는 중 | 잠시 기다림 → 중복 Codex/MCP 종료 → 작업 재시도. 모든 프로세스를 끄기 전 잠금 파일을 수동 삭제하지 않음 |
| 경로 접근 거부 | 볼트 밖 경로, `..`, junction, 내부 관리 폴더 | 볼트 안의 정상 상대 경로 사용; 보호 장치를 끄지 않음 |
| 중복이라며 수집 생략 | 동일 `source_hash` 존재 | 기존 노트를 확인하고 새 노트가 정말 필요할 때 출처·내용을 구분 |
| 파일명에 숫자 접미사가 붙음 | 같은 이름 파일 보호 | 정상적인 덮어쓰기 방지 동작; 두 파일 내용을 비교 |
| Notion에 항목이 없음 | 핵심 서버는 Notion을 직접 쓰지 않음 | 별도 Notion 연결과 대상 DB 권한 확인 → 사용자가 색인 작업 승인 → 반환 ID 기록 |
| 한글 경로/공백 오류 | 셸 인용 문제 | 전체 경로를 큰따옴표로 감싸고 PowerShell에서 다시 실행 |
| 모바일에서 실행 안 됨 | 데스크톱 로컬 플러그인 | 컴퓨터에서 실행하고 승인된 동기화로 결과만 모바일에서 열기 |
| `npm audit` 실패 | 네트워크 또는 레지스트리 오류 가능 | 오류 문구 확인 → 네트워크 복구 후 재실행 → 취약점이면 패키지 영향 분석 |

문제가 반복되면 다음 정보만 공유하고 비밀값은 지웁니다: 운영체제, Codex/Node 버전, 실행한 명령, 짧게 정리한 오류, 문제가 난 파일의 상대 경로. 노트 전체 내용, 토큰, `.env`, 사용자 홈 전체 경로는 공유하지 마십시오.

## 16. FAQ

### Q. 기존 노트를 삭제하나요?

아니요. 기본 정책은 영구 삭제 금지이며, 제거가 필요하면 승인 후 `99_Archive`로 이동합니다.

### Q. Obsidian을 항상 켜 두어야 하나요?

명시적인 볼트 경로로 파일을 처리할 때는 필수가 아닙니다. 자동 탐지는 Obsidian 설정이 있어야 더 정확합니다.

### Q. Notion 계정이 꼭 필요한가요?

아니요. Notion은 선택 사항이며 로컬 Markdown 기능은 독립적으로 동작합니다.

### Q. 모든 데이터가 컴퓨터 밖으로 나가지 않나요?

로컬 MCP의 파일 입출력은 로컬입니다. 그러나 Codex 대화는 Codex/OpenAI 설정을 따르고, Notion이나 동기화 서비스를 사용하면 해당 서비스로 데이터가 전송될 수 있습니다.

### Q. 원래 `/wikimate` 슬래시 명령을 그대로 쓸 수 있나요?

현재 Codex는 플러그인 정의 임의 슬래시 명령을 등록하지 않습니다. `/skills`에서 `wikimate`를 선택하거나 `$wikimate`를 사용하십시오.

### Q. 휴대전화에서 직접 실행할 수 있나요?

플러그인 실행은 컴퓨터에서 합니다. 동기화한 Markdown 결과는 모바일 Obsidian 등에서 볼 수 있습니다.

### Q. 기존 노트를 수정할 수 있나요?

가능하지만 미리 보기, 명시적 승인, 백업, 원자적 쓰기 절차를 거칩니다. 요약 기능은 원본 본문을 바꾸지 않습니다.

### Q. 여러 사람이 같은 볼트를 동시에 써도 되나요?

잠금 장치가 자동화 충돌을 줄이지만 사람의 편집과 외부 동기화 충돌까지 모두 해결하지는 않습니다. 같은 파일 동시 편집을 피하고 팀 백업·병합 규칙을 정하십시오.

### Q. 로그와 백업은 어디에 있나요?

볼트 내부의 `.wikimate/runlog.jsonl`과 `.wikimate/backups/`입니다. 민감한 본문을 로그에 남기지 않도록 설계했지만 접근 권한과 백업 보관 기간은 사용자가 관리해야 합니다.

### Q. “저장 완료”는 무엇을 의미하나요?

도구가 쓰기 성공만 반환한 상태가 아니라, 저장된 파일을 다시 읽어 제목·본문·메타데이터가 기대와 일치함을 확인한 상태를 뜻합니다.

## 17. 법률·저작권·라이선스·상업적 사용

> 이 절은 기술적 준수 안내이며 법률 자문이 아닙니다. 국가, 조직, 자료 종류에 따라 의무가 달라질 수 있으므로 상업 배포나 민감 데이터 처리는 법률 전문가에게 확인하십시오.

상세 배포 체크리스트와 확인된 사실·법무 검토 필요 사항은 [법률·저작권·라이선스·상업적 사용 가이드](docs/LEGAL_AND_COMMERCIAL_USE.md)와 [제3자 소프트웨어·서비스 고지](THIRD_PARTY_NOTICES.md)를 함께 확인하십시오.

### 프로젝트 코드

이 프로젝트는 `LICENSE`에 포함된 **Apache License 2.0**으로 제공됩니다. 일반적으로 개인·교육·연구·회사 내부·상업적 사용, 수정, 복제, 파생물 제작과 배포가 허용되지만 다음 조건을 지켜야 합니다.

- 배포물에 Apache 2.0 라이선스 사본을 포함합니다.
- 기존 저작권, 특허, 상표, 귀속 고지를 유지합니다.
- `NOTICE`가 제공되면 읽을 수 있는 방식으로 관련 고지를 함께 전달합니다.
- 수정한 파일에는 의미 있는 변경을 했다는 사실을 표시합니다.
- Apache 2.0은 상표 사용 권리를 부여하지 않습니다. SoDam, WikiMate, Obsidian, Notion 등의 이름이나 로고로 공식 승인·제휴를 암시하면 안 됩니다.
- 소프트웨어는 보증 없이 제공됩니다. 운영 전 자체 검증과 백업 책임은 사용자에게 있습니다.
- 책임 제한은 `LICENSE` 제8조에 규정되어 있으며, 적용 법률이나 별도 서면 합의가 우선할 수 있습니다. 모든 책임이 무조건 면제된다는 뜻은 아닙니다.

영문 라이선스 원문이 우선합니다: [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0), [Apache 라이선스 FAQ](https://www.apache.org/foundation/license-faq.html).

### 상업적 사용

Wikimate 코드 자체는 Apache 2.0 조건을 지키면 상업적으로 사용할 수 있습니다. 그러나 다음 권리는 별개입니다.

1. **수집 원문**: 웹 페이지, PDF, 책, 이미지, 고객 문서의 저작권과 이용 약관은 원저작자에게 남습니다. 공개되어 있다는 이유만으로 복제·재배포·AI 입력 권한이 생기지 않습니다.
2. **개인정보와 기밀**: 적법한 처리 근거, 고지·동의, 최소 수집, 보관 기간, 삭제 요청, 국외 이전과 조직 보안 정책을 검토해야 합니다.
3. **Obsidian**: 2026-09-20 확인 기준 공식 라이선스/가격 안내는 개인·상업·비영리 사용에 필수 유료 상업 라이선스를 요구하지 않고 유료 지원 라이선스를 선택 사항으로 설명합니다. 정책은 바뀔 수 있으므로 조직 도입 전 [Obsidian License Overview](https://obsidian.md/license)와 [Obsidian Pricing](https://obsidian.md/pricing)을 다시 확인하십시오.
4. **Notion**: Notion을 연결하면 Notion 서비스 약관, 개인정보 처리방침, Developer Terms가 별도로 적용됩니다. 최종 사용자의 동의 없이 통합 데이터를 수집·저장·변경·삭제하거나 토큰을 요구하지 마십시오. [Notion Terms and Privacy](https://www.notion.so/notion/Terms-and-Privacy-28ffdd083dc3473e9c2da6ec011b58ac), [Notion Developer Terms](https://www.notion.so/Developer-Terms-ba4131408d0844e08330da2cbb225c20).
5. **Codex/OpenAI와 동기화 서비스**: 계정 유형, 조직 정책, 데이터 제어, 보관 정책, API/서비스 약관을 별도로 확인합니다.
6. **제3자 패키지·소재**: 재배포 전 각 패키지와 사용한 폰트·이미지·아이콘·템플릿의 실제 버전, 출처, 라이선스와 상업 이용 조건을 다시 검사합니다. 프로젝트 라이선스가 제3자 구성요소의 조건을 덮어쓰지 않습니다. 외부 API·AI 모델의 요금제와 이용 정책도 별도로 확인합니다.

### 초보자용 사용 가능 범위

| 사용 방식 | 안내 |
|---|---|
| 수정·복제·포크 | 가능. 기존 고지를 유지하고 배포하는 수정 파일에 변경 사실을 표시 |
| 재배포·판매 | 가능. LICENSE와 관련 NOTICE를 제공하고 제3자 권리는 별도 확인 |
| 회사 내부 사용·교육 | 가능. 조직의 AI·보안·개인정보 정책 준수 |
| SaaS·고객사 납품 | 조건부 가능. 계약·데이터 처리·외부 API·상표·보증 범위를 별도 검토 |
| Wikimate/SoDam 명칭·로고를 내 브랜드처럼 사용 | Apache-2.0이 허용하지 않음. 별도 권리 확인과 허락 필요 |
| 고객 문서·웹 원문·이미지·캐릭터 재배포 | 프로젝트 라이선스 범위 밖. 원권리자의 허락 또는 법적 근거 필요 |

### AI 생성·보조 콘텐츠

코드·문서·프롬프트·노트에는 AI가 생성하거나 수정한 내용이 포함될 수 있습니다. 공개·판매·납품 전 사람이 정확성, 보안, 출처, 라이선스, 기존 저작물·코드·이미지·캐릭터·상표와의 유사성, 관할법상 저작권 보호 가능성을 확인해야 합니다. 독점 소유권·등록 가능성·비침해를 보장하지 않습니다.

### 법무/전문가 검토 필요

저작권 표기에 사용된 `SoDam AI Studio`의 법적 주체와 권리 보유 근거, 다른 Git 기여자의 기여 조건, `Wikimate`·`SoDam AI Studio` 상표 상태, 고객 납품 계약, 규제 데이터 처리와 수집 원문의 상업 재배포는 이 저장소만으로 확정할 수 없습니다.

로컬 보존 파일 `docs/original/CHECKPOINT.original.md`에는 개인 컴퓨터 경로가 있어 Git 추적·공개 배포에서 제외했습니다. 파일은 원래 작업 폴더에 그대로 남아 있습니다. 폴더 전체를 ZIP으로 전달할 때는 이 파일과 포함된 경로·권리를 별도로 확인하세요.

### 자료를 수집하기 전 체크리스트

- 내가 이 자료를 저장·요약·변환할 권한이 있는가?
- robots 정책, 유료벽, 접근 통제, 사이트 약관을 우회하지 않는가?
- 개인정보, 영업비밀, 의료·재무·법률 정보가 포함되어 있는가?
- 필요한 최소 범위만 수집하고 보관 기간과 삭제 방법을 정했는가?
- 생성한 요약을 공개하거나 판매할 때 원문 인용·출처·라이선스 의무를 지키는가?
- 고객 또는 조직의 AI 사용 정책과 국외 이전 정책을 충족하는가?

답이 불명확하면 수집을 중지하고 권리자나 법률·보안 담당자에게 확인하십시오.

## 18. 현재 검증 상태와 한계

2026-09-23 현재 작업 폴더에서 다시 확인한 항목(Node.js 26):

- 의존성 고정 설치 성공
- 핵심 검증 236개 통과
- MCP smoke 검증 18개 통과
- Codex 포팅 검증 127개 통과
- JavaScript 모듈 30개 구문 검사 및 `git diff --check` 통과
- 보안 검사: 커밋 대상·미추적 파일 93개 중 93개 검사, 의심 패턴 없음
- `npm audit --audit-level=moderate`: 알려진 취약점 0건

Node.js 18·20 호환성, 공식 플러그인 validator, 설치 캐시 해시, 실제 등록 볼트 조회, 5,000노트 성능 수치는 이전 점검의 기록입니다. **이번 점검에서 다시 실행하지 않았으므로 현재 상태의 통과 근거로 사용하지 마십시오.**

최종 배포 전에 남아 있는 환경별 확인:

- 실제 사용자 볼트에 대한 쓰기 작업은 데이터 보호를 위해 이 최종 문서 작성 단계에서 실행하지 않았습니다.
- 실시간 Notion 생성·조회·수정은 계정 및 권한이 필요한 선택 기능이라 이 단계에서 실행하지 않았습니다.
- 브라우저 화면과 모바일 반응형 UI는 이 로컬 CLI/MCP 플러그인에 없습니다.
- 이번 작업 폴더의 미반영 변경에 대한 원격 GitHub Actions 결과는 확인하지 않았습니다.
- 현재 Git 작업 트리에는 기존 변경사항 89건이 있고 `main`의 유일한 원격 `upstream`은 **원본** `SoDam-WikiMate`를 가리킵니다. 공개된 Codex 포팅 저장소와 다르므로 이 폴더에서 현재 설정 그대로 push하면 안 됩니다.

배포 전에는 테스트용 볼트에서 수집 → 승인 → 쓰기 → 재읽기 → 검사 → 백업 복원을 한 번 수행하고, 공개 대상 저장소·브랜치·라이선스 고지를 사람이 최종 확인하십시오.
