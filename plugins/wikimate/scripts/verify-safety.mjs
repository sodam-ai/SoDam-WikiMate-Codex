import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, symlink, writeFile, readFile, utimes, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { safeInside, writeFileAtomic, withVaultWriteLock } from "../mcp/lib/shared.mjs";

let pass = 0;
function ok(name) { pass += 1; console.log("PASS " + name); }
const base = await mkdtemp(join(tmpdir(), "wikimate-safety-"));
try {
  const vault = join(base, "vault");
  const outside = join(base, "outside");
  await mkdir(join(vault, "30_Notes"), { recursive: true });
  await mkdir(outside, { recursive: true });
  assert.equal(safeInside(vault, "30_Notes/new.md"), join(vault, "30_Notes", "new.md"));
  ok("missing leaf inside vault accepted");

  const portal = join(vault, "30_Notes", "portal");
  await symlink(outside, portal, process.platform === "win32" ? "junction" : "dir");
  assert.equal(safeInside(vault, "30_Notes/portal/secret.md"), null);
  ok("junction or symlink escape rejected");

  const unsafeVault = join(base, "unsafe-state-vault");
  await mkdir(unsafeVault, { recursive: true });
  await symlink(outside, join(unsafeVault, ".wikimate"), process.platform === "win32" ? "junction" : "dir");
  await assert.rejects(
    () => withVaultWriteLock(unsafeVault, async () => {}),
    (error) => error?.code === "UNSAFE_STATE_PATH" && !String(error.message).includes(base),
  );
  ok("internal state junction escape rejected");

  let atomicError;
  try { await writeFileAtomic(join(vault, "missing-parent", "secret-name.md"), "x"); } catch (error) { atomicError = error; }
  assert.equal(atomicError?.code, "ATOMIC_WRITE_FAILED");
  assert.equal(String(atomicError?.message).includes(base), false);
  ok("atomic write failure hides absolute path");

  await withVaultWriteLock(vault, async () => {
    await assert.rejects(
      () => withVaultWriteLock(vault, async () => {}, { timeoutMs: 30, pollMs: 10 }),
      (error) => error?.code === "VAULT_BUSY" && !String(error.message).includes(vault),
    );
  });
  ok("concurrent writer rejected safely");

  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const sharedUrl = pathToFileURL(join(scriptDir, "..", "mcp", "lib", "shared.mjs")).href;
  const childCode = `import { withVaultWriteLock } from ${JSON.stringify(sharedUrl)}; await withVaultWriteLock(${JSON.stringify(vault)}, async () => { console.log("LOCKED"); await new Promise((done) => setTimeout(done, 500)); });`;
  const child = spawn(process.execPath, ["--input-type=module", "-e", childCode], { stdio: ["ignore", "pipe", "pipe"] });
  await new Promise((resolve, reject) => {
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.stdout.on("data", (chunk) => { if (String(chunk).includes("LOCKED")) resolve(); });
    child.once("exit", (code) => reject(new Error("child lock exited early: " + code + " " + stderr)));
  });
  await assert.rejects(
    () => withVaultWriteLock(vault, async () => {}, { timeoutMs: 50, pollMs: 10 }),
    (error) => error?.code === "VAULT_BUSY",
  );
  await new Promise((resolve, reject) => child.once("exit", (code) => code === 0 ? resolve() : reject(new Error("child lock failed: " + code))));
  ok("separate process writer rejected safely");

  const lockPath = join(vault, ".wikimate", "write.lock");
  await writeFile(lockPath, JSON.stringify({ token: "dead", pid: 2147483647, createdAt: "2000-01-01T00:00:00.000Z" }), "utf8");
  const recovered = await withVaultWriteLock(vault, async () => "recovered", { timeoutMs: 200, pollMs: 10, staleMs: 0 });
  assert.equal(recovered, "recovered");
  await assert.rejects(() => readFile(lockPath, "utf8"), (error) => error?.code === "ENOENT");
  ok("dead stale lock recovered and released");

  await writeFile(lockPath, "", "utf8");
  const old = new Date("2000-01-01T00:00:00.000Z");
  await utimes(lockPath, old, old);
  const malformedRecovered = await withVaultWriteLock(vault, async () => "recovered-empty", { timeoutMs: 200, pollMs: 10, staleMs: 0 });
  assert.equal(malformedRecovered, "recovered-empty");
  const stateFiles = await readdir(join(vault, ".wikimate"));
  assert.deepEqual(stateFiles.filter((name) => name.startsWith("write.lock")), []);
  ok("empty crash lock recovered without quarantine debris");

  console.log("SUMMARY: " + pass + " PASS, 0 FAIL");
} finally {
  await rm(base, { recursive: true, force: true });
}
