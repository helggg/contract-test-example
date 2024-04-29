<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient, type Post } from '../api/api-client';
	import PostForm from '../components/PostForm.svelte';
	import PostList from '../components/PostList.svelte';

	function refreshPosts() {
		const event = new CustomEvent('refreshPosts');
		dispatchEvent(event);
	}
</script>

<main>
	<h1>Pactwitter</h1>
	<PostForm on:postCreated={refreshPosts} />
	<PostList />
</main>

<style>
	main {
		max-width: 500px;
		margin: 0 auto;
		padding: 1rem;
		font-family: Arial, sans-serif;
	}
</style>
