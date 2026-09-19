# 개발 및 검증

실행 가능한 플러그인은 `plugins/wikimate/` 아래에 있습니다. MCP 서버는 빌드가 필요 없는 Node.js 18+ ESM stdio 서버이며, npm 의존성은 검증용 개발 의존성뿐입니다.

## 로컬 검증

```powershell
cd plugins\wikimate
npm ci
npm run verify
node scripts\smoke-tools.mjs
node scripts\security-scan.mjs --all
cd ..\..
node validate-codex.mjs
```

- `npm run verify`: 격리된 임시 볼트에서 코어 불변 조건을 검사합니다.
- `smoke-tools.mjs`: 실제 stdio MCP 서버를 띄워 8개 도구의 JSON-RPC 배선을 검사합니다.
- `security-scan.mjs --all`: 무시 목록을 제외한 현재 저장소 파일 전체에서 실제 토큰 형태를 스캔합니다.
- `validate-codex.mjs`: Marketplace, manifest, MCP 상대경로, hook, 스킬 및 원본 명령 호환 템플릿 구조를 교차 검증합니다.

## 안전한 수동 시험

- 운영 볼트에서 시험하지 말고 버리는 전용 테스트 볼트를 사용합니다.
- 쓰기 요청은 항상 `dry_run=true` 결과를 먼저 확인합니다.
- Notion 운영 DB를 시험할 경우 테스트 행을 명확히 표시하고 직접 정리합니다.
- 실제 쓰기는 볼트별 `.wikimate/write.lock`으로 서버 프로세스 사이에서도 직렬화됩니다. 다른 쓰기가 진행 중이면 기다린 뒤 안전하게 실패하며, 종료된 프로세스의 오래된 잠금은 회수합니다. 그래도 사람이 같은 노트를 동시에 직접 편집하는 상황은 피하세요.

## 저장소 구조

```text
.agents/plugins/marketplace.json       Codex Marketplace 카탈로그
plugins/wikimate/.codex-plugin/        Codex manifest
plugins/wikimate/plugin.json           Agent Plugins 1.0 portable manifest
plugins/wikimate/.mcp.json             번들 MCP 등록
plugins/wikimate/hooks/                Codex SessionStart hook
plugins/wikimate/skills/               Codex 스킬 8개(/skills에서 선택)
plugins/wikimate/commands/             원본 명령 호환·감사용 템플릿(Codex 등록 아님)
plugins/wikimate/mcp/                  무의존 MCP 코어
plugins/wikimate/scripts/              테스트·보안 스캔
docs/original/                          원본 Claude 중심 문서 보존본
```

## 배포 경계

이 로컬 포팅 작업은 새 GitHub 저장소 생성, push, release, 실제 Marketplace 원격 설치를 포함하지 않습니다. 공개 전에는 새 저장소 URL을 확정해 두 manifest와 README의 원본 저장소 링크를 포팅 저장소 링크로 갱신하고, 깨끗한 checkout에서 전체 검증을 다시 실행해야 합니다.

## 공개·배포·납품 전 법률 체크

- `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md`, `docs/LEGAL_AND_COMMERCIAL_USE.md`를 함께 검토합니다.
- `npm ls --omit=dev --all`과 `npx --yes license-checker --summary`를 다시 실행하고 결과를 릴리스 기록에 남깁니다.
- `git status --short --ignored`로 `sandbox-vault`, `.env`, 로그 등 로컬 산출물이 없는지 확인합니다.
- 작업 폴더 전체를 ZIP으로 묶지 말고, 검토 완료된 Git 추적 파일로 릴리스 산출물을 만듭니다.
- 이미지·폰트·샘플·스크린샷·AI 생성물이 추가되면 출처, 라이선스, 상업 이용, 개인정보를 사람에게 확인받습니다.
- 저작권자 법적 주체, 기여자 권리, 상표, 고객 계약과 규제 데이터는 법무/전문가 검토 필요 항목입니다.
