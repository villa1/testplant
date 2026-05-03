import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'

export const buildInitialFormState = (fields: FormFieldBlock[]) => {
  return fields?.reduce((initialSchema, field) => {
    const blockType = field.blockType as string
    const name = 'name' in field ? field.name : undefined
    const defaultValue = 'defaultValue' in field ? field.defaultValue : undefined

    if (!name) {
      return initialSchema
    }

    if (blockType === 'checkbox') {
      return {
        ...initialSchema,
        [name]: defaultValue ?? false,
      }
    }

    if (
      blockType === 'country' ||
      blockType === 'email' ||
      blockType === 'number' ||
      blockType === 'select' ||
      blockType === 'state' ||
      blockType === 'text' ||
      blockType === 'textarea'
    ) {
      return {
        ...initialSchema,
        [name]: defaultValue ?? '',
      }
    }

    return initialSchema
  }, {})
}
