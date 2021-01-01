import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../../Utils/colors';
import CustomButton from '../../Components/CustomButton';
import CustomTextInput from '../../Components/CustomTextInput';
import ApiHandler from '../../Utils/ApiHandler';
import {getToken} from '../../Database/TokenManager';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-community/async-storage';
import {USER_TOKEN} from '../../Utils/Constants';

export default class App extends React.Component {
  state = {
    password: '',
    newPassword: '',
    confirmPassword: '',
  };

  onFocusFunction = () => {
    AsyncStorage.getItem(USER_TOKEN).then((token) => {
      if (token != null) {
        ApiHandler.getAllOrders(token)
          .then((response) => {
            console.log(JSON.stringify(response));
            if (response.code == 200) {
              console.log(response.code + '\n' + JSON.stringify(response));
              this.setState({data: response.order, bodyType: 1});
            } else {
              console.log(response.errors);
              this.setState({data: response.order, bodyType: 0});
            }
          })
          .catch((error) => {
            console.error('Response Error : ' + error);
          });
      } else {
        this.setState({bodyType: 0});
        Toast.show({
          type: 'error', // success | error | info
          position: 'bottom',
          text1: 'Error!!!',
          text2: 'Please Login.',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
          onShow: () => {},
          onHide: () => {
            this.handleBack();
          },
        });
      }
    });
  }
  
  componentDidMount() {
    AsyncStorage.getItem(USER_TOKEN).then((token) => {
      if(token == null){
        Toast.show({
          type: 'error', // success | error | info
          position: 'bottom',
          text1: 'Error!!!',
          text2: "Please Login.",
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
          onShow: () => {},
          onHide: () => {
            this.props.navigation.navigate('Home');
          },
        });
      }else{
      }
    });
  }
  
  handleBack = (text) => {
    this.props.navigation.goBack(null);
  }

  handleLogin = (text) => {
    this.props.navigation.goBack(null);
  };

  passwordUpdate = (text) => {

    if (this.state.newPassword == this.state.confirmPassword) {
      ApiHandler.changePasswordApi(
        getToken('token'),
        this.state.password,
        this.state.newPassword,
      )
        .then((response) => {
          console.log(JSON.stringify(response));
          console.log(response.code);
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
    }
  };

  changePassword = (text) => {
    this.setState({password: text});
  };

  changeNewPassword = (text) => {
    this.setState({newPassword: text});
  };

  changeConfirmPassword = (text) => {
    this.setState({confirmPassword: text});
  };

  render() {
    return (
      <View style={styles.container}>
      <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 128 : 0}
          style={{
            flex: 0.8,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
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
        </View>

        <View
          style={{
            flex: 0.6,
            backgroundColor: 'transparent',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.logoTitle}>Change Password</Text>
          <Text style={styles.logoSubtitle}>Create a New Password</Text>

          <CustomTextInput
            title="Old Password"
            passwordType={true}
            placeholder=""
            iconName="key"
            widthPercentage="85%"
            bottomMargin={30}
            onChangeText={this.changePassword}
            value={this.state.password}
          />
          <CustomTextInput
            title="New Password"
            passwordType={true}
            placeholder=""
            iconName="key"
            widthPercentage="85%"
            bottomMargin={30}
            onChangeText={this.changeNewPassword}
            value={this.state.newPassword}
          />
          <CustomTextInput
            title="Retype Password"
            passwordType={true}
            placeholder=""
            iconName="key"
            widthPercentage="85%"
            onChangeText={this.changeConfirmPassword}
            value={this.state.confirmPassword}
          />
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
            text="UPDATE"
            buttonWidthPercentage="80%"
            marginTop={0}
            onPress={this.passwordUpdate}
          />

          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <Text style={styles.registerTitle}>
              Password must be atleast 8 chars
            </Text>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  logoSubtitle: {
    width: '100%',
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 30,
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
