import zabApi from "@/helpers/zabApi"

export default {
	namespaced: true,
	actions: {
		async loginUser({commit}) {
			const { data } = await zabApi.get('/user');
			if(data.ret_det.code === 200) {
				commit('setUser', data.data)
			}
			commit('setFetched', true)
		},
		async logoutUser({commit}) {
			await zabApi.get('/user/logout');
			commit('setUser', null);
		}
	},
	getters: {},
	mutations: {
		setUser(state, user) {
			state.userData = user;
		},
		setFetched(state, fetched) {
			state.fetched = fetched
		}
	},
	state: {
		userData: null,
		fetched: false,
	},
}