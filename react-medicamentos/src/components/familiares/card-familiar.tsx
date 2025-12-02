import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faEye} from "@fortawesome/free-solid-svg-icons";
export default function CardFamiliar({ fam }: any) {
  const eliminarFamiliar = async (data: Number) => {
    var a = confirm("¿Eliminar familiar?");
    if (a) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/familiares/delete/` + data , {
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
        <label htmlFor=""> {fam.nombre} </label>
        <p>
          {fam.parentesco} - {fam.fecha_nacimiento}
        </p>
      </div>
      <div className="card-actions">
        <a href={`familiares/detalles/${fam.id_familiar}`}>
          <FontAwesomeIcon icon={faEye} size="lg" />
        </a>
        <a href={`familiares/editar/${fam.id_familiar}`}>
          <FontAwesomeIcon icon={faEdit} size="lg" />
        </a>
        <a onClick={() => eliminarFamiliar(fam.id_familiar)}>
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </a>
      </div>
    </div>
  );
}
