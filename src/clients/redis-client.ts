import redis from 'redis';
import bluebird from 'bluebird';

import logger from '../utils/logger';

interface PromisifedRedis extends redis.RedisClient {
  [x: string]: any;
}

bluebird.promisifyAll(redis);

const redisClient = redis.createClient({
  host: process.env.NODE_ENV === 'production' ? 'redis' : 'localhost',
  port: 6379,
});
redisClient.on('error', err => logger.error('Redis error', err));

export default redisClient as PromisifedRedis;
