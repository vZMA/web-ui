<template>
	<div class="card">
		<div class="card-content">
			<span class="card-title">Issue Solo Certification</span>
			<div class="spinner_wrapper" v-if="!controllers">
				<Spinner />
			</div>
			<div class="row row_no_margin" v-else>
				<div class="col s12 l6 push-l6 card_desc">
                    <p>
                        The issuance of a solo certification shall be in accordance with <b>section 8 of the Miami ARTCC
                        SOP</b>.

                        Please ensure that the student's training records have been entered onto their ZMA and VATUSA
                        record <b>prior</b> to issuance of any solo certification.

                        Ensure that you enter solo certifications into the appropriate system in accordance with section
                        <b>8.4 of the Miami ARTCC SOP</b>. The student <i>cannot</i> take advantage of solo certifications that are
                        not entered correctly.
                    </p>
                </div>
				<form class="col s12 l6 pull-l6" @submit.prevent=submitCert>
					<div class="row row_no_margin">
						<div class="col s12 input-field">
							<select v-model="form.cid" required class="materialize-select">
								<option value="" disabled selected>Select a controller</option>
								<option v-for="controller in controllers" :value="controller.cid" :key="controller.cid">{{controller.fname}} {{controller.lname}}</option>
							</select>
							<label>Controller</label>
						</div>
						<div class="col s12 input-field">
							<input id="position" type="text" minlength=7 maxlength=7 class="validate" placeholder="PHX_APP" v-model="form.position" required>
							<label for="position" class="active">Position</label>
						</div>
						<div class="col s12 input-field">
							<input id="expiration_date" type="text" class="datepicker" ref="expirationDate" required>
							<label for="expiration_date">Expiration Date</label>
						</div>
						<div class="col s12 input-field">
							<input type="submit" class="btn" value="Submit" />
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
import {vatusaApiAuth, zabApi} from '@/helpers/axios.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default {
	name: 'NewSoloCert',
	title: 'Issue Solo Certification',
	data() {
		return {
			controllers: null,
			form: {
				cid: '',
				position: ''
			}
		};
	},
	async mounted() {
		await this.getControllers();

		const today = new Date(new Date().toUTCString());
		const future = new Date(new Date().toUTCString());

		flatpickr(this.$refs.expirationDate, {
			enableTime: false,
			minDate: today,
			maxDate: new Date(future.setDate(future.getDate() + 30)),
			disableMobile: true,
			dateFormat: 'Y-m-d',
			altFormat: 'Y-m-d',
			altInput: true,
		});
		
		M.FormSelect.init(document.querySelectorAll('.materialize-select'), {});
	},
	methods: {
		async getControllers() {
			const {data} = await zabApi.get('/feedback/controllers');
			this.controllers = data.data.filter(c => {
				return c.rating > 2 && c.vis == false;
			});
		},
		async submitCert() {
			try {
				const formData = new FormData();
				formData.append('cid', this.form.cid);
				formData.append('position', this.form.position);
				formData.append('expDate', this.$refs.expirationDate.value);
				await vatusaApiAuth.post('/solo', formData);

				this.toastSuccess('Solo Certification issued');

				this.$router.push('/ins/solo');
			} catch(e) {
				this.toastError(e);
			}
		}
	}
};
</script>

<style scoped lang="scss">
.card_desc {
	margin-bottom: 1em;
}
</style>