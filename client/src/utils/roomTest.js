const roomList = [
	{
		id: 1,
		name: 'testRoom01',
		avatar: '',
		creator_id: 1,
		creator_name: 'test00',
		admin_id: 1,
	},
	{
		id: 2,
		name: 'testRoom02',
		avatar: '',
		creator_id: 1,
		creator_name: 'test00',
		admin_id: 1,
	},
];

const roomChatList = {
	'1': {
		chatHistory: [
			{
				s_id: 1,
				r_id: 1,
				content: 'hi room test',
				time: '2021/05/29 10:20:00',
				avatar: '',
				name: 'test00',
			},
		],
		memberList: [
			{
				id: 1,
				name: 'test00',
				avatar: '',
				status: '',
				title: 'admin',
			},
		],
	},
	'2': {
		chatHistory: [],
		memberList: [],
	},
};

export default {
	roomList,
	roomChatList,
};
