import { navigateTo } from "../../../Router";
import styles from './create.flight.css';

export function createFlightScene(){

    const roleId = localStorage.getItem('roleId');

    //Log in only if the roleid is 1 equivalent to the admin
    if(roleId === '1'){
        let pageContent =`
        <h2>Crear Vuelo</h2>
        <div class="${styles['form-container']}">
            <form id="create-form">
                <label>Número de vuelo:</label> 
                <input type="number" id="number" maxlength="20" required>
                <label>Origen:</label> 
                <input type="text" id="origin" maxlength="50" required>
                <label>Destino:</label> 
                <input type="text" id="destination" maxlength="50" required>
                <label>Salida:</label> 
                <input type="date" id="departure" required>
                <label>Llegada:</label> 
                <input type="date" id="arrival" required>
                <label>Capacidad:</label> 
                <input type="number" id="capacity" required>
                <button type="submit" id="create-flight" class="${styles['btn']}">Crear vuelo</button>
            </form>
        </div>
        `;
        const logic = async ()=>{
            const $form = document.getElementById("create-form");
            console.log($form);
    
            $form.addEventListener('submit', async (event)=>{
                event.preventDefault();
    
                   const $number = Number(document.getElementById('number').value.trim());
                   const $origin = document.getElementById('origin').value.trim();
                   const $destination = document.getElementById('destination').value;
                   const $departure = document.getElementById('departure').value.trim();
                   const $arrival = document.getElementById('arrival').value.trim();
                   const $capacity = Number(document.getElementById('capacity').value.trim());
    
                   const newFlight = {
                      number: $number,
                      origin: $origin,
                      destination: $destination,
                      departure: $departure,
                      arrival: $arrival,
                      capacity: $capacity
                  };
    
                  // Enviar solicitud PUT para actualizar el vuelo
                  try {
                      const response = await fetch(`http://localhost:3000/Flight`, {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(newFlight)
                      });
      
                       if (response.ok) {
                          alert("Vuelo creado exitosamente")
                          navigateTo('/dashboard');
                         } 
                  } catch (error) {
                      console.error('Error creating flight:', error);
                  }
            })
        }
        return{
            pageContent,
            logic
        }
    }else{
        alert("Acceso no autorizado");
        if(localStorage.getItem('token')){
           navigateTo('./dashboard');
        }else{
           navigateTo('./login');
        }
        
     }

    
}