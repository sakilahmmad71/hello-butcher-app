import React, {useState, useEffect, useNavigation} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Body, Header, Left, Right} from 'native-base';
import {COLORS} from '../Utils/colors';
import RadioGroup from '../Components/customRadioGroup/RadioGroup';
import CustomButton from '../Components/CustomButton';
import ApiHandler from '../Utils/ApiHandler';
import AsyncStorage from '@react-native-community/async-storage';
import {USER_TOKEN} from '../Utils/Constants';
import Utils from '../Utils/Utils';
import Toast from 'react-native-toast-message';

export default function CheckoutScreen({navigation}) {
  const products = navigation.getParam('products');
  //console.log('retrived products are :' + JSON.stringify(products));

  const [cart, setCart] = useState(products);
  const [address, setAddress] = useState([]);
  const [newAddressStatus, addNewAddressStatus] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const [shippingMethod, setShippingMethod] = useState('Normal');

  var data = [];
  for (var i = 0; i < address.length; i++) {
    data.push({
      id: i,
      label: (
        <View key={i}>
          <Text style={{fontWeight: 'bold', fontSize: 14}}>
            {address[i].streetName}
          </Text>
          <Text style={{color: COLORS.darkGray, fontSize: 12}}>
            {address[i].addressName +
              ', ' +
              address[i].postTown +
              '-' +
              address[i].postCode}
          </Text>
        </View>
      ),
      value: address[i],
    });
  }

  const addOrder = () => {

    const orders = [];
    cart.map((item, index) => {
      const obj = {
        product: item._id,
        options: JSON.parse(item.options),
        quantity: item.productQuantity,
      };
      orders.push(obj);
    });

    const subTotal = cart.reduce(
      (acc, val) => parseInt(val.totalPrice, 0) + acc,
      0,
    )

    AsyncStorage.getItem(USER_TOKEN).then((token) => {
      if (token != null) {
        ApiHandler.addNewOrder(
          token,
          selectedAddress._id,
          orders,
          selectedAddress.shippingCost,
          subTotal
        )
          .then((response) => {
            console.log(JSON.stringify(response));
            if (response.code == 200) {
              console.log(response.code + '\n' + JSON.stringify(response));
              
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
                  navigation.goBack(null);
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
                  navigation.goBack(null);
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

  useEffect(() => {
    AsyncStorage.getItem(USER_TOKEN).then((token) => {
      if (token != null) {
        ApiHandler.getAddressList(token)
          .then((response) => {
            //console.log(JSON.stringify(response));
            if (response.code == 200) {
              //console.log(response.code + '\n' + JSON.stringify(response));
              addNewAddressStatus(true);
              setAddress(response.addresses);
              setSelectedAddress(response.addresses[0]);
            } else {
              console.log(response.errors);
              addNewAddressStatus(false);
            }
          })
          .catch((error) => {
            console.error('Response Error : ' + error);
            addNewAddressStatus(false);
          });
      }
    });
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Header
          style={{
            backgroundColor: '#FFFFFF',
            elevation: 0,
            marginHorizontal: 10,
          }}>
          <Left>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack(null);
              }}>
              <Icon name="arrow-left" color="#000" size={20} />
            </TouchableOpacity>
          </Left>

          <Body>
            <Text style={{color: '#2b2b2b', fontSize: 18, fontWeight: 'bold'}}>
              Checkout
            </Text>
          </Body>

          <Right />
        </Header>

        <View style={{flex: 0.88, marginBottom: '30%'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cartTitleView}>
              <Text style={styles.cartTitle}>Products</Text>
            </View>

            {cart.length > 0 ? (
              <View>
                <View style={{borderWidth: 0}}>
                  {cart
                    .sort((a, b) => a.title > b.title)
                    .map((product) => (
                      <View style={styles.productView} key={product._id}>
                        <TouchableWithoutFeedback>
                          <View style={styles.listItem}>
                            <View style={{width: '20%', alignItems: 'center'}}>
                              <Image
                                source={{
                                  uri: product.file
                                    .toString()
                                    .replace('localhost', '198.13.36.60'),
                                }}
                                style={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: 30,
                                }}
                              />
                            </View>

                            <View style={styles.productMiddleView}>
                              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                                {product.title}
                              </Text>

                              <View style={{flexDirection: 'row'}}>
                                <View>
                                  <Text
                                    style={{
                                      color: COLORS.darkGray,
                                      fontSize: 12,
                                    }}>
                                    {Utils.convertWeight(product.weight)}
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      color: COLORS.price,
                                    }}>
                                    £{product.totalPrice} (
                                    {product.productQuantity}
                                    {''}Pcs)
                                  </Text>

                                  <View style={{flex: 1}}>
                                  {JSON.parse(product.options).map(
                                    (item, index) => (
                                      <Text style={{color:COLORS.darkGray,fontSize:11}}>
                                        {item.title +
                                          ' : ' +
                                          item.values[item.selected]}
                                      </Text>
                                    ),
                                  )}
                                </View>
                                </View>


                              </View>
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    ))}
                </View>

                <View style={styles.shippingView}>
                  <View style={styles.cartTitleView}>
                    <Text style={styles.cartTitle}>Address</Text>
                  </View>

                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#333',
                      marginHorizontal: 10,
                    }}>
                    <View>
                      <View style={{margin: 10}}>
                        {newAddressStatus ? (
                          <RadioGroup
                            options={data}
                            activeButtonId={0}
                            onChange={(option) => {
                              console.log(option.value);
                              setSelectedAddress(option.value);
                            }}
                          />
                        ) : (
                          <Text
                            style={{
                              alignSelf: 'center',
                              color: 'red',
                              marginBottom: 30,
                            }}>
                            No address found, Click on plus icon to add new
                            address
                          </Text>
                        )}
                      </View>

                      <View
                        style={{flexDirection: 'row', flex: 1, marginTop: 60}}>
                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,0.2)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 44,
                            height: 44,
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            backgroundColor: COLORS.black,
                            borderRadius: 100,
                          }}
                          onPress={() => {
                            navigation.navigate('AddressInput');
                          }}>
                          <Icon name="plus" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.emptyCartView}>
                <Text style={styles.emptyCartViewText}>
                  Your cart is empty.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              <Text style={styles.totalText}>Sub Total :</Text>
              <Text style={styles.totalPrice}>
                {' '}
                £
                {cart.reduce(
                  (acc, val) => parseInt(val.totalPrice, 0) + acc,
                  0,
                )}
              </Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              <Text style={styles.totalText}>Shipping Cost :</Text>
              <Text style={styles.totalPrice}>
                {selectedAddress != null
                  ? '£' + selectedAddress.shippingCost
                  : '£00.00'}
              </Text>
            </View>

            <View style={styles.totalView}>
            <Text style={styles.finalPrice}>Total :</Text>

              <Text style={styles.finalPrice}>
                £
                {selectedAddress != null
                  ? cart.reduce(
                      (acc, val) => parseInt(val.totalPrice, 0) + acc,
                      0,
                    ) + parseInt(selectedAddress.shippingCost)
                  : cart.reduce(
                      (acc, val) => parseInt(val.totalPrice, 0) + acc,
                      0,
                    ) + 0}
              </Text>
            </View>
          </View>

          <View>
            <CustomButton
              text="Place Order"
              buttonWidthPercentage="100%"
              onPress={() => {
                addOrder();
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  paymentTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  cartContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingHorizontal: 16,
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  cartTitleView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 14,
    marginLeft: 10,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  productView: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    elevation: 2,
    marginTop: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
  productMiddleView: {
    flex: 1,
    display: 'flex',
    width: '80%',
    flexDirection: 'column',
    paddingLeft: 10,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  productCompanyTitle: {
    fontSize: 14,
    fontWeight: '300',
  },
  productRightView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productItemCounterView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  counterValue: {
    fontSize: 20,
    fontWeight: '500',
  },
  productPriceText: {
    alignSelf: 'flex-end',
    paddingRight: 10,
    fontSize: 20,
    fontWeight: '700',
  },
  toggleCounterButton: {
    paddingHorizontal: 10,
  },
  couponInputView: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#333',
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  couponInput: {
    flex: 1,
    fontSize: 20,
    paddingHorizontal: 10,
  },
  couponButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  couponButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  subtotalView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtotalPrice: {
    fontSize: 16,
    fontWeight: '300',
  },
  shippingView: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 10,
  },
  shippingItemsView: {
    marginTop: 10,
  },
  shippingText: {
    fontSize: 18,
    fontWeight: '500',
  },
  shippingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shippingItemText: {
    fontSize: 14,
    paddingVertical: 4,
    fontWeight: '300',
  },
  totalView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  finalPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.price,
  },
  addAddressButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 10,
    flex: 0.5,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  editAddressButton: {
    backgroundColor: 'tomato',
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 10,
    flex: 0.5,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  checkoutButton: {
    backgroundColor: '#333',
    paddingVertical: 14,
    marginTop: 30,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  emptyCartView: {
    flex: 1,
    marginTop: 140,
  },
  emptyCartViewText: {
    fontSize: 16,
    fontWeight: '300',
    alignSelf: 'center',
  },
  listItem: {
    backgroundColor: '#FFF',
    width: '97%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footer: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'white',
    position: 'absolute',
    paddingHorizontal: 30,
    paddingVertical: 20,
    bottom: 0,
    width: '100%',
    height: '25%',
  },
});
