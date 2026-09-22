#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = dirname(fileURLToPath(import.meta.url));
const pluginRoot = join(root, "plugins", "wikimate");
const errors = [];
const pass = [];

function ok(condition, message) {
  if (condition) pass.push(message);
  else errors.push(message);
}

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function json(rel) {
  try {
    return JSON.parse(read(rel));
  } catch (error) {
    errors.push(`${rel} JSON 파싱 실패: ${error.message}`);
    return {};
  }
}

const marketplace = json(".agents/plugins/marketplace.json");
const entry = marketplace.plugins?.find((item) => item.name === "wikimate");
ok(marketplace.name === "wikimate-codex", "Marketplace 이름");
ok(entry?.source?.source === "local" && entry?.source?.path === "./plugins/wikimate", "Marketplace source 경로");
ok(entry?.policy?.installation === "AVAILABLE", "Marketplace installation 정책");
ok(entry?.policy?.authentication === "ON_INSTALL", "Marketplace authentication 정책");
ok(entry?.category === "Productivity", "Marketplace category");

const pkg = json("plugins/wikimate/package.json");
const codex = json("plugins/wikimate/.codex-plugin/plugin.json");
const portable = json("plugins/wikimate/plugin.json");
const legacy = json("plugins/wikimate/.claude-plugin/plugin.json");
for (const [label, manifest] of [["Codex", codex], ["portable", portable], ["legacy", legacy]]) {
  ok(manifest.name === "wikimate", `${label} manifest 이름`);
  const exactVersion = manifest.version === pkg.version;
  const cachePrefix = `${pkg.version}+codex.`;
  const localCachebuster = label === "Codex" && manifest.version.startsWith(cachePrefix) && /^[0-9]{14}$/.test(manifest.version.slice(cachePrefix.length));
  ok(exactVersion || localCachebuster, `${label} manifest 릴리스 버전=${pkg.version}`);
}
ok(codex.skills === "./skills/", "Codex skills 경로");
ok(codex.mcpServers === "./.mcp.json", "Codex MCP 경로");
ok(!Object.hasOwn(codex, "hooks"), "Codex manifest unsupported hooks 필드 없음");
ok(portable.$schema === "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", "portable schema");
ok(portable.extensions?.["com.openai"]?.hooks === "./hooks/hooks.json", "portable OpenAI hook 경로");

const mcp = json("plugins/wikimate/.mcp.json");
const server = mcp.mcpServers?.wikimate;
ok(server?.command === "node", "MCP node command");
ok(Array.isArray(server?.args) && server.args.length === 1 && server.args[0] === "./mcp/server.mjs", "MCP 상대경로");
ok(server?.cwd === ".", "MCP 작업 경로를 플러그인 루트로 고정");
ok(existsSync(join(pluginRoot, server?.args?.[0] || "missing")), "MCP 진입점 존재");
ok(!read("plugins/wikimate/.mcp.json").includes("CLAUDE_PLUGIN_ROOT"), "MCP에 Claude 전용 변수 없음");

const hooks = json("plugins/wikimate/hooks/hooks.json");
const handlers = hooks.hooks?.SessionStart?.flatMap((group) => group.hooks || []) || [];
ok(handlers.length === 1, "SessionStart handler 1개");
ok(handlers[0]?.command?.includes("${PLUGIN_ROOT}/hooks/session-start.mjs"), "Codex PLUGIN_ROOT 사용");
ok(!handlers[0]?.command?.includes("CLAUDE_PLUGIN_ROOT"), "hook에 Claude 전용 변수 없음");
ok(handlers[0]?.additionalContextLimit === 0, "hook 내장 절단 비활성화와 프로젝트 상한 사용");

for (const input of ["{}", "x".repeat(5 * 1024 * 1024)]) {
  const run = spawnSync(process.execPath, [join(pluginRoot, "hooks", "session-start.mjs")], {
    cwd: pluginRoot,
    input,
    encoding: "utf8",
    timeout: 15000,
    maxBuffer: 8 * 1024 * 1024,
  });
  ok(run.status === 0, `SessionStart hook 종료코드 0 (${input.length} bytes stdin)`);
  try {
    const output = JSON.parse(run.stdout);
    const context = output.hookSpecificOutput?.additionalContext;
    ok(output.continue === true, "SessionStart continue=true");
    ok(output.hookSpecificOutput?.hookEventName === "SessionStart", "SessionStart 이벤트 이름");
    ok(typeof context === "string" && context.includes("Wikimate Codex runtime rules"), "SessionStart 안전 컨텍스트 주입");
    ok(context.length <= 12000, "SessionStart 프로젝트 출력 상한");
  } catch (error) {
    errors.push(`SessionStart JSON 출력 실패 (${input.length} bytes stdin): ${error.message}`);
  }
}

