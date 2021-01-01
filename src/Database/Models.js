export const USER_SCHEMA = 'UserSchema';
export const PRODUCT_SCHEMA = 'ProductSchema';
export const CART_SCHEMA = 'CartSchema';
export const WISH_SCHEMA = 'WishSchema';
export const TOKEN_SCHEMA = 'TokenSchema';

export const UserSchema = {
    name: USER_SCHEMA,
    properties: {
        username: 'string',
        email: 'string',
        phone: 'string',
        password: 'string'
    }
};

export const ProductSchema = {
    name: PRODUCT_SCHEMA,
    primaryKey: '_id',
    properties: {
        _id: 'string',
        productCategoryId: 'int',
        title: 'string',
        description: 'string',
        productQuantity: { type: 'int', default: 1 },
        price: 'string',
        file: 'string',
        totalPrice: 'string',
        weight: 'string',
        discount: 'string',
    }
};

export const CartSchema = {
    name: CART_SCHEMA,
    properties: {
        _id: 'string',
        productCategoryId: 'int',
        title: 'string',
        description: 'string',
        productQuantity: { type: 'int', default: 1 },
        price: 'string',
        file: 'string',
        totalPrice: 'string',
        options: 'string',
        weight: 'string',
        discount: 'string',
    }
}

export const WishSchema = {
    name: WISH_SCHEMA,
    primaryKey: '_id',
    properties: {
        _id: 'string',
        productCategoryId: 'int',
        title: 'string',
        description: 'string',
        productQuantity: { type: 'int', default: 1 },
        price: 'string',
        file: 'string',
        totalPrice: 'string',
        options: 'string',
        weight: 'string',
        discount: 'string',
    }
}

export const TokenSchema = {
    name: TOKEN_SCHEMA,
    properties: {
        
    }
}