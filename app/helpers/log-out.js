import { navigateTo } from "../Router";

export function logOut() {
  localStorage.removeItem('token');
  localStorage.removeItem('roleId');
  localStorage.removeItem('userId');
  navigateTo('/login');
}