import React, { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import LeftFloating from "./LeftFloating";
import { Actions, useTableContext } from "context/TableContext";
import scss from "./Left.module.scss";
import LeftItem from "./LeftItem";
import TableLocalService from "@/service/TableLocalService";
import { IWorkTable } from "@/types";
import TableApiService from "@/api/TableApiService";

export type IWorkTableWithActive = IWorkTable & { isVisible: boolean };

function buildListOfDetails(list: IWorkTable[]): IWorkTableWithActive[] {
  return list.map((it) => ({ ...it, isVisible: false }));
}

const Left = () => {
  const [{ visibility, listOfTables, activeTable }, dispatch, payload] =
    useTableContext();

  const [listOfDetails, setListOfDetails] = useState(() => {
    return buildListOfDetails(listOfTables);
  });

  const [isCreateMode, setCreateMode] = useState(false);
  const [name, setName] = useState(getDefName);

  useEffect(() => {
    if (!isCreateMode) return;
    setName(getDefName);
  }, [isCreateMode]);

  useEffect(() => {
    setListOfDetails(buildListOfDetails(listOfTables));
  }, [listOfTables]);

  function setItemVisible(id: string, force?: boolean) {
    setListOfDetails((prev) => {
      return prev.map((it) => ({
        ...it,
        isVisible:
          String(it.id) === id
            ? force === undefined
              ? !it.isVisible
              : force
            : false,
      }));
    });
  }

  function getDefName() {
    return `По умолчанию ${listOfTables.length + 1}`;
  }

  function setLeftVisible() {
    setCreateMode(false);

    setListOfDetails((prev) => {
      return prev.map((it) => ({ ...it, isVisible: false }));
    });

    dispatch({
      type: Actions.Visible,
      payload: { key: "left", value: !visibility.left },
    });
  }

  async function onAddTable() {
    try {
      const item = await TableApiService.createTable(name);

      setCreateMode(false);

      dispatch({
        type: Actions.State,
        payload: {
          activeTable: String(item.id),
          listOfTables: [...listOfTables, item],
        },
      });

      TableLocalService.activeTable = String(item.id);
    } catch (e) {
      alert(e);
    }
  }

  async function onRenameTableItem(id: number, name: string) {
    const isExist = listOfTables.find((it) => it.name === name);
    if (!name || isExist !== undefined) return;

    try {
      await TableApiService.renameTable(id, name);

      const list = listOfTables.map((it) => {
        return it.id !== id ? it : { ...it, name };
      });

      dispatch({
        type: Actions.Rewrite,
        payload: payload("listOfTables", list),
      });
    } catch (e) {
      alert(e);
    }
  }

  return (
    <>
      {activeTable && <LeftFloating />}

      <Offcanvas show={visibility.left} onHide={setLeftVisible}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Рабочие таблицы</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={scss.wrapper}>
            <div className={scss.top}>
              {listOfTables.length ? (
                <div className={scss.list}>
                  {listOfDetails.map((it) => (
                    <LeftItem
                      data={it}
                      onToggle={setItemVisible}
                      onRename={onRenameTableItem}
                      key={it.id}
                    />
                  ))}
                </div>
              ) : (
                !isCreateMode && <p>Рабочие таблицы еще не созданы...</p>
              )}

              {isCreateMode && (
                <div className={scss.create}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Имя таблицы"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    type="button"
                    className="btn btn-primary"
                    value="Добавить"
                    onClick={onAddTable}
                  />

                  <input
                    type="button"
                    className="btn btn-outline-secondary"
                    value="Отмена"
                    onClick={() => setCreateMode(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </Offcanvas.Body>

        <div className="offcanvas-footer">
          <div className={scss.bottom}>
            <input
              type="button"
              className="btn btn-primary"
              value="Добавить таблицу"
              disabled={isCreateMode}
              onClick={() => setCreateMode(true)}
            />

            {/* {listOfTables.length > 0 && (
              <input
                type="button"
                className="btn btn-outline-danger"
                value="Удалить все таблицы"
                onClick={() => TableLocalService.deleteAllTables()}
              />
            )} */}
          </div>
        </div>
      </Offcanvas>
    </>
  );
};

export default Left;
