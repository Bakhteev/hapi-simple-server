import { Sequelize } from 'sequelize-typescript'
import { config } from '../config/config'
import { SyncOptions } from 'sequelize'
import { models } from './models/models'

export class Database extends Sequelize {
  private static _instance: Database

  static async instance(): Promise<Database> {
    if (!Database._instance) {
      Database._instance = new Database()

      const syncOptions: SyncOptions = {}
      if (config.test) syncOptions.force = true

      await Database._instance.sync()
    }

    return Database._instance
  }

  constructor() {
    const dbLink = config.test ? config.testDbLink : config.dbLink
    super(dbLink, {
      dialect: 'postgres',
      models: models,
      pool: {
        max: 40,
        min: 0,
        idle: 10000,
        acquire: 60000,
        evict: 1000,
      },
      logging: config.development,
    })
  }
}
