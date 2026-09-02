'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { useSiteCopy } from '@/providers/SiteCopy'

export const Error = ({ name }: { name: string }) => {
  const copy = useSiteCopy()
  const {
    formState: { errors },
  } = useFormContext()
  return (
    <div className="mt-2 text-red-500 text-sm">
      {(errors[name]?.message as string) || copy.forms.requiredError}
    </div>
  )
}
