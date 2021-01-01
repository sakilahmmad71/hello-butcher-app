const SET_CART = "SET_CART"
// const REMOVE_CART = "REMOVE_CART"
// const RESET_CART = "RESET_CART"

const cartReducer = (state = 0, action) => {
    switch (action.type) {
        case SET_CART:
            return action.payload

        // case REMOVE_CART:
        //     return action.payload

        // case RESET_CART:
        //     return 0

        default:
            return state
    }
}

export const setCart = (length) => ({ type: SET_CART, payload: length })
// export const removeFromCart = (length) => ({ type: REMOVE_CART, payload: length })
// export const resetCart = () => ({ type: RESET_CART })

export default cartReducer