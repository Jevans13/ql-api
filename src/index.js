import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config()

// import typeDefs from './schema/schema.js';
// import resolvers from './schema/resolvers.js'
import schema from './schema/schema.js';
import EcosystemDatabase from './datasource/index.js';


const knexConfig = {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
};


const db = new EcosystemDatabase(knexConfig);

async function startApolloServer() {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        dataSources: () => ({ db })
    });

    await server.start();
    server.applyMiddleware({ app });
    await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
};

startApolloServer(schema)