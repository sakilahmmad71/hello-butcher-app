import React, {Component} from 'react';
import {View, StyleSheet, Image, Text, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomButton from '../Components/CustomButton';
import {COLORS} from '../Utils/colors';
import {USER_TOKEN, USER_NAME} from '../Utils/Constants';
import AsyncStorage from '@react-native-community/async-storage';

export default class CustomSidebarMenu extends Component {
  constructor() {
    super();

    this.items = [
      {
        navOptionThumb: 'home',
        navOptionName: 'Home',
        screenToNavigate: 'NavScreen1',
      },
      {
        navOptionThumb: 'user',
        navOptionName: 'My Profile',
        screenToNavigate: 'MyProfile',
      },
      {
        navOptionThumb: 'first-order',
        navOptionName: 'My Orders',
        screenToNavigate: 'NavScreen3',
      },
      {
        navOptionThumb: 'lock',
        navOptionName: 'Change Password',
        screenToNavigate: 'NavScreen4',
      },
      {
        navOptionThumb: 'check-circle',
        navOptionName: 'Terms',
        screenToNavigate: 'NavScreen6',
      },
    ];

    this.state = {
        name: null,
      }
  }

  onFocusFunction = () => {
    console.log("CDM")

    AsyncStorage.getItem(USER_NAME).then((userName) => {
      console.log('Name : ' + userName);
      if (userName != null) {
        this.setState({
          name: userName
        });
      }
      //this.focusListener.remove();
    });

    AsyncStorage.getItem(USER_TOKEN).then((token) => {
      console.log('Token : ' + token);
      if (token != null) {
        this.setState({
          tokenExist: true,
        });
      }
      //this.focusListener.remove();
    });
  }

  componentDidMount() {
    console.log('Focus Added');
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }


  logout = (text) => {
    console.log("aaaa")
    Alert.alert(
      'Logout',
      'Are you sure to Logout?',
      [
        {
          text: 'Yes',
          onPress: () => {
            this.setState({ tokenExist: false, name: null })
            AsyncStorage.removeItem(USER_NAME);
            AsyncStorage.removeItem(USER_TOKEN);
          }
        },
        { text: 'No', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    );
  };

  state = {
    tokenExist: false,
  };

  render() {
    return (
      <View style={styles.sideMenuContainer}>
        {/*Top Large Image */}
        <Image
          source={require('../Assets/logo.png')}
          style={styles.sideMenuProfileIcon}
        />
        {this.state.name != null ?
        <Text style={{fontWeight: 'bold'}}>Welcome {this.state.name}</Text>
        :
        null
        }
        
        {/*Setting up Navigation Options from option array using loop*/}
        <View style={{width: '100%', marginTop: 50}}>
          {this.items.map((item, key) => (
            <View key={key}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 12,
                  paddingLeft: 32,
                  alignSelf: 'flex-start',
                }}>
                <View style={{marginRight: 10}}>
                  <Icon
                    name={item.navOptionThumb}
                    size={20}
                    color={COLORS.theme}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight : global.currentScreenIndex === key ? 'bold' : 'normal',
                    color: global.currentScreenIndex === key ? 'black' : COLORS.theme,
                  }}
                  onPress={() => {
                    global.currentScreenIndex = key;
                    this.props.navigation.navigate(item.screenToNavigate);
                  }}>
                  {item.navOptionName}
                </Text>
              </View>

              <View
                style={{
                  width: '90%',
                  height: 1,
                  backgroundColor: COLORS.theme,
                  marginTop: 10,
                  marginLeft: '10%',
                }}
              />
            </View>
          ))}
        </View>

        {this.state.tokenExist ? (
          <CustomButton
            text="LOG OUT"
            buttonWidthPercentage="80%"
            marginTop={120}
            marginBottom={20}
            onPress={this.logout}
          />
        ) : (
          <CustomButton
            text="LOG IN"
            buttonWidthPercentage="80%"
            marginTop={120}
            marginBottom={20}
            onPress={() => {
              this.setState({ tokenExist: false })
              this.props.navigation.navigate('Login');
            }}
          />
        )}

        <Text>Powered By Hello Butcher</Text>
        <Text>Developed By SmartMux Limited</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 150,
    height: 150,
    marginTop: 64,
  },
});
