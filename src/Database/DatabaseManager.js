const Realm = require('realm');
import { CartSchema, ProductSchema } from './Models'

export const BadgeUtil = {
    cartLength: () => {
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
                const cartList = realm.objects('CartSchema');
                return cartList.length;
            }
        ).catch(error => {
            console.log(error);
            return 0;
        });
        return 0;
    }
}

export class CartManager {

    constructor() {
    }

    addToCart({ productObject }) {

        console.log('data is ' + productObject);
    }

    deleteAllFromCart() {
        Realm.open(
            {
                schema: [CartSchema, ProductSchema],
                schemaVersion: 1,
            }
        ).then(
            realm => {
                realm.write(() => {
                    const cartList = realm.objects('CartSchema');
                    realm.delete(cartList);
                })

                let cartListLength = realm.objects('CartSchema').length;
                console.debug('Total Number Of Your Cart Data is : ' + cartListLength)
                realm.close();
            }
        ).catch(error => {
            console.log(error);
        });
    }

    getAllCart() {
        Realm.open(
            {
                schema: [CartSchema, ProductSchema]
            }
        ).then(
            realm => {
                const cartList = realm.objects('CartSchema');
                realm.close();
                return cartList;
            }
        ).catch(error => {
            console.log(error);
        });
    }
}

export class ProductManager {

    constructor() { }

    getAllProduct() {
        Realm.open(
            {
                schema: [CartSchema, ProductSchema],
                schemaVersion: 1,
            }
        ).then(
            realm => {
                //const productList = realm.objects('ProductSchema').length;
                realm.close();
                return '1';
            }
        ).catch(error => {
            console.log(error);
        });
    }

    addProduct() {

        console.log('Add product method called');

        Realm.open(
            {
                schema: [ProductSchema],
                schemaVersion: 1,
            }).then(realm => {

                const productListLength = realm.objects('ProductSchema').length;
                if (productListLength > 0) {
                    console.log('products already added');
                    return;
                } else {

                    realm.write(() => {

                        var index = 1;

                        for (index; index <= 10; index++) {

                            realm.create(
                                'ProductSchema',
                                {
                                    _id: index,
                                    productCategoryId: 1,
                                    productName: 'Chicken with Skin ' + index,
                                    productDescription: 'Product Detail',
                                    productQuantity: 1,
                                    productPrice: 99.99,
                                    productImage: "1"
                                });

                        }

                        for (index = 11; index <= 20; index++) {

                            realm.create(
                                'ProductSchema',
                                {
                                    _id: index,
                                    productCategoryId: 2,
                                    productName: 'Fresh Beef ' + index,
                                    productDescription: 'Product Detail',
                                    productQuantity: 1,
                                    productPrice: 99.99,
                                    productImage: "2"
                                });

                        }

                        for (index = 21; index <= 30; index++) {

                            realm.create(
                                'ProductSchema',
                                {
                                    productId: index,
                                    productCategoryId: 3,
                                    productName: 'Fresh Mutton ' + index,
                                    productDescription: 'Product Detail',
                                    productQuantity: 1,
                                    productPrice: 99.99,
                                    productImage: "3"
                                });

                        }

                        for (index = 31; index <= 40; index++) {

                            realm.create(
                                'ProductSchema',
                                {
                                    _id: index,
                                    productCategoryId: 4,
                                    productName: 'Other ' + index,
                                    productDescription: 'Product Detail',
                                    productQuantity: 1,
                                    productPrice: 99.99,
                                    productImage: "4"
                                });

                        }

                    });

                    //let productListLength = realm.objects('ProductSchema').length;
                    //console.debug('Total Number Of Your Product Data is : ' + productListLength)

                }

                realm.close();

            }).catch(error => {
                console.log(error);
            });
    }

}