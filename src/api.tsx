import dataProvider, {GraphQLClient} from "@pankod/refine-strapi-graphql";

const production = false;
let API_URL = "http://dev.olbongo.com:8383/graphql/";
if (production) {
  API_URL = "http://meetings.nictanzania.co.tz/graphql";
}

export const client = new GraphQLClient(API_URL);
export const gqlDataProvider = dataProvider(client);

if (localStorage.getItem("token")) {
  client.setHeader("Authorization", `Bearer ${localStorage.getItem("token")}`);
}
