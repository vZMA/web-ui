import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Master from '..//views/layout/Master.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: Master,
		children: [
			{
				path: '',
				component: () => import('../views/pages/Home.vue'),
			}
		]
	}, {
		path: '/dashboard',
		component: Master,
		meta: {
			contextNav: [
				{
					link: "/dashboard/profile",
					icon: "edit",
					text: "Edit Profile"
				},
				{
					link: "/ids",
					icon: "computer",
					text: "IDS"
				},
				{
					link: "/dashboard/training",
					icon: "event_note",
					text: "Training Sessions"
				},
				{
					link: "/dashboard/feedback",
					icon: "question_answer",
					text: "My Feedback"
				},
			]
		},
		children: [
			{
				path: '',
				component: () => import('../views/pages/Home.vue'),
			}
		]
	}
];

export default createRouter({
	history: createWebHistory(),
	routes
});