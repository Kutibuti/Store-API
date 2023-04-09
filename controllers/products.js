const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product
        .find({ price: { $gt: 30 } })
        .select('name price')
        .sort('price')
    res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, limit } = req.query
    const queryObject = {}
    if (featured) {
        queryObject.featured = featured === "true" ? true : false
    }

    if (company) {
        queryObject.company = company
    }

    if (name) {
        queryObject.name = { $regex: name, $options: "i" }
    }
    let result = Product.find(queryObject)
    if (fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    if (limit) {
        const limitValue = Number(req.body.limit)
        result = result.limit(limitValue)
    }
    products = await result
    res.status(200).json({ nbHits: products.length, products })
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}