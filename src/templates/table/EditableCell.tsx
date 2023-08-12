import React, { useEffect, useRef, useState } from 'react'

interface EditableRowProps<R extends HTMLElement> {
  data?: string | number | undefined,
  hidden?: boolean,
  onEdit: (ref: React.MutableRefObject<R | null>, blur: () => void) => JSX.Element,
  children?: JSX.Element
}

function EditableCell<R extends HTMLElement = HTMLInputElement>(
  {
    data,
    hidden,
    onEdit,
    children,
  }: EditableRowProps<R>): JSX.Element | null {
  const [isEdit, setEdit] = useState(false)
  const ref = useRef<R | null>(null)

  useEffect(() => {
    if (isEdit && ref.current)
      ref.current.focus()
  }, [isEdit])

  function handler() {
    setEdit(false)
  }

  if (hidden) return null

  return (
    <td
      onDoubleClick={() => setEdit(true)}
    >
      {isEdit
        ? onEdit(ref, handler)
        : (children || data || 'undefined')}
    </td>
  )
}

export default EditableCell