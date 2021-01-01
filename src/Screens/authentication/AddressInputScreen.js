import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../../Utils/colors';
import CustomButton from '../../Components/CustomButton';
import CustomTextInput from '../../Components/CustomTextInput';
import ApiHandler from '../../Utils/ApiHandler';
import Toast from 'react-native-toast-message';
import {USER_TOKEN} from '../../Utils/Constants';
import AsyncStorage from '@react-native-community/async-storage';

export default class AddressInputScreen extends React.Component {
  state = {
    flatNo: 'flat no',
    flatName: 'flat name',
    streetName: 'street name',
    city: 'Dhaka',
    postCodePrefix: '1111',
    postCodeSuffix: '111',
  };

  flatNo = (text) => {
    this.setState({flatNo: text});
  };

  flatName = (text) => {
    this.setState({flatName: text});
  };

  streetName = (text) => {
    this.setState({streetName: text});
  };

  city = (text) => {
    this.setState({city: text});
  };

  postCodePrefix = (text) => {
    this.setState({postCodePrefix: text});
  };

  postCodeSuffix = (text) => {
    this.setState({postCodeSuffix: text});
  };

  handleBack = (text) => {
    this.props.navigation.goBack(null);
  };

  handleSubmit = (text) => {
    AsyncStorage.getItem(USER_TOKEN).then((token) => {
      console.log('Token : ' + token);

      if (token != null) {
        ApiHandler.addNewAddress(
          token,
          this.state.flatNo,
          this.state.flatName,
          this.state.streetName,
          this.state.city,
          this.state.postCodePrefix,
          this.state.postCodeSuffix,

        ).then((response) => {
            console.log(JSON.stringify(response));
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
                  this.handleBack();
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
      }
    });
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
              flex: 0.3,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
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
              flex: 0.7,
              backgroundColor: 'transparent',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.logoTitle}>Add New Address</Text>

            <CustomTextInput
              title="Flat/House No"
              placeholder=""
              iconName="pencil"
              widthPercentage="85%"
              bottomMargin={20}
              onChangeText={this.flatNo}
              value={this.state.flatNo}
            />

            <CustomTextInput
              title="Flat/Apartment Name"
              placeholder=""
              iconName="pencil"
              widthPercentage="85%"
              bottomMargin={20}
              onChangeText={this.flatName}
              value={this.state.flatName}
            />

            <CustomTextInput
              title="Street Name"
              placeholder=""
              iconName="pencil"
              widthPercentage="85%"
              bottomMargin={20}
              onChangeText={this.streetName}
              value={this.state.streetName}
            />

            <CustomTextInput
              title="City"
              placeholder=""
              iconName="pencil"
              widthPercentage="85%"
              bottomMargin={20}
              onChangeText={this.city}
              value={this.state.city}
            />

            <View style={{flexDirection: 'row',backgroundColor: 'transparent',width: '85%',alignItems: 'flex-start'}}>
              <CustomTextInput
                title="Post Code"
                placeholder=""
                iconName="pencil"
                widthPercentage="30%"
                onChangeText={this.postCodePrefix}
                value={this.state.postCodePrefix}
              />
              <CustomTextInput
                title="Post Code"
                placeholder=""
                iconName="pencil"
                marginLeft={100}
                widthPercentage="30%"
                onChangeText={this.postCodeSuffix}
                value={this.state.postCodeSuffix}
              />

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
            text="SUBMIT"
            buttonWidthPercentage="80%"
            marginTop={0}
            onPress={this.handleSubmit}
          />
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
    marginTop: 10,
    textAlign: 'center',
  },
  logoSubtitle: {
    width: '100%',
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 20,
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
