import React from 'react';
import {
  View
} from 'react-native';
import { Badge } from 'react-native-elements';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'
import TabBar from 'react-native-custom-navigation-tabs'
import GettingStartedScreen from './GettingStartedScreen';
import CartScreen from './CartScreen';
import WishListScreen from './WishListScreen';
import { COLORS } from '../Utils/colors';
import NotificationListScreen from './NotificationListScreen';
import { BadgeUtil } from '../Database/DatabaseManager'
import AsyncStorage from '@react-native-community/async-storage';
import { USER_WISH, USER_CART } from '../Utils/Constants';

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: GettingStartedScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon size={22} name="home" style={{ color: tintColor }} />
      }
    },
    Wish: {
      screen: WishListScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <View><Icon size={22} name="heart" style={{ color: tintColor }} />
          {/* {
            ( () => {

              AsyncStorage.getItem(USER_WISH).then((value) => {
                if (value != null) {
                  return (
                    <Badge
                      status="primary"
                      value={value}
                      containerStyle={{ position: 'absolute', top: -10, right: -10 }} />
                  )
                } else {
                  return (
                    <Badge
                      status="primary"
                      value="0"
                      containerStyle={{ position: 'absolute', top: -10, right: -10 }} />
                  )
                }
              });
            })()
          } */}
        </View>
      }
    },
    Cart: {
      screen: CartScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <View><Icon size={22} name="shopping-cart" style={{ color: tintColor }} /><Badge
          status="error"
          value={parseInt(BadgeUtil.cartLength())}
          containerStyle={{ position: 'absolute', top: -10, right: -10 }}
        /></View>
      }
    },
    Notification: {
      screen: NotificationListScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon size={22} name="bell" style={{ color: tintColor }} />
      }
    },
  },
  {
    tabBarComponent: TabBar,
    tabBarOptions: {
      activeTintColor: COLORS.theme,
      inactiveTintColor: COLORS.darkGray,
      tabBarBackgroundColor: COLORS.white,
      tabBarHeight: 70,
      tabBarType: 'bubbleTab',//dark
      numOfTabs: 4,
    },
    defaultNavigationOptions: {
      headerShown: true,
      headerTransparent: true,
    },
  }
);

const HomeScreen = createAppContainer(TabNavigator)

export default HomeScreen;
