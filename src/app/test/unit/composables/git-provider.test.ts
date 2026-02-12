import { describe, expect, test, vi } from 'vitest'
import { effectScope } from 'vue'
import { useGitProvider } from '../../../src/composables/useGitProvider'
import type { GitOptions, GitProviderAPI } from '../../../src/types'

describe('useGitProvider', () => {
  test('uses custom provider when configured', () => {
    const customProvider: GitProviderAPI = {
      fetchFile: vi.fn().mockResolvedValue(null),
      commitFiles: vi.fn().mockResolvedValue(null),
      getRepositoryUrl: vi.fn().mockReturnValue('https://example.com/repo'),
      getBranchUrl: vi.fn().mockReturnValue('https://example.com/repo/tree/main'),
      getCommitUrl: vi.fn().mockReturnValue('https://example.com/repo/commit/sha'),
      getFileUrl: vi.fn().mockReturnValue('https://example.com/repo/file'),
      getRepositoryInfo: vi.fn().mockReturnValue({
        owner: 'example',
        repo: 'repo',
        branch: 'main',
        provider: 'custom',
      }),
    }

    const options: GitOptions = {
      provider: 'custom',
      owner: 'example',
      repo: 'repo',
      branch: 'main',
      rootDir: '',
      token: '',
      authorName: 'Author',
      authorEmail: 'author@example.com',
      customProvider,
    }

    const scope = effectScope()
    const gitProvider = scope.run(() => useGitProvider(options))

    expect(gitProvider?.api).toBe(customProvider)
    expect(gitProvider?.name).toBe('Custom')
    expect(gitProvider?.icon).toBe('i-simple-icons:git')

    scope.stop()
  })
})
