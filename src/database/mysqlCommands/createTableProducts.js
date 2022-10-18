const database = require('../databaseMysql.js')

const createTableInsertProducts = async () => {
    try {
        await database.schema.dropTableIfExists('products')

        await database.schema.createTable('products', table =>{
            table.increments('id').primary()
            table.string('title', 150).notNullable()
            table.string('price', 50).notNullable()
            table.string('thumbnail', 150).notNullable()
        })
        console.log("Products table Created")

        const products = []

        await database('products').insert(products)

        console.log('products inserted!')

        database.destroy()

    } catch (error) {
        console.log(error)
    }
}

createTableInsertProducts()