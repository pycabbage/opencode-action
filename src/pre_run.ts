import typia from "typia"
import { fetchWithRetry, spawnAsync } from "./utilities.js"
import { platform, addPath } from "@actions/core"
import { exec } from "@actions/exec"
import { readFile, stat, writeFile, mkdir, rename } from "fs/promises"
import { homedir } from "os"
import { join } from "path"

async function getTarget() {
  const target: string[] = [platform.platform, platform.arch]

  if (platform.isLinux) {
    const cpuinfo = await readFile("/proc/cpuinfo", "utf-8")
    if (cpuinfo.includes("avx2")) {
      target.push("baseline")
    }

    const alpineReleaseStat = await stat("/etc/alpine-release", { throwIfNoEntry: false })
    const code = await exec("which", ["ldd", "-s"], { ignoreReturnCode: true })
    const { stdout } = code === 0 ? await spawnAsync("ldd", ["--version"]) : { stdout: "" }
    if (alpineReleaseStat?.isFile() || stdout.includes("musl")) {
      target.push("musl")
    }
  }

  return target.join("-")
}

async function installOpencode() {
  const {
    version,
    metadata: { package: packageBase },
  } = typia.assert<{ version: string; metadata: { package: string } }>(
    await fetchWithRetry("https://opencode.ai/update/api/latest/cli/npm")
  )
  const packageId = `${packageBase}-${await getTarget()}`
  console.log(`Installing ${packageId} (${version})`)

  const {
    dist: { tarball: tarballUrl },
  } = typia.assert<{
    dist: {
      tarball: string
    }
  }>(await fetchWithRetry(`https://registry.npmjs.org/${packageId}/${version}`))
  const filename = tarballUrl.split("/").pop() ?? `cli-${await getTarget()}-${version}.tgz`
  const directory = `/tmp/opencode-${Date.now()}`
  console.log(tarballUrl)

  const response = await fetch(tarballUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch tarball: ${response.status} ${response.statusText}`)
  }
  const tarballBuffer = await response.arrayBuffer()
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, filename), Buffer.from(tarballBuffer))
  const extractResult = await spawnAsync("tar", [
    "axf",
    join(directory, filename),
    "package/bin/opencode",
  ])
  if (extractResult.code !== 0) {
    throw new Error(`Failed to extract tarball: ${extractResult.stderr}`)
  }

  await mkdir(join(homedir(), ".opencode"), { recursive: true })
  await rename(join(directory, "package/bin"), join(homedir(), ".opencode"))
  addPath(join(homedir(), ".opencode", "bin"))

  console.log(`Opencode installed at ${join(homedir(), ".opencode", "bin")}`)
}

void installOpencode()
