<template>
	<div class="card">
		<div class="card-content">
			<span class="card-title">Edit Controller {{controller !== null ? ` - ${controller.fname}
				${controller.lname}` : ''}}</span>
			<div class="loading_container" v-if="controller === null">
				<Spinner />
			</div>
			<form id="update_controller" @submit.prevent=updateController v-else>
				<div class="row row_no_margin">
					<div class="input-field col s6">
						<input id="first_name" type="text" v-model="form.fname" required>
						<label for="first_name" class="active">First Name</label>
					</div>
					<div class="input-field col s6">
						<input id="last_name" type="text" v-model="form.lname" required>
						<label for="last_name" class="active">Last Name</label>
					</div>
					<div class="input-field col s6">
						<input id="cid" type="text" :value="controller.cid" disabled>
						<label for="cid" class="active">Controller ID</label>
					</div>
					<div class="input-field col s6">
						<input id="rating" type="text" :value="controller.ratingLong" disabled>
						<label for="rating" class="active">Rating</label>
					</div>
					<div class="input-field col s6">
						<input id="email" type="email" v-model="form.email">
						<label for="email" class="active">Email</label>
					</div>
					<div class="input-field col s6 input_oi">
						<input id="oi" type="text" v-model="form.oi" @input="checkOi($event)" maxlength="2" required>
						<label for="oi" class="active">Operating Initials</label>
						<div class="oi_check right">
							<i v-if="oiAvail == true" class="material-icons green-text">check_circle</i>
							<i v-else class="material-icons red-text text-darken-1">remove_circle</i>
						</div>
					</div>
					<div class="input-field col s12">
						<div id="certs_container">
							<label for="minor_certs_container" class="active">Tier 2 Certifications:</label>
							<div id="minor_certs_container" class="cert_container">
								<span id="gnd" :class="{active: form.certs.gnd}" class="cert cert_minor"
									@click="toggleCert">Tier 2 Del. / Ground</span>
								<span id="twr" :class="{active: form.certs.twr}" class="cert cert_minor"
									@click="toggleCert">Tier 2 Tower</span>
								<span id="app" :class="{active: form.certs.app}" class="cert cert_minor"
									@click="toggleCert">Tier 2 Approach</span>
							</div>
							<label for="miami_certs_container" class="active">Tier 1 Certifications:</label>
							<div id="miami_certs_container" class="cert_container">
								<span id="miagnd" :class="{active: form.certs.miagnd}" class="cert cert_major"
									@click="toggleCert">Tier 1 Del. / Ground</span>
								<span id="miatwr" :class="{active: form.certs.miatwr}" class="cert cert_major"
									@click="toggleCert">Tier 1 Tower</span>
								<span id="miaapp" :class="{active: form.certs.miaapp}" class="cert cert_major"
									@click="toggleCert">Tier 1 Approach</span>
								<span id="zma" :class="{active: form.certs.zma}" class="cert cert_center"
									@click="toggleCert">Domestic Center</span>
								<!-- <span id="zmo" :class="{active: form.certs.zmo}" class="cert cert_center"
									@click="toggleCert">Oceanic Center</span> -->
							</div>
							<!--<label for="solo_certs_container" class="active">Solo Certifications:</label>
							<div id="solo_certs_container" class="cert_container">
								<span id="twrs" :class="{active: form.certs.twrs}" class="cert cert_solo"
									@click="toggleCert">Tower (Solo)</span>
								<span id="apps" :class="{active: form.certs.apps}" class="cert cert_solo"
									@click="toggleCert">Approach (Solo)</span>
								<span id="miazmas" :class="{active: form.certs.miazmas}" class="cert cert_solo"
									@click="toggleCert">Domestic Center (Solo)</span>
								 <span id="miazmos" :class="{active: form.certs.miazmos}" class="cert cert_solom"
									@click="toggleCert">Oceanic Center (Solo)</span>
							</div>-->
						</div>
					</div>
					<div class="input-field col s12">
						<label for="roles" class="active">Roles</label>
						<div id="roles_container">
							<span id="atm" class="cert cert_senior" :class="{active: form.roles.atm}"
								@click="toggleRole">ATM</span>
							<span id="datm" class="cert cert_senior" :class="{active: form.roles.datm}"
								@click="toggleRole">DATM</span>
							<span id="ta" class="cert cert_senior" :class="{active: form.roles.ta}"
								@click="toggleRole">TA</span>
							<span id="ec" class="cert cert_junior" :class="{active: form.roles.ec}"
								@click="toggleRole">EC</span>
							<span id="fe" class="cert cert_junior" :class="{active: form.roles.fe}"
								@click="toggleRole">FE</span>
							<span id="wm" class="cert cert_junior" :class="{active: form.roles.wm}"
								@click="toggleRole">WM</span>
							<span id="ins" class="cert cert_training" :class="{active: form.roles.ins}"
								@click="toggleRole">INS</span>
							<span id="mtr" class="cert cert_training" :class="{active: form.roles.mtr}"
								@click="toggleRole">MTR</span>
							<span id="vis" class="cert cert_training" :class="{active: form.vis}"
								@click="toggleVis">VIS</span>
						</div>
					</div>
					<div class="input-field col s12">
						<button type="submit" class="btn right">Update</button>
					</div>
				</div>
			</form>
		</div>	
	</div>
