import { expect, test, describe } from "bun:test";
import { appInfoSchema, dynamicComposeSchemaYaml } from '@runtipi/common/schemas'
import fs from 'node:fs'
import path from 'node:path'
import { type } from "arktype";
import { parse as parseYaml } from 'yaml';

const getApps = async () => {
  const appsDir = await fs.promises.readdir(path.join(process.cwd(), 'apps'))

  const appDirs = appsDir.filter((app) => {
    const stat = fs.statSync(path.join(process.cwd(), 'apps', app))
    return stat.isDirectory()
  })

  return appDirs
};

const getFile = async (app: string, file: string) => {
  const filePath = path.join(process.cwd(), 'apps', app, file)
  try {
    const file = await fs.promises.readFile(filePath, 'utf-8')
    return file
  } catch (err) {
    return null
  }
}

describe("each app should have the required files", async () => {
  const apps = await getApps()

  for (const app of apps) {
    const files = ['config.json', 'docker-compose.yml', 'metadata/logo.jpg', 'metadata/description.md']

    for (const file of files) {
      test(`app ${app} should have ${file}`, async () => {
        const fileContent = await getFile(app, file)
        expect(fileContent).not.toBeNull()
      })
    }
  }
})

describe("each app should have a valid config.json", async () => {
  const apps = await getApps()

  for (const app of apps) {
    test(`app ${app} should have a valid config.json`, async () => {
      const fileContent = await getFile(app, 'config.json')
      const parsed = appInfoSchema.omit('urn')(JSON.parse(fileContent || '{}'))

      if (parsed instanceof type.errors) {
        console.error(`Error parsing config.json for app ${app}:`, parsed.summary);
      }

      expect(parsed instanceof type.errors).toBe(false)
    })
  }
})

describe("each app should have a valid docker-compose.yml", async () => {
  const apps = await getApps()

  for (const app of apps) {
    test(`app ${app} should have a valid docker-compose.yml`, async () => {
      const fileContent = await getFile(app, 'docker-compose.yml')
      const doc = parseYaml(fileContent || '') as Record<string, unknown>

      // The top-level `x-runtipi.schema_version` marker in Runtipi's schema_version 2
      // format is a runtime hint and is not covered by @runtipi/common's bundled
      // YAML schema (which only validates the `overrides` shape if x-runtipi is present).
      // Strip it here so validation focuses on the services structure.
      const { 'x-runtipi': _topLevelXRuntipi, ...rest } = doc ?? {}
      const parsed = dynamicComposeSchemaYaml(rest)

      if (parsed instanceof type.errors) {
        console.error(`Error parsing docker-compose.yml for app ${app}:`, parsed.summary);
      }

      expect(parsed instanceof type.errors).toBe(false)
    })
  }
});
