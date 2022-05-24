const express = require('express');
const path = require('path');
//import apollo server
const { ApolloServer } = require('apollo-server-express');
// import typeDefs and resolvers
const { typeDefs, resolvers} = require('./schema');
const {authMiddleware} = require('./utils/auth');

//db connection
const db = require('./config/connection');

// const routes = require('./routes');

//express server
const app = express();
const PORT = process.env.PORT || 3001;

//apollo server
async function startServer() {
  apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: authMiddleware
  });
  await apolloServer.start();
}
//middleware parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

// app.use(routes);

//get all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
