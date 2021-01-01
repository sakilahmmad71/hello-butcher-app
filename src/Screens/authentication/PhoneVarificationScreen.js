import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLORS } from '../../Utils/colors';
import CustomButton from '../../Components/CustomButton';
import CustomTextInput from '../../Components/CustomTextInput';

export default class App extends React.Component {
  state = {
    email : ""
  }

  handleBack = (text) => {
    this.props.navigation.goBack(null);
  }

  handleEmail = (text) => {
    this.props.navigation.navigate("PhoneVarification"); 
  }

  changeEmail = (text) => {
    this.setState({ email: text })
  }

  render(){
    return (
      <View style={styles.container}>

        <ImageBackground source={require('../../Assets/login_bg.png')} style={{flex:.25,width:"100%"}}>
            <TouchableOpacity style = {styles.backButton} onPress={this.handleBack}>
              <Icon name='arrow-left' color='#000' size={20}/>
            </TouchableOpacity>
        </ImageBackground>
        
        <Text style={styles.logoTitle}>Varification</Text>
        <Text style={styles.logoSubTitle}>Create an account to continue</Text>

        <View style={{flex:.35,
                      backgroundColor:COLORS.white,
                      width:"85%",
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius:32,
                      marginTop:50}}>

          <CustomTextInput
            title = 'Enter OTP Code Here'
            placeholder = ''
            iconName = "mobile"
            widthPercentage="80%"
            onChangeText = {this.changeEmail}/>

          <CustomButton
            text='VARIFY'
            buttonWidthPercentage="80%"
            marginTop={30}
            onPress={this.handleEmail}/>
        </View>

        <View style={{flex:.3,width:"100%",alignItems: 'center',justifyContent: 'center'}}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%",
    backgroundColor: COLORS.themeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    width:"100%",
    backgroundColor: COLORS.theme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle:{
    fontWeight:"bold",
    fontSize:18,
    color:COLORS.white,
    marginBottom:5
  },
  logoSubTitle:{
    fontSize:14,
    color:COLORS.white
  },
  logo:{
    backgroundColor : COLORS.theme,
    width:160,
    height:160
  },
  inputView:{
    width:"80%",
    borderWidth: 1,
    color : COLORS.black,
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:COLORS.black
  },
  backButton: {
    backgroundColor: 'transparent',
    width:32,
    height:32,
    marginTop:20,
    marginLeft:10,
    alignItems:'center',
    justifyContent: 'center'
  }
});