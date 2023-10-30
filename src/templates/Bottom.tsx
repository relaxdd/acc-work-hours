import CompareData from "@/utils/class/CompareData";
import { IWorkTableRow } from "@/types";
import {
  getAllIds,
  getDateTimeWithOffset,
  getFormattedDateTime,
  roundDateTime,
} from "@/utils";
import Random from "@/utils/class/Random";
import { Actions, useTableContext } from "@/context/TableContext";

const Bottom = () => {
  const [
    {
      initialTable,
      modifiedTable,
      options,
      activeTable,
      selectedRows,
      listOfTables,
    },
    dispatch,
    payload,
  ] = useTableContext();

  function dispatchModifiedTable(table: IWorkTableRow[]) {
    dispatch({
      type: Actions.State,
      payload: {
        modifiedTable: table,
        selectedRows: getAllIds(table),
      },
    });
  }

  function addFastTableRow() {
    const dt = getFormattedDateTime();
    const start = options.dtRoundStep
      ? roundDateTime(dt, options.dtRoundStep)
      : dt;
    const finish = getDateTimeWithOffset(1.5, start);

    if (!options.listOfTech.length) {
      alert("Ошибка: Добавьте варианты сущностей!");
      return;
    }

    const item: IWorkTableRow = {
      id: NaN,
      tableId: +activeTable!,
      entityId: options.listOfTech[0]!.id,
      start,
      finish,
      isPaid: false,
      description: "",
      order: modifiedTable.length + 1,
    };

    const table = [...modifiedTable, item];

    dispatch({
      type: Actions.State,
      payload: {
        modifiedTable: table,
        selectedRows: [...selectedRows, String(item.id)],
      },
    });
  }

  function addTableRow() {
    switch (options.typeOfAdding) {
      case "fast":
        addFastTableRow();
        break;
      case "full":
        dispatch({
          type: Actions.Visible,
          payload: { key: "adding", value: true },
        });
        break;
    }
  }

  function saveWorkTableData() {
    console.log(modifiedTable);
    
    const updated = listOfTables.map((it) => {
      return String(it.id) === activeTable
        ? { ...it, count: modifiedTable.length }
        : it;
    });

    dispatch({
      type: Actions.State,
      payload: {
        initialTable: modifiedTable,
        listOfTables: updated,
      },
    });

    // TableLocalService.updateActiveTableData(activeTable!, modifiedTable)
    // TableLocalService.listOfTablesInfo = updated
  }

  function showExportData() {
    window.navigator.clipboard
      .writeText(JSON.stringify(modifiedTable))
      .then(() => {
        alert("База рабочих часов успешно скопирована в буфер обмена");
      })
      .catch((err) => {
        console.error(err);
        alert("Не удалось получить данные!");
      });
  }

  // TODO: Вынести в модалку импорта
  function importTableData() {
    let overwrite = false;

    function refine() {
      const actions = [
        ["no", "0", "n", "нет"],
        ["yes", "1", "y", "да"],
      ];
      const msg = `Таблица не пуста, выберите действие: перезаписать или объединить (y/n)`;

      const result = window.prompt(msg);
      if (!result) return;

      const choice = actions.findIndex((it) => {
        return it.includes(result.toLowerCase());
      });

      if (choice === -1) return false;
      overwrite = Boolean(choice);

      return true;
    }

    function handler(e: any) {
      if (!e.target) return;
      const file = e.target.files?.[0];
      if (!file) return;

      alert("Not Implemented!");
      return;

      // const service = new ImportService(file, options.listOfTech, activeTable!, modifiedTable.length)

      // service.onUpdateEntity((entities) => {
      //   TableLocalService.updateActiveOptions(activeTable!, {
      //     ...options, listOfTech: overwrite
      //       ? entities : [...options.listOfTech, ...entities],
      //   })
      // })

      // service.onSuccess((table) => {
      //   table = overwrite ? table : [...modifiedTable, ...table]
      //   TableLocalService.updateActiveTableData(activeTable!, table)
      //   const list = TableLocalService.listOfTablesInfo

      //   for (let it of list) {
      //     if (String(it.id) !== activeTable) continue
      //     it.count = table.length
      //   }

      //   TableLocalService.listOfTablesInfo = list
      //   window.location.reload()
      // })
    }

    if (initialTable.length > 0 && !refine()) return;

    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", ".json");
    input.addEventListener("change", handler);

    input.click();
  }

  return (
    <div
      className="d-flex justify-content-end"
      style={{ columnGap: "5px", marginBottom: "20px" }}
    >
      <input
        type="button"
        value="Экспорт"
        className="btn btn-outline-dark"
        onClick={showExportData}
        disabled={!modifiedTable.length}
      />

      <input
        type="button"
        value="Импорт"
        className="btn btn-outline-secondary"
        onClick={importTableData}
      />

      <input
        type="button"
        value="Сбросить"
        className="btn btn-outline-danger"
        disabled={CompareData.isEquals(initialTable, modifiedTable)}
        onClick={() => dispatchModifiedTable(initialTable)}
      />

      <input
        type="button"
        value="Сохранить"
        className="btn btn-primary"
        disabled={CompareData.isEquals(initialTable, modifiedTable)}
        onClick={saveWorkTableData}
      />

      <input
        type="button"
        value="Добавить"
        className="btn btn-secondary"
        onClick={addTableRow}
      />
    </div>
  );
};

export default Bottom;
