import path from 'path';

import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { ApiClient } from '../api/api-client';

describe('ApiClient', () => {
	const pact = new PactV3({
		consumer: 'pactwitter',
		provider: 'awesome-backend',
		dir: path.resolve(process.cwd(), '../pacts')
	});

	describe('getPosts', () => {
		it('returns a list of posts', async () => {
			const expectedNumberOfPosts = 1;
			const expectedPostsMatcher = MatchersV3.atLeastOneLike(
				{
					id: MatchersV3.uuid(),
					content: MatchersV3.string('Hello, Pact!')
				},
				expectedNumberOfPosts
			);

			await pact
				.given('posts exist')
				.uponReceiving('a request for posts')
				.withRequest({
					method: 'GET',
					path: '/posts',
					headers: { 'Content-Type': 'application/json' }
				})
				.willRespondWith({
					status: 200,
					body: expectedPostsMatcher
				})
				.executeTest(async (mockserver) => {
					const apiClient = new ApiClient(mockserver.url);
					const posts = await apiClient.getPosts();
					expect(posts).length(expectedNumberOfPosts);
				});
		});
	});
	describe('createPost', () => {
		it('creates a new post', async () => {
			return await pact
				.given('no posts')
				.uponReceiving('a request to create a post')
				.withRequest({
					method: 'POST',
					path: '/posts',
					headers: { 'Content-Type': 'application/json' },
					body: { content: 'Hello, Pact!' }
				})
				.willRespondWith({
					status: 201,
					body: {}
				})
				.executeTest(async (mockserver) => {
					const apiClient = new ApiClient(mockserver.url);
					await apiClient.createPost('Hello, Pact!');
				});
		});
	});
});
