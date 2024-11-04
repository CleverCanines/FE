import { ApolloClient, InMemoryCache } from '@apollo/client';
import Constants from 'expo-constants';

const { manifest } = Constants;
// The GraphQL URL
// localhost: 'http://localhost:8080/graphql'
// connecting via ngrok: 'https://cockatoo-precise-sponge.ngrok-free.app/graphql'
const uri = 'https://cockatoo-precise-sponge.ngrok-free.app/graphql';

export const client = new ApolloClient({
    uri: uri,
    cache: new InMemoryCache()
});

