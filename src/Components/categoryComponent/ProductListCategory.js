import React from 'react'
import { StyleSheet, Text, View, ScrollView, List, ListItem } from 'react-native'
import CategoryItem from './CategoryItem'

const types = [
    {
        name: "chicken",
        categoryImage: require('../../Assets/category_chicken.png')
    },
    {
        name: "meet",
        categoryImage: require('../../Assets/meat.png')
    },
    {
        name: "meet",
        categoryImage: require('../../Assets/meat.png')
    },
    {
        name: "meet",
        categoryImage: require('../../Assets/meat.png')
    },
    {
        name: "meet",
        categoryImage: require('../../Assets/meat.png')
    }
]

const ProductListCategory = () => {
    return (
        <View>
            <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
                <View style={styles.CategoryItem}>
                    {types.map((item) => { return <CategoryItem {...item} /> })
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default ProductListCategory

const styles = StyleSheet.create({
    CategoryItem: {
        flexDirection: 'row',
        margin: 20
    }
})
