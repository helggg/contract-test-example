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
			// This is a Pact matcher that expects at least one post with the content 'Hello, Pact!'
			const expectedPostsMatcher = MatchersV3.atLeastOneLike(
				{
					id: MatchersV3.uuid(),
					content: MatchersV3.string('Hello, Pact!')
				},
				expectedNumberOfPosts
			);

			await pact
				// This is the state of the provider before the interaction
				.given('posts exist')
				// This is the name of the iteraction
				.uponReceiving('a request for posts')
				// This is the request that the consumer will make
				.withRequest({
					method: 'GET',
					path: '/posts',
					headers: { 'Content-Type': 'application/json' }
				})
				// This is the response that the provider will send back
				.willRespondWith({
					status: 200,
					body: expectedPostsMatcher
				})
				// This is the test that will be executed
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
				// This is the state of the provider before the interaction
				.given('no posts')
				// This is the name of the iteraction
				.uponReceiving('a request to create a post')
				// This is the request that the consumer will make
				.withRequest({
					method: 'POST',
					path: '/posts',
					headers: { 'Content-Type': 'application/json' },
					body: { content: 'Hello, Pact!' }
				})
				// This is the response that the provider will send back
				.willRespondWith({
					status: 201,
					body: {}
				})
				// This is the test that will be executed
				.executeTest(async (mockserver) => {
					const apiClient = new ApiClient(mockserver.url);
					await apiClient.createPost('Hello, Pact!');
				});
		});
	});
});
