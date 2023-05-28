import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Actions, useTableContext } from '@/context/TableContext'
import { setAccessPassword } from '@/utils/login'
import BaseRepeater from '@/temps/repeater/BaseRepeater'
import TableService from '@/service/TableService'
import { getTypedKeys } from '@/utils'
import { ITableOptions } from '@/types'
import CompareData from '@/utils/class/CompareData'
import useDidUpdateEffect from '@/hooks/useDidUpdateEffect'

const SettingModal = () => {
  const [{ settingVisible, options, activeTable }, dispatch, payload] = useTableContext()
  const [modified, setModified] = useState(options)
  const [password, setPassword] = useState('')

  useDidUpdateEffect(() => {
    setModified(options)
  }, [options])

  useEffect(() => {
    if (!settingVisible) return
    setTimeout(() => setPassword(''), 1000)
  }, [settingVisible])

  /* ============ Methods ============ */

  function handleClose() {
    dispatch({
      type: Actions.Rewrite,
      payload: payload('settingVisible', false),
    })
  }

  function saveModifiedOptions() {
    if (!validateOptions()) return

    dispatch({
      type: Actions.Rewrite,
      payload: payload('options', modified),
    })

    TableService.updateActiveOptions(activeTable!, modified)
  }

  function updateAccessPassword() {
    setAccessPassword(password, () => {
      window.location.reload()
    })
  }

  function validateOptions(): boolean {
    const names: Record<keyof ITableOptions, string> = {
      dtRoundStep: 'Шаг округления',
      listOfTech: 'Сущности',
    }

    const validate: Record<keyof ITableOptions, boolean[]> = {
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

  return (
    <Modal
      show={settingVisible}
      onHide={handleClose}
      centered
      scrollable
      // backdrop="static"
      // keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Настройки</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          <label htmlFor="new-password">Новый пароль для входа</label>

          <div className="d-flex align-items-end gap-2">
            <input
              type="password"
              id="new-password"
              className="form-control mt-2"
              autoComplete="none"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />

            <input
              type="button"
              className="btn btn-primary"
              value="Сохранить"
              onClick={updateAccessPassword}
            />
          </div>
        </div>

        <hr/>

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
          onRender={([item, change], i) => (
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
            </>
          )}
        />
      </Modal.Body>

      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  )
}

export default SettingModal