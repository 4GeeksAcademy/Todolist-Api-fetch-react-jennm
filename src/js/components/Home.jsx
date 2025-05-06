//agregamos useEffect se agregara 
import React, { useState, useEffect } from "react";
//importando icono de papelera
import { TrashIcon } from '@primer/octicons-react'


//componente principal Home
const Home = () => {
	// aqui vamos agregar mi usuario a la API
	const userName = "jenni";
	//link de la API
	const API_URL = `https://playground.4geeks.com/todo`;

	//aqui guardaremos la lista de tareas
	//Aqui el usuario va a escribir (darle valores al input)
	const [inputValue, setInputValue] = useState("");
	//aqui gaurdaremos las tareas como un array de string 
	const [tareas, setTareas] = useState([]);

	//aqui vamos a cargar las tareas dedde la API
	useEffect(() => {
		obtenerTareas();
	}, []);


	// funcion para obtener mis tareas
	const obtenerTareas = () => {
		fetch(API_URL + `/users/${userName}`)
			.then((resp) => {
				if (!resp.ok) {
					// Si el usuario no existe, crearlo
					crearUsuario();
					throw new Error("Usuario no encontrado, se creará uno nuevo.");
				}
				return resp.json();
			})
			.then((data) => {
				console.log("Tareas obtenidas:", data.todos);
				// Solo tomamos el texto de cada tarea
				const tareasTexto = data.todos.map((item) => item.label);
				setTareas(tareasTexto); //esto me guardara los textos de mi tarea
			})
			.catch((error) => {
				console.error("Error al obtener tareas:", error);
			});
	};

	// aqui voy a crear mi usuario por esta razon usaremos "POST"
	const crearUsuario = () => {
		fetch(API_URL, {
			method: "POST",
			body: JSON.stringify([]), // aqui me va crear un usuario con lista vacía
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((resp) => {
				if (resp.ok) {
					console.log("Usuario creado");
					obtenerTareas(); // Luego de crear el usuario, obtenemos las tareas
				} else {
					throw new Error("No se pudo crear el usuario.");
				}
			})
			.catch((error) => console.error("Error al crear usuario:", error));
	};


	//funcion se ejecuta cuando se presiona la tecla enter(agregar tarea cuando le doy enter)
	const manejarEnter = (e) => {
		if (e.key === "Enter") {

			//pero si el input sigue vacio, no se agrega nada
			if (inputValue.trim() === "") return;

			//aqui agregamos la tarera a la Api
			const nuevaTarea = { label: inputValue, done: false };
			const nuevasTareas = [...tareas, inputValue];

			fetch(API_URL, {
				method: "PUT",
				body: JSON.stringify(nuevasTareas.map((tarea) => ({ label: tarea, done: false }))),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((resp) => {
					if (resp.ok) {
						setTareas(nuevasTareas);
						setInputValue("");
					} else {
						throw new Error("No se pudo agregar la tarea.");
					}
				})
				.catch((error) => console.error("Error al agregar tarea:", error));
		}
	};


	// 		//aqui ahora agregamos la tarea al array
	// 		setTareas([...tareas, inputValue]);

	// 		//luego se volvera a limpiar el input
	// 		setInputValue("");
	// 	}
	// };

	//esta funcion me ayudara a eliminar la tarea manualmente
	const eliminarTarea = (index) => {
		const nuevasTareas = tareas.filter((_, i) => i !== index);

	}




	return (
		<div className="container d-flex flex-column justify-content-between vh-100">
			<h1 className="text-center">📋To do list React y Fetch</h1>


			<div className="content">
				{/* input para agregar las tareas */}
				<input
					type="text"
					className="form-control mb-3"
					placeholder="Escribe tu tarea y presiona enter"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={manejarEnter}
				/>

				{/* se mostrara mensaje si no hay tareas */}
				{tareas.length === 0 && (
					<p className="text-muted text-center">No hay tareas, añadir tareas✏️</p>
				)}

				{/* aqui se mostrara la lista de tareas que vamos agregando al input con ul */}
				<ul className="list-group">
					{tareas.map((tarea, index) => (
						<li key={index} className="list-group-item d-flex justify-content-between align-items-center tarea-item">

							{tarea}
							{/* aqui se mostrara el boton de eliminar */}
							< button className="btn btn-danger btn-sm eliminar-btn" onClick={() => eliminarTarea(index)}>
								{/* aqui se mostrara el icono de papelera */}
								<TrashIcon size={24} />
							</button>
						</li>
					))}

				</ul >

			</div >

			<footer className="mt-4">
				<h5 className="text-center">
					<strong>Made by Jenn with love💙!</strong>
				</h5>
			</footer>

		</div >
	);
};

export default Home;

