import { Client, Databases, Storage, Query, ID } from "appwrite"

export class BayService {
  client = new Client()
  databases
  bucket

  constructor () {
    this.client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67349ddb00238eae5212')
    this.databases = new Databases(this.client)
    this.bucket = new Storage(this.client)
  }

  async CreateBayDetails({ vin, bay_name, img, mid }) {
    console.log({ vin, bay_name, img, mid })
    try {
      const userData = await this.databases.createDocument(
        '67349f580014ea914a52',
        '6757c3ef0028363f4759',
        ID.unique(),
        { vin, bay_name, img, mid }
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
      return await this.databases.getDocument('67349f580014ea914a52', '6757c3ef0028363f4759', slug)
    } catch (error) {
      console.log(`error in Get: ${error}`)
      return false
    }
  }

  async GetAll(queries = [Query.select(['vin', 'bay_name', 'img', 'mid'])]) {
    try {
      return await this.databases.listDocuments('67349f580014ea914a52', '6757c3ef0028363f4759', [queries, Query.limit(1000)])
    } catch (error) {
      console.log(`error in GetAll: ${error}`)
      return false
    }
  }

  async Update(vin, { bay_name, imgId }) {
    console.log(bay_name, imgId)
    try {
      return await this.databases.updateDocument(
        '65e74275cf504aad7b45',
        '65e743eee5fabd2160df',
        vin,
        { bay_name, imgId }
      )
    } catch (error) {
      console.log(`error in Update: ${error}`)
      return false
    }
  }

  async UploadFile(file) {
    console.log(file)
    try {
      return await this.bucket.createFile('67349f9f0007ec26fd6c', ID.unique(), file)
    } catch (error) {
        console.log("Appwrite service :: UploadFile :: ", error);
        return false
    }
  }

  GetFilePreview(imgId) {
    return this.bucket.getFilePreview('67349f9f0007ec26fd6c', imgId).href
  }

}

const bayServices = new BayService()
export default bayServices;
