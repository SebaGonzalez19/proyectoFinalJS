// DOM
const marcaInput = document.getElementById("marcaInput");
const buscarBtn = document.getElementById("buscarBtn");
const resultadoDiv = document.getElementById("resultado");

// alerta de carga
async function mostrarAlertaCarga() {
  let timerInterval;

  Swal.fire({
    title: "Buscando modelos 😁",
    timer: 1500,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("b");
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft();
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
      buscarModelosZapatillas();
    }
  });
}

// buscar la marca de zapatillas
async function buscarModelosZapatillas() {
  const marcaBuscada = marcaInput.value.toLowerCase();

  try {
    const response = await fetch("productos.json");
    const data = await response.json();

    const marcaEncontrada = data.find(
      (producto) => producto.marca.toLowerCase() === marcaBuscada,
    );

    if (marcaEncontrada) {
      let resultadosHTML = "<h2>Modelos disponibles:</h2>";

      marcaEncontrada.modelos.forEach((modelo) => {
        resultadosHTML += `
          <div class="card">
            <img src="${modelo.imagen}" alt="${modelo.modelo}">
            <p>Modelo: ${modelo.modelo}</p>
            <p>Precio: $${modelo.precio}</p>
          </div>
        `;
      });

      resultadoDiv.innerHTML = resultadosHTML;

      // Almacenar en el Local Storage
      localStorage.setItem("ultimaBusqueda", marcaBuscada);
    } else {
      resultadoDiv.innerHTML =
        "<p>No tenemos esa marca de zapatillas disponible.</p>";
    }
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    resultadoDiv.innerHTML = "<p>Error al cargar los datos.</p>";
  }
}

// botón de buscar
buscarBtn.addEventListener("click", () => {
  mostrarAlertaCarga();
});
marcaInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    mostrarAlertaCarga();
  }
});

// Recuperar la última búsqueda del Local Storage
window.addEventListener("load", function () {
  const ultimaBusqueda = localStorage.getItem("ultimaBusqueda");

  if (ultimaBusqueda) {
    marcaInput.value = ultimaBusqueda;
    buscarModelosZapatillas();
  }
});
