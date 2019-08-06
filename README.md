to use import statements run `npm install @babel/core @babel/register @babel/preset-env --save-dev`

to run app, `node server.js`. Runs of port 4000.

# NOTES
need a root query (an entry point of where to start the search)

using 	`json-server` to mock an api call. `npm run json:server`. Runs on port 3000. 
* `http://localhost:3000/companies/1/users` to see all users associated with company 1

with Nodemon, `npm run dev`. 

perfectly fine to query data that is already returned as nested data. already have company information but we're asking it again.
```JavaScript
{
  company(id: "2") {
    id
    name
    description
    users{
      firstName,
      id
      company{
        name
      }
    }
  }
}
```

okay to name queries. much more beneficial for the FE. not so much when using GraphiQL. 
```JavaScript
query findCompany {
  company(id: "2") {
    id
    name
    description
    users{
      firstName,
      id
      company{
        name
      }
    }
  }
}
```

okay to have multiple queries per request. just give repeating parent variables a different property name.
```JavaScript
{
  google:company(id: "2") {
    id
    name
    description
  }
  apple:company(id: "1") {
    id
    name
    description
  }
}
```

query fragments help deal with duplication. 
```JavaScript
{
  google:company(id: "2") {
    ...companyDetails
  }
  apple:company(id: "1") {
    ...companyDetails
  }
}

fragment companyDetails on Company{
  id
  name
  description
}
```

# Mutations
add or delete from the db
do this by creating a completely new obj. don't update existing GraphQLObjectType

must declare `mutation` like a query
```JavaScript
mutation {
  addUser(
    firstName:"Mike",
    age:15
  ){  // must always define the data we will get back
    id
    firstName
    age
  }
}
```
the above comes back as...
```JavaScript
{
  "data": {
    "addUser": {
      "id": "Qwwdfd3",
      "firstName": "Mike",
      "age": 15
    }
  }
}
```

side note. `PUT` replaces the entire object. `PATCH` only replaces parts of an object. 