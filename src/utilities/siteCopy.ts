import { mergeSiteCopy, type SiteCopyData } from '@/SiteCopy/defaults'
import { getCachedGlobal } from './getGlobals'

export const getSiteCopy = async (): Promise<SiteCopyData> => {
  const stored = await getCachedGlobal('siteCopy', 0)().catch(() => ({}))
  return mergeSiteCopy(stored)
}