const skillRoot = join(pluginRoot, "skills");
const skillDirs = readdirSync(skillRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
ok(skillDirs.length === 8, "Codex 스킬 8개");
ok(skillDirs.includes("wikimate"), "Codex /skills용 최상위 wikimate 스킬");
for (const dir of skillDirs) {
  const rel = `plugins/wikimate/skills/${dir}/SKILL.md`;
  ok(existsSync(join(root, rel)), `${dir}/SKILL.md 존재`);
  const text = read(rel);
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  ok(Boolean(frontmatter), `${dir} frontmatter`);
  ok(new RegExp(`^name:\\s*${dir.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m").test(frontmatter?.[1] || ""), `${dir} 이름과 폴더 일치`);
  ok(/^description:\s*\S.+$/m.test(frontmatter?.[1] || ""), `${dir} description`);
}

const commandRoot = join(pluginRoot, "commands");
const expectedCommands = ["wikimate", "wikimate-classify", "wikimate-link", "wikimate-lint", "wikimate-summarize"];
const commandFiles = readdirSync(commandRoot, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !entry.name.startsWith("_"))
  .map((entry) => entry.name.replace(/\.md$/, ""))
  .sort();
ok(JSON.stringify(commandFiles) === JSON.stringify(expectedCommands), "원본 명령 호환 템플릿 5개");
for (const command of commandFiles) {
  const rel = `plugins/wikimate/commands/${command}.md`;
  const text = read(rel);
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  ok(Boolean(frontmatter), `${command} 호환 템플릿 frontmatter`);
  ok(/^description:\s*\S.+$/m.test(frontmatter?.[1] || ""), `${command} 호환 템플릿 description`);
  ok(text.includes("$ARGUMENTS"), `${command} 호환 템플릿 인자 자리표시자`);
}

const activeTexts = ["AGENTS.md", "README.md", "README.en.md", "DEVELOPMENT.md", "docs/CODEX_SETUP.md"]
  .map((rel) => [rel, read(rel)]);
for (const dir of skillDirs) activeTexts.push([`skills/${dir}`, read(`plugins/wikimate/skills/${dir}/SKILL.md`)]);
for (const command of commandFiles) activeTexts.push([`commands/${command}`, read(`plugins/wikimate/commands/${command}.md`)]);
for (const rel of ["README.md", "README.en.md", "docs/CODEX_SETUP.md"]) {
  ok(!/\/wikimate:/u.test(read(rel)), `${rel}에 미지원 플러그인 슬래시 명령 안내 없음`);
}
for (const [rel, text] of activeTexts) {
  ok(!/CLAUDE_PLUGIN_ROOT|AskUserQuestion|insane-search|WebFetch|\/plugin install|Codex에는 (?:마켓플레이스|플러그인).*없/iu.test(text), `${rel}에 현재 Codex 비호환 표현 없음`);
}

const required = [
  "README.md",
  "README.en.md",
  "LICENSE",
  "NOTICE",
  "THIRD_PARTY_NOTICES.md",
  "docs/LEGAL_AND_COMMERCIAL_USE.md",
  "docs/original/README.md",
  "plugins/wikimate/LICENSE",
  "plugins/wikimate/NOTICE",
  "docs/CODEX_SETUP.md",
  "plugins/wikimate/mcp/server.mjs",
  "plugins/wikimate/hooks/codex-context.md",
  "plugins/wikimate/templates/note.md",
];
for (const rel of required) ok(existsSync(resolve(root, rel)), `필수 파일 존재: ${rel}`);

const rootLicense = read("LICENSE");
const pluginLicense = read("plugins/wikimate/LICENSE");
const rootNotice = read("NOTICE");
const pluginNotice = read("plugins/wikimate/NOTICE");
ok(rootLicense === pluginLicense, "루트·플러그인 LICENSE 동일");
ok(rootLicense.includes("Apache License") && rootLicense.includes("Version 2.0, January 2004"), "Apache License 2.0 공식 명칭·버전");
ok(rootLicense.includes("Copyright 2026 SoDam AI Studio"), "LICENSE 저작권자·연도");
ok(rootLicense.includes("Copyright [yyyy] [name of copyright owner]"), "Apache LICENSE Appendix 자리표시자 보존");
ok(rootNotice === pluginNotice, "루트·플러그인 NOTICE 동일");
ok(rootNotice.includes("Copyright 2026 SoDam AI Studio"), "NOTICE 저작권자·연도");
ok(pkg.license === "Apache-2.0" && codex.license === "Apache-2.0" && portable.license === "Apache-2.0", "manifest 라이선스 일치");
ok(read("README.md").includes("docs/LEGAL_AND_COMMERCIAL_USE.md") && read("README.en.md").includes("docs/LEGAL_AND_COMMERCIAL_USE.md"), "한·영 README 법률 가이드 연결");

for (const message of pass) console.log(`PASS ${message}`);
if (errors.length) {
  for (const message of errors) console.error(`FAIL ${message}`);
  console.error(`\nCodex 포팅 검증 실패: ${errors.length}건`);
  process.exit(1);
}
console.log(`\nCodex 포팅 검증 통과: ${pass.length}개`);
