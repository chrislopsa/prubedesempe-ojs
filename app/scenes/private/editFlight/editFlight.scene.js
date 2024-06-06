
import { navigateTo } from '../../../Router';
import styles from './edit.Flight.scene.css';

export function editFlightScene(params){

    const roleId = localStorage.getItem('roleId');
    
    if(roleId === '1'){

      const flightId = Number(params.get('id'));

      let pageContent =`
      <h2 class=${styles['page-title']}>Editar Vuelo</h2>
      <div id="flight-info" class="${styles['flight-info']}"></div>
      `;

      let logic = async () => {
         const resp = await fetch(`http://localhost:3000/Flight`);
         const dataFlights = await resp.json();
         let flightToEdit = dataFlights.find(element => element.number === flightId);
         console.log(flightToEdit);
         const { id, number, origin, destination, departure, arrival, capacity } = flightToEdit;
                 console.log(id);
         const flightInfo = document.getElementById('flight-info');
         flightInfo.innerHTML=`
         <table class="${styles['flight-table']}">
            <thead>
               <tr>
                  <th>Número de Vuelo</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Salida</th>
                  <th>Llegada</th>
                  <th>Cupos disponibles</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td>${number}</td>
                  <td>${origin}</td>
                  <td>${destination}</td>
                  <td>${departure}</td>
                  <td>${arrival}</td>
                  <td>${capacity}</td> 
               </tr>
            </tbody>
         </table>
         <form id="form-edit" class="${styles['form']}">               
            <label>Fecha de Salida:</label> 
            <input type="date" id="departure" value=${departure}> 
            <label>Fecha de llegada:</label> 
            <input type="date" id="arrival" value=${arrival}>
            <label>Capacidad:</label> 
            <input type="number" id="capacity" value=${capacity}>
            <input type="submit" class="${styles['btn-edit']}" value="Guardar cambios">
         </form> 
         
              `;

              const $form = document.getElementById('form-edit');
              
              $form.addEventListener('submit', async (event)=>{
               event.preventDefault();

               const $departure = document.getElementById('departure').value.trim();
               const $arrival = document.getElementById('arrival').value.trim();
               const $capacity = document.getElementById('capacity').value.trim();

               const updatedFlight = {
                  id: id,
                  number: number,
                  origin: origin,
                  destination: destination,
                  departure: $departure,
                  arrival: $arrival,
                  capacity: $capacity
              };
  
              // Submit PUT request to update flight
              try {
                  const response = await fetch(`http://localhost:3000/Flight/${id}`, {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(updatedFlight)
                  });
  
                   if (response.ok) {
                      alert("información de vuelo actualizada exitosamente")
                      navigateTo('/dashboard');
                     } 
              } catch (error) {
                  console.error('Error updating flight:', error);
              }

         });
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