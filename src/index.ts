import { getInput, getMultilineInput } from "@actions/core"

const input = {
  model: getInput("model", { required: true }),
  variant: getInput("variant"),
  agent: getInput("agent"),
  prompt: getMultilineInput("prompt"),
  use_github_token: getInput("use_github_token"),
  mentions: getInput("mentions"),
}

console.log(input)
