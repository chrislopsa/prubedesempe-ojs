import { navigateTo } from '../../../Router';
import styles from './home.private.css';
import { fetchApi } from '../../../helpers/fetch-api';

export function homePrivateScene(params){

        const roleId = Number(localStorage.getItem('roleId'));

        let pageContent =`
         <div id="flights-info" class="${styles['flights-info']}"></div>
         <div id="bookings-info" class="${styles['bookings-info']}"></div>
         `;

        let logic = async () => {
            const resp = await fetch('http://localhost:3000/Flight');
            const flights = await resp.json();
            const flightsInfo = document.getElementById('flights-info');
      
            flightsInfo.innerHTML = `
            <h2 class=${styles['page-title']}>Vuelos Actuales</h2>
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
                        ${roleId?`
                        <td><button id="${flight.number}" class="${styles['btn-edit']}">Editar</button></td>
                        <td><button id="${flight.id}" name="${flight.number}" class="${styles['btn-delete']}">Eliminar</button></td>
                        `:`
                        <td><button id="${flight.number}" class="${styles['btn-reserve']}">Reservar</button></td>
                        `}
                    </tr>`).join('')}
                </tbody>
            </table>
            ${roleId?`
            <button id="create-flight" class="${styles['btn-create']}">Crear Vuelo</button>
            `:`
            <button id="show-bookings" class="${styles['btn-showBookings']}">Ver mis reservas</button>
            `}
            
            `;
            
            if(roleId){

                document.querySelectorAll(`.${styles['btn-edit']}`).forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        navigateTo(`/dashboard/edit?id=${e.target.id}`);
                    });
                });
                document.querySelectorAll(`.${styles['btn-delete']}`).forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const confirmDelete = confirm("¿Eliminar el vuelo?");

                        if(confirmDelete){

                            const numberFlight = Number(e.target.name);
                            console.log("numberFlight",numberFlight);
                            let Bookings = await fetchApi('http://localhost:3000/Booking');
                            console.log(Bookings);
                            let idBookingToDelete = Bookings.find(booking => booking.flightId === numberFlight).id;
                            console.log(idBookingToDelete);

                            await fetchApi(`http://localhost:3000/Flight/${e.target.id}`,{
                                method: 'DELETE',
                                headers: {
                                'Content-Type': 'application/json'
                                }
                            })
                            
                            await fetchApi(`http://localhost:3000/Booking/${idBookingToDelete}`,{
                                method: 'DELETE',
                                headers: {
                                'Content-Type': 'application/json'
                                }
                            })
                            navigateTo(`/dashboard`);
                        }
                    });
                });
                document.getElementById("create-flight").addEventListener('click', (e) =>{
                    navigateTo('/dashboard/create');
                });

            }else {

                document.getElementById("show-bookings").addEventListener('click',(e)=>{
                    e.preventDefault();
                    navigateTo(`/dashboard?showBookings="show"`);
                })
                
              document.querySelectorAll(`.${styles['btn-reserve']}`).forEach(btn => {
                 btn.addEventListener('click', (event) => {
                    event.preventDefault();
                    let confirmBooking = confirm("¿Deseas confirmar la reservación?")
                    if(confirmBooking){
                       navigateTo(`/dashboard?id=${event.target.id}`);
                    }
                    
                 } );
                });
            }      
        }
        if (params.get('id') && !roleId) {

            const flightId = Number(params.get('id'));
               
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
                            bookingDate: "2024-07-06" //cambiar esto por la fecha actual
                        })
                    })
                    if(newBooking){
                        alert("Booking created successfully");
                        navigateTo('/dashboard');
                    }

                }        
            
        }else if(params.get('showBookings')){

            const userId = localStorage.getItem('userId');

            logic = async () =>{
                
                const Bookings = await fetchApi('http://localhost:3000/Booking');
                const Flights = await fetchApi('http://localhost:3000/Flight');

                const userBookings = Bookings.filter(booking => booking.userId === userId);

                let ShowUserBookings=[];

                userBookings.forEach(obj =>{
                    let originf = Flights.find(flight => flight.number === obj.flightId).origin;
                    let destination = Flights.find(flight => flight.number === obj.flightId).destination;
                    let arrival = Flights.find(flight => flight.number === obj.flightId).arrival;
                    let departure = Flights.find(flight => flight.number === obj.flightId).departure;
                    let flightId =  obj.flightId;
                    let bookingDate = obj.bookingDate;
                    
                    ShowUserBookings.push({
                        originf,
                        destination,
                        arrival,
                        departure,
                        flightId,
                        bookingDate
                    })
                })   //cuando el admin elimine un vuelo debe eliminarse tambien de las reservas de los usuarios
                
                const bookingsInfo = document.getElementById('bookings-info');

                bookingsInfo.innerHTML = `
                <h2 class=${styles['page-title']}>Mis vuelos reservados</h2>
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
                        ${ShowUserBookings.map(booking => `
                        <tr>
                            <td>${booking.flightId}</td>
                            <td>${booking.originf}</td>
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
