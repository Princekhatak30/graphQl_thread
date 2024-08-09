import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

async function startServer() {
    const app = express();
    const server = new ApolloServer({
    //Schema
        typeDefs:` 
        type User {
        id:ID!
        name:String!
        username:String!
        email:String!
        phone:String!
        website:String!
        }
        type Todo {
        id:ID!
        title:String!
        completed: Boolean
        user:User
        }
        type Query{
        getTodos:[Todo]
        getAllUsers:[User]
        getUser(id:ID!):User
        say(name:String): String
        }
        `, // Resolver Or Actual func that will execute
        resolvers:{
Todo :{
    user: async(todo:any) =>  (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
},

            Query:{
                getTodos: async()=> (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getAllUsers:async()=> (await axios.get(`https://jsonplaceholder.typicode.com/users`)).data,
                getUser:async(parent:any,{id}:any)=> (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
                say: (_,{name}:{name:string})=> `Hey ${name} how are you`
            }
        }
    });
    //
    app.use(bodyParser.json());
    let corsOption = {
        origin:['http://localhost:5173'],
        methods: ['GET', 'POST', 'OPTIONS'], // Add OPTIONS for preflight requests
        allowedHeaders: ['Content-Type'],
    }
    const PORT = Number(process.env.PORT) || 9000
    app.use(cors(corsOption));
    await server.start()

    app.use('/graphQl',expressMiddleware(server));

    app.get('/',(req:any,res:any)=>{
        res.json({message:"server is up and running"})
    })
    app.listen(PORT, ()=> console.log('Server start at port 9000'))
}

startServer()