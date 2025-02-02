<template>
	<div class="card card_downloads">
		<div class="card-content">
			<span class="card-title">Downloads</span>
		</div>
		<div v-if="!user.isLoggedIn">
					<p style="text-align:center">To access ZMA SOP's, LOAs and orther documents, all users need to log in via VATSIM.
					</p>
					<br />
					<div class="center-align">
						<button class="btn btn-waves login_button" @click="login">Login via VATSIM</button>
					</div>
				</div>
		<div class="row" v-else>
			<div class="col s12">
				<ul class="tabs">
					<li class="tab col s6 l2"><a class="active" href="#sector">Facility Files</a></li>
					<li class="tab col s6 l2"><a href="#references">References</a></li>
					<li class="tab col s6 l2"><a href="#mfr">SOPs and LOAs</a></li>
					<li class="tab col s6 l2"><a href="#training">Training</a></li>
					<li class="tab col s6 l2"><a href="#misc">Miscellaneous</a></li>
					<!--<li class="tab col s6 l3"><a class="active" href="#sector">Facility Files</a></li>
					<li class="tab col s6 l2"><a href="#references">References</a></li>
					<li class="tab col s7 l4"><a href="#mfr">SOPs and LOAs</a></li>
					<li class="tab col s6 l3"><a href="#training">Training</a></li>
					<li class="tab col s6 l3"><a href="#misc">Miscellaneous</a></li>-->
				</ul>
			</div>
			<div v-if = "downloads === null" class="loading_container loading_files">
				<Spinner />
			</div>
			<div v-else class="tabs_content">
				<DownloadCategory v-for="(files, cat) in downloads" :key="cat" :cat="cat" :files="files" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { zabApi } from "@/helpers/axios.js";
import { vatsimAuthRedirectUrl } from "@/helpers/uriHelper.js";
import DownloadCategory from './DownloadCategory.vue';

export default {
	name: 'Downloads',
	title: 'Downloads',
	data() {
		return {
			downloads: null
		};
	},
	components: {
		DownloadCategory
	},
	async mounted() {
		await this.getDownloads();
		M.Tabs.init(document.querySelectorAll('.tabs'));
	},
	methods: {
	async login() {
      localStorage.setItem("redirect", this.$route.path);
      window.location.href = vatsimAuthRedirectUrl;
  	  },
	async getDownloads() {
			const {data: fileData} = await zabApi.get('/file/downloads');
			this.downloads = {
				sector: fileData.data.filter(file => file.category === 'sectorFiles'),
				references: fileData.data.filter(file => file.category === 'references'), 
				training: fileData.data.filter(file => file.category === 'training'), 
				mfr: fileData.data.filter(file => file.category === 'mfr'),
				misc: fileData.data.filter(file => file.category === 'misc'),
			};
		},
	},
	computed: {
    ...mapState("user", ["user"]),
  },
};
</script>

<style scoped lang="scss">
.download {
	padding: 1em 1em .5em 1em;
	transition: background-color .3s ease;

	.title {
		font-weight: 700;
		font-size: 1.3rem;
	}

	.desc {
		font-size: .9rem;
	}

	.button {
		float: right;
		margin-top: -30px;
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

.tabs {
	overflow-x: auto;

	&::-webkit-scrollbar {
		height: 3px;
	}

	&::-webkit-scrollbar-track {
		background-color: #fff;
	}

	&::-webkit-scrollbar-thumb:horizontal {
		background-color: $gray_light;
	}
}

.loading_files {
	padding-top: 5em;
}
</style>