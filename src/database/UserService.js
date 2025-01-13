import { Client, Databases, Storage, ID } from "appwrite"

export class UserService {
  client = new Client()
  databases
  bucket

  databaseId = '67349f580014ea914a52'
  collectionId = '6757c4b4001a5199a073'

  constructor () {
    this.client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67349ddb00238eae5212')
    this.databases = new Databases(this.client)
    this.bucket = new Storage(this.client)
  }

  async CreateUserDetails({ userId, location }) {
    console.log({ location })
    try {
      const userData = await this.databases.createDocument(
        this.databaseId,
        this.collectionId,
        userId,
        { location }
      )
      console.log(userData)
      return userData
    } catch (error) {
        console.log(`error in CreateUserDetails: ${error}`)
      return false
    }
  }
  
  async Get(slug) {
    try {
      return await this.databases.getDocument(
        this. databaseId, 
        this.collectionId,
        slug
      )
    } catch (error) {
      console.log(`error in Get: ${error}`)
      return false
    }
  }

  async GetAll(queries = [Query.select(['location', 'pic_url'])]) {
    try {
      return await this.databases.listDocuments(
        this. databaseId,
        this.collectionId,
        [queries, Query.limit(1000)]
      )
    } catch (error) {
      console.log(`error in GetAll: ${error}`)
      return false
    }
  }


  async Update(documentId, {location, pic_url}) {
    console.log(documentId, location, pic_url)
    try {
      return await this.databases.updateDocument(
        this.databaseId,
        this.collectionId,
        documentId,
        {location, pic_url}
      )
    } catch (error) {
      console.log(`error in Update: ${error}`)
      return false
    }
  }
  
}

const userServices = new UserService()
export default userServices;
