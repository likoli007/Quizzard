# Quizzard

# Run Local Database

Follow these steps to get your local database up and running with Turso:

1. **Copy and configure environment variables**

   - Duplicate the example file:
     ```bash
     .env.example
     ```
   - Open `.env` in your editor and fill in the required values.

2. **Install the Turso CLI**

3. **Start the local Turso server**

   ```bash
   turso dev --db-file dev.db
   ```

   - This will create (or reuse) a SQLite file at `./dev.db` and expose it over HTTP on `localhost:8080`.

Once the server is running, your application can connect using the `DATABASE_URL` and `AUTH_TOKEN` specified in your `.env` file.
