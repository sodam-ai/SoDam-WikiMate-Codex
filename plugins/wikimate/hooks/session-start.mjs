#!/usr/bin/env node
// Codex SessionStart hook: inject compact safety rules and read-only Obsidian detection.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { hasNotesmdCli, listVaults } from "../mcp/lib/collect.mjs";

const here = dirname(fileURLToPath(import.meta.url));

async function buildOutput() {
  let rules = "";
  try {
    rules = await readFile(join(here, "codex-context.md"), "utf8");
  } catch {
    rules = "[Wikimate] 안전 규칙 파일을 읽지 못했습니다. 플러그인 설치 상태를 확인하세요.";
  }

  const lines = [rules.trim(), "", "[Wikimate] 읽기 전용 환경 감지:"];
  try {
    const cli = await hasNotesmdCli().catch(() => false);
    const detected = listVaults();
    lines.push(`- notesmd-cli: ${cli ? "감지됨" : "미감지; vault_path 파일시스템 경로 사용 가능"}`);
    if (detected.ok) {
      const names = (detected.vaults || [])
        .map((vault) => `${vault.name}${vault.open ? "(열림)" : ""}`)
        .join(", ");
      lines.push(`- 등록된 볼트: ${names || "없음"}`);
      if (detected.open_vault) lines.push(`- 열린 볼트 후보: ${detected.open_vault} (쓰기 전 사용자 확인 필요)`);
    } else {
      lines.push(`- 볼트 감지: ${detected.reason}`);
    }
  } catch {
    lines.push("- 환경 감지를 완료하지 못했습니다. 세션은 계속 진행합니다.");
  }

  return JSON.stringify({
    continue: true,
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: lines.join("\n").slice(0, 12000)
    }
  });
}

const output = await buildOutput();
if (process.stdin.isTTY) {
  process.stdout.write(output);
} else {
  process.stdin.resume();
  process.stdin.on("end", () => process.stdout.write(output));
}
