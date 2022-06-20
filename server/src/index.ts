import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { MyContext } from './types'
import Redis from 'ioredis'
// only enable this if default playground doesn't work in front-end
// import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core'
import cors from 'cors'
import 'dotenv/config'
import { COOKIE_NAME, DEV_ORIGIN } from './constants'

declare module 'express-session' {
  export interface SessionData {
    tellerId: number
  }
}


const main = async () => {
  
  console.log('this is my env variable: ', process.env.POSTGRES_PASSWORD);
  // const myDataSource = new DataSource({
  //   type: 'postgres',
  //   database: 'bankify-v2',
  //   username: 'postgres',
  //   password: '16/04/2002',
  // })
}

main().catch(err => console.log(err))