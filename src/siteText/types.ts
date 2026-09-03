export type SiteTextControlType = 'text' | 'textarea'

export type SiteTextFieldOptions = {
  description?: string
  label?: string
  section: string
}

export type SiteTextControl = SiteTextFieldOptions & {
  control: SiteTextControlType
  id: string
  required: boolean
  value: string
}

export type SiteTextChange = Pick<SiteTextControl, 'id' | 'value'>

export type SiteTextDocument = {
  area: string
  controls: SiteTextControl[]
  previewPath: string
  sourceID: string
  title: string
  version: string
}

export type SiteTextDocumentSummary = Omit<SiteTextDocument, 'controls'>

export type SaveSiteTextDocumentInput = {
  changes: SiteTextChange[]
  sourceID: string
  version: string
}
