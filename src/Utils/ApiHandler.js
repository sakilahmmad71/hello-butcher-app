import {Platform} from 'react-native';
import fetch from './FetchWithTimeOut';

let SERVER_ADDRESS = 'http://198.13.36.60:4000/api/';

const ApiHandler = {
  //======================== USER LOGIN ===========================//
  loginUser: async (email, password) => {
    console.log('loginUser >>>>>>>>>>>>>>>>>>>>>>>');
    try {
      const response = await fetch(`${SERVER_ADDRESS}v1/users/login`, {
        method: 'POST',
        body: JSON.stringify({email: email, password: password}),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const responseJson = response.json();
      return responseJson;
    } catch (error) {
      console.error('Response Error : ' + error);
    }
  },

  //======================== DEVICE REGISTRATION ===========================//
  registerUserDevice: async (
    platform,
    appVersion,
    brand,
    udid,
    pushId,
    accessToken,
  ) => {
    console.log('registerUserDevice >>>>>>>>>>>>>>>>>>>>>>>');
    try {
      const response = await fetch(
        `${SERVER_ADDRESS}v1/devices/register-device`,
        {
          method: 'POST',
          body: JSON.stringify({
            platform: platform,
            appVersion: appVersion,
            brand: brand,
            udid: udid,
            pushid: pushId,
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: accessToken,
          },
        },
      );
      const responseJson = response.json();
      console.log(responseJson);
      return responseJson;
    } catch (error) {
      console.error('Response Error : ' + error);
    }
  },

  //======================== GET MY PROFILE ===========================//
  getMyProfile: async (accessToken) => {
    try {
      const response = await fetch(`${SERVER_ADDRESS}v1/users/get-profile`, {
        method: 'GET',
        headers: new Headers({Authorization: accessToken}),
      });
      const responseJson = response.json();
      return responseJson;
    } catch (error) {
      console.error('Response Error : ' + error);
    }
  },

  //======================== UPDATE PROFILE ===========================//
  updateMyProfile: async (name, email, phone, accessToken) => {
    try {
      const response = await fetch(`${SERVER_ADDRESS}v1/users/update-profile`, {
        method: 'POST',
        body: JSON.stringify({name: name, email: email, phone: phone}),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
      });
      const responseJson = response.json();
      console.log('Response Error1 : ' + responseJson);
      return responseJson;
    } catch (error) {
      console.log('Response Error2 : ' + error);
    }
  },

  registerUserApi: (name, email, phone, password) => {
    console.log('registerUserApi >>>>>>>>>>>>>>>>>>>>>>>');
    return fetch(`${SERVER_ADDRESS}v1/users/register`, {
      method: 'POST',
      body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(
        email,
      )}&phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(
        password,
      )}`,
      headers: new Headers({
        'Content-type': 'application/x-www-form-urlencoded',
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error('Response Error : ' + error);
      });
  },

  //======================== CHANGE PASSWORD ===========================//
  changePasswordApi: async (accessToken, oldPassword, newPassword) => {
    console.log('changePasswordApi >>>>>>>>>>>>>>>>>>>>>>>');
    try {
      const response = await fetch(
        `${SERVER_ADDRESS}v1/users/change-password`,
        {
          method: 'POST',
          body: JSON.stringify({
            password: oldPassword,
            newPassword: newPassword,
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: accessToken,
          },
        },
      );
      const responseJson = response.json();
      return responseJson;
    } catch (error) {
      console.error('Response Error : ' + error);
    }
  },

  forgotPasswordApi: (token, email) => {
    return fetch(`${SERVER_ADDRESS}v1/users/forgot-password`, {
      method: 'POST',
      headers: new Headers({
        'Content-type': 'application/x-www-form-urlencoded',
        'access-token': token,
      }),
      body: `email=${encodeURIComponent(email)}`,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error('Response Error : ' + error);
      });
  },
  //===============================END_USER===============================//

  //===============================PRODUCTS===============================//
  getAllProductsByCategoryApi: (id) => {
    return fetch(`${SERVER_ADDRESS}v1/products/product/${id}`, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/x-www-form-urlencoded',
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error('Response Error : ' + error);
      });
  },

  getAllProductsApi: () => {
    return fetch(`${SERVER_ADDRESS}v1/products/product`, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/x-www-form-urlencoded',
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error('Response Error : ' + error);
      });
  },

  //===============================END_PRODUCTS===============================//

  getAllNotificationsApi: () => {
    return fetch(`${SERVER_ADDRESS}v1/notifications`, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/x-www-form-urlencoded',
        platform: Platform.OS,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error('Response Error : ' + error);
      });
  },

  //===============================START_ADDRESS===============================//

  getAddressList: (accessToken) => {
    //console.error("getMyProfile Request : " + accessToken);
    return fetch(`${SERVER_ADDRESS}v1/get-address-list`, {
      method: 'GET',
      headers: new Headers({Authorization: accessToken}),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error('Response Error : ' + error);
      });
  },

  // "houseNo" : "32",
  //       "apartmentName" : "Gazipur",
  //       "streetName" : "Norda",
  //       "city" : "Dhaka",
  //       "postcodePrefix" : "DK",
  //       "postcodeSuffix"  : "1220"

  addNewAddress: (
    accessToken,
    houseNo,
    apartmentName,
    streetName,
    city,
    postcodePrefix,
    postcodeSuffix,
  ) => {
    return fetch(`${SERVER_ADDRESS}v1/add-address`, {
      method: 'POST',
      body: JSON.stringify({
        houseNo: houseNo,
        apartmentName: apartmentName,
        streetName: streetName,
        city: city,
        postcodePrefix: postcodePrefix,
        postcodeSuffix: postcodeSuffix
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error('Response Error : ' + error);
      });
  },

  //===============================END_ADDRESS===============================//

  //===============================START_ADDRESS===============================//

  addNewOrder: (accessToken, address, orders, shippingCost, subTotal) => {
    console.log(JSON.stringify({
      address: address,
      orders: orders,
      shippingCost: shippingCost,
      subTotal: subTotal
    }));
    return fetch(`${SERVER_ADDRESS}v1/orders/add-order`, {
      method: 'POST',
      body: JSON.stringify({
        address: address,
        products: orders,
        shippingCost: shippingCost,
        subTotal: subTotal
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error('Response Error : ' + error);
      });
  },

  getAllOrders: (accessToken) => {

    return fetch(`${SERVER_ADDRESS}v1/orders/get-order`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error('Response Error : ' + error);
      });
  },

  //===============================END_ADDRESS===============================//
};

export default ApiHandler;
