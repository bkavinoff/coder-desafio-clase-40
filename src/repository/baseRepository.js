class BaseRepository {
    constructor(collection){
        this.collection = collection
    }
    async getAll(){
        return await this.collection.find()
    }

    async getById(id){
        return await this.collection.findById(id)
    }

    async create(newEntity){
        return await this.collection.create(newEntity)
    }

    async update(id, updateData){
        return await this.collection.updateOne({_id: id}, updateData)
    }

    async delete(id){
        return await this.collection.deleteOne({_id: id})
    }
}

export default BaseRepository