import style from './Repeater.module.scss'
import ItemRepeater, { OnHideItemRepeater, RepeatActions, RepeaterReducer } from './ItemRepeater'
import React, { useEffect } from 'react'
import CompareData from '@/utils/class/CompareData'

type SomeObject<T = any> = { [key: string | number]: T }
type BaseTypes = 'number' | 'string' | 'boolean' | 'array';
type AllowedTypes = number | string | boolean | any[];
type ListOfTypes<T = Record<string, any>> = { [key in keyof T]: BaseTypes; };

export type RepeaterDispatch<T> = (key: keyof T, value: any, index: number) => void

interface BaseRepeaterProps<T> {
  data: Array<T>,
  baseKeys: (keyof T)[],
  onChange: (list: T[]) => void,
  onRender: (state: [T, RepeaterDispatch<T>], i: number) => JSX.Element | JSX.Element[],
  title?: string,
  onHideItem?: OnHideItemRepeater,
  onMount?: (() => void),
  textConfirmDeleteItem?: string,
  id?: string,
  baseTypes?: ListOfTypes<T>,
  asForm?: boolean,
  onSubmit?: ((e: React.FormEvent<HTMLFormElement>) => void),
  submitDisabled?: boolean
}

function getTypedKeys<T extends Object>(obj: T) {
  return Object.keys(obj) as (keyof T)[]
}

function removeElementByKey<T = any>(obj: SomeObject<T>, key: string) {
  return getTypedKeys(obj).reduce((acc, item) => {
    if (item === key)
      return acc
    else {
      acc[item] = obj[item]!
      return acc
    }
  }, {} as SomeObject<T>)
}

