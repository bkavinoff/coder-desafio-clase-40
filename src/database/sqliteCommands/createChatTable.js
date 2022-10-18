const database = require('../databaseSqlite.js')

const createTableInsertChat = async () => {
    try {
        await database.schema.dropTableIfExists('chat')

        await database.schema.createTable('chat', table => {
            table.increments('id').primary()
            table.string('userEmail', 100).notNullable()
            table.string('message', 500). notNullable()
        })

        console.log("Chat table created")

        const chats = []

        await database('chat').insert(chats)

        console.log("History chat added!")

        database.destroy()

    } catch (error) {
        console.log(error)
    }
}

createTableInsertChat()