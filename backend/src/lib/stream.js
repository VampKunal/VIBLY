import {StreamChat} from "stream-chat"
import dotenv from "dotenv"


dotenv.config()

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET
const client = StreamChat.getInstance(apiKey, apiSecret)

export const upsertUser=async (userData)=>{
    try {
        await client.upsertUser(userData)
        return userData;
        
    } catch (error) {
        console.error("Error upserting user:", error)
        throw new Error("Failed to upsert user")
        
    }


}
export const generateStreamToken = (userId) => {
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    return client.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};