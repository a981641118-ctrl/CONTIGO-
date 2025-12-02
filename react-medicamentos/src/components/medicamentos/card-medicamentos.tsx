import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
export default function CardMedicamentos({ data }: any) {
  const eliminarRegistro = async (id: Number) => {
    var a = confirm("¿Eliminar registro?");
    if (a) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicamentos/delete/` + id , {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      if (res.ok) {
        const data = await res.json();
        alert("Registro eliminado")
        location.reload()
      } else {
        console.error("Error al enviar datos");
      }
    }
  };
  return (
    <div className="card">
      <div className="card-text">
        <label htmlFor=""> {data.nombre_medicamento} </label>
        <div className="card-text-flex">
          <label> Dosis: {data.dosis} pastilla </label> - 
          <label> Frecuencia: {data.frecuencia} </label> - 
          <label> Duracion: {data.duracion_tratamiento} </label>
        </div>
      </div>
      <div className="card-actions">
        <a href={`medicamentos/editar/${data.id_medicamento}`}>
          <FontAwesomeIcon icon={faEdit} size="lg" />
        </a>
        <a onClick={() => eliminarRegistro(data.id_medicamento)}>
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </a>
      </div>
    </div>
  );
}
