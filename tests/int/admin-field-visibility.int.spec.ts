// @vitest-environment node

import { Footer } from '@/Footer/config'
import { Header } from '@/Header/config'
import { PrivacyPolicy } from '@/PrivacyPolicy/config'
import { Users } from '@/collections/Users'
import type { Field } from 'payload'
import { describe, expect, it } from 'vitest'

type TestRole = 'admin' | 'eventsManager'

const conditionContext = (role: TestRole) =>
  ({
    blockData: {},
    operation: 'update',
    path: [],
    user: { id: `${role}-id`, role },
  }) as never

const getTabs = (fields: Field[]) => {
  const tabsField = fields.find((field) => field.type === 'tabs')

  if (!tabsField || tabsField.type !== 'tabs') throw new Error('Expected tabs field')

  return tabsField.tabs
}

const getTab = (fields: Field[], label: string) => {
  const tab = getTabs(fields).find((candidate) => candidate.label === label)

  if (!tab) throw new Error(`Expected ${label} tab`)

  return tab
}

const isVisible = (item: { admin?: { condition?: unknown } }, role: TestRole) => {
  const condition = item.admin?.condition

  if (!condition) return true
  if (typeof condition !== 'function') throw new Error('Expected admin condition function')

  return condition({}, {}, conditionContext(role))
}

const findNamedField = (fields: Field[], name: string): Field | undefined => {
  for (const field of fields) {
    if ('name' in field && field.name === name) return field

    if ('fields' in field) {
      const nested = findNamedField(field.fields, name)
      if (nested) return nested
    }

    if (field.type === 'tabs') {
      for (const tab of field.tabs) {
        const nested = findNamedField(tab.fields, name)
        if (nested) return nested
      }
    }
  }

  return undefined
}

const getNamedField = (fields: Field[], name: string): Field => {
  const field = findNamedField(fields, name)

  if (field) return field
  throw new Error(`Expected ${name} field`)
}

const canUpdate = async (field: Field, role: TestRole) => {
  if (!('access' in field) || !field.access?.update) return true

  return await field.access.update({ req: { user: { id: `${role}-id`, role } } } as never)
}

describe('events manager admin field visibility', () => {
  it.each(['Background', 'SEO'])(
    'hides the Privacy Policy %s tab from events managers',
    (label) => {
      const tab = getTab(PrivacyPolicy.fields, label)

      expect(isVisible(tab, 'eventsManager')).toBe(false)
      expect(isVisible(tab, 'admin')).toBe(true)
    },
  )

  it.each([
    'backgroundImage',
    'bgTab',
    'bgMob',
    'imageQuality',
    'imagePositionMobile',
    'imagePositionTablet',
    'imagePositionDesktop',
    'overlay',
    'width',
    'padding',
    'metaTitle',
    'metaDescription',
  ])('prevents events managers from updating Privacy Policy field %s', async (name) => {
    const field = getNamedField(PrivacyPolicy.fields, name)

    expect(await canUpdate(field, 'eventsManager')).toBe(false)
    expect(await canUpdate(field, 'admin')).toBe(true)
  })

  it.each(['Brand', 'Navigation', 'Style', 'Typography'])(
    'hides the Header %s tab from events managers',
    (label) => {
      const tab = getTab(Header.fields, label)

      expect(isVisible(tab, 'eventsManager')).toBe(false)
      expect(isVisible(tab, 'admin')).toBe(true)
    },
  )

  it('keeps the editable Header Social tab visible to events managers', () => {
    expect(isVisible(getTab(Header.fields, 'Social'), 'eventsManager')).toBe(true)
  })

  it('hides only the non-editable parts of the Footer', () => {
    const contentTab = getTab(Footer.fields, 'Content')
    const linksTab = getTab(Footer.fields, 'Links')
    const legalLinks = getNamedField(linksTab.fields, 'legalLinks')
    const navItems = getNamedField(linksTab.fields, 'navItems')

    expect(isVisible(contentTab, 'eventsManager')).toBe(false)
    expect(isVisible(contentTab, 'admin')).toBe(true)
    expect(isVisible(linksTab, 'eventsManager')).toBe(true)
    expect(isVisible(legalLinks, 'eventsManager')).toBe(false)
    expect(isVisible(legalLinks, 'admin')).toBe(true)
    expect(isVisible(navItems, 'eventsManager')).toBe(true)
  })

  it('hides the non-editable role field from an events manager account view', async () => {
    const roleField = getNamedField(Users.fields, 'role')

    expect(isVisible(roleField, 'eventsManager')).toBe(false)
    expect(isVisible(roleField, 'admin')).toBe(true)
    expect(await canUpdate(roleField, 'eventsManager')).toBe(false)
    expect(await canUpdate(roleField, 'admin')).toBe(true)
  })
})
