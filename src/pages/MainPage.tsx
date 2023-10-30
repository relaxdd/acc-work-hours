import Table from "@/templates/table/Table";
import Container from "@/templates/Container";
import { IWorkTable, IWorkTableRow } from "types";
import {
  Actions,
  defTableStore,
  ITableStore,
  TableContext,
  tableReducer,
  wrapPayload,
} from "context/TableContext";
import { useEffect, useReducer, useRef, useState } from "react";
import Bottom from "@/templates/Bottom";
import Filter from "@/templates/filter/Filter";
import { getAllIds } from "@/utils";
import Left from "@/templates/left/Left";
import DescrModal from "@/templates/modals/DescrModal";
import useDidUpdateEffect from "@/hooks/useDidUpdateEffect";
import Empty from "@/templates/empty/Empty";
import SettingModal from "@/templates/setting/SettingModal";
import CompareData from "@/utils/class/CompareData";
import HelpModal from "@/templates/modals/HelpModal";
import AddingModal from "@/templates/modals/AddingModal";
import TableApiService from "@/api/TableApiService";
import { Spinner } from "react-bootstrap";
import { LS_ACTIVE_KEY } from "@/data";

type BoundPartsOfStore = Pick<
  ITableStore,
  "initialTable" | "modifiedTable" | "selectedRows"
>;

// function qtyObjKeys(obj: Object): number {
//   return Object.keys(obj).length;
// }

// function validateOptions(opt: ITableOptions, def: ITableOptions) {
//   const verify = ["hiddenCols", "usingKeys"];

//   return getTypedKeys(def).reduce<Record<string, any>>((list, key) => {
//     if (!(key in opt)) list[key] = def[key];
//     else if (verify.includes(key))
//       list[key] =
//         qtyObjKeys(opt[key]) === qtyObjKeys(def[key]) ? opt[key] : def[key];
//     else if (key === "listOfTech")
//       list[key] = opt[key].length ? opt[key] : def[key];
//     else list[key] = opt[key];

//     return list;
//   }, {}) as ITableOptions;
// }

// function getActiveOptions(id: string | null, def = defOptions) {
//   let validate = false;

//   const options = id
//     ? (() => {
//         validate = true;
//         return TableLocalService.getActiveOptions(id);
//       })() ?? def
//     : def;

//   if (validate) return validateOptions(options, def);
//   else return options;
// }

function getActiveTableInfo(listOfTables: IWorkTable[]) {
  if (!listOfTables.length) return null;

  const active = localStorage.getItem(LS_ACTIVE_KEY);
  if (!active) return listOfTables[0]!;

  return (
    listOfTables.find((it) => String(it.id) === active) || listOfTables[0]!
  );
}

function getBoundPartsOfStore(table: IWorkTableRow[]): BoundPartsOfStore {
  return {
    initialTable: table,
    modifiedTable: table,
    selectedRows: getAllIds(table),
  };
}

async function getServerStore(): Promise<ITableStore> {
  const tables = await TableApiService.getTables();

  const active = getActiveTableInfo(tables);
  if (!active) return defTableStore;

  const { rows, options } = await TableApiService.getAllData(String(active.id));

  return {
    ...defTableStore,
    activeTable: active && String(active.id),
    listOfTables: tables,
    options,
    ...getBoundPartsOfStore(rows),
  };
}

/* ====================================== */

function MainPage() {
  const [store, dispatch] = useReducer(tableReducer, defTableStore);
  const [width, setWidth] = useState(window.innerWidth);
  const [isLoading, setLoading] = useState(true);
  const isInit = useRef(true);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });

    try {
      getServerStore().then((data) => {
        dispatch({
          type: Actions.State,
          payload: data,
        });

        isInit.current = false;
      });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    function handler(e: any) {
      const msg = "Do you really want to close?";
      (e || window.event).returnValue = msg;
      return msg;
    }

    if (CompareData.isEquals(store.initialTable, store.modifiedTable))
      window.removeEventListener("beforeunload", handler);
    else window.addEventListener("beforeunload", handler);

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [store.initialTable, store.modifiedTable]);

  useDidUpdateEffect(async () => {
    if (isInit.current) return;
    if (!store.activeTable) return;

    const data = await TableApiService.getAllData(store.activeTable);

    dispatch({
      type: Actions.State,
      payload: {
        options: data.options,
        ...getBoundPartsOfStore(data.rows),
      },
    });
  }, [store.activeTable]);

  return width >= 768 ? (
    <TableContext.Provider value={[store, dispatch, wrapPayload]}>
      {isLoading ? (
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner variant={"primary"} />
        </div>
      ) : (
        <Container>
          {store.activeTable === null ? (
            <Empty />
          ) : (
            <>
              <Filter />
              <Table />
              <Bottom />
              <DescrModal />
              <HelpModal />
              <SettingModal />

              {store.options.typeOfAdding === "full" && <AddingModal />}
            </>
          )}

          <Left />
        </Container>
      )}
    </TableContext.Provider>
  ) : (
    <div className="container">
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <h2>
          Для отображения этого приложения ширина экрана должна быть больше
          767px :(
        </h2>
      </div>
    </div>
  );
}

export default MainPage;
