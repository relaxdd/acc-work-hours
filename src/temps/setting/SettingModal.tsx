import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Actions, useTableContext } from '@/context/TableContext'
import BaseRepeater from '@/temps/repeater/BaseRepeater'
import TableService from '@/service/TableService'
import { getTypedKeys } from '@/utils'
import { ITableOptions, ListOfHiddenCol } from '@/types'
import CompareData from '@/utils/class/CompareData'
import useDidUpdateEffect from '@/hooks/useDidUpdateEffect'
import scss from './SettingModal.module.scss'
import BindingKey from '@/temps/setting/BindingKey'
import EntityRepeater from '@/temps/setting/EntityRepeater'
import { appVersion } from '@/defines'
import SettingFields from '@/temps/setting/SettingFields'
import HiddenCols from '@/temps/setting/HiddenCols'

export const labelsCols: Record<ListOfHiddenCol, string> = {
  number: 'Нумерация',
  entity: 'Сущность',
  description: 'Описание',
}

const SettingModal = () => {
  const [{ visibility, options, activeTable }, dispatch, payload] = useTableContext()
  const [modified, setModified] = useState(options)

  useDidUpdateEffect(() => {
    setModified(options)
  }, [options])

  /* ============ Methods ============ */

  function handleClose() {
    dispatch({
      type: Actions.Visible,
      payload: { key: 'setting', value: false },
    })
  }

  function saveModifiedOptions() {
    if (!validateOptions()) return

    dispatch({
      type: Actions.Rewrite,
      payload: payload('options', modified),
    })

    TableService.updateActiveOptions(activeTable!, modified)
    handleClose()
  }

  function validateOptions(): boolean {
    const names: Record<keyof ITableOptions, string> = {
      typeOfAdding: 'Вариант добавления',
      hiddenCols: 'Скрытые столбцы',
      dtRoundStep: 'Шаг округления',
      listOfTech: 'Сущности',
      usingKeys: 'Используемые клавиши',
    }

    const validate: Record<keyof ITableOptions, boolean[]> = {
      typeOfAdding: [],
      hiddenCols: [],
      usingKeys: [],
      dtRoundStep: [
        typeof modified.dtRoundStep === 'number',
        modified.dtRoundStep <= 15,
      ],
      listOfTech: [
        modified.listOfTech.every((it) => {
          return (typeof it.key === 'string' && it.key !== '')
            && (typeof it.text === 'string' && it.text !== '')
            && (typeof it.rate === 'number' && it.rate > 0)
        }),
      ],
    }

    /* ============================================== */

    const msg = (key: keyof ITableOptions) => {
      alert(`Ошибка в настройках, исправьте поле "${names[key]}"`)
    }

    return getTypedKeys(validate).every((key) => {
      let pos = null

      const isValid = validate[key].every((it, i) => {
        return it ? true : (() => {
          pos = i
          return false
        })()
      })

      if (!isValid) {
        msg(key)

        const m = `ключ: ${key}, индекс условия: ${pos}`
        console.warn(`Ошибка валидации настроек, ${m}`)

        return false
      }

      return true
    })
  }

  function onToggleHiddenCol(key: ListOfHiddenCol, value: boolean) {
    setModified(prev => {
      return {
        ...prev, hiddenCols: {
          ...prev.hiddenCols, [key]: value,
        },
      }
    })
  }

  return (
    <Modal
      show={visibility.setting}
      onHide={handleClose}
      centered
      scrollable
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Настройки</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <SettingFields/>

        <hr/>

        <div className="mb-3">
          <label htmlFor="typeOfAdding">Вариант добавления строки</label>

          <select
            id="typeOfAdding"
            className="form-select mt-2"
            value={modified.typeOfAdding}
            onChange={({ target }) => {
              setModified(prev => ({
                ...prev,
                typeOfAdding: target.value as 'fast' | 'full',
              }))
            }}
          >
            <option value="fast">Быстрый</option>
            <option value="full">Подробно</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="dtRoundStep">Шаг округления даты</label>

          <select
            id="dtRoundStep"
            className="form-select mt-2"
            value={modified.dtRoundStep}
            onChange={({ target }) => {
              setModified(prev => ({ ...prev, dtRoundStep: +target.value }))
            }}
          >
            <option value="0">Не округлять</option>
            <option value="5">5 Минут</option>
            <option value="10">10 Минут</option>
            <option value="15">15 Минут</option>
          </select>
        </div>

        <BaseRepeater
          id={activeTable!}
          title="Сущности таблицы"
          data={modified.listOfTech}
          baseKeys={['key', 'text', 'rate']}
          baseTypes={{ text: 'string', key: 'string', rate: 'number' }}
          onChange={(list) => {
            setModified(prev => ({ ...prev, listOfTech: list }))
          }}
          onRender={(state, i) => (
            <EntityRepeater state={state} i={i}/>
          )}
        />

        <hr/>

        <div>
          <p style={{ marginBottom: '8px' }}>Скрытые столбцы</p>

          <div>
            {getTypedKeys(labelsCols).map((key) => (
              <HiddenCols
                label={labelsCols[key]}
                isDisabled={modified.hiddenCols[key]}
                onChange={(value) => {
                  onToggleHiddenCol(key, value)
                }}
                key={key}
              />
            ))}
          </div>

        </div>

        <hr/>

        <div>
          <div style={{ marginBottom: '15px' }}>
            <p style={{ marginBottom: '0px' }}>Используемые клавиши</p>
            <span className="small mb-1">Примечание: что бы использовать действия на элементе таблицы
            кликните по строке в любое место</span>
          </div>

          <div className={scss.listBindingKeys}>
            {getTypedKeys(modified.usingKeys).map(((key) => {
              return (
                <BindingKey
                  id={key}
                  modified={modified}
                  setModified={setModified}
                  key={key}
                />
              )
            }))}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="w-100 d-flex justify-content-between align-items-center">
          <div>
            <span className="small" style={{ fontWeight: '500' }}>v{appVersion.name}</span>
          </div>

          <div style={{
            display: 'flex',
            flexShrink: '0',
            flexWrap: 'wrap',
            alignItems: 'center',
            columnGap: '10px',
          }}>
            <input
              type="button"
              className="btn btn-secondary"
              value="Сбросить"
              onClick={() => setModified(options)}
              disabled={CompareData.isEquals(options, modified)}
            />

            <input
              type="button"
              className="btn btn-primary"
              value="Сохранить"
              onClick={saveModifiedOptions}
              disabled={CompareData.isEquals(options, modified)}
            />
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default SettingModal