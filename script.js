let registros = JSON.parse(localStorage.getItem('registros')) || [];
actualizarTabla();

function marcarEntrada() {
    let nombre = document.getElementById('nombre').value.trim();
    let apellido = document.getElementById('apellido').value.trim();

    if (!nombre || !apellido) {
        alert("Por favor, ingresa tu nombre y apellido.");
        return;
    }

    navigator.geolocation.getCurrentPosition(pos => {
        let fecha = new Date().toLocaleDateString();
        let hora = new Date().toLocaleTimeString();
        let ubicacion = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;

        let registro = { nombre, apellido, fecha, horaEntrada: hora, ubicacionEntrada: ubicacion, horaSalida: '', ubicacionSalida: '' };
        registros.push(registro);
        localStorage.setItem('registros', JSON.stringify(registros));

        actualizarTabla();
        alert("Entrada registrada correctamente");
    }, error => {
        alert("No se pudo obtener la ubicación.");
    }, { enableHighAccuracy: true });
}

function marcarSalida() {
    let nombre = document.getElementById('nombre').value.trim();
    let apellido = document.getElementById('apellido').value.trim();

    if (!nombre || !apellido) {
        alert("Por favor, ingresa tu nombre y apellido.");
        return;
    }

    let registro = registros.find(reg => reg.nombre === nombre && reg.apellido === apellido && reg.horaSalida === '');
    if (!registro) {
        alert("No se encontró una entrada registrada para esta persona.");
        return;
    }

    navigator.geolocation.getCurrentPosition(pos => {
        registro.horaSalida = new Date().toLocaleTimeString();
        registro.ubicacionSalida = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;

        localStorage.setItem('registros', JSON.stringify(registros));
        actualizarTabla();
        alert("Salida registrada correctamente.");
    }, error => {
        alert("No se pudo obtener la ubicación.");
    }, { enableHighAccuracy: true });
}

function actualizarTabla() {
    let tabla = document.getElementById("registroTabla");
    tabla.innerHTML = "";
    registros.forEach(reg => {
        let fila = `<tr>
            <td>${reg.nombre}</td>
            <td>${reg.apellido}</td>
            <td>${reg.fecha}</td>
            <td>${reg.horaEntrada}</td>
            <td><a href="${reg.ubicacionEntrada}" target="_blank">Ver ubicación</a></td>
            <td>${reg.horaSalida || 'Pendiente'}</td>
            <td>${reg.ubicacionSalida ? `<a href="${reg.ubicacionSalida}" target="_blank">Ver ubicación</a>` : 'Pendiente'}</td>
        </tr>`;
        tabla.innerHTML += fila;
    });
}

function exportarExcel() {
    let ws = XLSX.utils.json_to_sheet(registros);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registros");
    XLSX.writeFile(wb, "Registros_Entrada_Salida.xlsx");
}

function eliminarRegistros() {
    if (confirm("¿Seguro que quieres eliminar todos los registros del día?")) {
        registros = [];
        localStorage.removeItem('registros');
        actualizarTabla();
        alert("Registros eliminados correctamente.");
    }
}