function ListRepeater<T extends Object>(
  {
    title,
    data,
    baseKeys,
    onChange,
    textConfirmDeleteItem,
    onRender,
    onHideItem,
    id,
    baseTypes,
    onMount,
    asForm,
    onSubmit,
    submitDisabled,
  }: BaseRepeaterProps<T>,
): JSX.Element {
  const ls = '__awenn2015_react_repeater'
  const hidden = getDataOfHidden() || []

  useEffect(() => {
    onMount && onMount()
  }, [])

  function defaultTypes() {
    return baseKeys.reduce((acc, key) => {
      acc[key] = 'string'
      return acc
    }, {} as ListOfTypes<T>)
  }

  /**
   * Returns the default value for a specific data type
   */
  function getDefaultValue(type: BaseTypes): AllowedTypes {
    switch (type) {
      case 'number':
        return 0
      case 'string':
        return ''
      case 'boolean':
        return false
      case 'array':
        return []
    }
  }

  /**
   * Get data about hidden fields, also cleans local storage
   */
  function getDataOfHidden() {
    if (!id) return

    const candidate = localStorage.getItem(ls)
    if (candidate === null) return

    const listOfHidden = JSON.parse(candidate) as SomeObject<boolean[]>
    if (!Object.keys(listOfHidden).length) return

    const list = listOfHidden?.[id] || null
    if (list === null || !list.length) return

    // Очистка local storage
    if (data.length < list.length) {
      for (let i = list.length - 1; i >= 0; i--)
        if (i >= data.length || !list[i]) list.pop()

      localStorage.setItem(ls, JSON.stringify(!list.length
        ? removeElementByKey(listOfHidden, id)
        : { ...listOfHidden, [id]: list },
      ))
    }

    return list
  }

  function validateDataType() {
    if (!Array.isArray(data))
      throw new Error(`Не верно указан тип данных в свойстве повторителя 'baseTypes'`)

    return true
  }

  function convertType(value: string, type: BaseTypes) {
    switch (type) {
      case 'number':
        return value ? parseInt(value) : 0
      case 'string':
        return String(value)
      default:
        return value
    }
  }

  /**
   * Overwrites the state at the specified index
   */
  function onEdit(key: keyof T, value: string, index: number) {
    const type = baseTypes ? baseTypes[key]! : 'string'

    onChange(data.map((item, i) => {
      return i !== index ? item
        : { ...item, [key]: convertType(value, type) }
    }))
  }

  /**
   * Creates a new element
   */
  function create(): T {
    baseTypes = baseTypes || defaultTypes()

    return baseKeys.reduce((obj, key) => {
      obj[key] = getDefaultValue(baseTypes![key]) as unknown as T[keyof T]
      return obj
    }, {} as T)
  }

  /**
   * Checks if the element is empty
   * @param index element index
   */
  function isFieldEmpty(index: number): boolean {
    baseTypes = baseTypes || defaultTypes()

    return getTypedKeys(data[index]!).every((key) => {
      return CompareData.isEquals(data[index]![key], getDefaultValue(baseTypes![key]))
    })
  }

  /**
   * Adds a new repeater element to the end
   */
  function push() {
    onChange([...data, create()])
  }

  /**
   * Deletes an item by index
   */
  function remove(index: number) {
    const __delete = () => {
      onChange(data.filter((_, i) => i !== index))
    }

    if (isFieldEmpty(index)) __delete()
    else {
      const text = textConfirmDeleteItem || 'Do you really want to delete this item?'
      const result = window.confirm(text)
      if (result) __delete()
    }
  }

  /**
   * Adds a new element at the specified index
   */
  function add(index: number) {
    onChange([
      ...data.slice(0, index),
      create(),
      ...data.slice(index, data.length),
    ])
  }

  /**
   * Saving hidden fields in local storage
   */
  function saveHiddenItemInStore(index: number, isHidden: boolean) {
    if (!id) return
    const candidate = localStorage.getItem(ls)

    /* ======== utils ======== */

    const __save = (list: boolean[], data: SomeObject<boolean[]>) => {
      const isEmpty = data?.[id]?.every(item => !item) || false

      if (isEmpty) {
        const result = removeElementByKey(data, id)

        if (Object.keys(result).length > 0)
          localStorage.setItem(ls, JSON.stringify(result))
        else
          localStorage.removeItem(ls)
      } else {
        localStorage.setItem(ls, JSON.stringify({
          ...data, [id]: list,
        }))
      }
    }

    const __push = (index: number, prev: boolean[] = [], withLast: boolean = true) => {
      if (index === 0 && !withLast)
        throw new Error('Не корректная операция!')

      const loop = withLast ? index : index - 1

      for (let i = prev.length; i <= loop; i++)
        prev.push(i === index)

      return prev
    }

    const __clear = (list: boolean[]) => {
      if (list[list.length - 1]) return list

      for (let i = list.length - 1; i >= 0; i--) {
        if (!list[i]) list.pop()
        else break
      }

      return list
    }

    /* ====== methods ====== */

    const deleteItem = () => {
      if (candidate === null) return

      const data = JSON.parse(candidate) as SomeObject<boolean[]>
      let list = data[id]!

      if (index >= list.length)
        list = __push(index, list, false)
      else if (index === list.length - 1)
        list.pop()
      else
        list[index] = false

      __save(__clear(list), data)
    }

    const addItem = () => {
      if (candidate === null)
        __save(__push(index), {})
      else {
        const data = JSON.parse(candidate) as SomeObject<boolean[]>
        let list = data?.[id] || []

        if (typeof list[index] === 'undefined')
          list = __push(index, list)
        else {
          list[index] = true
          list = __clear(list)
        }

        __save(list, data)
      }
    }

    if (isHidden) addItem()
    else deleteItem()
  }

  /**
   * Intermediate event "onHide"
   */
  const onItemToggleHide: OnHideItemRepeater = (index, isHidden, isInitial) => {
    onHideItem && onHideItem(index, isHidden, isInitial)

    if (!isInitial)
      saveHiddenItemInStore(index, isHidden)
  }

  /**
   * A set of some actions specifying the index of the element
   */
  const reducer: RepeaterReducer = (action, index) => {
    switch (action) {
      case RepeatActions.ADD:
        add(index)
        break
      case RepeatActions.REMOVE:
        remove(index)
        break
    }
  }

  return (

    <div className={style.wrapper}>
      {typeof title !== 'undefined' && (
        <div>
          <label className={'form-label'}>{title}</label>
        </div>
      )}
      <div className={style.header}>
        <div className={style.inner}></div>
        <div className={style.inner}>
          Данные <span className={style.required}>*</span>
        </div>
        <div className={style.inner}></div>
      </div>
      <div className={style.elements}>
        {validateDataType() && data.map((item, i) => (
          <ItemRepeater
            index={i}
            reducer={reducer}
            onHide={onItemToggleHide}
            isHidden={hidden?.[i] || false}
            key={i}
          >
            {onRender([data[i]!, onEdit], i)}
          </ItemRepeater>
        ))}
      </div>

      <div className={style.button}>
        {asForm && (
          <button
            className="btn btn-primary"
            type={onSubmit ? 'submit' : 'button'}
            {...(typeof submitDisabled !== 'undefined' ? { disabled: submitDisabled } : {})}
          >
            Обновить
          </button>
        )}

        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={push}
        >
          Добавить
        </button>
      </div>
    </div>
  )
}

/**
 * TODO: Сделать проверку на кол-во элементов и если 1 то не покалывать скрывашку
 *
 * @author awenn2015
 * @version 1.0.3
 */
function BaseRepeater<T extends Object>(props: BaseRepeaterProps<T>) {
  return props.asForm
    ? (
      <form
        autoComplete="off"
        {...(props.onSubmit ? { onSubmit: props.onSubmit } : {})}
      >
        <ListRepeater {...props} />
      </form>
    )
    : <div><ListRepeater {...props} /></div>
}

export default BaseRepeater
