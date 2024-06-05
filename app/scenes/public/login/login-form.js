import { navigateTo } from '../../../Router';
import {fetchApi} from '../../../helpers/fetch-api';
import styles from './login-form.css';

export async function LoginPage() {
  const $root = document.getElementById('root');

  $root.innerHTML = `
  <div class=${styles.login_page}>
    <form class=${styles.form_login} id="loginForm">
        <h4>Login</h4>
        <div class=${styles.input_container}>
          <p class=${styles.label_name}>User Email:</p> 
          <input class=${styles.input} type="email" id="email" placeholder="useremail@example.com" required>
        </div>
        <div class=${styles.input_container}>  
          <p class=${styles.label_name}>Password:</p>
          <input class=${styles.input} type="password" id="password" placeholder="password" required>   
        </div>
          <input type="submit" value="Login" class=${styles.button}>
        <div class=${styles.register_link}>
            <p>Don't have an account yet?    <a href="./register">Sign Up</a></p>
        </div>
        <a class=${styles.btn_go_home} href="/home">Go To Home</a>
    </form>
</div>
    `;

  const $form = document.getElementById('loginForm');
  $form.addEventListener('submit', async (event) => {
    event.preventDefault(); // previene el comportamiento por default que es, recargar la pagina

    const $userEmail = document.getElementById('email').value;
    const $userPassword = document.getElementById('password').value;

    if(!email || !password){
      alert('Please fill in all fields');
      return;
    }
    
    const users = await fetchApi('http://localhost:3000/Users')
    const user = users.find(user => user.email === $userEmail && user.password === $userPassword);

    if(user){
        const token = Math.random().toString(36).substring(2);
        const roleId = user.roleId;
        const userId = user.id;
      localStorage.setItem('token', token);
      localStorage.setItem('roleId', roleId);
      localStorage.setItem('userId', userId);
      navigateTo('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  });
}

