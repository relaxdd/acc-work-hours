import React, { FC } from 'react'
import { ITableOptionsEntity } from '@/types'
import { RepeaterDispatch } from '@/templates/repeater/BaseRepeater'

interface EntityRepeaterProps {
  state: [ITableOptionsEntity, RepeaterDispatch<ITableOptionsEntity>],
  i: number
}

const EntityRepeater: FC<EntityRepeaterProps> = ({ state: [item, change], i }) => {
  return (
    <>
      <input
        type="text"
        className="form-control"
        value={item.key}
        onChange={({ target }) => change('key', target.value, i)}
        placeholder="Ключ"
      />

      <input
        type="text"
        className="form-control"
        value={item.text}
        onChange={({ target }) => change('text', target.value, i)}
        placeholder="Текст"
      />

      <input
        type="number"
        className="form-control"
        value={item.rate}
        step={10}
        onChange={({ target }) => change('rate', target.value, i)}
        placeholder="Ставка"
      />

      <input type="hidden" value={item.id} readOnly />
    </>
  )
}

export default EntityRepeater