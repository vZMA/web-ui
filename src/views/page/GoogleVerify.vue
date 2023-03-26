<template>
	<div class="card home_intro">
	  <div class="card-content">
		<span class="processing_login">Google Calendar Connected</span>
		<div class="loading_container">
		  <Spinner />
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  import { zabApi } from "@/helpers/axios.js";
  import { mapMutations, mapActions } from "vuex";
  export default {
	name: "GoogleVerify",
	title: "Verifying Google Login...",
	methods: {

	},
	async mounted() {
	  
	},
  };
  </script>
  
  <style scoped>
  .card-content {
	text-align: center;
  }
  .processing_login {
	font-weight: 600;
	font-size: 2rem;
  }
  .progress {
	max-width: 500px;
	margin: 50px auto;
  }
  </style>