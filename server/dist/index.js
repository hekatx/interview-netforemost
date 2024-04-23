import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import { randomUUID } from "node:crypto";
// import fs from "fs";
// import path from "path";
// const __dirname = new URL(".", import.meta.url).pathname;
//
const typeDefs = `#graphql
#enum LocationType {
#  SPACESHIP
#  HOUSE
#  CAMPSITE
#  APARTMENT
#  ROOM
#}

  type User {
    id: String
    name: String
    email: String
    role: String
  }

  input UserInput {
    name: String
    email: String
    role: String
  }

  input EditUserInput {
    id: String
    name: String
    email: String
    role: String
  }

  type Query {
    user: User
    users: [User]!
  }

  type Mutation {
    deleteUser(id: String): User
    addUser(user: UserInput): User
    editUser(user: EditUserInput): User
  }
`;
/*
 *
Define and document a GraphQL schema that includes:
Types for the User, including at least id, name, email, and role.
Queries to retrieve individual users and a list of all users.
Mutations to create, update, and delete users.
 */
const db = {
    users: [
        {
            id: "1",
            name: "Kevin",
            email: "kevin@example.com",
            role: "admin",
        },
        {
            id: "2",
            name: "Marvin",
            email: "marvin@example.com",
            role: "viewer",
        },
    ],
};
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Mutation: {
        deleteUser: (_, { id }) => {
            // copy
            const users = [...db.users];
            const index = db.users.findIndex((user) => user.id === id);
            let deletedUser;
            if (index !== -1) {
                deletedUser = users.splice(index, 1);
                db.users = users;
            }
            return deletedUser;
        },
        addUser: (_, { user }) => {
            const completeUser = {
                ...user,
                id: randomUUID(),
                role: user.role ?? "viewer",
            };
            db.users.push(completeUser);
            return completeUser;
        },
        editUser: (_, { user }) => {
            const index = db.users.findIndex((u) => u.id === user.id);
            if (index !== -1) {
                db.users[index] = user;
            }
            return user;
        },
    },
    Query: {
        users: () => db.users,
        user: (_, { id }) => {
            if (!id) {
                throw new GraphQLError("Id is required", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        argumentName: "id",
                    },
                });
            }
            const user = db.users.find((u) => u.id === id);
            if (!user) {
                throw new GraphQLError("User is not found", {
                    extensions: {
                        code: "RESOURCE_NOT_FOUND",
                        http: {
                            status: 404,
                        },
                    },
                });
            }
            return user;
        },
    },
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
