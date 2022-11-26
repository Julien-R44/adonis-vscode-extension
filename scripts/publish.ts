import 'dotenv/config'
import { dirname } from 'node:path'
import execa from 'execa'

const execaOptions = { cwd: dirname(__dirname), stdio: 'inherit' as const }

async function publish() {
  console.log('Publishing to Vscode ...')
  await execa('npm', ['run', 'vscode:publish'], execaOptions)

  console.log('Publishing to OVSX...')
  await execa('npx', ['ovsx', 'publish', '-p', process.env.OVSX_TOKEN!], execaOptions)

  console.log('Done!')
}

publish()
