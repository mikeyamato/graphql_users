// this will tell graphQL how the data is structured
const graphql = require('graphql'); 
const _ = require('lodash');
const axios = require('axios');
const {
	GraphQLObjectType,  // instruct gQL the presence of a user
	GraphQLString,
	GraphQLInt,
	GraphQLSchema
} = graphql;

const users = [
	{id: '23', firstName: 'Bill', age: 20},
	{id: '47', firstName: 'Samantha', age: 21}
]

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
				return _.find(users, {id: args.id}); // `args.id` will be provided when the query is made
			}
		}
	}
})

// export default new GraphQLSchema({
// 	query: RootQuery
// })

module.exports = new GraphQLSchema({
	query: RootQuery
})
