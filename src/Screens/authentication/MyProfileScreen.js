import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLORS } from '../../Utils/colors';
import CustomButton from '../../Components/CustomButton';
import CustomTextInput from '../../Components/CustomTextInput';
import ApiHandler from '../../Utils/ApiHandler';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-community/async-storage';
import {USER_TOKEN} from '../../Utils/Constants';

export default class App extends React.Component {
  state = {
    name: "",
    email: "",
    phone: ""
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
        ApiHandler.getMyProfile(token)
            .then((response) => {
            if (response.code == 200) {
              console.log(response.user);
              this.setState({ name: response.user.name, email: response.user.email,phone: response.user.phone })
            } else if (response.code == 404) {
              console.log(response.errors);
            } else {
              console.log('unknown error')
          }
        })
        .catch((error) => {
          console.error("Response Error : " + error);
          this.setState({ bodyType: 0, message: 'unknown error !!!' })
        });
      }
    });
  }

  handleBack = (text) => {
    this.props.navigation.goBack(null);
  }

  handleUpdateProfile = () => {
    console.log(this.state.name + this.state.email + this.state.phone);
    AsyncStorage.getItem(USER_TOKEN).then((token) => {
        if(token == null){
          console.log("NULLLLLLLLLLL");
          return;
        }
        ApiHandler.updateMyProfile(this.state.name,this.state.email,this.state.phone,token)
        .then((response) => {
          if (response.code == 200) {
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
                this.props.navigation.navigate('Home');
              },
            });
          } else if (response.code == 404) {
              console.log(response.errors);
          } else {
              console.log('unknown error : ' + response.errors.message)
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
          console.error("Response Error : " + error);        
      });
    });
  }

  changeName = (text) => {
    this.setState({ name: text })
  }

  changeEmail = (text) => {
    this.setState({ email: text })
  }

  changePhone = (text) => {
    this.setState({ phone: text })
  }

  changePassword = (text) => {
    this.setState({ password: text })
  }

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
        <View style={{ flex: .40, width: "100%", alignItems: 'center', justifyContent: 'center', backgroundColor : 'transparent' }}>
          <ImageBackground
            source={require('../../Assets/login_bg.png')}
            style={{ height: '100%', width: '100%' }}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={this.handleBack}>
              <Icon name='arrow-left' color='#000' size={20} />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <View style={{
          flex: .60,
          backgroundColor: 'transparent',
          width: "100%",
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={styles.logoTitle}>My Profile</Text>
          <CustomTextInput
            title='Name'
            placeholder=''
            iconName="user-o"
            widthPercentage="85%"
            bottomMargin={30}
            onChangeText={this.changeName}
            value={this.state.name}/>
          <CustomTextInput
            title='Email'
            placeholder=''
            iconName="envelope-o"
            widthPercentage="85%"
            bottomMargin={30}
            text={this.state.name}
            onChangeText={this.changeEmail} 
            value={this.state.email}/>
          <CustomTextInput
            title='Phone'
            placeholder=''
            iconName="phone"
            widthPercentage="85%"
            onChangeText={this.changePhone}
            value={this.state.phone}
            editable={false} />
        </View>
        </KeyboardAvoidingView>
        <View style={{
          flex: .20,
          backgroundColor: 'transparent',
          width: "100%",
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CustomButton
            text='UPDATE PROFILE'
            buttonWidthPercentage="80%"
            marginTop={0}
            onPress={this.handleUpdateProfile} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.theme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    width: "100%",
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.theme,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  logoSubtitle: {
    width: "100%",
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputView: {
    width: "80%",
    borderWidth: 1,
    color: COLORS.black,
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  registerTitle: {
    color: COLORS.darkGray,
    fontSize: 15,
    marginTop: 10
  },
  registerButton: {
    color: COLORS.theme,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10
  },
  forgotButton: {
    color: COLORS.theme,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 30,
    marginLeft: 20
  },
  backButton: {
    backgroundColor: 'transparent',
    width: 32,
    height: 32,
    marginTop: 10,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});