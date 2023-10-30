import React, { FC, useEffect, useMemo, useState } from "react";
import {
  formatDate,
  getDiffOfHours,
  getHoursOrZero,
  getTimeByDT,
} from "@/utils";
import type { FieldsEnum, IWorkTableRow } from "@/types";
import { DTEnum } from "@/types";
import {
  Actions,
  ChangeDateTime,
  useTableContext,
} from "@/context/TableContext";
import { TableRowActions } from "@/templates/table/Table";
import EditableCell from "@/templates/table/EditableCell";

type Nullable<T> = T | null;
type WriterList = Record<FieldsEnum, boolean>;

interface WTRowProps {
  data: IWorkTableRow;
  index: number;
  changeDT: ChangeDateTime;
  onAction: (action: TableRowActions, id: number) => void;
}

const defWritingData: WriterList = {
  start: false,
  finish: false,
  entity: false,
  paid: false,
};

function calcWorkHours(data: IWorkTableRow) {
  return getHoursOrZero(getDiffOfHours(data.start, data.finish));
}

const TableRow: FC<WTRowProps> = ({ data, index, changeDT, onAction }) => {
  const [{ filteredTable, selectedRows, options }, dispatch, payload] =
    useTableContext();
  // state
  const [diffDate, setDiffDate] = useState(formatDate(data));
  const [qtyHours, setQtyHours] = useState(() => calcWorkHours(data));

  useEffect(() => {
    setQtyHours(calcWorkHours(data));
  }, [filteredTable]);

  function onBlurHandle() {
    setDiffDate(formatDate(data));
    setQtyHours(getDiffOfHours(data.start, data.finish));
  }

  function preChange(key: DTEnum, value: string) {
    const check = (() => {
      switch (key) {
        case "start":
          return value < data.finish;
        case "finish":
          return value > data.start;
      }
    })();

    if (!check) return;

    changeDT(key, value, data.id);
  }

  function onPressHandle(e: React.KeyboardEvent<HTMLTableRowElement>) {
    e.preventDefault();

    switch (e.code) {
      case options?.usingKeys?.delete || "Delete":
        const msg = `Хотите удалить строку '${index + 1}'?`;
        if (!window.confirm(msg)) return;
        onAction("delete", data.id);
        break;
      case options?.usingKeys?.up || "ArrowUp":
        onAction("moveUp", data.id);
        break;
      case options?.usingKeys?.down || "ArrowDown":
        onAction("moveDown", data.id);
        break;
    }
  }

  function dispatchSelected(value: string[]) {
    dispatch({
      type: Actions.Rewrite,
      payload: payload("selectedRows", value),
    });
  }

  function toggleCheckHours() {
    if (selectedRows.includes(String(data.id)))
      dispatchSelected(selectedRows.filter((it) => it !== String(data.id)));
    else dispatchSelected([...selectedRows, String(data.id)]);
  }

  function getEntityField(
    value: string | number | null,
    field: "key" | "id",
    def: string | null = null,
    list = options.listOfTech
  ) {
    const arr = ["key", "id"] as const;
    const key = arr[+!Boolean(arr.indexOf(field))]!;

    return value
      ? list.find((it) => String(it[key]) === String(value))?.[field] || def
      : def;
  }

  const entity = useMemo(() => {
    return getEntityField(data.entityId, "key") ?? "Нет";
  }, [data.entityId, options.listOfTech]);

  return (
    <tr tabIndex={index} onKeyDown={onPressHandle}>
      {!options.hiddenCols.number && <td>{index + 1}</td>}

      <td>{diffDate}</td>

      <EditableCell<HTMLInputElement>
        data={getTimeByDT(data.start)}
        onEdit={(ref, blur) => (
          <input
            type="datetime-local"
            className="form-control"
            value={data.start}
            max={data.finish}
            ref={ref}
            onChange={({ target }) => {
              preChange("start", target.value);
            }}
            onBlur={() => {
              blur();
              onBlurHandle();
            }}
          />
        )}
      />

      <EditableCell<HTMLInputElement>
        data={getTimeByDT(data.finish)}
        onEdit={(ref, blur) => (
          <input
            type="datetime-local"
            className="form-control"
            value={data.finish}
            min={data.start}
            ref={ref}
            onChange={({ target }) => {
              preChange("finish", target.value);
            }}
            onBlur={() => {
              blur();
              onBlurHandle();
            }}
          />
        )}
      />

      <td>{qtyHours} ч.</td>

      <EditableCell<HTMLSelectElement>
        data={entity}
        hidden={options.hiddenCols.entity}
        onEdit={(ref, blur) => (
          <select
            className="form-select"
            value={getEntityField(data.entityId, "key") ?? "null"}
            onChange={({ target }) => {
              dispatch({
                type: Actions.WH_Item,
                payload: {
                  key: "entityId",
                  id: data.id,
                  value: (() => {
                    const id = getEntityField(target.value, "id");
                    return id ? +id : null;
                  })(),
                },
              });
            }}
            onBlur={blur}
            ref={ref}
          >
            <option value="null" disabled>
              Выбрать
            </option>

            {options.listOfTech.map((it) => (
              <option value={it.key} key={it.id}>
                {it.text}
              </option>
            ))}
          </select>
        )}
      />

      <EditableCell<HTMLInputElement>
        onEdit={(ref, blur) => (
          <input
            type="checkbox"
            checked={data.isPaid}
            className="form-check-input"
            ref={ref}
            onBlur={blur}
            onChange={() => {
              dispatch({
                type: Actions.WH_Item,
                payload: {
                  key: "isPaid",
                  id: data.id,
                  value: !data.isPaid,
                },
              });
            }}
          />
        )}
      >
        {data.isPaid ? (
          <span className="text-success">✓</span>
        ) : (
          <span className="text-danger">✗</span>
        )}
      </EditableCell>

      <td>
        <input
          type="checkbox"
          className="form-check-input"
          checked={selectedRows.includes(String(data.id))}
          onChange={toggleCheckHours}
        />
      </td>

      {!options.hiddenCols.description && (
        <td
          style={{ padding: "5px 7px" }}
          onDoubleClick={(e) => {
            e.preventDefault();

            dispatch({
              type: Actions.Rewrite,
              payload: payload("modalVisible", {
                id: String(data.id),
                visible: true,
              }),
            });
          }}
        >
          {data.description.slice(0, 35).trim() +
            (data.description.length > 25 ? "..." : "")}
        </td>
      )}
    </tr>
  );
};

export default TableRow;
