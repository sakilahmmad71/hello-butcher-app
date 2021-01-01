import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    Text,
    View,
    Image,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import { Badge } from 'react-native-elements';
import { Body, Header, Left, Right } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../Utils/colors';
import ApiHandler from '../Utils/ApiHandler';
import Utils from '../Utils/Utils';
import LoadingPlaceholderScreen from '../Screens/LoadingPlaceholderScreen';
import CustomLottieView from '../Components/LottieProgress'
import AsyncStorage from '@react-native-community/async-storage';
import { USER_CART } from '../Utils/Constants';

const Realm = require('realm');

const shuffleDeck = (array) => {
    let i = array.length - 1;
    for (i; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

export default class ProductListItemScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            realmObj: null,
            products: [],
            confirmResult: null,
            bodyType: 2,
            message: "",
            cartLen: "0",
        }
    }

    componentDidMount() {
        this.setState({ bodyType: 2 })

        AsyncStorage.getItem(USER_CART).then((value) => {
            if (value != null) {
                this.setState({ cartLen: value.toString() })
            }
          });

        setTimeout(() => {

            switch (this.props.navigation.getParam("type")) {
                case "chicken":
                case "beef":
                case "sheep":
                case "lamb":
                case "mutton":
                    ApiHandler.getAllProductsByCategoryApi(this.props.navigation.getParam("type"))
                        .then((response) => {
                            if (response.code == 200) {
                                this.setState({ bodyType: 1, products: response.products })
                            } else if (response.code == 404) {
                                console.log(response.errors);
                                this.setState({ confirmResult: null, bodyType: 0, message: response.errors.message })

                            } else {
                                console.log('unknown error')
                                this.setState({ bodyType: 0, message: 'unknown error !!!' })
                            }
                        })
                        .catch((error) => {
                            console.error("Response Error : " + error);
                            this.setState({ bodyType: 0, message: 'unknown error !!!' })
                        });
                    break;

                case "all":
                    ApiHandler.getAllProductsApi()
                        .then((response) => {
                            if (response.code == 200) {
                                //console.log(response.code + "\n" + JSON.stringify(response));
                                this.setState({ bodyType: 1, products: response.products })
                            } else if (response.code == 404) {
                                console.log(response.errors);
                                this.setState({ confirmResult: null, bodyType: 0, message: response.errors.message })

                            } else {
                                console.log('unknown error')
                                this.setState({ bodyType: 0, message: 'unknown error !!!' })
                            }
                        })
                        .catch((error) => {
                            console.error("Response Error : " + error);
                            this.setState({ bodyType: 0, message: 'unknown error !!!' })
                        });
                    break;
            }
        }, 200)
    }

    async onProductDetailPress(item) {
        this.props.navigation.navigate("ProductDetails", { productInfo: JSON.stringify(item), currentPage: 'productList' });
    }

    handleBack = (text) => {
        this.props.navigation.goBack(null);
    }

    goToCart = () => {
        this.props.navigation.navigate("Cart");
    };

    renderEmptyView = () => {
        return (
            <View></View>
        );
    }

    render() {
        return (
            <View style={styles.MainContainer} >
                <Header style={{ backgroundColor: 'transparent', elevation: 0, marginHorizontal: 10 }}>
                    <Left>
                        <TouchableOpacity onPress={this.handleBack}>
                            <Icon name='arrow-left' color='#000' size={20} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <Text style={{ color: '#2b2b2b', fontSize: 18, fontWeight: 'bold' }}>
                            {this.props.navigation.getParam("type").toUpperCase()}
                        </Text>
                    </Body>
                    <Right>
                        <TouchableOpacity onPress={this.goToCart}>
                            <Icon name='shopping-cart' color='#000' size={20} />
                            <Badge
                                status="error"
                                value = {this.state.cartLen}
                                containerStyle={{ position: 'absolute', top: -10, right: -10 }}
                            />
                        </TouchableOpacity>
                    </Right>
                </Header>

                {
                    (() => {

                        switch (this.state.bodyType) {
                            case 0:
                                return (<CustomLottieView path={require('../Assets/lottie_product_not_found.json')} message={this.state.message} />)
                            case 1:
                                return (<FlatList
                                    style={{ backgroundColor: COLORS.background }}
                                    data={this.state.products}
                                    renderItem={({ item }) =>
                                        <TouchableWithoutFeedback onPress={() => this.onProductDetailPress(item)}>
                                            <View style={styles.GridViewBlockStyle}>
                                                <View>
                                                    <Image source={{ uri: item.file.toString().replace("localhost", "198.13.36.60") }} style={styles.productImage} />
                                                    {
                                                        item.discount > 0 ?
                                                            <Image source={require('../Assets/sale.png')} style={styles.discountImage} />
                                                            :
                                                            <Image source={require('../Assets/no_sale.png')} style={styles.discountImage} />
                                                    }
                                                </View>
                                                <View style={styles.productDetails}>
                                                    <Text style={{ fontSize: 14, margin: 4, textAlign: 'center' }}>{item.title}</Text>
                                                    <Text style={{ fontSize: 13, color: COLORS.darkGray }}>{Utils.convertWeight(item.weight)}</Text>

                                                    {
                                                        item.discount > 0 ?
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Text style={{ fontSize: 16, marginTop: 4, fontWeight: 'bold', color: COLORS.gray, textDecorationLine: 'line-through' }}>£{item.price}</Text>
                                                                <Text style={{ fontSize: 16, marginTop: 4, fontWeight: 'bold', color: COLORS.price, marginLeft: 3 }}>£{item.price - item.discount}</Text>
                                                            </View>
                                                            :
                                                            <Text style={{ fontSize: 16, marginTop: 4, fontWeight: 'bold', color: COLORS.price }}>£{item.price}</Text>
                                                    }
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    }
                                    keyExtractor={item => item._id}
                                    numColumns={2}
                                />)

                            case 2:
                                return (<LoadingPlaceholderScreen />)
                            default:
                                break
                        }

                    })()
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({

    MainContainer: {
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        flex: 1,
        paddingTop: (Platform.OS) === 'ios' ? 0 : 0,
    },

    GridViewBlockStyle: {
        justifyContent: 'center',
        flex: .5,
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
        paddingVertical: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },

    GridViewInsideTextItemStyle: {
        color: '#fff',
        padding: 10,
        fontSize: 18,
        justifyContent: 'center',
    },

    categoryTitle: {
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 15,
    },

    productImage: {
        height: 120,
        width: 120,
        borderRadius: 60,
        backgroundColor: COLORS.background
    },

    discountImage: {
        height: 24,
        width: 24,
        backgroundColor: 'transparent',
        position: 'absolute',
        right: -20,
        top: -10,
    },

    productDetails: {
        alignItems: 'center',
        marginTop: 5,
    }
});