<Notes />
<TrainerNotes />
</template>

<script>
import {zabApi} from '@/helpers/axios.js';
import { mapState } from 'vuex';
import Notes from './Notes.vue'; 
import TrainerNotes from './TrainerNotes.vue'; 

import { FLIPPED_ALIAS_KEYS } from '@babel/types';

export default {
    data() {
        return {
            controller: null,
            usedOi: [],
            oi: "",
            oiAvail: true,
            form: {
                fname: "",
                lname: "",
                email: "",
                oi: "",
                vis: false,
                certs: {
                    zmo: false,
                    zma: false,
                    miaapp: false,
                    miatwr: false,
                    miagnd: false,
                    app: false,
                    twr: false,
                    gnd: false
                    //dels: false,
                    //gnds: false,
                    //twrs: false,
                    //apps: false,
                    //miadels: false,
                    //miagnds: false,
                    //miatwrs: false,
                    //miaapps: false,
                    //miazmas: false,
                    //miazmos: false
                },
                roles: {
                    atm: false,
                    datm: false,
                    ta: false,
                    ec: false,
                    fe: false,
                    wm: false,
                    ins: false,
                    mtr: false,
                }, 
            }
        };
    },
    async mounted() {
		//get my user statusconst codes
        await this.getController();
        this.setTitle(`Edit ${this.controller.fname + " " + this.controller.lname}`);
    },
    methods: {
        async getController() {
            const { data } = await zabApi.get(`/controller/${this.$route.params.cid}`);
            this.controller = data.data;
            this.form = {
                ...this.form,
                fname: this.controller.fname,
                lname: this.controller.lname,
                email: this.controller.email,
                oi: this.controller.oi,
                vis: this.controller.vis,
            };
            this.controller.certifications.forEach(cert => {
    			if (!cert.code.endsWith('s')) {
        			this.form.certs[cert.code] = true;}
				});
				
            this.controller.roles.forEach(role => this.form.roles[role.code] = true);
            this.usedOi = (await zabApi.get(`/controller/oi`)).data.data;
        },
        checkOi(e) {
            this.form.oi = e.target.value.toUpperCase();
            this.oiAvail = (this.form.oi !== this.controller.oi && (this.usedOi.includes(this.form.oi) || this.form.oi.length != 2)) ? false : true;
        },
        toggleCert: function (e) {
            e.target.classList.toggle("active");
            this.form.certs[e.target.id] = e.target.classList.contains("active");
        },
        toggleRole: function (e) {
            e.target.classList.toggle("active");
            this.form.roles[e.target.id] = e.target.classList.contains("active");
        },
        toggleVis: function (e) {
            e.target.classList.toggle("active");
            this.form.vis = e.target.classList.contains("active");
        },
        async updateController() {
            try {
                if (!this.oiAvail) {
                    this.toastError("Operating initials already in use");
                }
                else {
                    const { data } = await zabApi.put(`/controller/${this.controller.cid}`, {
                        form: this.form
                    });
                    if (data.ret_det.code === 200) {
                        this.toastSuccess("Controller updated");
                    }
                    else {
                        this.toastError(data.ret_det.message);
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    },
	computed: {
		...mapState('user', [
			'user'
		])
	},
    components: { Notes, 
		TrainerNotes }
};
</script>

<style scoped lang="scss">
.input_oi input {
	width: calc(100% - 35px);
}

.oi_check {
	margin-top: 20px;
	width: 35px;
	text-align: right;
}

.cert {
	display: inline-block;
	padding: 0.25rem 0.4rem;
	font-size: 0.85rem;
	margin: 2px;
	cursor: pointer;
	transition: background-color .3s ease;
	background: #eaeaea;
	color: $gray_medium;
	user-select: none;

	&.active {
		&.cert_senior {
			background: $cert_senior;
			color: #fff;
		}
	
		&.cert_junior {
			background: $cert_junior;
			color: #fff;
		}
	
		&.cert_training {
			background: $cert_training;
			color: #fff;
		}
		
		&.cert_center {
			background-color: $secondary-color-dark;
			color: #fff;
		}
	
		&.cert_major {
			background: $secondary-color;
			color: #fff;
		}
	
		&.cert_minor {
			background: $secondary-color-light;
			color: #fff;
		}

		&.cert_solo {
			background: #FFA500;
			color: #fff;
		}
	}

}

#certs_container, #roles_container {
	margin-top: 5px;
}

.cert_container {
	margin-bottom: 1.5rem;
}
</style>
