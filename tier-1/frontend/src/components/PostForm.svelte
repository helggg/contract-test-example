<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { apiClient } from '../api/api-client';
	const dispatch = createEventDispatcher();
	let text = '';

	async function submitPost() {
		if (text.trim()) {
			try {
				await apiClient.createPost(text);
				dispatch('postCreated');
				text = '';
			} catch (error) {
				console.error('Failed to submit post:', error);
			}
		}
	}
</script>

<form on:submit|preventDefault={submitPost}>
	<textarea bind:value={text} rows="3" placeholder="What's happening?" class="textarea"></textarea>
	<button type="submit" class="button">Post</button>
</form>

<style>
	textarea,
	button {
		width: 100%;
		box-sizing: border-box;
	}

	.textarea {
		height: 100px;
		resize: none;
		padding: 8px;
		border: 2px solid #bdbdbd;
		border-radius: 4px;
		font-size: 16px;
		font-family: 'Roboto', sans-serif;
		margin-bottom: 10px;
	}

	.button {
		background-color: #6200ea;
		color: white;
		border: none;
		padding: 10px 0;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
		font-family: 'Roboto', sans-serif;
		transition: background-color 0.3s;
	}

	.button:hover {
		background-color: #3700b3;
	}

	form {
		max-width: 800px;
		margin: auto;
	}
</style>
