
Integrating Frappe oAuth
========================

- Conventional login using username and password will not work well when Frappe is the backend. This is because this authentication flow will be based on sessions and cookies which are extremely difficult to implement for a mobile app
- To circumvent this, we will set up our mobile application such that it authenticates the users. To achieve this, we make use of the oAuthClient doctype in Frappe

Mobile app pre-requisite setup
------------------------------

- In the app.json, take note of the value of "package" both for Android and IOS sections. The value of this will be used to provide a custom scheme to ensure deep-linking (universal links) of the app. In later part of this document, we will call this **SCHEME**
- Take note of the url generated when you run **npx expo** command in the terminal. Usually this is of the form *exp://192.168.100.26:8081* in Android and *exp://192.168.100.26:19000* for IOS. Change the IP addresses accordingly. In later part of this document we will refer to this as the **MOBILE_APP_LINK**
- Set .env variables accordingly such as:


OAuth setup in Frappe backend
-----------------------------
- Open the Frappe backend site and open OAuth Client interface
- Add OAuth Client and specify the following values as the example shown below:

.. image:: oAuth.png
  :width: 400
  :alt: OAuth Client


- Specify the following environment variables

.. code-block:: python

    # Frappe backend url
    EXPO_PUBLIC_BACKEND_URL={Frappe backend url}
    # Frappe OAuthClient client_id
    EXPO_PUBLIC_CLIENT_ID={client_id} # generated when creating OAuth Client in Frappe backend
    # Frappe OAuthClient client_secret
    EXPO_PUBLIC_CLIENT_SECRET={client_secret} # generated when creating OAuth Client in Frappe backend
    # must match the "scheme" property in the app.json. This is the SCHEME
    EXPO_PUBLIC_REDIRECT_URL_SCHEME={SCHEME}
