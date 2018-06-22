/* global localStorage */
import history from './history';

const STORAGE_KEY = 'expense-tracker';

export function getAuthorization() {
   return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

export function isAuthorized() {
   return !!getAuthorization();
}

export function deauthorize() {
   localStorage.removeItem(STORAGE_KEY);
   history.push('/login');
}

export function authorize(data) {
   localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
