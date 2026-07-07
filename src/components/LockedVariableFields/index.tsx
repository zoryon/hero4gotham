'use client'

import type {
  SelectFieldClientComponent,
  TextareaFieldClientComponent,
  TextFieldClientComponent,
} from 'payload'

import { SelectField, TextareaField, TextField, useFormFields } from '@payloadcms/ui'

const useVariableFieldsUnlocked = () =>
  useFormFields(([fields]) => fields.unlockEditing?.value === true)

export const LockedVariableTextField: TextFieldClientComponent = (props) => {
  const isUnlocked = useVariableFieldsUnlocked()

  return <TextField {...props} readOnly={props.readOnly || !isUnlocked} />
}

export const LockedVariableTextareaField: TextareaFieldClientComponent = (props) => {
  const isUnlocked = useVariableFieldsUnlocked()

  return <TextareaField {...props} readOnly={props.readOnly || !isUnlocked} />
}

export const LockedVariableSelectField: SelectFieldClientComponent = (props) => {
  const isUnlocked = useVariableFieldsUnlocked()

  return <SelectField {...props} readOnly={props.readOnly || !isUnlocked} />
}
