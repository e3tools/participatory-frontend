// const get_api_endpoint = (url) => {
//   let backend = 'http://127.0.0.1:8003/api/method';
//   return `${backend}/${url}`;
// };

// export { get_api_endpoint };

/**
 *  Make request
 * @param url URL to make request to
 * @param method either GET/PUT/DELETE/POST
 * @param body JSON object
 * @param data_property Property of the response that contains data from server
 * @returns
 */
const doRequest = async (
  url: string,
  method = 'POST',
  body: object = {},
  headers: object = {},
  data_property = 'data'
) => {
  try {
    const payload = {
      method,
      headers: headers,
    };
    if (method != 'GET' && body) {
      payload['body'] = JSON.stringify(body);
    }
    const res = await fetch(url, payload)/*.catch((error) => {
      console.log('Fetch error:', error.message);
    });*/
    if (!res.ok) {
      const message = `An error has occured: ${res.status}`;
      throw new Error(message);
    }
    return await handleResponse(res, data_property);
  } catch (error) {
    debugger;
    console.log(error);
  }
};

/**
 * Handle response
 * @param res Response object
 * @param data_property Property of the response that contains data from server
 * @returns
 */
const handleResponse = async (res: object, data_property: string) => {
  if (res.status == 200) {
    const data = await res.json();
    return await { status_code: res.status, data: data[data_property] };
  } else if (res.status == 404) {
    return { status_code: res.status, text: res.statusText };
  }
};

export { doRequest };
