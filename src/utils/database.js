import axios from 'axios'; // 'src/boot/axios';
import { get_api_endpoint } from './api';

interface DBReadParam {
  filters: Array<[]>;
  or_filters: Array<[]>;
  fields: Array<string>;
  order_by: string;
  limit_start: number;
  limit_page_length: number;
}

// const getList = async (
//   doctype,
//   filters,
//   fields,
//   group_by = null,
//   order_by = 'name',
//   limit_start = 0,
//   limit_page_length = null,
//   as_dict = true
// ) => {
//   let url = get_api_endpoint('frappe.client.get_list');

//   const resp = await _makeRequest(
//     // const { data, error } = _makeRequest(
//     url,
//     {
//       doctype,
//       filters,
//       fields,
//       group_by,
//       order_by,
//       limit_start,
//       limit_page_length,
//       //parent,
//       //debug: (bool = False),
//       as_dict,
//       or_filters: null,
//     },
//     //(callback = () => {}),
//     null,
//     'GET'
//     // (r) => {
//     //   frappe.model.sync(r.message);
//     //   resolve(r.message);
//     // }
//   );
//   let data = resp.json();

//   return { data, error };
//   //         args: {
//   //           doctype: "Data Import Log",
//   //           filters: {
//   //             data_import: frm.doc.name,
//   //           },
//   //           fields: ["success", "docname", "messages", "exception", "row_indexes"],
//   //           limit_page_length: 5000,
//   //           order_by: "log_index",
//   //         },

//   // method: "frappe.client.get",
//   // 				type: "GET",
//   // 				args: { doctype, name, filters },
//   // 				callback: (r) => {
//   // 					frappe.model.sync(r.message);
//   // 					resolve(r.message);
//   // 				},
// };

// const _makeRequest = async (url, args, callback, type) => {
//   // const getResponse = await axios({
//   //   method: type.toLowerCase(),
//   //   url: url,
//   //   timeout: 4000, //4 secs timeout
//   //   data: args,
//   // });

//   const getResponse = await axios.post(url, args).then(
//     (response) => {
//       console.log(response);
//     },
//     (error) => {
//       console.log(error);
//     }
//   );

//   // .then((response) => {
//   //   //handle response
//   //   return response;
//   // })
//   // .catch((error) => {
//   //   console.error(`Error=${error}`);
//   // });
//   return getResponse;
// };
// //   // if(type == "GET"){
// //   //   axios.get(url)
// //   //     .then(response => {
// //   //       console.log(response.data)
// //   //     }, error => {
// //   //       console.log(error)
// //   //     })
// //   // } else if(type == "POST") {

// //   // }
// // }

// const _makeRequest_fetch = async (url, args, callback, type) => {
//   let data = null;
//   let error = error;
//   try {
//     let res = await fetch(url);
//     if (!res.ok) {
//       throw Error('No data available');
//     }
//     data = await res.json();
//   } catch (err) {
//     console.log(err.message);
//     error = err.message;
//   }
//   return { data, error };
// };

export { DBReadParam };
