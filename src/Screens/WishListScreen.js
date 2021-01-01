import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { CartSchema, WishSchema } from '../Database/Models';
import CustomHeader from '../Components/CustomHeader';
import { COLORS } from '../Utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomLottieView from '../Components/LottieProgress';
import Utils from '../Utils/Utils';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-community/async-storage';
import { USER_CART } from '../Utils/Constants';
import { connect } from 'react-redux';
import { setCart } from '../Redux/reducers/cartReducer'

const Realm = require('realm');

class WishListScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    realmObj: null,
    products: [],
    isEmpty: true,
  };

  onFocusFunction = () => {
    const r = new Realm();
    if (!r.isClosed) {
      r.close();
    }
    this.setState({ isEmpty: true });
    Realm.open({
      schema: [CartSchema, WishSchema],
      schemaVersion: 1,
    })
      .then((realm) => {
        const productList = realm.objects('WishSchema');
        if (productList.length > 0) {
          this.setState({ isEmpty: false });
        }
        let jsonData = JSON.parse(
          JSON.stringify(
            Array.prototype.slice.call(productList, 0, productList.length),
          ),
        );
        this.setState({ products: jsonData, realmObj: realm });
        AsyncStorage.setItem(USER_CART, realm.objects('CartSchema').length.toString());
        // Here dispatching redux
        this.props.setCart(realm.objects('CartSchema').length.toString())
        realm.close();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // add a focus listener onDidMount
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
  }

  // and don't forget to remove the listener
  componentWillUnmount() {
    this.focusListener.remove();
  }

  async onProductDetailPress(item) {
    this.props.navigation.navigate('ProductDetails', {
      productInfo: JSON.stringify(item),
      currentPage: 'wishList',
    });
  }

  onAddToCart = (item) => {
    console.log('onAddToCart' + item.title);
    this.updateCart(item, 1);
  };

  async onAddAllToCart() {
    console.log('onAddAllToCart');
    this.updateCart(this.state.products, 2)
  };

  async updateCart(productObject, type) {
    const r = new Realm();
    if (!r.isClosed) {
      r.close();
    }

    Realm.open({ schema: [CartSchema, WishSchema], schemaVersion: 1 })
      .then((realm) => {

        const cartList = realm.objects('CartSchema');
        var alreadyInCart = false;
        var cartItem;

        if (type == 2) {
          productObject.forEach(itemObject => {

            cartList.forEach((item) => {
              if (item._id == itemObject._id) {
                alreadyInCart = true;
                cartItem = item;
                return false;
              }
            });

            if (alreadyInCart) {

              console.log('Already in cart');

              realm.write(() => {
                cartItem._id = itemObject._id;
                cartItem.productCategoryId = 1;
                cartItem.title = itemObject.title;
                cartItem.description = itemObject.description;
                cartItem.productQuantity = itemObject.productQuantity;
                cartItem.price = itemObject.price;
                cartItem.file = itemObject.file;
                cartItem.options = itemObject.options;
                cartItem.weight = itemObject.weight;
                cartItem.discount = itemObject.discount;

                const wish = realm.objects('WishSchema').filtered("_id == " + JSON.stringify(itemObject._id));
                if (wish.length >= 1) {
                  realm.delete(wish)
                }

              });

            } else {
              realm.write(() => {
                realm.create('CartSchema', {
                  _id: itemObject._id,
                  productCategoryId: 1,
                  title: itemObject.title,
                  description: itemObject.description,
                  productQuantity: itemObject.productQuantity,
                  price: itemObject.price,
                  file: itemObject.file,
                  totalPrice: itemObject.price,
                  options: itemObject.options,
                  weight: itemObject.weight,
                  discount: itemObject.discount,
                });
                const wish = realm.objects('WishSchema').filtered("_id == " + JSON.stringify(itemObject._id));
                if (wish.length >= 1) {
                  realm.delete(wish)
                }
              });
            }

          })

          Toast.show({
            type: 'success', // success | error | info
            position: 'bottom',
            text1: 'Success!!!',
            text2: 'All Products are successfully updated to cart',
            visibilityTime: 300,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
            onShow: () => {
              realm.close();
              this.onFocusFunction()
            },
            onHide: () => { },
          });

          return;
        }


        cartList.forEach((item) => {
          if (item._id == productObject._id) {
            alreadyInCart = true;
            cartItem = item;
            return false;
          }
        });

        if (alreadyInCart) {

          console.log('Already in cart');

          realm.write(() => {
            cartItem._id = productObject._id;
            cartItem.productCategoryId = 1;
            cartItem.title = productObject.title;
            cartItem.description = productObject.description;
            cartItem.productQuantity = productObject.productQuantity;
            cartItem.price = productObject.price;
            cartItem.file = productObject.file;
            cartItem.options = productObject.options;
            cartItem.weight = productObject.weight;
            cartItem.discount = productObject.discount;

            const wish = realm.objects('WishSchema').filtered("_id == " + JSON.stringify(productObject._id));
            if (wish.length >= 1) {
              realm.delete(wish)
            }

          });

          Toast.show({
            type: 'success', // success | error | info
            position: 'bottom',
            text1: 'Success!!!',
            text2: 'Product is successfully updated to cart',
            visibilityTime: 300,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
            onShow: () => {
              realm.close();
              this.onFocusFunction()
            },
            onHide: () => { },
          });
        } else {
          realm.write(() => {
            realm.create('CartSchema', {
              _id: productObject._id,
              productCategoryId: 1,
              title: productObject.title,
              description: productObject.description,
              productQuantity: productObject.productQuantity,
              price: productObject.price,
              file: productObject.file,
              totalPrice: productObject.price,
              options: productObject.options,
              weight: productObject.weight,
              discount: productObject.discount,
            });
            const wish = realm.objects('WishSchema').filtered("_id == " + JSON.stringify(productObject._id));
            if (wish.length >= 1) {
              realm.delete(wish)
            }
            // 
          });


          Toast.show({
            type: 'success', // success | error | info
            position: 'bottom',
            text1: 'Success!!!',
            text2: 'Product is successfully added to cart',
            visibilityTime: 300,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
            onShow: () => {
              realm.close();
              this.onFocusFunction()
            },
            onHide: () => { },
          });
        }

      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <CustomHeader title="Wish List" navigation={this.props.navigation} />
          {this.state.isEmpty ? (
            <CustomLottieView
              path={require('../Assets/lottie_empty_wishlist.json')}
              message="No Product added into Wish List"
              size={96}
            />
          ) : (
              <FlatList
                style={{
                  flex: 1,
                  marginTop: 3,
                  marginBottom: 3,
                  backgroundColor: COLORS.background,
                }}
                data={this.state.products}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback
                    onPress={() => this.onProductDetailPress(item)}>
                    <View style={styles.listItem}>
                      <Image
                        source={{
                          uri: item.file
                            .toString()
                            .replace('localhost', '198.13.36.60'),
                        }}
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                      />
                      <View
                        style={{
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                          flex: 1,
                          marginLeft: 20,
                        }}>
                        <Text style={{ fontWeight: 'normal', fontSize: 16 }}>
                          {item.title}
                        </Text>
                        <Text style={{ color: COLORS.darkGray, fontSize: 12 }}>
                          {Utils.convertWeight(item.weight)}
                        </Text>
                        <Text style={{ fontWeight: 'bold', color: COLORS.price }}>
                          £{item.price}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          marginRight: 10,
                        }}
                        onPress={() => this.onAddToCart(item)}>
                        <Icon name="cart-plus" color={COLORS.black} size={24} />
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                keyExtractor={(item) => item._id.toString()}
              />
            )}
          {!this.state.isEmpty ? (
            <TouchableOpacity
              onPress={() => this.onAddAllToCart()}
              style={{ width: '100%' }}
              activeOpacity={0.7}>
              <View
                style={{
                  backgroundColor: COLORS.black,
                  justifyContent: 'center',
                  height: 56,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: COLORS.white,
                    fontSize: 16,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}>
                  {' '}
                  ADD TO CART{' '}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

/*
function Item({ item }) {
  //var imagePath = item.productImage.substring(3, 23);
  return (
    <TouchableWithoutFeedback onPress={() => this.onProductDetailPress(item)}>
      <View style={styles.listItem}>
        <Image source={require('../Assets/chicks.jpg')} style={{ width: 60, height: 60, borderRadius: 30 }} />
        <View style={{ alignItems: "flex-start", justifyContent: "center", flex: 1, marginLeft: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.productName}</Text>
          <Text style={{ color: COLORS.darkGray, fontSize: 12 }}>Product Weight</Text>
          <Text style={{ fontWeight: "bold", color: COLORS.price }}>{item.productPrice}$</Text>
        </View>
        <View style={{ alignItems: "flex-end", justifyContent: "center", marginRight: 10 }}>
          <Icon name='trash-o' size={24} color={COLORS.price} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listItem: {
    margin: 3,
    padding: 10,
    backgroundColor: '#FFF',
    width: '97%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
});

const mapStateToProps = (state) => ({
  cart: state.cart
})

export default connect(mapStateToProps, { setCart })(WishListScreen)