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
import scss from './SettingModal.module.scss'
import BindingKey from '@/temps/setting/BindingKey'
import EntityRepeater from '@/temps/setting/EntityRepeater'
import { appVersion } from '@/defines'

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

  return (
    <Modal
      show={settingVisible}
      onHide={handleClose}
      centered
      scrollable
      size="lg"
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
          <label htmlFor="typeOfAdding">Вариант добавления строки</label>

          <select
            id="typeOfAdding"
            className="form-select mt-2"
            value={modified.typeOfAdding}
            onChange={({ target }) => {
              setModified(prev => ({ ...prev,
                typeOfAdding: target.value as 'fast' | 'full'
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
            <div className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                checked={modified.hiddenCols.number}
                onChange={() => {
                  setModified(prev => {
                    return {
                      ...prev, hiddenCols: {
                        ...prev.hiddenCols,
                        number: !prev.hiddenCols.number,
                      },
                    }
                  })
                }}
              />

              <label>Нумерация</label>
            </div>

            <div className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                checked={modified.hiddenCols.description}
                onChange={() => {
                  setModified(prev => {
                    return {
                      ...prev, hiddenCols: {
                        ...prev.hiddenCols,
                        description: !prev.hiddenCols.description,
                      },
                    }
                  })
                }}
              />

              <label>Описание</label>
            </div>
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