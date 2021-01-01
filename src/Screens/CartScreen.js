import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableWithoutFeedback, TouchableOpacity, InteractionManager,Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { CartSchema } from '../Database/Models';
import CustomHeader from '../Components/CustomHeader';
import { COLORS } from '../Utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomLottieView from '../Components/LottieProgress';
import Utils from '../Utils/Utils';
import AsyncStorage from '@react-native-community/async-storage';
import { USER_CART } from '../Utils/Constants';

const Realm = require('realm');

export default class CartScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    realmObj: null,
    products: [],
    isEmpty: true,
  }

  onFocusFunction = () => {
    this.setState({ isEmpty: true });
    const r = new Realm();
    if (!r.isClosed) {
      r.close()
    }

    Realm.open(
      {
        schema: [CartSchema],
        schemaVersion: 1,
      }
    ).then(
      realm => {
        const productList = realm.objects('CartSchema');
        if (productList.length > 0) {
          this.setState({ isEmpty: false });
        }
        let jsonData = JSON.parse(JSON.stringify(Array.prototype.slice.call(productList, 0, productList.length)));
        this.setState({ products: jsonData, realmObj: realm });
        // console.log(jsonData);
        AsyncStorage.setItem(USER_CART, realm.objects('CartSchema').length.toString());
        realm.close();
      }
    ).catch(error => {
      console.log(error);
    });
  }

  componentDidMount() {

    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      const { navigation } = this.props;

      console.log('Cart componentDidMount : ' + this.props.navigation.getParam('currentPage'));

      if (this.props.navigation.getParam('currentPage') == 'alert') {
        Alert.alert(
          'Cart',
          'Continue Shopping?',
          [
            {text: 'Keep', onPress: () => {
              this.props.navigation.setParams({currentPage: "no-alert" });
            }},
            {text: 'Yes', onPress: () => {
              this.props.navigation.setParams({currentPage: "no-alert" });
              this.props.navigation.goBack(null);
            }},
          ]
        );
      }
      this.onFocusFunction()
    })
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }

  async onProductDetailPress(item) {
    this.props.navigation.navigate("ProductDetails", { productInfo: JSON.stringify(item), currentPage: 'cartList' });
  }

  //this.props.navigation.navigate("PlaceOrder");
  handlePlaceOrder = (text) => {
    this.props.navigation.navigate("PlaceOrder");
  }

  async deleteFromCart(productObject) {
    console.log('delete from cartlist called');
    const r = new Realm();
    if (!r.isClosed) {
      r.close()
    }

    Realm.open(
      {
        schema: [CartSchema],
        schemaVersion: 1,
      }).then(realm => {

        const cart = realm.objects('CartSchema').filtered("_id == " + JSON.stringify(productObject._id));
        if (cart.length >= 1) {
          realm.write(() => {
            realm.delete(cart)
          });
        }

        realm.close();

        Toast.show({
          type: 'success',//success | error | info
          position: 'top',
          text1: 'Success!!!',
          text2: 'Product is successfully deleted from cartList',
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
          onShow: () => { this.onFocusFunction() },
          onHide: () => { }
        });

      }).catch(error => {
        console.log(error);
      });
  }

  render() {

    const { products } = this.state;
    let totalPrice = 0;
    products.forEach((item) => {
      totalPrice += item.productQuantity * (item.price - item.discount);
    })

    return (
      <View style={styles.container}>
        <CustomHeader title="Carts" navigation={this.props.navigation} />

        {this.state.isEmpty ? <CustomLottieView path={require('../Assets/lottie_empty_cart.json')} message='No Product added into Cart' size={96} /> :

          <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <FlatList
              style={{ flex: 1, marginTop: 3, marginBottom: 3 }}
              data={this.state.products}
              renderItem={({ item, index }) =>

                <TouchableWithoutFeedback onPress={() => this.onProductDetailPress(item)}>
                  <View style={styles.listItem}>
                    <View style={{ width: '20%', alignItems: 'center' }}>
                      <Image source={{ uri: item.file.toString().replace("localhost", "198.13.36.60") }} style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 4 }} />
                      <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => this.deleteFromCart(item)}>
                          <Icon name='trash-o' size={24} color={COLORS.price} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ height: "100%", width: 1, backgroundColor: COLORS.background, marginHorizontal: 10 }} />

                    <View style={{ width: '50%', marginHorizontal: 10, alignItems: "flex-start", justifyContent: "center", flex: 1 }}>
                      <Text style={{ fontWeight: "normal", fontSize: 16 }}>{item.title}</Text>
                      <Text style={{ color: COLORS.darkGray, fontSize: 12 }}>{Utils.convertWeight(item.weight)}</Text>
                      <Text style={{ fontWeight: "bold", color: COLORS.price }}>£{(item.price - item.discount) * item.productQuantity}</Text>
                    </View>

                    <TouchableWithoutFeedback>
                      <View
                        style={{ width: '30%', height: 32, alignSelf: 'center', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => {
                          if (item.productQuantity != 1) {
                            item.productQuantity = item.productQuantity - 1;
                            this.state.products[index].totalPrice = item.productQuantity * (item.price - item.discount);
                            this.forceUpdate()
                          }
                        }}>
                          <Icon name='minus-square-o' size={28} color={COLORS.darkGray} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', alignSelf: 'center', marginLeft: 16, marginRight: 16 }}>{item.productQuantity}</Text>
                        <TouchableOpacity onPress={() => {
                          this.state.products[index].productQuantity = item.productQuantity + 1;
                          this.state.products[index].totalPrice = item.productQuantity * (item.price - item.discount);
                          this.forceUpdate()
                        }}>
                          <Icon name='plus-square-o' size={28} color={COLORS.darkGray} />
                        </TouchableOpacity>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              }
              keyExtractor={item => item._id.toString()} />
            <View style={styles.footer}>

              <View style={{ width: '40%' }}>
                <View style={{
                  backgroundColor: COLORS.theme,
                  justifyContent: 'center',
                  height: 56,
                  borderTopRightRadius: 50,
                  borderBottomRightRadius: 50
                }}>
                  <Text style={{
                    fontWeight: 'bold',
                    color: COLORS.white,
                    fontSize: 16,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}> Total :   £{totalPrice} </Text>
                </View>
              </View>

              <TouchableOpacity onPress={
                () => this.props.navigation.navigate('Checkout', { products: this.state.products })} style={{ width: '60%' }} activeOpacity={0.7}>
                <View style={{
                  backgroundColor: COLORS.black,
                  justifyContent: 'center',
                  height: 56,
                }}>
                  <Text style={{
                    fontWeight: 'bold',
                    color: COLORS.white,
                    fontSize: 16,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}> CHECKOUT </Text>
                </View>
              </TouchableOpacity>

            </View>
          </View>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  listItem: {
    margin: 3,
    padding: 10,
    backgroundColor: "#FFF",
    width: "97%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
    backgroundColor: COLORS.black,
  }
});