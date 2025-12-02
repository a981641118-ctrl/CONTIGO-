"use client";
import { useEffect, useState } from "react";

export default function ContactoEmergencia() {
   const [formData, setFormData] = useState({
    nombres: "",
    numero: "",
    id: 0
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    guardarRegistro()
  };
  const setSingle = (data: any) => {
    setFormData({
      nombres: data.nombre,
      numero: data.numero,
      id: data.id
    });
  };
  const guardarRegistro = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/save-emergencia/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    console.log(res);
    if (res.ok) {
      const data = await res.json();
      console.log("Registro actualizado:", data);
    } else {
      console.error("Error al enviar datos");
    }
  };
  const id = "1";
  useEffect(() => {
    if (id && !isNaN(Number.parseInt(id))) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/get-single/${id}`)
        .then(res => res.json())
        .then(data => setSingle(data));
    }
  }, [id]);
  return (
    <main className="section-main">
      <div className="title-center">
        <h5> Contacto de Emergencia </h5>
      </div>
      <div className="container">
        <form action="" onSubmit={handleSubmit}>
          <div className="container-group">
            <label> Nombres y Apellidos </label>
              <div className="container-input">
                <input
                  type="text"
                  className="form-input"
                  name="apellido"
                  value={formData.nombres}
                  onChange={handleChange}
                />
                <span> * </span>
              </div>
          </div>
          <div className="container-group">
            <label> Número </label>
              <div className="container-input">
                <input
                  type="text"
                  className="form-input"
                  name="apellido"
                  value={formData.numero}
                  onChange={handleChange}
                />
                <span> * </span>
              </div>
          </div>
          <div className="container-msg">
            <span> * </span> Campos obligatorios
          </div>
          <div className="container-button">
            <button className="btn-cancelar" type="button">
              Cancelar
            </button>
            <button className="btn-guardar"> Guardar </button>
          </div>
        </form>
      </div>
    </main>
  );
}
