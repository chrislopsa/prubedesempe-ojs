import { navigateTo } from '../../../Router';
import styles from './home.private.css';
import { fetchApi } from '../../../helpers/fetch-api';

export function homePrivateScene(params){

    const roleId = localStorage.getItem('roleId');
    if(roleId === '1'){

        let pageContent =`
        <h2 class=${styles['page-title']}>Vuelos Actuales</h2>
         <div id="flights-info" class="${styles['flights-info']}"></div>
         `;

        let logic = async () => {
            const resp = await fetch('http://localhost:3000/Flight');
            const flights = await resp.json();
            const flightsInfo = document.getElementById('flights-info');
      
            flightsInfo.innerHTML = `
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
                    ${flights.map(flight => `
                    <tr>
                        <td>${flight.number}</td>
                        <td>${flight.origin}</td>
                        <td>${flight.destination}</td>
                        <td>${flight.departure}</td>
                        <td>${flight.arrival}</td>
                        <td>${flight.capacity}</td>
                        <td><button id="${flight.number}" class="${styles['btn-edit']}">Editar</button></td>
                        <td><button id="${flight.id}" class="${styles['btn-delete']}">Eliminar</button></td>
                    </tr>`).join('')}
                </tbody>
            </table>
            <button id="create-flight" class="${styles['btn-create']}">Crear Vuelo</button>
            `;

            document.querySelectorAll(`.${styles['btn-edit']}`).forEach(btn => {
                btn.addEventListener('click', (e) => {
                    navigateTo(`/dashboard/edit?id=${e.target.id}`);
                });
            });

            document.querySelectorAll(`.${styles['btn-delete']}`).forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const confirmDelete = confirm("¿Eliminar el vuelo?");
                    if(confirmDelete){
                        const flightToDelete = await fetchApi(`http://localhost:3000/Flight/${e.target.id}`,{
                            method: 'DELETE',
                            headers: {
                            'Content-Type': 'application/json'
                            }
                        })
                    }
                });
            });

            document.getElementById("create-flight").addEventListener('click', (e) =>{
                navigateTo('/dashboard/create');
            });
        }
        return{
            pageContent,
            logic
         }
    }



    else{
        let pageContent =`
        <h2 class=${styles['page-title']}>Vuelos Actuales</h2>
         <div id="flights-info" class="${styles['flights-info']}"></div>
         <div id="bookings-info" class="${styles['bookings-info']}"></div>
         <button id="show-bookings" class="${styles['btn-showBookings']}">Ver mis reservas</button>
        `;
     
        let logic = async () => {
           const resp = await fetch('http://localhost:3000/Flight');
           const flights = await resp.json();
           const flightsInfo = document.getElementById('flights-info');
     
           flightsInfo.innerHTML = `
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
                   ${flights.map(flight => `
                   <tr>
                       <td>${flight.number}</td>
                       <td>${flight.origin}</td>
                       <td>${flight.destination}</td>
                       <td>${flight.departure}</td>
                       <td>${flight.arrival}</td>
                       <td>${flight.capacity}</td>
                       <td><button id="${flight.number}" class="${styles['btn-reserve']}">Reservar</button></td>
                   </tr>`).join('')}
               </tbody>
           </table>
           `;
             //logica para ver reservas actuales:
             document.getElementById("show-bookings").addEventListener('click',(e)=>{
                 e.preventDefault();
                 navigateTo(`/dashboard?showBookings="true"`);
             })
             
           document.querySelectorAll(`.${styles['btn-reserve']}`).forEach(btn => {
              btn.addEventListener('click', (event) => {
                 event.preventDefault();
                 navigateTo(`/dashboard?id=${event.target.id}`);
              } );
             });
         }
     
             if (params.get('id')) {
                 const flightId = Number(params.get('id'));
                 const confirmBooking = 1;//confirm("Deseas confirmar la reservación")
     
                 if(confirmBooking){
                    
                     logic = async () =>{
     
                         const userId = localStorage.getItem('userId');
     
                         const newBooking = await fetchApi('http://localhost:3000/Booking', {
                             method: 'POST',
                             headers: {
                                 'Content-Type': 'application/json'
                             },
                             body: JSON.stringify({
                                 flightId: flightId,
                                 userId: userId,
                                 bookingDate: "2024-07-06"
                             })
                         })
                         if(newBooking){
                             alert("Booking created successfully");
                             navigateTo('/dashboard');
                         }
     
                     }        
                 }
             }else if(params.get('showBookings')){
                 const userId = localStorage.getItem('userId');
     
                 logic = async () =>{
                     
                     const Bookings = await fetchApi('http://localhost:3000/Booking');
                     const Flights = await fetchApi('http://localhost:3000/Flight');
     
                     const userBookings = Bookings.filter(booking => booking.userId === userId);
                     let Userbookings=[];
     
                     userBookings.forEach(obj =>{
     
                         let flightId =  obj.flightId;
                         let bookingDate = obj.bookingDate;
                         let origin = Flights.find(flight => flight.number === obj.flightId).origin;
                         let destination = Flights.find(flight => flight.number === obj.flightId).destination;
                         let arrival = Flights.find(flight => flight.number === obj.flightId).arrival;
                         let departure = Flights.find(flight => flight.number === obj.flightId).departure;
                         
                         Userbookings.push({
                             origin,
                             destination,
                             arrival,
                             departure,
                             flightId,
                             bookingDate
                         })
                     })   
                     
                     const bookingsInfo = document.getElementById('bookings-info');
     
                     bookingsInfo.innerHTML = `
                     <table class="${styles['flight-table']}">
                         <thead>
                             <tr>
                                 <th>Número de Vuelo</th>
                                 <th>Origen</th>
                                 <th>Destino</th>
                                 <th>Salida</th>
                                 <th>Llegada</th>
                                 <th>Fecha de la reserva</th>
                             </tr>
                         </thead>
                         <tbody>
                             ${Userbookings.map(booking => `
                             <tr>
                                 <td>${booking.flightId}</td>
                                 <td>${booking.origin}</td>
                                 <td>${booking.destination}</td>
                                 <td>${booking.departure}</td>
                                 <td>${booking.arrival}</td>
                                 <td>${booking.bookingDate}</td>
                             </tr>`).join('')}
                         </tbody>
                     </table>
                     `;
                 }
                 
             }
     
        return{
           pageContent,
           logic
        }
    }
}
