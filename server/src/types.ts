import { Request, Response } from 'express'
import { Redis } from 'ioredis';
import { DataSource } from 'typeorm'

export type MyContext = {
  req: Request,
  res: Response,
  redis: Redis,
  myDataSource: DataSource,
}