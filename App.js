import React, { useEffect } from 'react';
import { Alert, SafeAreaView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux' // Import Provider for provide our store to UI

import GettingStartedScreen from './src/Screens/GettingStartedScreen';
import LoginScreen from './src/Screens/authentication/LoginScreen'
import RegistrationScreen from './src/Screens/authentication/RegistrationScreen';
import ForgotPasswordScreen from './src/Screens/authentication/ForgotPasswordScreen';
import ChangePasswordScreen from './src/Screens/authentication/ChangePasswordScreen';
import PhoneInputScreen from './src/Screens/authentication/PhoneInputScreen';
import PhoneVarificationScreen from './src/Screens/authentication/PhoneVarificationScreen';
import HomeScreen from './src/Screens/HomeScreen';
import WishListScreen from './src/Screens/WishListScreen';
import MyOrdersScreen from './src/Screens/MyOrdersScreen';
import MyOrdersProductsScreen from './src/Screens/MyOrdersProductsScreen'
import MyProfileScreen from './src/Screens/authentication/MyProfileScreen'
import CartScreen from './src/Screens/CartScreen';
import PlaceOrderScreen from './src/Screens/PlaceOrderScreen';
import NotificationListScreen from './src/Screens/NotificationListScreen';
import CustomDrawer from './src/Screens/CustomDrawer';
import ProductDetailsScreen from './src/Screens/ProductDetailsScreen';
import ProductListItemScreen from './src/Screens/ProductListItemScreen';
import CheckoutScreen from './src/Screens/CheckoutScreen'
import AddressInputScreen from './src/Screens/authentication/AddressInputScreen'
import NewLoginScreen from './src/Screens/LogInScreenTypeTwo'
import Toast from 'react-native-toast-message';
import LoadingPlaceholderScreen from './src/Screens/LoadingPlaceholderScreen'

import messaging from '@react-native-firebase/messaging';

import store from './src/Redux/store' // Import redux and redux persist store
// import { PersistGate } from 'redux-persist/es/integration/react'

const navigator = createStackNavigator(
    {
        GettingStarted: GettingStartedScreen,
        Login: LoginScreen,
        Registration: RegistrationScreen,
        MyProfile: MyProfileScreen,
        ForgotPassword: ForgotPasswordScreen,
        ChangePassword: ChangePasswordScreen,
        PhoneInput: PhoneInputScreen,
        PhoneVarification: PhoneVarificationScreen,
        Home: HomeScreen,
        WishList: WishListScreen,
        MyOrders: MyOrdersScreen,
        Cart: CartScreen,
        NotificationList: NotificationListScreen,
        CD: CustomDrawer,
        ProductDetails: ProductDetailsScreen,
        ProductListItem: ProductListItemScreen,
        PlaceOrder: PlaceOrderScreen,
        Checkout: CheckoutScreen,
        NewLogin: NewLoginScreen,
        LoadingPlaceholder: LoadingPlaceholderScreen,
        AddressInput: AddressInputScreen,
        MyOrdersProducts: MyOrdersProductsScreen
    },
    {
        initialRouteName: 'CD',
        defaultNavigationOptions: {
            headerShown: false,
        },
    }
);

const Mycontainer = createAppContainer(navigator);

export default function App(props) {

    useEffect(() => {
        requestUserPermission();
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });

        return unsubscribe;
    }, []);

    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Provider store={store}>
                <Mycontainer />
                <Toast ref={(ref) => Toast.setRef(ref)} />
            </Provider>
        </SafeAreaView>
    );
}
// <PersistGate loading={null} persistor={persistor}>
{/* </PersistGate> */ }