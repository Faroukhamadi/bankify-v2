import { writable } from 'svelte/store';
const emailValue = writable('');
const passwordValue = writable<string>('');

export { emailValue, passwordValue };
