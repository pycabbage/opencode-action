import { exec } from "@actions/exec"
import { Readable } from "stream"
import { text } from "stream/consumers"

export async function fetchWithRetry(
  input: string | URL | Request,
  init?: RequestInit,
  attempt: number = 10
) {
  const response = await fetch(input, init)
  if ([429, 500, 503].includes(response.status)) {
    return await fetchWithRetry(input, init, attempt - 1)
  } else if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }
  return await response.json()
}

export async function spawnAsync(command: string, args: string[] = []) {
  const stdout = new Readable()
  const stderr = new Readable()

  const code = await exec(command, args, {
    listeners: {
      stdout(data) {
        stdout.push(data)
      },
      stderr(data) {
        stderr.push(data)
      },
    },
  })
  stdout.push(null)
  stderr.push(null)

  return {
    stdout: await text(stdout),
    stderr: await text(stderr),
    code,
  }
}
