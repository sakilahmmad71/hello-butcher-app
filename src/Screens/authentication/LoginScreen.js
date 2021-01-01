import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../../Utils/colors';
import CustomButton from '../../Components/CustomButton';
import CustomTextInput from '../../Components/CustomTextInput';
import messaging from '@react-native-firebase/messaging';
import ApiHandler from '../../Utils/ApiHandler';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-community/async-storage';
import {USER_TOKEN, USER_NAME} from '../../Utils/Constants'
import DeviceInfo from 'react-native-device-info';

export default class App extends React.Component {
  state = {
    email: 'sumancsc@gmail.com',
    password: '12345678',
    token: '',
  };

  componentDidMount() {

  }
  
  handleRegistration = (text) => {
    this.props.navigation.navigate('Registration');
  };

  handleForgotPassword = (text) => {
    this.props.navigation.navigate('ForgotPassword');
  };

  handleLogin = (text) => {
    ApiHandler.loginUser(this.state.email, this.state.password)
      
      .then((response) => {
        if (response.code == 200) {
          console.log(response)
          //name
          AsyncStorage.setItem(USER_NAME, response.name);
          AsyncStorage.setItem(USER_TOKEN, response.token);
          
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Success!!!',
            text2: response.success.message,
            visibilityTime: 300,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
            onShow: () => {},
            onHide: () => {
              this.getFcmToken();
            },
          });
        } else {
          console.log(response.errors);

          Toast.show({
            type: 'error', // success | error | info
            position: 'bottom',
            text1: 'Error!!!',
            text2: response.errors.message,
            visibilityTime: 1000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
            onShow: () => {},
            onHide: () => {
              //this.handleBack();
            },
          });
          
        }
      })
      .catch((error) => {
        console.error('Response Error : ' + error);
      });
  };

  handleBack = (text) => {
    this.props.navigation.goBack(null);
  }
  
  changeEmail = (text) => {
    this.setState({email: text});
  };

  changePassword = (text) => {
    this.setState({password: text});
  };

  getFcmToken = async () => {
    console.log("CALL getFcmToken >>>>");
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
        console.log("fcmToken FOUND >>>>");
        AsyncStorage.getItem(USER_TOKEN).then((token) => {
        if(token != null){
          console.log("token FOUND >>>>");
          let platform = Platform.OS;
          let appVersion = DeviceInfo.getVersion();
          let brand = DeviceInfo.getDeviceId() + "-" + DeviceInfo.getSystemVersion();
          let udid = DeviceInfo.getUniqueId();
          console.log("\nplatform : " + platform + "\n" + 
                      "appVersion : " + appVersion + "\n" + 
                      "brand : " + brand + "\n" + 
                      "udid : " + udid + "\n" + 
                      "pushId : [" + fcmToken + "]\n");
          ApiHandler.registerUserDevice(platform,appVersion,brand,udid,fcmToken,token)
          .then((response) => {
            if (response.code == 200) {
              this.props.navigation.navigate('Home');
            } else {
              this.props.navigation.navigate('Home');
            }
          })
          .catch((error) => {
            console.error('Response Error : ' + error);
          });          
        }else{
          console.log("token NULL >>>>");
        }
      });
    } else {
      console.log('Failed', 'No token received');
      this.props.navigation.navigate('Home');
    }
  };

  render() {
    return (
      <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={{
            flex: 0.8,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
        <View style={{flex: 0.5,width: '100%',alignItems: 'center',justifyContent: 'center',backgroundColor: 'transparent'}}>
          <ImageBackground
            source={require('../../Assets/login_bg.png')}
            style={{height: '100%', width: '100%'}}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={this.handleBack}>
              <Icon name="arrow-left" color="#000" size={20} />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <View style={{flex: 0.5,width: '100%',alignItems: 'flex-start',justifyContent: 'center',paddingLeft: 40,backgroundColor:'transparent'}}>
            <Text style={styles.logoTitle}>Let's Log You In</Text>
            <CustomTextInput
              title="Email"
              placeholder=""
              iconName="envelope-o"
              widthPercentage="85%"
              bottomMargin={30}
              onChangeText={this.changeEmail}
              value={this.state.email}
            />
            <View style={{flexDirection: 'row'}}>
              <CustomTextInput
                title="Password"
                placeholder=""
                iconName="key"
                widthPercentage="65%"
                passwordType={true}
                onChangeText={this.changePassword}
                value={this.state.password}
              />
              <TouchableOpacity onPress={this.handleForgotPassword}>
                <Text style={styles.forgotButton}>Forgot?</Text>
              </TouchableOpacity>
            </View>
        </View>
        </KeyboardAvoidingView>
        <View
          style={{
            flex: 0.2,
            backgroundColor: 'transparent',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CustomButton
            text="LOGIN"
            buttonWidthPercentage="80%"
            marginTop={0}
            onPress={this.handleLogin}
          />

          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <Text style={styles.registerTitle}>Don't have an account?</Text>
            <TouchableOpacity onPress={this.handleRegistration}>
              <Text style={styles.registerButton}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.theme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    width: '100%',
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.theme,
    marginBottom: 60,
    marginLeft: -20,
    textAlign: 'center',
  },
  inputView: {
    width: '80%',
    borderWidth: 1,
    color: COLORS.black,
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: COLORS.black,
  },
  registerTitle: {
    color: COLORS.darkGray,
    fontSize: 15,
    marginTop: 10,
  },
  registerButton: {
    color: COLORS.theme,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  forgotButton: {
    color: COLORS.theme,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 20,
  },
  backButton: {
    backgroundColor: 'transparent',
    width: 32,
    height: 32,
    marginTop: 10,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
