const malla = document.getElementById("malla");
const btnReiniciar = document.getElementById("reiniciar");

const estructura = {
  "Semestre 1": [
    { nombre: "Bases Morfológicas I", dependientes: ["Bases Morfológicas II"] },
    { nombre: "Biología Molecular I", dependientes: ["Biología Molecular II"] },
    { nombre: "Electivo", dependientes: [] },
    { nombre: "Bases conceptuales de la Enfermería", dependientes: ["Enfermería en el proceso y crecimiento del niño y adolescente"] },
    { nombre: "GIS I", dependientes: ["GIS II"] }
  ],
  "Semestre 2": [
    { nombre: "Bases Morfológicas II", dependientes: [] },
    { nombre: "Biología Molecular II", dependientes: [] },
    { nombre: "Fundamentos biológicos I", dependientes: ["Fundamentos biológicos II"] },
    { nombre: "Enfermería en el proceso y crecimiento del niño y adolescente", dependientes: ["Enfermería en el proceso y crecimiento del adulto"] },
    { nombre: "GIS II", dependientes: ["GIS III"] }
  ],
  "Semestre 3": [
    { nombre: "GIS III", dependientes: ["GIS IV"] },
    { nombre: "Fundamentos biológicos II", dependientes: ["Fundamentos biológicos III"] },
    { nombre: "Enfermería en el proceso y crecimiento del adulto", dependientes: ["Enfermería básica"] },
    { nombre: "Electivo", dependientes: [] }
  ],
  "Semestre 4": [
    { nombre: "Fundamentos biológicos III", dependientes: [] },
    { nombre: "Enfermería básica", dependientes: ["Enfermería en el adulto I"] },
    { nombre: "GIS IV", dependientes: ["Gestión en enfermería I"] }
  ],
  "Semestre 5": [
    { nombre: "Enfermería en el adulto I", dependientes: ["Enfermería en el adulto II"] },
    { nombre: "Gestión en enfermería I", dependientes: ["Gestión en enfermería II"] }
  ],
  "Semestre 6": [
    { nombre: "Enfermería en el adulto II", dependientes: ["Enfermería en materno infantil y adolescente I"] },
    { nombre: "Gestión en enfermería II", dependientes: ["Diseño de investigación en enfermería I"] }
  ],
  "Semestre 7": [
    { nombre: "Enfermería en materno infantil y adolescente I", dependientes: ["Enfermería materno infantil y adolescente II", "Enfermería en emergencia médico quirúrgicas"] },
    { nombre: "Diseño de investigación en enfermería I", dependientes: ["Diseño de investigación en enfermería II"] }
  ],
  "Semestre 8": [
    { nombre: "Enfermería materno infantil y adolescente II", dependientes: [] },
    { nombre: "Enfermería en emergencia médico quirúrgicas", dependientes: [] },
    { nombre: "Diseño de investigación en enfermería II", dependientes: [] }
  ]
};

const estadoRamos = {};

function crearMalla() {
  for (const [semestre, ramos] of Object.entries(estructura)) {
    const divSemestre = document.createElement("div");
    divSemestre.classList.add("semestre");

    const titulo = document.createElement("h2");
    titulo.textContent = semestre;
    divSemestre.appendChild(titulo);

    ramos.forEach(ramo => {
      const divRamo = document.createElement("div");
      divRamo.textContent = ramo.nombre;
      divRamo.classList.add("ramo");
      if (!estadoRamos[ramo.nombre]) divRamo.classList.add("bloqueado");

      divRamo.onclick = () => {
        if (divRamo.classList.contains("bloqueado")) return;

        divRamo.classList.toggle("aprobado");
        estadoRamos[ramo.nombre] = divRamo.classList.contains("aprobado");

        if (estadoRamos[ramo.nombre]) {
          desbloquear(ramo.dependientes);
        }
        guardarEstado();
      };

      divRamo.setAttribute("id", ramo.nombre);
      malla.appendChild(divSemestre);
      divSemestre.appendChild(divRamo);
    });
  }
}

function desbloquear(nombres) {
  nombres.forEach(nombre => {
    const div = document.getElementById(nombre);
    if (div) div.classList.remove("bloqueado");
  });
}

function guardarEstado() {
  localStorage.setItem("estadoRamos", JSON.stringify(estadoRamos));
}

function cargarEstado() {
  const guardado = JSON.parse(localStorage.getItem("estadoRamos") || "{}");
  for (const nombre in guardado) {
    estadoRamos[nombre] = guardado[nombre];
  }
}

function aplicarEstado() {
  for (const nombre in estadoRamos) {
    const div = document.getElementById(nombre);
    if (!div) continue;

    if (estadoRamos[nombre]) {
      div.classList.remove("bloqueado");
      div.classList.add("aprobado");
    }
  }

  for (const [_, ramos] of Object.entries(estructura)) {
    ramos.forEach(ramo => {
      if (estadoRamos[ramo.nombre]) {
        desbloquear(ramo.dependientes);
      }
    });
  }
}

btnReiniciar.onclick = () => {
  if (confirm("¿Seguro que quieres reiniciar todo el progreso?")) {
    localStorage.removeItem("estadoRamos");
    location.reload();
  }
};

// Inicializa
cargarEstado();
crearMalla();
aplicarEstado();
