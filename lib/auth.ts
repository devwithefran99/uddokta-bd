import { betterAuth} from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("uddokta-bd");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
    emailAndPassword: { 
    enabled: true, 
  }, 
  user: {
    changeEmail: {
      enabled: true,
      // No email provider is configured, so allow unverified accounts to
      // change their email immediately instead of sending a verification link.
      updateEmailWithoutVerification: true,
    },
  },
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

    plugins: [
  jwt({
    jwt: {
      issuer: process.env.BETTER_AUTH_URL,
      audience: process.env.BETTER_AUTH_URL,
    },
  }),
],
    session: {
      cookieCache: {
        enabled: true,
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      }
    }
});