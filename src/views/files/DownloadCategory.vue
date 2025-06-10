<template>
	<div :id="cat" class="col s12">
		<div v-if="files.length === 0" class="no_files">No files in this category found</div>
		<div class="download" v-else v-for="file in files" :key="file.id">
			<div v-if="file.permalink && file.permalink.trim() !== ''"><a :href="`https://zmaartcc.net/files/downloads/permalink/${file.permalink}`" class="btn button" :download="isJson(file.fileName) ? '' : null"><i class="material-icons">file_download</i></a></div>
			<div v-else><a :href="`https://zma-web.nyc3.digitaloceanspaces.com/downloads/${file.fileName}`" class="btn button" :download="isJson(file.fileName) ? '' : null"><i class="material-icons">file_download</i></a></div>
			<div class="title">{{file.name}}</div>
			<div class="desc">{{file.description}}</div>
			<div v-if="file.permalink && file.permalink.trim() !== ''" class="info">Permalink: https://zmaartcc.net/files/downloads/permalink/{{ file.permalink }}</div>
			<div class="info">Updated at: {{dtRegionalUS(file.updatedAt)}}z</div>
		</div>
	</div>
</template>

<script>
export default {
  props: ['cat', 'files'],
  methods: {
    isJson(fileName) {
      return fileName && fileName.toLowerCase().endsWith('.json');
    }
  }
};
</script>

<style lang="scss" scoped>
.download {
	padding: 1em 1em .5em 1em;
	transition: background-color .3s ease;

	.title {
		font-weight: 700;
		font-size: 1.3rem;
		width: calc(100% - 45px);
	}

	.desc {
		font-size: .9rem;
		width: calc(100% - 45px);
	}

	.button {
		float: right;
		background: $primary-color-light;

		&.btn {
			width: auto;
			padding: 0 .6em;
			color: #fff;
		}
	}

	.info {
		font-size: .8rem;
		margin-top: 5px;
		color: #9e9e9e;
	}

	&:nth-of-type(odd) {
		background: hsla(0,0%,94.9%,.5);
	}

	&:hover {
		background: #eaeaea;
	}
}

.no_files {
	padding: 1.5em 1em;
	font-style: italic;
}
</style>