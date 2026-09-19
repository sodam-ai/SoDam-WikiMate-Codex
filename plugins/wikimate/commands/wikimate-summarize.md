---
description: 노트에 한 줄 요약 붙이기 또는 핵심만 뽑아 원자노트 만들기(원본 본문은 절대 축약 안 함)
---

노트를 요약하거나 원자노트로 정리한다. "Wikimate Summarize" 스킬의 워크플로우를 따른다:

1. 볼트 확정. `wikimate_summarize`를 `action:"suggest"`로 호출해 원문(`body`)과 현재 요약(`current_summary`)을 본다.
2. 원문을 근거로 200자 이내 한 줄 `summary`를 직접 작성한다(추측 금지). 필요하면 `atomic_note`(제목+본문)도 함께 준비한다.
3. 계획을 보고한다. Codex의 선택 UI를 사용할 수 있으면 사용하고, 그렇지 않으면 [적용/건너뛰기/수정] 중 하나를 명확히 질문해 답을 받은 뒤 진행한다.
4. 승인된 것만 `wikimate_summarize`를 `action:"apply", dry_run:false`로 호출한다. 대상 노트의 본문(body)은 이 도구가 절대 수정하지 않는다.
5. `wikimate-reviewer` 스킬의 읽기 전용 검수 절차로 원문 왜곡 여부를 재검증한다(요약은 LLM 판단이 개입하는 유일한 쓰기라 환각 위험이 더 높음).
6. 결과(반영된 summary/원자노트 경로·백업)를 재확인 후 보고한다.

인자가 있으면 그 노트를 대상으로 시작한다: $ARGUMENTS
