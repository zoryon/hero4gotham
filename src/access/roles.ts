import type { Access, AccessArgs } from 'payload'

type Role = 'admin' | 'eventsManager'

type RoleUser = {
  role?: Role | null
}

const getRole = (user: unknown): Role => {
  if (user && typeof user === 'object' && 'role' in user) {
    const role = (user as RoleUser).role

    if (role === 'admin' || role === 'eventsManager') return role
  }

  return 'admin'
}

export const isAdmin = ({ req: { user } }: AccessArgs): boolean => getRole(user) === 'admin'

export const isAdminOrEventsManager = ({ req: { user } }: AccessArgs): boolean => {
  const role = getRole(user)

  return role === 'admin' || role === 'eventsManager'
}

export const adminOnly: Access = (args) => isAdmin(args)

export const adminOrEventsManager: Access = (args) => isAdminOrEventsManager(args)

export const publicOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return true

  return getRole(user) === 'admin'
}

export const canAccessAdmin = ({ req: { user } }: { req: { user?: unknown } }): boolean => {
  const role = getRole(user)

  return role === 'admin' || role === 'eventsManager'
}

export const hideFromNonAdmins = ({ user }: { user?: unknown }) => getRole(user) !== 'admin'
