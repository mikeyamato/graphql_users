const express = require('express'); 
const expressGraphQL = require('express-graphql'); 
const schema = require('./schema/schema');

const app = express();

app.use('/graphql', expressGraphQL({
	// graphiql is a dev tool to make queries against the dev server. only use in a dev environment. 
	// schema, // es6 shortcut, key & value share the same name
	schema,
	graphiql: true
}))

const port = 4000; 

app.listen(port, () => {
	console.log(`app running on port ${port}`)
})

