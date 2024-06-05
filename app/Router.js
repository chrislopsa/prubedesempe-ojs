
import { routes } from './helpers/routes';
import { navBarLayout } from './scenes/private/navbar.layout/navbar.layout';

// Definir y manejar el router
export function Router() {

  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  const publicRoute = routes.public.find(route => route.path === path);
  const privateRoute = routes.private.find(route => route.path === path);
  const token = localStorage.getItem('token');

  if(token){

    if(path === '/login' || path === '/' || path === '/register') {
        navigateTo('/dashboard');
        return;

    }else if(privateRoute){

        const {pageContent, logic} = privateRoute.component(params);
        navBarLayout(pageContent, logic);
        return;
    }else{
        navigateTo('/not-found');
        return;
    }
    
  } else {
    if(path === '/'){
        navigateTo('/login')
        return;
    }else if(publicRoute){
        publicRoute.component();
        return;
    }else{
        navigateTo('/not-found');
        return;
    }
  }
} 

export function navigateTo(path){
  window.history.pushState({}, '', window.location.origin + path);
  Router();
}
// Manejar el evento de retroceso/avance en el navegador
window.onpopstate = Router;