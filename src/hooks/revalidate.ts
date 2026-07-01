import { revalidatePath } from 'next/cache'

/**
 * Refresh the ISR cache for both locale trees so published/edited/removed
 * articles appear immediately. Called from Payload afterChange/afterDelete hooks.
 * Guarded because the same config is loaded by CLI scripts (seed/migrate) that
 * run outside a Next.js request scope, where revalidatePath throws.
 */
export const revalidateSite = () => {
  try {
    revalidatePath('/', 'layout')
    revalidatePath('/en', 'layout')
  } catch {
    // Not in a Next.js request scope (e.g. seed script) — safe to ignore.
  }
}
