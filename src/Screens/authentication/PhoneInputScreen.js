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
import auth from '@react-native-firebase/auth';
import ApiHandler from '../../Utils/ApiHandler';
import Toast from 'react-native-toast-message';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmResult: null,
    verificationCode: '',
    userId: '',
  };

  validatePhoneNumber = () => {
    var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
    return regexp.test(this.state.phone);
  };

  handleSendCode = () => {
    // Request to send OTP
    if (this.validatePhoneNumber()) {
      auth()
        .signInWithPhoneNumber(this.state.phone)
        .then((confirmResult) => {
          this.setState({confirmResult});
        })
        .catch((error) => {
          alert(error.message);

          console.log(error);
        });
    } else {
      alert('Invalid Phone Number');
    }
  };

  changePhoneNumber = () => {
    this.setState({confirmResult: null, verificationCode: ''});
  };

  handleVerifyCode = () => {
    // Request for OTP verification
    const {confirmResult, verificationCode} = this.state;
    if (verificationCode.length == 6) {
      confirmResult
        .confirm(verificationCode)
        .then((user) => {
          this.setState({userId: user.uid});
          const {navigation} = this.props;
          console.log(
            'hellow ' +
              navigation.getParam('name') +
              'Your email is ' +
              navigation.getParam('email'),
          );

          ApiHandler.registerUserApi(
            navigation.getParam('name'),
            navigation.getParam('email'),
            this.state.phone,
            navigation.getParam('password'),
          )
            .then((response) => {
              console.log('response is : ' + JSON.stringify(response));
              if (response.code == 200) {
                console.log(response.code);
                
                //AsyncStorage.setItem(USER_TOKEN, token);

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
                    this.props.navigation.navigate('Login');
                  },
                });

              } else {
                console.log(response.errors);

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
                    this.handleBack();
                  },
                });

              }
            })
            .catch((error) => {
              console.error('Response Error : ' + error);
            });
        })
        .catch((error) => {
          //alert(error.message);
          console.log(error);
        });
    } else {
      alert('Please enter a 6 digit OTP code.');
    }
  };

  handleBack = (text) => {
    this.props.navigation.goBack(null);
  };

  renderNumberInputView = () => {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../Assets/login_bg.png')}
          style={{flex: 0.25, width: '100%'}}>
          <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
            <Icon name="arrow-left" color="#000" size={20} />
          </TouchableOpacity>
        </ImageBackground>

        <Text style={styles.logoTitle}>Add Phone Number</Text>
        <Text style={styles.logoSubTitle}>Create an account to continue</Text>

        <View
          style={{
            flex: 0.35,
            backgroundColor: COLORS.white,
            width: '85%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 32,
            marginTop: 50,
          }}>

          <CustomTextInput
            title="Enter your Phone Number"
            placeholder=""
            iconName="mobile"
            widthPercentage="80%"
            value={this.state.phone}
            onChangeText={(phone) => {
              this.setState({phone});
            }}
            maxLength={15}/>

          <CustomButton
            text="NEXT"
            buttonWidthPercentage="80%"
            marginTop={30}
            onPress={this.handleSendCode}/>
            
        </View>

        <View
          style={{
            flex: 0.3,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}></View>
      </View>
    );
  };

  renderConfirmationCodeView = () => {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../Assets/login_bg.png')}
          style={{flex: 0.25, width: '100%'}}>
          <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
            <Icon name="arrow-left" color="#000" size={20} />
          </TouchableOpacity>
        </ImageBackground>

        <Text style={styles.logoTitle}>Varification</Text>
        <Text style={styles.logoSubTitle}>Create an account to continue</Text>

        <View
          style={{
            flex: 0.35,
            backgroundColor: COLORS.white,
            width: '85%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 32,
            marginTop: 50,
          }}>
          <CustomTextInput
            title="Enter OTP Code Here"
            iconName="mobile"
            widthPercentage="80%"
            placeholder="Verification code"
            placeholderTextColor="#eee"
            value={this.state.verificationCode}
            keyboardType="numeric"
            onChangeText={(verificationCode) => {
              this.setState({verificationCode});
            }}
            maxLength={6}
          />

          <CustomButton
            text="VARIFY"
            buttonWidthPercentage="80%"
            marginTop={30}
            onPress={this.handleVerifyCode}
          />
        </View>

        <View
          style={{
            flex: 0.3,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}></View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.confirmResult
          ? this.renderConfirmationCodeView()
          : this.renderNumberInputView()}
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
    marginBottom: 5,
  },
  logoSubTitle: {
    fontSize: 14,
    color: COLORS.white,
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
    marginTop: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
