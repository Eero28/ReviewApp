import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const dataSource = new DataSource({
          type: 'postgres',
          url: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB}`,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        });

        try {
          await dataSource.initialize();
          console.log('Database connection is OK!');
          await dataSource.destroy();
        } catch (err) {
          console.error('Failed to connect to the database:', err);
          process.exit(1);
        }

        return {
          type: 'postgres',
          url: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB}`,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
