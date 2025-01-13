import { ID, Client, Account } from 'appwrite'

export class AuthService {
  client = new Client()
  account

  constructor() {
    this.client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67349ddb00238eae5212')
    this.account = new Account(this.client)
  }

  async CreateAccount({email, password, name}) {
    console.log({email, password, name});
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name)
      if(userAccount) {
        return this.SignIn({email, password})
      } else {
        return userAccount
      }
    } catch (error) {
      console.log(`error in createAccount: ${error}`)
    }
  }

  async SignIn({email, password}) {
    try {
      return await this.account.createEmailPasswordSession(email, password)
    } catch (error) {
      console.log(`error in SignIn: ${error}`)
    }
  }

  async GetCurrentUser() {
    try {
      return await this.account.get()
    } catch (error) {
      console.log(`error in GetCurrentUser: ${error}`)
    }
  }

  async UpdateUserName(user_name) {
    try {
      return await this.account.updateName(user_name)
    } catch (error) {
      console.log(`error in GetCurrentUser: ${error}`)
    }
  }

  async UpdatePassword(password) {
    try {
      return await this.account.updatePassword(password)
    } catch (error) {
      console.log(`error in GetCurrentUser: ${error}`)
    }
  }

  async SignOut() {
    try {
      return await this.account.deleteSessions()
    } catch (error) {
      console.log(`error in SignOut: ${error}`)
    }
  }
}

const authService = new AuthService()

export default authService