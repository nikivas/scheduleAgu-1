/*
export const someGetter = (state) => {}
 */
import axios from 'axios'
const _instanse = axios.create({
	
});
import {
	Dialog
} from 'quasar';
export function getFaculties(state) {
	if (!localStorage.getItem('faculties') || localStorage.getItem('faculties') == '') {
		return new Promise(function(resolve) {
			_instanse.get('http://raspisanie.asu.edu.ru/student/faculty')
				.then(function(json) {
					localStorage.setItem('faculties', JSON.stringify(json.data));
					resolve(json.data);
				}).catch(() => {
					Dialog.create({
						title: 'Информация',
						message: 'Что-то пошло не так. Проверьте интернет соединение' +
							' или обратитесь к администратору!'
					});
					resolve(null);
				});
		});
	} else {
		return new Promise((resolve) => {
			resolve(JSON.parse(localStorage.getItem('faculties')));
		});
	}
}

export function getSpecialities(state) {
	if (!localStorage.getItem('all_specialities') || localStorage.getItem('all_specialities') == '') {
		return new Promise(function(resolve) {
			_instanse.get('http://m.raspisanie.asu.edu.ru/student/specialty')
				.then(function(json) {
					localStorage.setItem('all_specialities', JSON.stringify(json.data))
					resolve(json.data);
				}).catch(() => {
					Dialog.create({
						title: 'Информация',
						message: 'Что-то пошло не так. Проверьте интернет соединение' +
							' или обратитесь к администратору!'
					});
					resolve(null);
				});
		});
	} else {
		return new Promise((resolve) => {
			resolve(JSON.parse(localStorage.getItem('all_specialities')));
		});
	}
}
export function getAllScheduleJson(state) {
	if (navigator.onLine) {
		return new Promise((resolve) => {
			axios.get('http://raspisanie.asu.edu.ru/student/studentjson/cashed').then((json) => {
				if (JSON.stringify(json.data) != localStorage.getItem('all_schedule')) {
					localStorage.setItem('all_schedule', JSON.stringify(json.data));
				}
				resolve(json.data);
			}).catch((error) => {
				Dialog.create({
						title: 'Информация',
						message: 'Что-то пошло не так. Проверьте интернет соединение' +
							' или обратитесь к администратору!'
					});
				resolve(error);
			});
		});
	} else {
		return new Promise((resolve) => {
			resolve(JSON.parse(localStorage.getItem('all_schedule')));
		});
	}
}
export function getGroups(state) {
	if (!localStorage.getItem('all_groupies') || localStorage.getItem('all_groupies') == '') {
		return new Promise(function(resolve) {
			_instanse.get('http://raspisanie.asu.edu.ru/student/grup')
				.then(function(json) {
					localStorage.setItem('all_groupies', JSON.stringify(json.data))
					resolve(json.data);
				}).catch((err) => {
					Dialog.create({
						title: 'Информация',
						message: 'Что-то пошло не так. Проверьте интернет соединение' +
							' или обратитесь к администратору!'
					});
					resolve(null);
				});
		});
	} else {
		return new Promise((resolve) => {
			resolve(JSON.parse(localStorage.getItem('all_groupies')));
		});
	}
}

export const getAvailableDaysChislitel = (state) => {
	return state.availableDaysChislitel;
}
export const getAvDaysZnamenatel = (state) => {
	return state.avaibleDaysZnamenatel;
}

export const getAllKorpuses = (state) => {
	if (!localStorage.getItem('korpuses')) {
		return new Promise((resolve) => {
			_instanse.get('http://raspisanie.asu.edu.ru/audience/korpus')
				.then((json) => {
					localStorage.setItem('korpuses', JSON.stringify(json.data));
					resolve(json.data);
				}).catch((err) => {
					Dialog.create({
						title: 'Информация',
						message: 'Что-то пошло не так. Проверьте интернет соединение' +
							' или обратитесь к администратору!'
					});
					resolve(null);
				});
		})
	} else {
		return new Promise((resolve) => {
			resolve(JSON.parse(localStorage.getItem('korpuses')));
		});
	}
}

export const getAllAudiences = (state) => {
	if (!localStorage.getItem('all_aud')) {
		return new Promise((resolve) => {
			_instanse.get('http://raspisanie.asu.edu.ru/audience/audience')
				.then((json) => {
					localStorage.setItem('all_aud', JSON.stringify(json.data));
					resolve(json.data);
				}).catch((err) => {
					Dialog.create({
						title: 'Информация',
						message: 'Что-то пошло не так. Проверьте интернет соединение' +
							' или обратитесь к администратору!'
					});
					resolve(null);
				});
		})
	} else {
		return new Promise((resolve) => {
			resolve(JSON.parse(localStorage.getItem('all_aud')));
		});
	}
}


export const getAllTeachers = (state) => {
	if (!localStorage.getItem('birds')) {
		return new Promise((resolve) => {
			_instanse.get('http://raspisanie.asu.edu.ru/teacher/all')
				.then((json) => {
					localStorage.setItem('birds', JSON.stringify(json.data));
					resolve(json.data);
				}).catch((err) => {
					Dialog.create({
						title: 'Информация',
						message: 'Что-то пошло не так. Проверьте интернет соединение' +
							' или обратитесь к администратору!'
					});
					resolve(null);
				});
		})
	} else {
		return new Promise((resolve) => {
			resolve(JSON.parse(localStorage.getItem('birds')));
		});
	}
}