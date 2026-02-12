import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import type { Repository, UseStudioHost } from 'nuxt-studio/app'
import { defineStudioActivationPlugin } from '../utils/activation'
import { customProvider } from '#build/studio-custom-provider'

export default defineNuxtPlugin(() => {
  // Don't await this to avoid blocking the main thread
  defineStudioActivationPlugin(async (user) => {
    const config = useRuntimeConfig()
    const repository = customProvider
      ? { ...config.public.studio.repository, customProvider }
      : config.public.studio.repository
    // Initialize host
    const host = await import(config.public.studio.dev ? '../host.dev' : '../host').then(m => m.useStudioHost);
    (window as unknown as { useStudioHost: UseStudioHost }).useStudioHost = () => host(user, repository as unknown as Repository)

    await import('nuxt-studio/app')
    document.body.appendChild(document.createElement('nuxt-studio'))
  })
})
