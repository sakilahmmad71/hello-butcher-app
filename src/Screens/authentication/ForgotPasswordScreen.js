import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../../Utils/colors';
import CustomButton from '../../Components/CustomButton';
import CustomTextInput from '../../Components/CustomTextInput';
import ApiHandler from '../../Utils/ApiHandler';
import {getToken} from '../../Database/TokenManager';
import Toast from 'react-native-toast-message';

export default class App extends React.Component {
  state = {
    email: '',
  };

  handleBack = (text) => {
    this.props.navigation.goBack(null);
  };

  sendRecoveryEmail = (text) => {
    //alert('clicked : ' + this.state.email)
    ApiHandler.forgotPasswordApi(getToken('token'), this.state.email)
      .then((response) => {
        console.log(JSON.stringify(response));
        if (response.code == 200) {
          console.log(response.code);

          Toast.show({
            type: 'success', // success | error | info
            position: 'bottom',
            text1: 'Success!!!',
            text2: response.success.message,
            visibilityTime: 300,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
            onShow: () => {},
            onHide: () => {
              handleBack();
            },
          });

        } else {

          Toast.show({
            type: 'error', // success | error | info
            position: 'bottom',
            text1: 'Error!!!',
            text2: response.errors.message,
            visibilityTime: 300,
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

  changeEmail = (text) => {
    this.setState({email: text});
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 0.4,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ImageBackground
            source={require('../../Assets/login_bg.png')}
            style={{height: '100%', width: '100%'}}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={this.handleBack}>
              <Icon name="arrow-left" color="#000" size={20} />
            </TouchableOpacity>
          </ImageBackground>

          <Text style={styles.logoTitle}>Forgot Password</Text>
        </View>

        <View
          style={{
            flex: 0.4,
            backgroundColor: COLORS.white,
            width: '85%',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: 32,
            marginBottom: 0,
          }}>
          <Text
            style={{
              color: COLORS.darkGray,
              marginTop: 30,
              marginBottom: 30,
              width: '85%',
            }}>
            We will reset and send a temporary password to your associated email
            address.Please type in your Email address.
          </Text>

          <CustomTextInput
            title="Email Address"
            placeholder=""
            iconName="envelope-o"
            widthPercentage="80%"
            onChangeText={this.changeEmail}
          />

          <CustomButton
            text="SUBMIT"
            buttonWidthPercentage="80%"
            marginTop={30}
            onPress={this.sendRecoveryEmail}
          />
        </View>

        <View
          style={{
            flex: 0.15,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.themeLight,
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
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.white,
    paddingBottom: 60,
  },
  logo: {
    backgroundColor: COLORS.theme,
    width: 160,
    height: 160,
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
  backButton: {
    backgroundColor: 'transparent',
    width: 32,
    height: 32,
    marginTop: 60,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
