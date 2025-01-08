import {
  Alert,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from "react";
import {
  Card,
  Checkbox,
  DataTable,
  List,
  Menu,
  Title,
} from "react-native-paper";
import { AppHyperLink } from "../../../shared/app-hyperlink";
import { APP } from "common";
import * as CONFIG from "../../../../config";
import { IDBReadParam } from "data-layer/interfaces/database";
import { DocTypeService } from "data-layer/services/doctype";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { AppIconButton } from "../../../shared/app-icon-button";
import { AppButton } from "../../../shared/app-button";
import AppMask from "../../../shared/app-mask";
import { Confirm } from "../../../shared/app-dialog";
import DocDialog from "./doc-dialog";
import {
  reset_form_store,
  update_field_store_value,
} from "../../../../utils/state";
import { UIUtil } from "../../../../utils/ui";
import { AppMenu } from "../../../shared/app-menu";
import { ExporterService } from "data-layer/services/exporter";
import ViewerWeb from "../../../shared/viewer-web";
import { FileUtil } from "common/utils/file";
import { IGridProps } from "../../../../interfaces/ui";
import AppLoader from "../../../shared/app-loader";
import { MediaAsset } from "../../../media/media-handler";
import { theme } from "../../../theme/theme";

const GLOBALS = CONFIG.GLOBALS;
const DOCTYPES = CONFIG.DOCTYPES;

const DocGrid = (props: IGridProps, ref) => {
  //const { columns, data, doctype, ...rest } = props;
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { doctype, is_report } = props;

  const [page, setPage] = React.useState<number>(0);
  const [numOfItemsPerPageList] = React.useState(GLOBALS.LISTVIEW_PAGE_SIZES); // [5, 10, 20]);
  const [items_per_page, onItemsPerPageChange] = React.useState(
    numOfItemsPerPageList[0]
  );
  const [data, setData] = React.useState(props.value || []);
  const [count, set_count] = React.useState(0);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [columns, set_columns] = useState([]);
  const [deleting, setDeleting] = React.useState(false);
  const [confirm_delete, setConfirmDelete] = React.useState(false);
  const [dialog_visible, setDialogVisible] = React.useState(false);
  const [current_row, setCurrentRow] = React.useState(null);
  const [downloading, setDownloading] = useState(false);
  const [download_url, setDownloadUrl] = useState("");
  const [is_loading, setIsLoading] = useState(true);

  const db = new DocTypeService(doctype);

  useImperativeHandle(ref, () => {
    getRows: () => getRows();
  }, []);

  const getReadDbConfig = (): IDBReadParam => {
    let config = {} as IDBReadParam;
    config.doctype = props.doctype;
    config.fields = columns?.map((a) => a.fieldname);
    let query = {};
    if (props.isChildTable && props.parenttype && props.parentfield) {
      query["parenttype"] = props.parenttype;
      query["parent"] = props.parent;
      query["parentfield"] = props.parentfield;
    } else {
      if (props.doctype == DOCTYPES.ENGAGEMENT_ENTRY) {
        if ("engagement" in params) {
          query["engagement"] = params.engagement;
        }
      }
    }
    config.filters = APP.make_filters(query);
    config.order_by = GLOBALS.LISTVIEW_SORT_FIELD;

    // update total rows count. Get the count from backend
    //If "All" (0) is selected, get all rows
    if (items_per_page === 0) {
      config.limit_start = 0;
      config.limit_page_length = 0;
    } else {
      config.limit_start = Math.max(0, page * items_per_page);
      config.limit_page_length = items_per_page;
    }
    return config;
  };

  const getColumns = async () => {
    let cols = [
      {
        name: "name",
        fieldname: "name",
        label: APP._("DOC_LIST_VIEW_PAGE.ID_COLUMN_HEADER"),
        align: "left",
        field: "name",
        sortable: true,
        // format: (val, row) => {
        //   return `<b>${val} </b>`;// '<a href=#>`${val}`</a>'
        // }
      },
    ];

    if (props.isChildTable) {
      // If is childtable, hide ID field
      cols = [];
    }
    const form_def = await db.get_doctype();
    if (form_def) {
      let visible_cols = form_def.fields.filter(
        (item) => item.in_list_view === 1
      );
      //show max of 5 columns
      for (
        let i = 0;
        i < Math.min(GLOBALS.MAX_GRID_COLUMNS, visible_cols.length);
        i++
      ) {
        let col = visible_cols[i];
        cols.push({
          name: col.fieldname,
          fieldname: col.fieldname,
          label: col.label, // APP._(col.label),
          align: "left",
          field: col.fieldname,
          sortable: true,
        });
      }
    }
    // set_fields(fielda => doc_fields);//setResult(result => [...result, response]);
    set_columns((columns) => cols);
  };

  /**
   * Load data
   */
  const loadData = async () => {
    setIsLoading(true);
    if (!props.isChildTable) {
      // get data from server
      const config = getReadDbConfig();
      const [recs, total_count] = await db.get_list(config, true);
      setData((data) => recs);
      set_count((count) => total_count);
      setIsLoading(false);
    } else {
      let recs = props.parentdoc?.__islocal
        ? []
        : props.parentdoc?.[props.parentfield];
      recs = recs || props.value; //If there are existing rows, show them
      setData((data) => recs);
      setIsLoading(false);
    }
  };

  /**
   * Handle row selection
   * @param row_id
   */
  const handleRowSelect = (row: string) => {
    // Toggle selection for a specific row
    if (selectedRows.includes(row.name)) {
      const cellId = selectedRows.filter((id) => id !== row.name);
      setSelectedRows(cellId);
      props.on_row_select?.(row);
    } else {
      setSelectedRows([...selectedRows, row.name]);
      props.on_row_select?.(row);
    }
  };

  /**
   * Delete selected rows
   */
  const deleteRows = async () => {
    if (selectedRows.length <= 0) {
      return;
    }
    if (props.isChildTable) {
      //remove items from the grid without deleting in the db
      let rows = data ? [...data] : [];
      let left = rows.filter((el) => !selectedRows.includes(el.name));
      setData(left);
      setSelectedRows([]);
    } else {
      //delete items from the db and reload grid
      setDeleting(true);
      setTimeout(() => {}, 1000);
      for (let i = 0; i < selectedRows.length; i++) {
        await db.delete_doc(selectedRows[i]);
      }
      setDeleting(false);
      loadData();
    }
  };

  const onRefresh = () => {
    setSelectedRows([]);
    const page_to_load = 0;
    // if page_to_load is same as current page, hard load data else soft load
    if (page == page_to_load) {
      loadData();
    } else {
      setPage(page_to_load);
    }
  };

  const openFormView = (is_editing: boolean, row = null) => {
    // reset_form_store(props.doctype); // reset form state
    if (doctype != DOCTYPES.ENGAGEMENT_ENTRY) {
      APP.navigateToPath(navigation, "views/form/index", {
        doctype: doctype,
        docname: is_editing ? row.name : GLOBALS.NEW_RECORD_ID,
      });
      // APP.route_to_path(
      //   'views/form', {
      //     'doctype': doctype,
      //     'docname': is_editing ? row.name : GLOBALS.NEW_RECORD_ID
      //   }
      // );
      // return `/form/${props.doctype}/new`
    } else {
      const curr_engagement = params.engagement;
      APP.navigateToPath(
        navigation,
        "/modules/engage/screens/EngageFormScreen",
        {
          engagement: curr_engagement,
          entry: is_editing ? row.name : GLOBALS.NEW_RECORD_ID,
        }
      );
      // APP.route_to_path(
      //   'views/form/MultiStepForm', {
      //     'engagement': curr_engagement,
      //     'entry': is_editing ? row.name : GLOBALS.NEW_RECORD_ID
      //   }
      // );
    }
    // const curr_engagement = route.query.engagement
    // return `/engage/${curr_engagement}/new`
  };

  const onAddNewRow = () => {
    setDialogVisible(true);
  };

  /**
   * Add a new row to grid
   * @param row
   */
  const insertNewRow = (row) => {
    let rows = data ? [...data] : [];
    if (current_row) {
      const idx = rows.findIndex((el, indx) => el == current_row);
      rows[idx] = row;
    } else {
      row["name"] = `${GLOBALS.NEW_RECORD_ID}-${APP.generate_random_string(6)}`;
      row["docname"] = row["name"];
      rows = [...rows, row];
    }
    rows = resetRowIndices(rows);
    setData(rows);
    setCurrentRow(null);
    setDialogVisible(false);
    // update_field_store_value(props.doctype, props.field_name, rows);

    // setData((current_data) => {
    //     current_data = current_data || [];
    //     if(current_row){
    //       const idx = current_data.findIndex((el, indx) => el == current_row);
    //       current_data[idx] = row;
    //       return current_data;
    //     }
    //     return [...current_data, row];
    //   });
  };

  /**
   * Reset child row index
   */
  const resetRowIndices = (rows: Array<object>) => {
    rows.map((el, idx) => {
      el["idx"] = idx + 1;
    });
    return rows;
  };
  /**
   * Get grid rows
   * @returns
   */
  const getRows = () => {
    return data;
  };

  /**
   * Get title to display on child table dialog
   */
  const getChildTableTitle = () => {
    let count = data?.length || 0;
    let row_idx = current_row ? current_row.idx : count + 1;
    let title = `${APP._("CHILD_TABLE.EDITING_ROW")} ${row_idx}`;
    return title;
  };

  const from = page * items_per_page;
  const to = Math.min((page + 1) * items_per_page, count);

  useLayoutEffect(() => {
    //set title only for major grids. Child tables appear within forms and so cannot have page title
    if (!props.isChildTable) {
      let pg_title = `${doctype} ${APP._("DOC_LIST_VIEW_PAGE.TITLE")}`;
      if (params["engagement"]) {
        pg_title = `${params.engagement_name} ${APP._("DOC_LIST_VIEW_PAGE.TITLE")}`;
      }
      navigation.setOptions({ title: pg_title });
    }
  }, []);

  React.useEffect(() => {
    props.on_change?.(data); // update_field_store_value will be called from here
  }, [data]);

  React.useEffect(() => {
    getColumns().then(() => {});
  }, []);

  React.useEffect(() => {
    if (columns) {
      loadData();
    }
  }, [items_per_page /*columns,*/]);

  React.useEffect(() => {
    if (columns) {
      loadData();
    }
  }, [page]);

  /**
   * Format cell value
   * @param cellValue
   */
  const cellFormatter = (cellValue) => {
    if (cellValue instanceof Array) {
      return cellValue?.map((itm) => itm.file_name)?.join(", ");
    }
    return cellValue?.toString();
  };

  return is_loading ? (
    <AppLoader />
  ) : (
    <View
      style={[
        props.style,
        { borderWidth: 1, borderColor: theme.colors.inversePrimary },
      ]}
    >
      {!props.isChildTable && props.label && <Title>{props.label}</Title>}
      {!props.isChildTable && (
        <Card>
          <Card.Actions>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                {!is_report && selectedRows.length > 0 && (
                  <AppButton
                    icon="delete-forever"
                    mode="outlined"
                    label={APP._("BUTTON.DELETE")}
                    style={{
                      marginTop: 0,
                      display: props.isChildTable ? "none" : "flex",
                    }}
                    onPress={() => {
                      setConfirmDelete(true);
                    }}
                  />
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                <View style={{ alignSelf: "flex-end" }}>
                  <AppIconButton
                    icon="refresh"
                    mode="contained-tonal"
                    style={{
                      marginTop: 0,
                      display: props.isChildTable ? "none" : "flex",
                    }}
                    tooltip={APP._("BUTTON.REFRESH")}
                    size={16}
                    onPress={() => {
                      onRefresh();
                    }}
                  />
                </View>
                {!is_report ? (
                  <View style={{ alignSelf: "flex-start" }}>
                    <AppButton
                      icon="plus"
                      mode="contained"
                      style={{
                        display: props.isChildTable ? "none" : "flex",
                      }}
                      onPress={() => {
                        openFormView(false);
                      }}
                      label={APP._("BUTTON.NEW")}
                    />
                  </View>
                ) : (
                  <View>
                    <AppMenu
                      visible={true}
                      anchor_label={APP._("REPORT_VIEW_PAGE.BUTTON.ACTIONS")}
                      anchor_icon="dots-vertical-circle"
                      // anchor={<Button onPress={() => { this.setState({ settings_visible : !this.state.settings_visible })}}>Rest</Button>}
                    >
                      <Menu.Item
                        leadingIcon="microsoft-excel"
                        title={APP._("REPORT_VIEW_PAGE.BUTTON.EXPORT")}
                        onPress={async () => {
                          const url = await ExporterService.export_to_excel(
                            props.doctype
                          );
                          FileUtil.download_file(url);
                          setDownloadUrl(url);
                          setDownloading(true);
                          // setTimeout(()=>{
                          //   //reset downloading after 5 seconds
                          //   setDownloading(false);
                          // }, 5000);
                          console.log("Exported file: ", url);
                        }}
                      />
                      <Menu.Item
                        leadingIcon="printer-outline"
                        title={APP._("REPORT_VIEW_PAGE.BUTTON.PRINT")}
                        onPress={() => {
                          Alert.alert("Print");
                        }}
                      />
                    </AppMenu>
                    {downloading && <ViewerWeb url={download_url} />}
                  </View>
                )}
              </View>
            </View>
          </Card.Actions>
        </Card>
      )}
      {/* Data grid */}
      <DataTable>
        <DataTable.Header>
          {columns?.map((column, idx) => (
            <DataTable.Title key={column.fieldname}>
              {column.label}
            </DataTable.Title>
          ))}
        </DataTable.Header>
        {data?.map((item, idx) => (
          <DataTable.Row key={`${item.name}_${idx}`}>
            {columns?.map((column, col_idx) => {
              // if(column.fieldname === 'name'){
              let colValue = cellFormatter(item[column.fieldname]);
              let colKey = `${column.fieldname}_${item.name}`;
              if (col_idx == 0) {
                let link_label = `${colValue}`;
                return (
                  <DataTable.Cell key={`${column.fieldname}_${item.name}`}>
                    <View style={styles.id_container}>
                      <Checkbox
                        status={
                          selectedRows.includes(item.name)
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() => handleRowSelect(item)}
                      />
                      <AppHyperLink
                        label={link_label}
                        href={`views/form?doctype=${doctype}&docname=${item.name}`}
                        onPress={() => {
                          setCurrentRow(item);
                          if (props.isChildTable) {
                            // For child tables, show child table dlg
                            onAddNewRow();
                          } else {
                            openFormView(true, item);
                            // APP.route_to_path(
                            //   'views/form/', {
                            //     'doctype': doctype,
                            //     'docname': item.name
                            //   }
                            // )
                          }
                        }}
                      />
                    </View>
                  </DataTable.Cell>
                );
              }
              return (
                <DataTable.Cell key={colKey}>
                  <Text>{colValue}</Text>
                </DataTable.Cell>
              );
            })}
          </DataTable.Row>
        ))}
        {
          // For childtable, do not support pagination for now
          !props.isChildTable && (
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(count / items_per_page)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${count}`}
              numberOfItemsPerPageList={numOfItemsPerPageList}
              numberOfItemsPerPage={items_per_page}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={"" /*'Rows per page'*/}
            />
          )
        }
      </DataTable>
      {
        // <Card>
        //   <Card.Actions>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {!is_report && (
            <View>
              {selectedRows.length > 0 && (
                <AppButton
                  icon="delete-forever"
                  mode="text"
                  label={APP._("BUTTON.DELETE")}
                  style={{ display: props.isChildTable ? "flex" : "none" }}
                  onPress={() => {
                    setConfirmDelete(true);
                  }}
                />
              )}
            </View>
          )}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <View style={{ alignSelf: "flex-start" }}>
              <AppButton
                // icon="plus"
                mode="text"
                label={APP._("BUTTON.ADD_ROW")}
                style={{ display: props.isChildTable ? "flex" : "none" }}
                onPress={() => {
                  setCurrentRow(null);
                  onAddNewRow();
                }}
              />
            </View>
            {props.footer_buttons?.map((btn, idx) => {
              return (
                <View key={idx} style={{ alignSelf: "flex-start" }}>
                  <AppButton
                    label={btn.label}
                    icon={btn.icon}
                    onPress={btn.onPress}
                  />
                </View>
              );
            })}
          </View>
        </View>
        //   </Card.Actions>
        // </Card>
      }
      {confirm_delete ? (
        <Confirm
          visible={true}
          message={APP._("GLOBAL.CONFIRM_RECORD_DELETE_MESSAGE")}
          title={APP._("GLOBAL.CONFIRM_DIALOG_TITLE")}
          on_ok={() => {
            setConfirmDelete(false);
            deleteRows();
          }}
          on_cancel={() => setConfirmDelete(false)}
          onDismiss={() => setConfirmDelete(false)}
        />
      ) : null}
      {deleting ? (
        <AppMask maskText={APP._("GLOBAL.DELETE_WAIT_MESSAGE")} />
      ) : null}
      {dialog_visible ? (
        <DocDialog
          title={getChildTableTitle()}
          visible={true}
          doctype={props.doctype}
          docname={
            current_row
              ? UIUtil.isNewRecord(current_row.name)
                ? GLOBALS.NEW_RECORD_ID
                : current_row.name
              : GLOBALS.NEW_RECORD_ID
          }
          doc={current_row}
          isChildTable={props.isChildTable}
          onDismiss={() => setDialogVisible(false)}
          onInsertChildRow={(row) => {
            insertNewRow(row);
          }}
        />
      ) : null}
    </View>
  );
};

export default forwardRef(DocGrid);

const styles = StyleSheet.create({
  id_container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -15,
  },
});
