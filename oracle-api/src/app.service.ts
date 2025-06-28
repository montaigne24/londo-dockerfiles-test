import { Injectable } from '@nestjs/common';
import { InjectConnection } from './database/database.provider';
import { Connection } from 'oracledb';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async getUsers(): Promise<any[]> {
    const result = await this.connection.execute(
      `SELECT * FROM users`,
      [],
      { outFormat: 'object' }
    );
    return result.rows;
  }

  async createUser(user: any): Promise<any> {
    const result = await this.connection.execute(
      `INSERT INTO users (name, email) VALUES (:name, :email) RETURNING id INTO :id`,
      {
        name: user.name,
        email: user.email,
        id: { dir: 2, type: 2002 } // Oracle bind type for NUMBER
      }
    );
    return { id: result.outBinds.id[0] };
  }
}