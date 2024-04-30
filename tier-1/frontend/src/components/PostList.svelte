<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient, type Post } from '../api/api-client';

	let posts: Post[] = [];
	let loading = true;

	async function loadPosts() {
		try {
			posts = await apiClient.getPosts();
		} catch (error) {
			console.error('Failed to load posts:', error);
		}
		loading = false;
	}

	onMount(() => {
		loadPosts();
		window.addEventListener('refreshPosts', loadPosts);
		return () => {
			window.removeEventListener('refreshPosts', loadPosts);
		};
	});
</script>

{#if loading}
	<p>Loading...</p>
{:else if posts.length > 0}
	{#each posts as post}
		<div class="post" id={post.id}>{post.content}</div>
	{/each}
{/if}

<style>
	.post {
		background: #f8f8f8;
		padding: 20px;
		margin-top: 10px;
		border-radius: 5px;
		font-family: 'Roboto', sans-serif;
		font-size: 16px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
		box-sizing: border-box;
	}
</style>
