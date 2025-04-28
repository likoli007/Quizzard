import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import type { InferInsertModel } from 'drizzle-orm';

import { users } from '@/db/schema/user';

import { gifts } from '../db/schema/gift';

//just a helper script
// forbidden to copy this auth token :)
const DATABASE_URL = 'http://127.0.0.1:8080';
const AUTH_TOKEN =
	'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18yYzA4R3ZNeEhYMlNCc3l0d2padm95cEdJeDUiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3NDU5OTk0NTYsImlhdCI6MTc0NTM5NDY1NiwiaXNzIjoiaHR0cHM6Ly9jbGVyay50dXJzby50ZWNoIiwianRpIjoiMmNlNzNkYWQyNzQwMTI4YzdiYzAiLCJuYmYiOjE3NDUzOTQ2NTEsInN1YiI6InVzZXJfMnc3WmNaM0lBRm5PTzFnOGFOdE9Tam52S1ZMIn0.I179bNyWMlAWxKuUzIlPXf2UrkdvQAdqWVqNwTJ9CY8gkN1y7BAwutfE2mzESgbkXN74BdEtlsN-3zgim2trHkPs8MqU8CERt6hoRZGf7Z4MHhqkP-BV1DnZkoyhc5uqTgGiXpDzucxEMGNmuv09w_IMjonWAYAnP2r4RwC13PXPF7A9rhlCy-gL9yEU5NVc1qONnTfspS_nnsWRLQvoeqOA0fFmrKNpKDJiemAJLDn6xvV4BuMnlJ0QraqdYEDDesC6H0LI5vU36cj_tM6kiItOjimHi7NxTyefocBFJ6rAQuuh3KFK4Kn103aFK6F9ZUiIX9V3cGcWVEcULgYtpQ';

const main = async () => {
	const client = createClient({
		url: DATABASE_URL!,
		authToken: AUTH_TOKEN!
	});
	const db = drizzle(client);

	const defaultUsers: InferInsertModel<typeof users>[] = [
		{
			id: 1,
			name: 'Santa Claus',
			username: 'santa',
			password: 'santa123',
			role: 'santa',
			isLoggedIn: false
		},
		{
			id: 2,
			name: 'Rudolph',
			username: 'rudy',
			password: 'rudy123',
			role: 'user',
			isLoggedIn: false
		},
		{
			id: 3,
			name: 'Frosty',
			username: 'frosty',
			password: 'frosty123',
			role: 'user',
			isLoggedIn: false
		}
	];
	const defaultGifts: InferInsertModel<typeof gifts>[] = [
		{
			id: 1,
			name: 'The fastest car',
			description: 'Mercedes AMG',
			price: 1,
			createdBy: 2,
			delivered: true
		},
		{
			id: 2,
			name: 'Macbook Air',
			description: 'M3 256 GB SSD 8GB RAM',
			price: 10,
			createdBy: 2,
			delivered: true
		},
		{
			id: 3,
			name: 'iPhone 19 Pro',
			description: 'Idc it does not exist',
			price: 5,
			createdBy: 3,
			delivered: true
		},
		{
			id: 4,
			name: 'Another gift',
			description: 'description description',
			price: 12,
			createdBy: 2,
			delivered: true
		}
	];

	await db.insert(users).values(defaultUsers).onConflictDoNothing();
	await db.insert(gifts).values(defaultGifts).onConflictDoNothing();

	console.log('seeded default users and gifts');
};

main();
