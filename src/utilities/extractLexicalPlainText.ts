type LexicalNode = {
  children?: LexicalNode[]
  text?: string
}

export const extractLexicalPlainText = (value: unknown): string => {
  const chunks: string[] = []

  const visit = (node: unknown) => {
    if (!node || typeof node !== 'object') {
      return
    }

    const lexicalNode = node as LexicalNode

    if (typeof lexicalNode.text === 'string') {
      chunks.push(lexicalNode.text)
    }

    if (Array.isArray(lexicalNode.children)) {
      lexicalNode.children.forEach(visit)
    }
  }

  visit(value)

  return chunks.join(' ').replace(/\s+/g, ' ').trim()
}
