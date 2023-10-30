import { ITableOptionsEntity, IWorkTableRow } from '@/types'
import Random from '@/utils/class/Random'
import TableLocalService from '@/service/TableLocalService'

type EventHandlers = {
  update: null | ((list: ITableOptionsEntity[]) => void),
  success: null | ((table: IWorkTableRow[]) => void)
}

/**
 * Пока что реализован импорт без сущностей
 *
 * TODO: Поменять формат импорта на {table: [...], entities: [{ key? text? rate? }]}
 * TODO: Переписать связи с entity в tableRow и по умолчанию кидать невидимую entity 0 (Добавить)
 * TODO: Дописать проверку в настройках и изменение entity в данных таблицы
 */
class ImportService {
  private reader: FileReader
  private handlers: EventHandlers

  public constructor(
    file: File | Blob,
    private entities: ITableOptionsEntity[],
    private active: string,
    private length: number,
  ) {
    this.reader = new FileReader()
    this.reader.readAsText(file)

    this.reader.onload = this.onload.bind(this)

    this.reader.onerror = () => {
      this.onerror(this.reader.error)
    }

    this.handlers = {
      update: null,
      success: null,
    }
  }

  /* ========================================== */

  public onUpdateEntity(fn: (data: ITableOptionsEntity[]) => void) {
    this.handlers.update = fn
  }

  public onSuccess(fn: (table: IWorkTableRow[]) => void) {
    this.handlers.success = fn
  }

  /* ========================================== */

  // private insertEntities(entity: string[], prevTech: string[]) {
  //   if (!this.handlers.update) return

  //   const list = entity.filter(key => !prevTech.includes(key)).map((it, i) => ({
  //     id: Random.uuid(10),
  //     key: it,
  //     text: `Ставка - ${i + 1}`,
  //     rate: 150,
  //   }))

  //   this.handlers.update(list)
  // }

  private onload() {
    if (!this.reader.result) return
    if (!this.handlers.success) return

    try {
      const any = JSON.parse(this.reader.result as string)
      const data = this.validate(any)
      if (!data.length) return

      // const entity = data.reduce<string[]>((list, it) => {
      //   if (!list.includes(it.entity)) list.push(it.entity)
      //   return list
      // }, [])
      //
      // const prevTech = this.entities.map(({ key }) => key)
      // const extra = [...entity, ...prevTech]
      //
      // if (extra.length !== prevTech.length)
      //   this.insertEntities(entity, prevTech)

      this.handlers.success(data)
    } catch (err) {
      this.onerror(err)
    }
  }

  private onerror(err: any) {
    console.error(err)
    alert('Не удалось импортировать файл!')
  }

  private validate(data: any): IWorkTableRow[] {
    if (!Array.isArray(data)) {
      alert('Ошибка импорта, не валидный формат данных!')
      return []
    }

    const schema: { key: string, type: string, empty?: boolean }[] = [
      { key: 'id', type: 'string', empty: false },
      { key: 'start', type: 'string', empty: false },
      { key: 'finish', type: 'string', empty: false },
      { key: 'isPaid', type: 'boolean' },
      { key: 'description', type: 'string', empty: true },
    ]

    const list = []
    let order = this.length

    // const options = TableLocalService.getActiveOptions(this.active)
    const options = null

    if (!options) {
      alert('Произошла непредвиденная ошибка при импорте!')
      throw new Error('Нет данных о настройках таблицы!')
    }

    return []

    // const entityId = options.listOfTech.length
    //   ? options.listOfTech[0]!.id
    //   : '-1'

    // for (const it of data) {
    //   if (!(typeof it === 'object' && !Array.isArray(it)))
    //     return []

    //   const check = schema.every(({ key, type, empty }) => {
    //     return key in it && typeof it[key] === type &&
    //       (type === 'string' && !empty ? it[key].trim() !== '' : true)
    //   })

    //   if (!check) continue

    //   const item: IWorkTableRow = {
    //     id: it.id,
    //     tableId: this.active,
    //     entityId,
    //     start: it.start,
    //     finish: it.finish,
    //     isPaid: it.isPaid,
    //     description: it.description,
    //     order: order + 1,
    //   }

    //   list.push(item)
    //   order++
    // }

    // return list
  }
}

export default ImportService