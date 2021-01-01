import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

const CategoryItem = ({ name, categoryImage }) => {
    return (
        <View>
            <View style={styles.imgBackgroud}>
                <Image source={categoryImage} style={styles.iconStyle} />
            </View>
            <Text style={styles.txtStyle}>{name}</Text>
        </View>
    )
}

export default CategoryItem

const styles = StyleSheet.create({
    imgBackgroud: {
        backgroundColor: 'tomato',
        padding: 10,
        marginRight: 10,
        borderRadius: 10,

    },
    iconStyle: {
        width: 50,
        height: 50,
    },
    txtStyle: {
        textAlign: "center"
    }
})
