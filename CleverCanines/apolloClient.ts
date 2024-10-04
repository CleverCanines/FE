import { ApolloClient, InMemoryCache } from '@apollo/client';
import Constants from 'expo-constants';

const { manifest } = Constants;
const uri = manifest?.debuggerHost
  ? `http://${manifest.debuggerHost.split(':').shift()}:8080/graphql`
  : 'http://localhost:8080/graphql'; // Fallback URL for non-Expo environments

export const client = new ApolloClient({
    uri: uri,
    cache: new InMemoryCache()
});

