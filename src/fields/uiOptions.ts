export const spacingOptions = [
  {
    label: 'Default',
    value: 'default',
  },
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'XS',
    value: 'xs',
  },
  {
    label: 'SM',
    value: 'sm',
  },
  {
    label: 'MD',
    value: 'md',
  },
  {
    label: 'LG',
    value: 'lg',
  },
  {
    label: 'XL',
    value: 'xl',
  },
] as const

export const paddingOptions = spacingOptions.filter((option) => option.value !== 'default')

export const colorOptions = [
  {
    label: 'Default',
    value: 'default',
  },
  {
    label: 'Text primary',
    value: 'primary',
  },
  {
    label: 'Text secondary',
    value: 'secondary',
  },
  {
    label: 'Text muted',
    value: 'muted',
  },
  {
    label: 'Text accent',
    value: 'accent',
  },
  {
    label: 'White',
    value: 'white',
  },
  {
    label: 'Black',
    value: 'black',
  },
] as const

export const justifyOptions = [
  {
    label: 'Start',
    value: 'start',
  },
  {
    label: 'Center',
    value: 'center',
  },
  {
    label: 'End',
    value: 'end',
  },
  {
    label: 'Space between',
    value: 'between',
  },
  {
    label: 'Space around',
    value: 'around',
  },
  {
    label: 'Space evenly',
    value: 'evenly',
  },
] as const

export const alignOptions = [
  {
    label: 'Start',
    value: 'start',
  },
  {
    label: 'Center',
    value: 'center',
  },
  {
    label: 'End',
    value: 'end',
  },
  {
    label: 'Stretch',
    value: 'stretch',
  },
  {
    label: 'Baseline',
    value: 'baseline',
  },
] as const

export const minHeightOptions = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Small',
    value: 'small',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'Large',
    value: 'large',
  },
  {
    label: 'Viewport',
    value: 'screen',
  },
] as const

export const flexDirectionOptions = [
  {
    label: 'Row',
    value: 'row',
  },
  {
    label: 'Column',
    value: 'column',
  },
  {
    label: 'Row on desktop, column on mobile',
    value: 'responsiveRow',
  },
] as const

export const flexWrapOptions = [
  {
    label: 'Wrap',
    value: 'wrap',
  },
  {
    label: 'No wrap',
    value: 'nowrap',
  },
] as const

export const textTransformOptions = [
  {
    label: 'Normal',
    value: 'normal',
  },
  {
    label: 'Uppercase',
    value: 'uppercase',
  },
] as const

export const textAlignOptions = [
  {
    label: 'Center',
    value: 'center',
  },
  {
    label: 'Left',
    value: 'left',
  },
] as const
