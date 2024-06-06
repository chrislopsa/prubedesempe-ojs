import { navigateTo } from '../../../Router';
import { logOut } from "../../../helpers/log-out";
import styles from './navBar-layout.css';

export function navBarLayout(pageContent, logic){
    
    const root = document.getElementById('root');

    root.innerHTML=`
    <nav class="${styles.navbar}">
        <ul>
            <h1 class="${styles.logo}">Airline</h1>
            <li><button id="logout" class="${styles.logout_Btn}">Logout</button></li>
        </ul>
    </nav>
    <div>
      ${pageContent}
    </div>
    `
    logic();

    document.getElementById('logout').addEventListener('click', logOut);
}