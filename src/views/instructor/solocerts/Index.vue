<template>
    <div class="card">
        <div class="card-content">
            <div class="row row_no_margin">
                <div class="card-title col s8"><span class="card-title">Solo Certificates</span></div>
                <div class="col s4"><router-link to="/ins/solo/new"><span class="btn waves-effect waves-light right">New</span></router-link></div>
            </div>
        </div>
   
        <div class="certs wrapper">
			<table class="certs_list striped compact">
                <thead class="certs_list_head">
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Expires</th>
                        <th class="options">Options</th>
                    </tr>
                </thead>
                <tbody class="certs_list_row">
					
					 <tr>
                        <td>Name</td>
                        <td>Position</td>
                        <td>Expires</td>
                        <td class="options">
                           <a href="#modal_delete" data-position="top" data-tooltip="Delete Certificate" class="tooltipped modal-trigger">
                                <i class="material-icons red-text text-darken-2">delete</i>
                            </a>
                        </td>
                        <div id="modal_delete" class="modal modal_delete">
                            <div class="modal-content">
                                <h4>Delete Certificate?</h4>
                                <p>This will delete the solo certificate for on.</p>
                            </div>
							<div class="modal-footer">
                                <a href="#!" class="waves-effect btn" @click="">Delete</a>
                                <a href="#!" class="modal-close waves-effect btn-flat">Cancel</a>
                            </div>
                        </div>
                    </tr>
                </tbody>
            </table>
		</div>
	</div>
</template>

<script>
import {vatusaApiAuth, vatusaApi, zabApi} from '@/helpers/axios.js';

export default {
   name: 'SoloCerts',
   title: 'Solo Certifications',
   data() {
        return {
            positions: ['MIA', 'FLL', 'TPA', 'PBI', 'RSW', 'NQX', 'ZMO', 'CLT', 'DEN'],
            certs: [],
            controllers: null,
            loading: true
        };
    },
    
    async mounted() {
        await this.getControllers();
        await this.getSoloCerts();
        this.loading = false;

		 M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
            margin: 0
        }) ;
        M.Modal.init(document.querySelectorAll('.modal'), {
            preventScrolling: false
        });
        
    },
 } ;

 methods: {
    async getSoloCerts() {
                try {
                            
                    // Fetch and decode API data

                    const {data} = await vatusaApi.get('/solo');    
                    const payload = atob(data.payload);
                    var data1 = JSON.parse(payload);
                    for (const cert of data1.data) {
                        if(this.positions.includes(cert.position.slice(0, 3))) 
                            this.certs.push(cert);
                    }

                } catch(e) {
                    console.log(e);  
                }
            },
            async getControllers() {
                try {
                    const {data} = await zabApi.get('/feedback/controllers');
                    this.controllers = data.data;
                } catch(e) {
                    console.log(e);
                }
            },
            async deleteCert(cid, pos) {
                try {
                    const formData = new FormData();
                    formData.append('cid', cid);
                    formData.append('position', pos);
                    await vatusaApiAuth.delete('/solo', formData);

                    this.toastSuccess('Solo Certification deleted');

                    await this.getSoloCerts();
                    this.$nextTick(() => {
                        M.Modal.getInstance(document.querySelector('.modal_delete')).close();
                    });
                    
                } catch(e) {
                    this.toastError('Something went wrong, please try again');
                }
            },
            getName(cid2) {
                const controller = this.controllers.filter(i => { return i.cid === cid2; });
                console.log(controller);
                return controller[0].fname + ' ' + controller[0].lname;
            }
        }
    
</script>

<style scoped lang="scss">

table tbody {
    tr {
        transition: background-color .3s ease;
        &:hover {
            background: #eaeaea;
        }
    }
}

.no_certs {
    padding: 0 1em 1em 1em;
    margin-top: -1em;
    font-style: italic;
}

.controller_link {
    font-weight: 700;
    color: $primary-color;
    
    &:hover {
        color: $primary-color-light;
    }
}

.modal_delete {
    min-width: 400px;
    width: 30%;
}

</style>
