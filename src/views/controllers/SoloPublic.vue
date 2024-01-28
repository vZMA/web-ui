<template>
    <div class="card">
        <div class="card-content">
            <div class="row row_no_margin">
                <div class="card-title col s8"><span class="card-title">VATUSA Solo Certificates</span></div>
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
                    </tr>
                </thead>
                <tbody class="certs_list_row">
                    <tr v-for="(cert, i) in certs" :key="cert.id">
                        <td><router-link :to="`/controllers/${cert.cid}`" class="controller_link">{{getName(cert.cid)}}</router-link></td>
                        <td>{{cert.position}}</td>
                        <td>{{cert.expires}}</td>        
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
                <p class="no_certs" v-if="loading===false && towercerts.length === 0">There are no Tower Solo certificates on record for ZMA</p>
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
                    </tr>
                </thead>
                <tbody class="certs_list_row">
                    <tr v-for="(user, i) in towercerts">
                        <td><router-link :to="`/controllers/${user.cid}`" class="controller_link">{{user.fname}} {{user.lname}}</router-link></td>
                        <td>{{user.soloPosition}}</td><td>{{user.towersoloExpiration.slice(0,10)}}</td>
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
            positions: ['MIA', 'FLL', 'TPA', 'PBI', 'RSW', 'NQX', 'ZMO', 'ZMA'],
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
