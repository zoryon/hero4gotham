'use client'

import React, { useEffect, useId, useMemo, useState } from 'react'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { useSiteCopy } from '@/providers/SiteCopy'

type LexicalNode = NonNullable<DefaultTypedEditorState['root']['children']>[number]

type PrivacySection = {
  content: DefaultTypedEditorState
  id: string
  title: string
}

const getNodeText = (node: LexicalNode): string => {
  if (!('children' in node) || !Array.isArray(node.children)) return ''

  return node.children
    .map((child) => ('text' in child && typeof child.text === 'string' ? child.text : ''))
    .join('')
    .trim()
}

const isSectionHeading = (node: LexicalNode) =>
  node.type === 'heading' && 'tag' in node && (node.tag === 'h2' || node.tag === 'h3')

const makeSectionId = (title: string, index: number) =>
  `${title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^\d+\.\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}-${index}`

const cleanSectionTitle = (title: string) => title.replace(/^\d+\.\s*/, '').trim()

const toEditorState = (source: DefaultTypedEditorState, children: LexicalNode[]) => ({
  root: {
    ...source.root,
    children,
  },
})

const splitPrivacyContent = (
  content: DefaultTypedEditorState,
  defaultSection: string,
  sectionLabel: string,
): PrivacySection[] => {
  const sections: PrivacySection[] = []
  let currentTitle = defaultSection
  let currentChildren: LexicalNode[] = []

  const pushSection = () => {
    if (!currentChildren.length) return

    const index = sections.length
    sections.push({
      content: toEditorState(content, currentChildren),
      id: makeSectionId(currentTitle, index),
      title: cleanSectionTitle(currentTitle),
    })
  }

  content.root.children.forEach((node) => {
    if (isSectionHeading(node)) {
      pushSection()
      currentTitle = getNodeText(node) || `${sectionLabel} ${sections.length + 1}`
      currentChildren = [node]
      return
    }

    currentChildren.push(node)
  })

  pushSection()

  return sections
}

export const PrivacyPolicyContent: React.FC<{ content: DefaultTypedEditorState }> = ({
  content,
}) => {
  const copy = useSiteCopy()
  const sections = useMemo(
    () => splitPrivacyContent(content, copy.privacy.defaultSection, copy.privacy.sectionLabel),
    [content, copy.privacy.defaultSection, copy.privacy.sectionLabel],
  )
  const [activeSectionId, setActiveSectionId] = useState(() => sections[0]?.id || '')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuId = useId()
  const activeSection = sections.find((section) => section.id === activeSectionId) || sections[0]

  useEffect(() => {
    const applySectionFromHash = () => {
      const hash = window.location.hash.replace('#', '')

      if (!hash) return

      const targetSection =
        sections.find((section) => section.id === hash) ||
        (hash === 'cookie-policy'
          ? sections.find((section) => section.title.toLowerCase().includes('cookie'))
          : undefined)

      if (targetSection) {
        setActiveSectionId(targetSection.id)
      }
    }

    applySectionFromHash()
    window.addEventListener('hashchange', applySectionFromHash)

    return () => {
      window.removeEventListener('hashchange', applySectionFromHash)
    }
  }, [sections])

  if (!activeSection) return null

  return (
    <div className="privacy-policy-layout">
      <div className="privacy-policy-mobile-nav">
        <span className="privacy-policy-section-label">{copy.privacy.sectionLabel}</span>
        <button
          aria-controls={mobileMenuId}
          aria-expanded={isMobileMenuOpen}
          aria-haspopup="listbox"
          className="privacy-policy-section-select"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          {activeSection.title}
        </button>

        {isMobileMenuOpen ? (
          <div
            className="privacy-policy-section-menu"
            id={mobileMenuId}
            role="listbox"
            aria-label={copy.privacy.sectionsAriaLabel}
          >
            {sections.map((section) => (
              <button
                aria-selected={section.id === activeSection.id}
                className="privacy-policy-section-option"
                key={section.id}
                onClick={() => {
                  setActiveSectionId(section.id)
                  setIsMobileMenuOpen(false)
                }}
                role="option"
                type="button"
              >
                {section.title}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <aside className="privacy-policy-nav" aria-label={copy.privacy.tableOfContentsAriaLabel}>
        {sections.map((section) => (
          <button
            className={cn(
              'privacy-policy-nav-button',
              section.id === activeSection.id && 'privacy-policy-nav-button--active',
            )}
            key={section.id}
            onClick={() => setActiveSectionId(section.id)}
            type="button"
          >
            {section.title}
          </button>
        ))}
      </aside>

      <RichText
        className="privacy-policy-content"
        data={activeSection.content}
        enableGutter={false}
        id={
          activeSection.title.toLowerCase().includes('cookie') ? 'cookie-policy' : activeSection.id
        }
      />
    </div>
  )
}
