import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLORS } from '../../Utils/colors';
import CustomButton from '../../Components/CustomButton';
import CustomTextInput from '../../Components/CustomTextInput';

export default class App extends React.Component {
  state = {
    name: "",
    email: "",
    phone: "",
    password: ""
  }

  handleBack = (text) => {
    this.props.navigation.goBack(null);
  }

  handleLogin = (text) => {
    this.props.navigation.goBack(null);
  }

  handleRegistration = (text) => {
    console.debug("Registration Button Pressed");
    this.props.navigation.navigate("PhoneInput",
      {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
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
            <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
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
          <Text style={styles.logoTitle}>Getting Started</Text>
          <Text style={styles.logoSubtitle}>Create New Account</Text>

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
            onChangeText={this.changeEmail} 
            value={this.state.email}/>

          <CustomTextInput
            title='Password'
            passwordType={true}
            placeholder=''
            iconName="key"
            widthPercentage="85%"
            onChangeText={this.changePassword} 
            value={this.state.password}/>

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
            text='REGISTER'
            buttonWidthPercentage="80%"
            marginTop={0}
            onPress={this.handleRegistration} />

          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <Text style={styles.registerTitle}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={this.handleLogin}>
              <Text style={styles.registerButton}>
                Login
              </Text>
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
    marginTop: 20,
    marginBottom: 5,
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