// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export default NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
      authorization: {
        url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
        params: {
          scope: "openid profile email offline_access",
          response_type: "code",
        },
      },
      token: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
});
