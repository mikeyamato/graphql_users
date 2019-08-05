// this will tell graphQL how the data is structured
const graphql = require('graphql'); 
const axios = require('axios');
const {
	GraphQLObjectType,  // instruct gQL the presence of a user
	GraphQLString,
	GraphQLInt,
	GraphQLSchema
} = graphql;

// create a new obj
const UserType = new GraphQLObjectType({
	name: 'User', // naming convention, uppercase
	fields: {  // this tells gQL that every user will have an id, first name, and age. we need to define types. 
		id: {type: GraphQLString},
		firstName: {type: GraphQLString},
		age: {type: GraphQLInt}
	}
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: {
				id: {
					type: GraphQLString
				}
			},
			resolve(parentValue, args){ // resolve function goes and grabs the data. args is from directly above. 
				return axios.get(`http://localhost:3000/users/${args.id}`)
				.then(resp => resp.data)  // axios returns data nested inside the data property
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery
})
