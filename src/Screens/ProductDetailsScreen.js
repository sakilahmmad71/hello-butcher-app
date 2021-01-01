import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { Badge } from 'react-native-elements';
import CustomButton from '../Components/CustomButton';
import { CartSchema, WishSchema } from '../Database/Models';
import { COLORS } from '../Utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Utils from '../Utils/Utils';
import AsyncStorage from '@react-native-community/async-storage';
import { USER_CART } from '../Utils/Constants';
// import { connect } from 'react-redux';

const Realm = require('realm');

class ProductDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      from: 'productList',
      quantity: 1,
      cuttingRequirement: '',
      skin: '',
      options: [],
      selectedTabIndex: [
        {
          id: 0,
        },
        {
          id: 0,
        },
        {
          id: 0,
        },
        {
          id: 0,
        },
      ],
      cartLen: "0",
    };
  }

  componentDidMount () {
    const { navigation } = this.props;
    const productInfo = navigation.getParam('productInfo');
    const productObject = JSON.parse(productInfo);

    AsyncStorage.getItem(USER_CART).then((value) => {
      if (value != null) {
        this.setState({ cartLen: value.toString() })
      }
    });

    navigation.getParam('currentPage') == 'productList'
      ? this.setState({
        from: navigation.getParam('currentPage'),
        options: productObject.options,
      })
      : this.setState({
        from: navigation.getParam('currentPage'),
        options: JSON.parse(productObject.options),
        quantity: productObject.productQuantity
      });
    console.log("AAA : " + productObject.options);

    navigation.getParam('currentPage') != 'productList'
      ? JSON.parse(productObject.options).map((item, i) => {
        this.state.selectedTabIndex[i].id = parseInt(item.selected);
        this.forceUpdate();
      })
      : null;
  }

  handleTabIndexChange = (index, i) => {
    this.state.selectedTabIndex[i].id = index;
    this.state.options[i].selected = index;
    this.forceUpdate();
    console.log(index);
  };

  handleBack = () => {
    this.props.navigation.goBack(null);
  };

  goToCart = () => {
    //this.props.navigation.navigate("Cart", { params: 'alert' });
    this.props.navigation.navigate('Cart', { currentPage: 'alert' });
  };

  async updateCart (productObject) {
    const r = new Realm();
    if (!r.isClosed) {
      r.close();
    }

    Realm.open({ schema: [CartSchema], schemaVersion: 1 })
      .then((realm) => {
        const cartList = realm.objects('CartSchema');
        var alreadyInCart = false;

        var cartItem;
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
            cartItem.productQuantity = parseInt(this.state.quantity);
            cartItem.price = productObject.price;
            cartItem.file = productObject.file;
            cartItem.options = JSON.stringify(this.state.options);
            cartItem.weight = productObject.weight;
            cartItem.discount = productObject.discount;
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
            onShow: () => { },
            onHide: () => {
              this.goToCart();
            },
          });
        } else {
          realm.write(() => {

            realm.create('CartSchema', {
              _id: productObject._id,
              productCategoryId: 1,
              title: productObject.title,
              description: productObject.description,
              productQuantity: parseInt(this.state.quantity),
              price: productObject.price,
              file: productObject.file,
              totalPrice: productObject.price,
              options: JSON.stringify(this.state.options),
              weight: productObject.weight,
              discount: productObject.discount,
            });
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
            onShow: () => { },
            onHide: () => {
              this.goToCart();
            },
          });
        }

        AsyncStorage.setItem(USER_CART, realm.objects('CartSchema').length.toString());
        realm.close();

      })
      .catch((error) => {
        console.log(error);
      });
  }

  async addToWish (productObject) {
    const r = new Realm();
    if (!r.isClosed) {
      r.close();
    }

    Realm.open({ schema: [WishSchema], schemaVersion: 1 })
      .then((realm) => {
        realm.write(() => {
          realm.create('WishSchema', {
            _id: productObject._id,
            productCategoryId: 1,
            title: productObject.title,
            description: productObject.description,
            productQuantity: parseInt(this.state.quantity),
            price: productObject.price,
            file: productObject.file,
            totalPrice: productObject.price,
            options: JSON.stringify(this.state.options),
            weight: productObject.weight,
            discount: productObject.discount,
          });
        });

        realm.close();

        Toast.show({
          type: 'success', // success | error | info
          position: 'bottom',
          text1: 'Success!!!',
          text2: 'Product is successfully added to wishlist',
          visibilityTime: 300,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
          onShow: () => { },
          onHide: () => {
            this.handleBack();
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async deleteFromWish (productObject) {
    console.log('delete from wishlist called');
    const r = new Realm();
    if (!r.isClosed) {
      r.close();
    }

    Realm.open({ schema: [WishSchema], schemaVersion: 1 })
      .then((realm) => {
        const wishList = realm.objects('WishSchema');

        realm.write(() => {
          wishList.forEach((wishItem) => {
            console.log(wishItem._id);
            if (wishItem._id == productObject._id) {
              realm.delete(wishItem);
            }
          });
        });

        realm.close();

        Toast.show({
          type: 'success', // success | error | info
          position: 'bottom',
          text1: 'Success!!!',
          text2: 'Product is successfully deleted from wishlist',
          visibilityTime: 300,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
          onShow: () => { },
          onHide: () => {
            this.handleBack();
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render () {
    const { navigation } = this.props;
    const productInfo = navigation.getParam('productInfo');
    //console.log(productInfo);
    const productObject = JSON.parse(productInfo);

    // const { cart } = this.props.cart

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ height: '30%' }}>
            <ImageBackground
              source={{
                uri: productObject.file
                  .toString()
                  .replace('localhost', '198.13.36.60'),
              }}
              style={{
                flex: 1,
                height: '100%',
              }}>

              <TouchableOpacity
                style={styles.backButton}
                onPress={this.handleBack}>
                <Icon name="times-circle" color="#000" size={28} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cartButton}
                onPress={this.goToCart}>
                <Icon name='shopping-cart' color='#000' size={20} />
                <Badge
                  status="error"
                  value={this.state.cartLen}
                  containerStyle={{ position: 'absolute', top: -5, right: -5 }}
                />
              </TouchableOpacity>

            </ImageBackground>
          </View>

          <View
            style={{
              flex: 1,
              borderTopLeftRadius: 0,
              backgroundColor: COLORS.background,
              paddingTop: 20,
              paddingHorizontal: 20,
              paddingBottom: 10,
              height: '55%',
            }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '70%' }}>
                {
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    {productObject.title}
                  </Text>
                }
                {
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#2b2b2b',
                      marginTop: 2,
                    }}>
                    {productObject.description}
                  </Text>
                }
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginTop: 12,
                    marginBottom: 2,
                  }}>
                  Net Weight
                </Text>
                <Text>{Utils.convertWeight(productObject.weight)}</Text>
              </View>

              {
                <View
                  style={{
                    width: '30%',
                    alignItems: 'flex-end',
                  }}>
                  {productObject.discount > 0 ? (
                    <View style={{ flexDirection: 'column' }}>
                      <Text
                        style={{
                          fontSize: 18,
                          marginTop: 4,
                          fontWeight: 'bold',
                          color: COLORS.gray,
                          textDecorationLine: 'line-through',
                        }}>
                        £{productObject.price}
                      </Text>

                      <Text
                        style={{
                          fontSize: 18,
                          marginTop: 4,
                          fontWeight: 'bold',
                          color: COLORS.price,
                        }}>
                        £{productObject.price - productObject.discount}
                      </Text>
                    </View>
                  ) : (
                      <Text
                        style={{
                          fontSize: 18,
                          marginTop: 4,
                          fontWeight: 'bold',
                          color: COLORS.price,
                        }}>
                        £{productObject.price}
                      </Text>
                    )}
                </View>
              }
            </View>

            <View
              style={{
                height: 0.5,
                width: '100%',
                backgroundColor: COLORS.darkGray,
                marginTop: 20,
                marginBottom: 10,
              }}
            />
            {/* ==================================ROW===================================== */}

            <View style={styles.bodyRow}>
              {
                <Text
                  style={{
                    width: '70%',
                    fontWeight: 'bold',
                  }}>
                  Quantity
                </Text>
              }
              <View
                style={{
                  width: '30%',
                  height: 32,
                  alignItems: 'flex-end',
                  flexDirection: 'row',
                }}>
                {
                  <TouchableOpacity
                    onPress={() => {
                      if (this.state.quantity != 1) {
                        this.setState({
                          quantity: this.state.quantity - 1,
                        });
                      }
                    }}>
                    <Icon
                      name="minus-square-o"
                      size={28}
                      color={COLORS.darkGray}
                    />
                  </TouchableOpacity>
                }
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    marginLeft: 20,
                    marginRight: 20,
                  }}>
                  {this.state.quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      quantity: this.state.quantity + 1,
                    });
                  }}>
                  <Icon
                    name="plus-square-o"
                    size={28}
                    color={COLORS.darkGray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                height: 0.5,
                width: '100%',
                backgroundColor: COLORS.darkGray,
                marginTop: 10,
                marginBottom: 10,
              }}
            />

            <View style={{ flex: 0.6, justifyContent: 'center' }}>
              {navigation.getParam('currentPage') == 'productList'
                ? productObject.options.map((product, i) => (
                  <View style={styles.optionRow} key={i}>
                    <Text
                      style={{
                        width: '100%',
                        fontWeight: 'bold',
                        textAlign: 'left',
                      }}>
                      {product.title}
                    </Text>
                    <SegmentedControlTab
                      tabsContainerStyle={styles.tabsContainerStyle}
                      activeTabStyle={styles.activeTabStyle}
                      tabTextStyle={styles.tabTextStyle}
                      activeTabTextStyle={styles.activeTabTextStyle}
                      tabStyle={styles.tabStyle}
                      enabled="true"
                      values={product.values}
                      selectedIndex={this.state.selectedTabIndex[i].id}
                      onTabPress={(index) =>
                        this.handleTabIndexChange(index, i)
                      }
                    />
                  </View>
                ))
                : JSON.parse(productObject.options).map((product, i) => (
                  <View style={styles.optionRow} key={i}>
                    <Text
                      style={{
                        width: '100%',
                        fontWeight: 'bold',
                        textAlign: 'left',
                      }}>
                      {product.title}
                    </Text>
                    <SegmentedControlTab
                      tabsContainerStyle={styles.tabsContainerStyle}
                      activeTabStyle={styles.activeTabStyle}
                      tabTextStyle={styles.tabTextStyle}
                      activeTabTextStyle={styles.activeTabTextStyle}
                      tabStyle={styles.tabStyle}
                      enabled="true"
                      values={product.values}
                      selectedIndex={this.state.selectedTabIndex[i].id}
                      onTabPress={(index) =>
                        this.handleTabIndexChange(index, i)
                      }
                    />
                  </View>
                ))}
            </View>
          </View>

          <View style={styles.footer}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '60%' }}>
                <Text
                  style={{ fontSize: 26, fontWeight: 'bold', color: 'black' }}>
                  Sub Total:
                </Text>
              </View>
              <View style={{ width: '40%', alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: COLORS.price,
                  }}>
                  £
                  {(productObject.price - productObject.discount) *
                    this.state.quantity}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
                alignItems: 'center',
              }}>
              {navigation.getParam('currentPage') == 'wishList' ? (
                <TouchableOpacity
                  onPress={() => this.deleteFromWish(productObject)}>
                  <Icon
                    name="heart"
                    size={36}
                    color={COLORS.price}
                    height={36}
                  />
                </TouchableOpacity>
              ) : (
                  <TouchableOpacity onPress={() => this.addToWish(productObject)}>
                    <Icon
                      name="heart-o"
                      size={36}
                      color={COLORS.price}
                      height={36}
                    />
                  </TouchableOpacity>
                )}

              <View style={{ width: '90%', alignItems: 'flex-end' }}>
                {navigation.getParam('currentPage') == 'cartList' ? (
                  <CustomButton
                    text="UPDATE CART"
                    width="100%"
                    onPress={() => this.updateCart(productObject)}
                  />
                ) : (
                    <CustomButton
                      text="ADD TO CART"
                      width="100%"
                      onPress={() => this.updateCart(productObject)}
                    />
                  )}
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
  },
  backButton: {
    backgroundColor: 'transparent',
    width: 32,
    height: 32,
    marginVertical: 10,
    marginLeft: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  cartButton: {
    backgroundColor: 'transparent',
    width: 32,
    height: 32,
    marginVertical: 10,
    marginRight: 10,
    marginTop: 10,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  bodyRow: {
    flexDirection: 'row',
    marginVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabStyle: {
    paddingVertical: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.black,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  optionRow: {
    marginVertical: 10,
    alignItems: 'center',
  },
  tabsContainerStyle: {
    paddingVertical: 5,
  },
  activeTabStyle: {
    backgroundColor: COLORS.black,
  },
  tabTextStyle: {
    color: COLORS.black,
  },
  activeTabTextStyle: {
    color: COLORS.white,
  },
  footer: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'white',
    position: 'absolute',
    paddingHorizontal: 30,
    paddingVertical: 20,
    bottom: 0,
    height: '15%',
  },
});

// const mapStateToProps = (state) => ({
//   cart: state.cart
// }) // Get cart global store item

export default ProductDetailsScreen
// export default connect(mapStateToProps, {})(ProductDetailsScreen) // Wrapped connect to get and dispatch actions on redux store