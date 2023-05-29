import React, { FC, useEffect, useRef, useState } from 'react'
import { ITableOptions, ListOfUsingKeys } from '@/types'
import scss from '@/temps/setting/SettingModal.module.scss'

const labels: Record<ListOfUsingKeys, string> = {
  delete: 'Удалить строку',
  up: 'Поднять строку выше',
  down: 'Отпустить строку нижу',
}

interface BindingKeyProps {
  id: ListOfUsingKeys,
  modified: ITableOptions,
  setModified: React.Dispatch<React.SetStateAction<ITableOptions>>,
}

const BindingKey: FC<BindingKeyProps> = ({ id, modified, setModified }) => {
  const [edit, setEdit] = useState(false)
  const ref = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!edit) return
    ref.current?.focus()
  }, [edit])

  return (
    <div key={id}>
      <span>{labels[id]}: </span>

      {edit
        ? (
          <input
            type="text"
            placeholder="Нажмите на клавишу"
            readOnly
            value={modified.usingKeys[id]}
            ref={ref}
            onBlur={() => setEdit(false)}
            onKeyUp={(e) => {
              setModified((prev) => ({
                ...prev, usingKeys: { ...prev.usingKeys, [id]: e.code },
              }))
            }}
          />
        )
        : (
          <i
            className={scss.bindingKey}
            onDoubleClick={() => setEdit(true)}
          >
            {modified.usingKeys[id]}
          </i>
        )}
    </div>
  )
}

export default BindingKey