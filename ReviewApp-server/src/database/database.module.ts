import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbName = configService.get('POSTGRES_DB');
        const dbHost = configService.get('POSTGRES_HOST');
        const dbPort = configService.get('POSTGRES_PORT');
        const dbUser = configService.get('POSTGRES_USER');
        const dbPassword = configService.get('POSTGRES_PASSWORD');

        const client = new Client({
          host: dbHost,
          port: dbPort,
          user: dbUser,
          password: dbPassword,
        });

        try {
          console.log('Connecting to the database...');
          await client.connect();

          // Check if the database exists
          const res = await client.query(`
            SELECT 1 FROM pg_database WHERE datname = '${dbName}'
          `);
          if (res.rowCount === 0) {
            console.log(`Database ${dbName} does not exist. Creating...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database ${dbName} created successfully.`);
          }

          await client.end();
          console.log('Database check complete.');
        } catch (error) {
          console.error('Error connecting to the database or checking database existence:', error);
        }

        return {
          type: 'postgres',
          host: dbHost,
          port: dbPort,
          username: dbUser,
          password: dbPassword,
          database: dbName,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule { }
