import React, {Component} from 'react'
import {Text, View, Image} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import {SafeAreaView} from 'react-native-safe-area-context'
import {createAppContainer, createNavigationContainer} from 'react-navigation'
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer'
import HomeScreen from './HomeScreen'
import Registraion from './authentication/RegistrationScreen';
import MyOrders from './MyOrdersScreen';
import ChangePassword from './authentication/ChangePasswordScreen';
import CustomSidebarMenu from './CustomSidebarMenu';
import Terms from './Terms'

const CustomDrawer = createDrawerNavigator({

    NavScreen1: {
        screen: HomeScreen,
        navigationOptions: {
            drawerLabel: 'Home'
        }
    },
    NavScreen2: {
        screen: Registraion,
        navigationOptions: {
            drawerLabel: 'Registraion'
        }
    },
    NavScreen3: {
        screen: MyOrders,
        navigationOptions: {
            drawerLabel: 'My Orders'
        }
    },
    NavScreen4: {
        screen: ChangePassword,
        navigationOptions: {
            drawerLabel: 'Change Password'
        }
    },
    NavScreen5: {
        screen: ChangePassword,
        navigationOptions: {
            drawerLabel: 'Login'
        }
    },
    NavScreen6: {
        screen: Terms,
        navigationOptions: {
            drawerLabel: 'Terms'
        }
    }

}, {contentComponent: CustomSidebarMenu})
// const CustomDrawer = createAppContainer(AppDrawerNavigator)

export default CustomDrawer
