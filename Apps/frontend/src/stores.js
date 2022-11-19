import { writable } from 'svelte/store';


export const osciData = writable([]);

export const timeSweep = writable(new Array(10).fill(5));