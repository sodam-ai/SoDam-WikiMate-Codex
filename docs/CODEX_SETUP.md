# Wikimate Codex 설치

## 권장: Codex 플러그인 설치

GitHub에 포팅 저장소가 게시된 경우:

```powershell
codex plugin marketplace add sodam-ai/SoDam-WikiMate-Codex
codex plugin add wikimate@wikimate-codex
```

로컬 소스에서 시험할 경우:

```powershell
codex plugin marketplace add D:\path\to\SoDam-WikiMate-Codex
codex plugin add wikimate@wikimate-codex
```

설치 후 새 Codex 작업을 열어 플러그인 cache, MCP 도구와 스킬 8개를 새로 로드합니다. 현재 Codex CLI는 플러그인별 임의 슬래시 명령을 등록하지 않으므로, 내장 `/skills`에서 `wikimate` 또는 원하는 `wikimate-*` 스킬을 선택합니다. 확인:

```powershell
codex plugin list
codex mcp list
```

`wikimate@wikimate-codex`가 enabled이고 `wikimate` MCP가 보이면 등록된 상태입니다. 새 작업에서 `/skills` 목록에 `wikimate`가 나타나는지 확인하세요. 실제 MCP 동작 여부는 `내 옵시디언 볼트 목록을 보여줘`라고 요청해 `wikimate_vaults` 응답까지 확인해야 합니다.

## 대안: MCP만 수동 등록

플러그인 설치를 원하지 않을 때만 사용합니다. 이 방식은 MCP 도구는 제공하지만 번들 스킬과 SessionStart hook은 제공하지 않습니다.

```powershell
codex mcp add wikimate -- node D:\path\to\SoDam-WikiMate-Codex\plugins\wikimate\mcp\server.mjs
```

고정 볼트 경로를 환경변수로 주고 싶다면:

```powershell
codex mcp add wikimate --env OBSIDIAN_VAULT_PATH=D:/MyVault -- node D:/path/to/SoDam-WikiMate-Codex/plugins/wikimate/mcp/server.mjs
```

제거:

```powershell
codex mcp remove wikimate
```

## 첫 동작 검증

새 Codex 작업에서 순서대로 확인합니다.

1. `내 옵시디언 볼트 목록을 보여줘` — 읽기 전용 `wikimate_vaults`가 실제 응답하는지 확인.
2. 버리는 테스트 볼트에서 `이 텍스트를 노트로 정리하되 dry-run 계획만 보여줘: 테스트 원문` — 파일이 생기지 않는지 확인.
3. 계획을 승인한 뒤 실제 생성 — 생성된 노트를 다시 읽어 원문 보존을 확인.
4. 운영 볼트에는 검증 완료 전 쓰지 않습니다.

## 주의

- Node.js 18 이상이 필요합니다.
- `.obsidian/`은 수정하지 않습니다.
- 같은 볼트에 쓰기 가능한 Wikimate 서버를 동시에 두 개 이상 연결하지 마세요.
- Notion 색인은 별도 Notion 도구 연결이 있어야 하며 Wikimate 코어만으로는 동작하지 않습니다.

## 공개·회사·고객사 사용 전

프로젝트 코드의 Apache-2.0 사용 허용과 수집 원문·외부 서비스·상표·개인정보 권리는 서로 별개입니다. 공개, 판매, 서비스 운영 또는 고객사 납품 전에는 [`LEGAL_AND_COMMERCIAL_USE.md`](LEGAL_AND_COMMERCIAL_USE.md)와 루트의 `THIRD_PARTY_NOTICES.md`를 확인하십시오. 법적 주체, 기여자 권리, 상표, 고객 계약과 규제 데이터는 법무/전문가 검토가 필요합니다.
