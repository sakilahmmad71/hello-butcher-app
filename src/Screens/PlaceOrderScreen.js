import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import { CartManager } from '../Database/DatabaseManager'
import { CartSchema } from '../Database/Models'
import CustomHeader from '../Components/CustomHeader';
import { COLORS } from '../Utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome'
import CustomButton from '../Components/CustomButton';

const Realm = require('realm');
const cartManager = new CartManager();

export default class PlaceOrderScreen extends React.Component {

    constructor(props) {
        super(props);
        this.onFocusFunction();
    }

    state = {
        realmObj: null,
        products: [],
        totalPrice: 0,
    }

    onFocusFunction = () => {
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

                let jsonData = JSON.parse(JSON.stringify(Array.prototype.slice.call(productList, 0, productList.length)));
                this.setState({ products: jsonData, realmObj: realm });

                console.log(jsonData);
                realm.close();
            }
        ).catch(error => {
            console.log(error);
        });
    }

    async componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            // this.onFocusFunction()
        })
    }

    componentWillUnmount() {
        this.focusListener.remove()
    }

    async onProductDetailPress(item) {
        this.props.navigation.navigate("ProductDetails", { productInfo: JSON.stringify(item) });
    }

    render() {
        return (
            <View style={styles.container}>
                <CustomHeader title="Carts" navigation={this.props.navigation} />
                <FlatList
                    style={{ flex: 1, marginTop: 3, marginBottom: 3 }}
                    data={this.state.products}
                    renderItem={({ item }) =>
                        <TouchableWithoutFeedback onPress={() => this.onProductDetailPress(item)}>
                            <View style={styles.listItem}>
                                <Image source={require('../Assets/chicks.jpg')} style={{ width: 60, height: 60, borderRadius: 30 }} />
                                <View style={{ alignItems: "flex-start", justifyContent: "center", flex: 1, marginLeft: 20 }}>
                                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
                                    <Text style={{ color: COLORS.darkGray, fontSize: 12 }}>Product Weight</Text>
                                    <Text style={{ fontWeight: "bold", color: COLORS.price }}>{item.price}$</Text>
                                </View>
                                <View style={{ alignItems: "flex-end", justifyContent: "center", marginRight: 10 }}>
                                    <Icon name='trash-o' size={24} color={COLORS.price} />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>}
                    keyExtractor={item => item.productId.toString()}
                />
                <View>
                    <View style={styles.basketContainerStyle}>
                        <Text style={styles.bagsTextStyle}>Products Price</Text>
                        <Text style={styles.priceTextStyle}>$1.50</Text>
                    </View>
                    <View style={styles.basketContainerStyle}>
                        <Text style={styles.bagsTextStyle}>Vat.</Text>
                        <Text style={styles.priceTextStyle}>$1.50</Text>
                    </View>
                    <View style={styles.basketContainerStyle}>
                        <Text style={styles.bagsTextStyle}>Total</Text>
                        <Text style={styles.priceTextStyle}>$3.00</Text>
                    </View>
                </View>
                <View style={{ alignItems: "center", justifyContent: "center", marginRight: 10, marginTop: 10 }}>
                    <CustomButton
                        text='PLACE ORDER'
                        buttonWidthPercentage="80%"
                        marginTop={0}
                        marginBottom={44}
                        onPress={this.handleLogin} />
                </View>
            </View>
        );
    }
}

function Item({ item }) {
    var imagePath = item.productImage.substring(3, 23);
    return (
        <View style={styles.listItem}>
            <TouchableWithoutFeedback onPress={() => this.onProductDetailPress(item)}>
                <Image source={require('../Assets/chicks.jpg')} style={{ width: 60, height: 60, borderRadius: 30 }} />
                <View style={{ alignItems: "flex-start", justifyContent: "center", flex: 1, marginLeft: 20 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.productName}</Text>
                    <Text style={{ color: COLORS.darkGray, fontSize: 12 }}>Product Weight</Text>
                    <Text style={{ fontWeight: "bold", color: COLORS.price }}>{item.productPrice}$</Text>
                </View>
                <View style={{ alignItems: "flex-end", justifyContent: "center", marginRight: 10 }}>
                    <Icon name='trash-o' size={24} color={COLORS.price} />
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    basketContainerStyle: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#e2e2e2',
        backgroundColor: '#DCDCDC'
    },
    bagsTextStyle: {
        fontSize: 12
    },
    priceTextStyle: {
        fontSize: 12,
    },
});