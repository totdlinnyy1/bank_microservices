module.exports = {
  apps: [{
    name: 'gateway',
    script: './dist/main.js',
    cwd: './gateway',
    out_file: './logs/gateway/output.log',
    error_file: './logs/gateway/error.log',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3000
    }
  },
    {
      name: 'wallets_users',
      script: './dist/main.js',
      cwd: './microservices/wallets_users/',
      out_file: './logs/wallets_users/output.log',
      error_file: './logs/wallets_users/error.log',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        PSQL_HOST: 'localhost',
        PSQL_PORT: 5432,
        PSQL_DATABASE: 'users_wallets',
        PSQL_USERNAME: 'postgres',
        PSQL_PASSWORD: 'postgres'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
        PSQL_HOST: 'localhost',
        PSQL_PORT: 5432,
        PSQL_DATABASE: 'users_wallets',
        PSQL_USERNAME: 'postgres',
        PSQL_PASSWORD: 'postgres'
      }
    },
    {
      name: 'transactions',
      script: './dist/main.js',
      cwd: './microservices/transactions/',
      out_file: './logs/transactions/output.log',
      error_file: './logs/transactions/error.log',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002,
        PSQL_HOST: 'localhost',
        PSQL_PORT: 5432,
        PSQL_DATABASE: 'transactions',
        PSQL_USERNAME: 'postgres',
        PSQL_PASSWORD: 'postgres',
        RABBITMQ_URL: 'amqp://admin:admin@localhost:5672',
        RABBITMQ_QUEUE: 'bank-queue'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3002,
        PSQL_HOST: 'localhost',
        PSQL_PORT: 5432,
        PSQL_DATABASE: 'transactions',
        PSQL_USERNAME: 'postgres',
        PSQL_PASSWORD: 'postgres',
        RABBITMQ_URL: 'amqp://admin:admin@localhost:5672',
        RABBITMQ_QUEUE: 'bank-queue'
      }
    }
  ],
}
