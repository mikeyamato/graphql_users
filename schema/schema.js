// this will tell graphQL how the data is structured
const graphql = require('graphql'); 
const axios = require('axios');
const {
	GraphQLObjectType,  // instruct gQL the presence of a user
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
	name: 'Company',
	// to deal with circular reference since we are defining UserType after (Js limitation), wrap the fields value in an arrow function (anonymous function)
	fields: () => ({
		id: {type: GraphQLString},
		name: {type: GraphQLString},
		description: {type: GraphQLString},
		users: {
			type: new GraphQLList(UserType), // this is a one to many relationship (one company can have many employees). therefore `GraphQLList` needs to be used. 
			resolve(parentValue, args){
				return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
				.then(resp => resp.data)
			}
		}
	})
})

// create a new obj
const UserType = new GraphQLObjectType({
	name: 'User', // naming convention, uppercase
	fields: () => ({  // this tells gQL that every user will have an id, first name, and age. we need to define types. 
		id: {type: GraphQLString},
		firstName: {type: GraphQLString},
		age: {type: GraphQLInt}, 
		// this will be used to associate company with user
		company: {
			type: CompanyType,
			// use resolve function to associate a field from one table and associate it to another.
			// think of resolve as taking us and connecting from one graph (aka node) to another 
			resolve(parentValue, args){
				return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
				.then(resp => resp.data)  // axios returns data nested inside the data property
				// console.log('parentValue: ', parentValue, 'args: ', args);
			}
		}
	})
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: {
				// whenever someone makes a query, it needs to be an id that is a string
				id: {
					type: GraphQLString
				}
			},
			resolve(parentValue, args){ // resolve function goes and grabs the data. args is from directly above. 
				return axios.get(`http://localhost:3000/users/${args.id}`)
				.then(resp => resp.data)  // axios returns data nested inside the data property
			}
		},
		// added in order to search a company directly from the root. otherwise to get to comany we'll always need to go through UserType
		company: {
			type: CompanyType,
			args: {
				id: {
					type: GraphQLString
				}
			},
			resolve(parentValue, args){
				return axios.get(`http://localhost:3000/companies/${args.id}`)
				.then(resp => resp.data)
			}
		}
	}
})

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		// best to name this to the action they perform
		addUser: {
			type: UserType,
			// parameters to pass along when calling addUser
			args: {
				// wrap the types with GraphQLNonNull if they are a must have when passing parameters
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				companyId: { type: GraphQLString }
			},
			// destructure parameters (optional)
			resolve(parentValue, {firstName, age}){
				return axios.post(`http://localhost:3000/users`, {
					firstName,
					age
				})
				.then(resp => resp.data)
			}
		},
		deleteUser: {
			type: UserType,
			// parameters to pass along when calling addUser
			args: {
				// wrap the types with GraphQLNonNull if they are a must have when passing parameters
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			// destructure parameters (optional)
			resolve(parentValue, {id}){
				return axios.delete(`http://localhost:3000/users${id}`)
				// null response is good
				.then(resp => resp.data)
			}
		},
		updateUser: {
			type: UserType,
			// parameters to pass along when calling addUser
			args: {
				// wrap the types with GraphQLNonNull if they are a must have when passing parameters
				id: { type: new GraphQLNonNull(GraphQLString) },
				firstName: { type: GraphQLString },
				age: { type: GraphQLInt },
				companyId: { type: GraphQLString }
			},
			// destructure parameters (optional)
			resolve(parentValue, args){
				return axios.patch(`http://localhost:3000/users/${args.id}`, args)
				// null response is good
				.then(resp => resp.data)
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation
})
