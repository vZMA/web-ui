<template>
    <div class="card">
        <div class="card-content">
            <div class="row row_no_margin">
                <div class="card-title col s8"><span class="card-title">VATUSA Solo Certificates</span></div>
                <div class="col s4"><router-link to="/ins/solo/new"><span class="btn waves-effect waves-light right">New</span></router-link></div>
            </div>
            <div>
                <p class="no_certs" v-if="loading===false && certs.length === 0">There are no solo certificates on record for ZMA</p>
            </div>
        </div>
 
        <div class="loading_container" v-if="loading">
            <Spinner />
        </div>
       
        <div class="certs_wrapper">
			 <table class="certs_list striped compact" >
                <thead class="certs_list_head">
                    <tr>
                        <th>Controller</th>
                        <th>Position</th>
                        <th>Expires</th>
                        <th class="options">Options</th> 
                    </tr>
                </thead>
                <tbody class="certs_list_row">
                    <tr v-for="(cert, i) in certs" :key="cert.id">
                        <td><router-link :to="`/controllers/${cert.cid}`" class="controller_link">{{getName(cert.cid)}}</router-link></td>
                        <td>{{cert.position}}</td>
                        <td>{{cert.expires}}</td>
                        <td class="options">
                            <a :href="`#modal_delete_${cert.cid}`" data-position="top" data-tooltip="Delete Solo Certificate" class="tooltipped modal-trigger"><i class="material-icons red-text text-darken-2">delete</i></a>
                        </td>
                        <div :id="`modal_delete_${cert.cid}`" class="modal modal_delete">
                            <div class="modal-content">
                                <h4>Delete Solo Certificate?</h4>
                                <p>This will remove the Solo Certification from VATUSA.</p>
                            </div>
                            <div class="modal-footer">
                                <a href="#!" @click="deleteCert(cert.id, cert.cid, cert.position)" class="btn waves-effect">Delete</a>
                                <a href="#!" class="btn-flat waves-effect modal-close">Cancel</a>
                            </div>
                        </div>
                    </tr>
                </tbody>
            </table>
		</div>
	</div><div class="card">
        <div class="card-content">
            <div class="row row_no_margin">
                <div class="card-title col s8"><span class="card-title">Tower Solo Certificates</span></div>
            </div>
            <div>
                <p class="no_certs" v-if="loading===false && certs.length === 0">There are no solo certificates on record for ZMA</p>
            </div>
        </div>
 
        <div class="loading_container" v-if="loading">
            <Spinner />
        </div>
       
        <div class="certs_wrapper">
			 <table class="certs_list striped compact" >
                <thead class="certs_list_head">
                    <tr>
                        <th>Controller</th>
                        <th>Position</th>
                        <th>Expires</th>
                        <th class="options">Options</th> 
                    </tr>
                </thead>
                <tbody class="certs_list_row">
                    <tr v-for="(user, i) in towercerts">
                        <td><router-link :to="`/controllers/${user.cid}`" class="controller_link">{{user.fname}} {{user.lname}}</router-link></td>
                        <td>TWR</td><td>{{user.towersoloExpiration.slice(0,10)}}</td>
                        <td class="options">
                            <a :href="`#modal_deletes_${user.cid}`" data-position="top" data-tooltip="Delete Solo Certificate" class="tooltipped modal-trigger"><i class="material-icons red-text text-darken-2">delete</i></a>
                        </td>
                        <div :id="`modal_deletes_${user.cid}`" class="modal modal_delete">
                            <div class="modal-content">
                                <h4>Delete Solo Certificate?</h4>
                                <p>This will remove the Solo Certification from ZMA.</p>
                            </div>
                            <div class="modal-footer">
                                <a href="#!" @click="deleteCert(user.id, user.cid, 'TWR')" class="btn waves-effect">Delete</a>
                                <a href="#!" class="btn-flat waves-effect modal-close">Cancel</a>
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
import axios from 'axios';

export default {
   name: 'SoloCerts',
   title: 'Solo Certifications',
   data() {
        return {
            positions: ['MIA', 'FLL', 'TPA', 'PBI', 'RSW', 'NQX', 'ZMO'],
            certs: [],
            controllers: null,
            loading: true,
            towercerts: []
        }
    },
    
    async mounted() {
        await this.getControllers();
        await this.getSoloCerts();
        await this.getLocalCerts();

        this.loading = false;

		 M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
            margin: 0
        }) ;
        M.Modal.init(document.querySelectorAll('.modal'), {
            preventScrolling: false
        });
        
    },

    methods: {
    async getSoloCerts() {
                try {
                            
                    // Fetch and decode API data.
                    // The API returns back base 64 encoded data with authentication blocks.   The payload needs to be base64 decoded and then parsd for json.

                    const {data} = await vatusaApi.get('/solo'); 
                
                    for (const cert of data.data) {
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
            async getLocalCerts() {
                try {
                    const {data} = await zabApi.get('/training/solo');
                    for (const user of data.data.users) {
                        this.towercerts.push(user);                                                 
                    }

                } catch(e) {
                    console.log(e);
                }
            },
            async deleteCert(id, cid, position) {
                try {                                   
                    const {data} = await zabApi.post('/training/solodelete/'+cid, {
                        position: position
                    });
                                      
                    if (position.slice(-3)==='APP' || position.slice(-3)==='CTR')
                        {
                        await vatusaApiAuth.delete('/solo?id='+id, { 
                                id: id
                            });
                    }
                    
                    this.toastSuccess('Solo Certification deleted');
                        
                    this.certs = [];
                    await this.getSoloCerts();
                    await this.getLocalCerts();    
                    this.$router.push('/ins/solo');
                    this.$router.go();
                    this.$nextTick(() => {
                        M.Modal.getInstance(document.querySelector('.modal_delete')).close();
                        });                                              
                    } catch(e) {
                        this.toastError(e);
                    }
            }, 
            getName(cid2) {
                const controller = this.controllers.filter(i => { return i.cid === cid2; });
                return controller[0].fname + ' ' + controller[0].lname;
            }
        }
    }; 
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
