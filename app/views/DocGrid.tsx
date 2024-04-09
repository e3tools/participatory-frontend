import { Alert, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Card, Checkbox, DataTable, List, Menu, Title } from 'react-native-paper' 
import HyperLink from '../components/shared/HyperLink'
import { APP } from '@/app/utils/app'
import { GLOBALS } from '@/app/constants/defaults'
import { IDBReadParam } from '@/app/interfaces/database'
import { DocTypeService } from '@/app/services/doctype'
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router'
import { AppIconButton } from '../components/shared/AppIconButton'
import { AppButton } from '../components/shared/AppButton'
import AppMask from '../components/shared/AppMask'
import { Confirm } from '../components/shared/Dialog'
import { DOCTYPES } from '@/app/constants/enums'
import DocDialog from '@/app/views/DocDialog'
import { reset_form_store, update_field_store_value } from '@/app/ui/utils/state'
import { UIUtil } from '@/app/utils/ui'
import { AppMenu } from '@/app/common/components/Menu';
import { ExporterService } from '@/app/services/exporter'
import ViewerWeb from '../components/shared/ViewerWeb'
import { FileUtil } from '@/app/utils/file'
import { IGridProps } from '@/app/interfaces/common'

const DocGrid = (props: IGridProps, ref ) => {
  //const { columns, data, doctype, ...rest } = props; 
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { doctype, is_report } = props; 

  const [page, set_page] = React.useState<number>(0); 
  const [num_of_items_per_page_list] = React.useState(GLOBALS.LISTVIEW_PAGE_SIZES);// [5, 10, 20]);
  const [items_per_page, on_items_per_page_change] = React.useState(num_of_items_per_page_list[0]);
  const [data, set_data] = React.useState(props.value || []);
  const [count, set_count] = React.useState(0);
  const [selected_rows, set_selected_rows] = React.useState([]);
  const [columns, set_columns] = useState([]);
  const [deleting, set_deleting] = React.useState(false);
  const [confirm_delete, set_confirm_delete] = React.useState(false); 
  const [dialog_visible, set_dialog_visible] = React.useState(false);
  const [current_row, set_current_row] = React.useState(null);
  const [downloading, set_downloading] = useState(false);
  const [download_url, set_download_url] = useState('');

  const db = new DocTypeService(doctype);  

  useImperativeHandle(ref, ()=>{
    get_rows: () => get_rows()
  }, []);

  const get_read_db_cfg = () : IDBReadParam => {
    let config = {} as IDBReadParam
    config.doctype = props.doctype;
    config.fields = columns?.map(a => a.fieldname);
    let query = {};
    if(props.is_child_table && props.parenttype && props.parentfield){
      query['parenttype'] = props.parenttype;
      query['parent'] = props.parent;
      query['parentfield'] = props.parentfield;
    }
    config.filters = APP.make_filters(query)
    config.order_by = GLOBALS.LISTVIEW_SORT_FIELD; 
  
    // update total rows count. Get the count from backend
    //If "All" (0) is selected, get all rows
    if(items_per_page === 0){
      config.limit_start = 0;
      config.limit_page_length = 0;
    }
    else {       
      config.limit_start = Math.max(0, (page) * items_per_page);
      config.limit_page_length = items_per_page;
    }
    return config;
  } 

  const get_columns = async () => { 
    let cols = [{
      'name': 'name',
      'fieldname': 'name',
      'label': APP._('ID'),
      align: 'left',
      field: 'name',
      sortable: true,
      // format: (val, row) => {
      //   return `<b>${val} </b>`;// '<a href=#>`${val}`</a>'
      // }
    }];

    if(props.is_child_table){
      // If is childtable, hide ID field
      cols = [];
    }
    const form_def = await db.get_doctype();
    if(form_def) {
      let visible_cols = form_def.fields.filter(item => item.in_list_view === 1);
      //show max of 5 columns
      for(let i=0; i<(Math.min(GLOBALS.MAX_GRID_COLUMNS, visible_cols.length)); i++){
        let col = visible_cols[i];
        cols.push({
          name: col.fieldname,
          fieldname: col.fieldname,
          label: col.label,// APP._(col.label),
          align: 'left',
          field: col.fieldname,
          sortable: true,
        });
      }
    }
    // set_fields(fielda => doc_fields);//setResult(result => [...result, response]);
    set_columns(columns => cols);   
  }

  /**
   * Load data
   */
  const load_data = async () => {
    if(!props.is_child_table){
      // get data from server 
      const config = get_read_db_cfg();
      const [recs, total_count] = await db.get_list(config, true); 
      set_data(data => recs);
      set_count(count => total_count);
    }
    else { 
      let recs = props.parentdoc?.__islocal ? [] : props.parentdoc?.[props.parentfield];
      recs = recs || props.value; //If there are existing rows, show them
      set_data(data => recs);
    }
  }

  /**
   * Handle row selection
   * @param row_id 
   */
  const handle_row_select = (row: string) => { 
    // Toggle selection for a specific row
    if (selected_rows.includes(row.name)) {
      const cellId = selected_rows.filter((id) => id !== row.name);
      set_selected_rows(cellId);
      props.on_row_select?.(row);
    } else {
      set_selected_rows([...selected_rows, row.name]); 
      props.on_row_select?.(row);
    }
  };

  /**
   * Delete selected rows
   */
  const delete_rows = async () => { 
    if(selected_rows.length <= 0) {
      return;
    }
    if(props.is_child_table) {
      //remove items from the grid without deleting in the db
      let rows = data ? [...data] : [];
      let left = rows.filter(el => !selected_rows.includes(el.name));
      set_data(left); 
      set_selected_rows([]);
    } else {
      //delete items from the db and reload grid
      set_deleting(true);
      setTimeout(() => {      
      }, 1000);
      for(let i=0; i < selected_rows.length; i++) {
        await db.delete_doc(selected_rows[i]);
      }
      set_deleting(false);
      load_data();
    }
  }

  const on_refresh = () => {
    set_selected_rows([]);
    set_page(0);
  }

  const open_form_view = (is_editing: boolean, row = null) => { 
    // reset_form_store(props.doctype); // reset form state    
    if(doctype != DOCTYPES.ENGAGEMENT_ENTRY){ 
      APP.navigate_to_path(navigation, 'views/form/index', {
          'doctype': doctype,
          'docname': is_editing ? row.name : GLOBALS.NEW_RECORD_ID
        }
      );
      // APP.route_to_path(
      //   'views/form', {
      //     'doctype': doctype,
      //     'docname': is_editing ? row.name : GLOBALS.NEW_RECORD_ID
      //   }
      // );
      // return `/form/${props.doctype}/new`
    }
    else {
      const curr_engagement = params.engagement;
      APP.navigate_to_path(navigation, 'views/form/MultiStepForm', {
          'engagement': curr_engagement,
          'entry': is_editing ? row.name : GLOBALS.NEW_RECORD_ID
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
  } 

  const on_add_new_row = () => { 
    set_dialog_visible(true); 
  }

  /**
   * Add a new row to grid
   * @param row 
   */
  const insert_new_row = (row) => {      
    let rows = data ? [...data] : []; 
    if(current_row){
      const idx = rows.findIndex((el, indx) => el == current_row);
      console.log("Curr index: ", idx);
      rows[idx] = row; 
    } else {
      row['name'] = `${GLOBALS.NEW_RECORD_ID}-${APP.generate_random_string(6)}`;      
      row['docname'] = row['name']
      rows = [...rows, row];
    }
    rows = reset_row_indices(rows); 
    set_data(rows);
    set_current_row(null);
    set_dialog_visible(false);
    // update_field_store_value(props.doctype, props.field_name, rows);

    // set_data((current_data) => { 
    //     current_data = current_data || [];
    //     if(current_row){
    //       const idx = current_data.findIndex((el, indx) => el == current_row);
    //       console.log("Curr index: ", idx);
    //       current_data[idx] = row;
    //       return current_data;
    //     }
    //     return [...current_data, row];
    //   });     
  }

  /**
   * Reset child row index
   */
  const reset_row_indices = (rows: Array<object>) => { 
    rows.map((el, idx) => {
      el['idx'] = idx + 1;
    })
    return rows;
  }
  /**
   * Get grid rows
   * @returns 
   */
  const get_rows = () => {
    return data;
  }

  /**
   * Get title to display on child table dialog
   */
  const get_child_table_title = () => {
    let count = data?.length || 0;  
    let row_idx = current_row ? current_row.idx : count + 1; 
    let title = `${APP._('CHILD_TABLE.EDITING_ROW')} ${row_idx}`;  
    return title;
  }

  const from = page * items_per_page;
  const to = Math.min((page + 1) * items_per_page, count);

  React.useEffect(() => {
    get_columns();
  }, []); 

  React.useEffect(() => { 
    props.on_change?.(data); // update_field_store_value will be called from here
  }, [data]);

  React.useEffect(() => {
    if(columns){
      load_data();
    }
  }, [items_per_page, columns, page])
 
  React.useEffect(() => {  
    get_columns().then(() => {});
  }, []); 
  
  React.useEffect(() => {
    if(columns){
      load_data();
    }
  }, [page]);

  useFocusEffect(() => {
    // console.log("focused list")
    // set_page(0); //set to page 0 to trigger reload. do not do this otherwise only page will show
  });
   
  return (
    <View style={props.style}>
      {
        props.label && <Title>{props.label}</Title>
      }
      <Card>
        <Card.Actions>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              {
                !is_report && (selected_rows.length > 0) && ( 
                  <AppButton
                    icon="delete-forever"
                    mode="outlined"
                    label={APP._('BUTTON.DELETE')}
                    style={{ marginTop: 0, display: props.is_child_table ? 'none' : 'flex' }}
                    on_press={() => {
                      set_confirm_delete(true); 
                    }}
                  />
                )
              }
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <View style={{ alignSelf: 'flex-end' }}>
                <AppIconButton
                  icon="refresh"
                  mode='contained-tonal'
                  style={{ marginTop: 0, display: props.is_child_table ? 'none' : 'flex' }}
                  tooltip={APP._('BUTTON.REFRESH')}
                  size={16}
                  on_press={()=> {  
                    on_refresh(); 
                  }} 
                /> 
              </View>
              {
                !is_report ? <View style={{ alignSelf: 'flex-start' }}>
                  <AppButton
                    icon="plus"
                    mode='contained'
                    style={{ display: props.is_child_table ? 'none' : 'flex' }}
                    on_press={()=> { 
                        open_form_view(false); 
                      }}
                    label={APP._('BUTTON.NEW')}
                  /> 
                </View> : <View>
                            <AppMenu
                                  visible={true}                                  
                                  anchor_label={APP._('REPORT_VIEW_PAGE.BUTTON.ACTIONS')} 
                                  anchor_icon='dots-vertical-circle'
                                  // anchor={<Button onPress={() => { this.setState({ settings_visible : !this.state.settings_visible })}}>Rest</Button>}
                              >
                                <Menu.Item leadingIcon="microsoft-excel" title={APP._('REPORT_VIEW_PAGE.BUTTON.EXPORT')} onPress={async () => {
                                  const url = await ExporterService.export_to_excel(props.doctype);
                                  FileUtil.download_file(url);
                                  set_download_url(url);
                                  set_downloading(true);
                                   // setTimeout(()=>{
                                  //   //reset downloading after 5 seconds
                                  //   set_downloading(false);
                                  // }, 5000);
                                  console.log("Exported file: ", url)
                                }} />
                                <Menu.Item leadingIcon="printer-outline" title={APP._('REPORT_VIEW_PAGE.BUTTON.PRINT')} onPress={() => {
                                   Alert.alert("Print")
                                }} /> 
                              </AppMenu>    
                              {
                                  downloading && <ViewerWeb url={download_url} />
                              }
                          </View>
              }
            </View>
          </View>  
        </Card.Actions>
      </Card>
      {/* Data grid */}
      <DataTable>
          <DataTable.Header>
            {       
              columns?.map((column, idx) => (
                <DataTable.Title key={column.fieldname}>
                  {column.label}
                </DataTable.Title>
              ))
            }
          </DataTable.Header>
          {
            data?.map((item, idx) => (
              <DataTable.Row key={`${item.name}_${idx}`}>
                {
                  columns?.map((column, col_idx) => { 
                    // if(column.fieldname === 'name'){
                    if(col_idx == 0){
                      return (
                        <DataTable.Cell key={`${column.fieldname}_${item.name}`} >
                          <View style={styles.id_container}>
                            <Checkbox
                              status={selected_rows.includes(item.name) ? 'checked' : 'unchecked'}
                              onPress={() => handle_row_select(item)}
                            /> 
                            <HyperLink
                              label={item[column.fieldname]}
                              href={`views/form?doctype=${doctype}&docname=${item.name}`}
                              on_press={()=> {
                                  set_current_row(item);
                                  if(props.is_child_table){
                                    // For child tables, show child table dlg
                                    console.log("Child table row clicked")
                                    on_add_new_row();
                                  } else {
                                    open_form_view(true, item); 
                                    // APP.route_to_path(
                                    //   'views/form/', {
                                    //     'doctype': doctype, 
                                    //     'docname': item.name
                                    //   }
                                    // )
                                  }
                                }
                              }
                            />
                          </View>
                        </DataTable.Cell>
                      )
                    }
                    return ( 
                      <DataTable.Cell key={`${column.fieldname}_${item.name}`}>{item[column.fieldname]}</DataTable.Cell>
                    )
                  })
                } 
              </DataTable.Row>
            ))
          }
          {
            // For childtable, do not support pagination for now
            !props.is_child_table && <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(count / items_per_page)}
              onPageChange={(page) => set_page(page)}
              label={`${from + 1}-${to} of ${count}`}
              numberOfItemsPerPageList={num_of_items_per_page_list}
              numberOfItemsPerPage={items_per_page}
              onItemsPerPageChange={on_items_per_page_change}
              showFastPaginationControls
              selectPageDropdownLabel={''/*'Rows per page'*/}
            />
          }
      </DataTable>
      {
        <Card>
          <Card.Actions>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              {
                !is_report &&
                <View>
                { 
                  (selected_rows.length > 0) && ( 
                    <AppButton
                      icon="delete-forever"
                      mode="outlined"
                      label={APP._('BUTTON.DELETE')}
                      style={{ display: props.is_child_table ? 'flex' : 'none' }}
                      on_press={() => {
                        set_confirm_delete(true); 
                      }}
                    />
                  )
                }
              </View>
              }
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' }}>               
                <View style={{ alignSelf: 'flex-start' }}>
                  <AppButton
                    // icon="plus"
                    mode='text'
                    label={APP._('BUTTON.ADD_ROW')}
                    style={{ display: props.is_child_table ? 'flex' : 'none' }}
                    on_press={()=> { 
                      set_current_row(null);
                      on_add_new_row(); 
                    }}
                  /> 
                </View>
                {
                  props.footer_buttons?.map((btn, idx) => {
                    return (
                    <View key={idx} style={{ alignSelf: 'flex-start' }}>
                      <AppButton
                        label={btn.label}
                        icon={btn.icon}
                        on_press={btn.on_press}
                      />
                      </View>
                    )
                  })
                }
              </View>
            </View>  
          </Card.Actions>
        </Card> 
      }
      {
        confirm_delete ? (<Confirm
          visible={true}
          message={APP._('GLOBAL.CONFIRM_RECORD_DELETE_MESSAGE')}
          title={APP._('GLOBAL.CONFIRM_DIALOG_TITLE')}
          on_ok={()=>{set_confirm_delete(false); delete_rows()}}
          on_cancel={()=> set_confirm_delete(false)}
          on_dismiss={()=> set_confirm_delete(false)}
        />) : null
      }
      {
        deleting ? (<AppMask mask_text={APP._('GLOBAL.DELETE_WAIT_MESSAGE')} />) : null
      }
      {
        dialog_visible ? (<DocDialog 
                            title={get_child_table_title()}
                            visible={true}
                            doctype={props.doctype} 
                            docname={current_row ? (UIUtil.is_new_record(current_row.name) ? GLOBALS.NEW_RECORD_ID : current_row.name) : GLOBALS.NEW_RECORD_ID }
                            doc={current_row}
                            is_child_table={props.is_child_table}
                            on_dismiss={()=>set_dialog_visible(false)}
                            insert_child_row={(row)=> { 
                              insert_new_row(row);
                            }}
                          />
                        ) : null
      }
    </View>
  )
}

export default forwardRef(DocGrid);

const styles = StyleSheet.create({
  id_container: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: -15,    
  },
});