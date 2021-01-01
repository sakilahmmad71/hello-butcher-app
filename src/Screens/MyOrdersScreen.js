import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import {Body, Header, Left, Right} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../Utils/colors';
import CustomLottieView from '../Components/LottieProgress';
import LoadingPlaceholderScreen from '../Screens/LoadingPlaceholderScreen';
import ApiHandler from '../Utils/ApiHandler';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import {USER_TOKEN} from '../Utils/Constants';

export default class MyOrdersScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isEmpty: true,
      bodyType: 2,
    };
  }

  onFocusFunction = () => {
    AsyncStorage.getItem(USER_TOKEN).then((token) => {
      if (token != null) {
        ApiHandler.getAllOrders(token)
          .then((response) => {
            console.log(JSON.stringify(response));
            if (response.code == 200) {
              console.log(response.code + '\n' + JSON.stringify(response.orders));
              this.setState({data: response.orders, bodyType: 1});
            } else {
              console.log(response.errors);
              this.setState({bodyType: 0});
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

  onOrderItemPressed(item){
    this.props.navigation.navigate("MyOrdersProducts", { productInfo: JSON.stringify(item.products), code : item.code });
  }

  // add a focus listener onDidMount
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }
  
  // and don't forget to remove the listener
  componentWillUnmount() {
    this.focusListener.remove()
  }

  handleBack = (text) => {
    this.props.navigation.goBack(null);
  };

  render() {
    return (
      // <SafeAreaView>
      <View style={styles.container}>
        <Header
          style={{
            backgroundColor: 'transparent',
            elevation: 0,
            marginHorizontal: 10,
          }}>
          <Left>
            <TouchableOpacity onPress={this.handleBack}>
              <Icon name="arrow-left" color="#000" size={20} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text style={{color: '#2b2b2b', fontSize: 18, fontWeight: 'bold'}}>
              My Orders
            </Text>
          </Body>
          <Right></Right>
        </Header>

        {(() => {
          switch (this.state.bodyType) {
            case 0:
              return (
                <CustomLottieView
                  path={require('../Assets/lottie_no_notification.json')}
                  message={this.state.message}
                  size={56}
                />
              );

            case 1:
              return (
                <FlatList
                  style={{
                    flex: 1,
                    marginTop: 3,
                    marginBottom: 3,
                    backgroundColor: COLORS.background,
                  }}
                  data={this.state.data}
                  renderItem={({item}) => (
                    <TouchableWithoutFeedback onPress={() => this.onOrderItemPressed(item)}>
                    <View style={styles.listItem}>
                      <View
                        style={{
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                          flex: 1,
                          marginLeft: 5,
                          padding: 5,
                        }}>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>
                          {item.code}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: COLORS.darkGray,
                            marginTop: 2,
                          }}>
                          {item.address.streetName}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: COLORS.darkGray,
                            marginTop: 2,
                          }}>
                          {item.createdAt}
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <Text style={styles.price}>£{parseInt(item.subTotal) + parseInt(item.shippingCost)}</Text>
                        <View style={styles.tag}>
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: 'bold',
                              alignSelf: 'center',
                              color: COLORS.white,
                              padding: 0,
                            }}>
                            {item.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                    </TouchableWithoutFeedback>
                  )}
                  keyExtractor={(item) => item._id}
                />
              );

            case 2:
              return <LoadingPlaceholderScreen />;
            default:
              break;
          }
        })()}
      </View>
      // </SafeAreaView> */
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listItem: {
    margin: 5,
    padding: 10,
    backgroundColor: COLORS.white,
    width: '95%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
  tag: {
    width: 80,
    height: 16,
    textAlign: 'center',
    backgroundColor: COLORS.themeLight,
    marginTop: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.price,
    textAlign: 'center',
  },
});
