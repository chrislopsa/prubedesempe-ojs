import { navigateTo } from "../../../Router";
import styles from './create.flight.css';

export function createFlightScene(){

    let pageContent =`
    <form id="create-form">
        <label>Número de vuelo:</label> 
        <input type="number" id="number">
        <label>Origen:</label> 
        <input type="text" id="origin">
        <label>Destino:</label> 
        <input type="text" id="destination">
        <label>Salida:</label> 
        <input type="date" id="departure">
        <label>Llegada:</label> 
        <input type="date" id="arrival">
        <label>Capacidad:</label> 
        <input type="number" id="capacity">
        <button type="submit" id="create-flight">Crear vuelo</button>
    </form>
    `;
    const logic = async ()=>{
        const $form = document.getElementById("create-form");
        console.log($form);

        $form.addEventListener('submit', async (event)=>{
            event.preventDefault();

               const $number = document.getElementById('number').value.trim();
               console.log($number);
               const $origin = document.getElementById('origin').value.trim();
               console.log($origin);
               const $destination = document.getElementById('destination').value;
               console.log($destination);
               const $departure = document.getElementById('departure').value.trim();
               console.log($departure);
               const $arrival = document.getElementById('arrival').value.trim();
               console.log($arrival);
               const $capacity = document.getElementById('capacity').value.trim();
               console.log($capacity);

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
}