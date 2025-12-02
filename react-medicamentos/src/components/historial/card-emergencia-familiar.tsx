import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
export default function CardFamiliar({ fam }: any) {
  return (
    <>
      {fam  ? (
        <div className="card-alert">
          <div className="card-text">
            <label htmlFor=""> Informacion de Emergencia </label>
          </div>
          <div className="card-body">
            <div>
              <label htmlFor="">Tipo de Sangre</label> <br /> <span> {fam.info_emergencia_tipo_sangre} </span>
            </div>
            <div>
              <label htmlFor="">Alergias</label> <br /> <span> {fam.info_emergencia_alergia} </span>
            </div>
            <div>
              <label htmlFor="">Condiciones</label> <br />{" "}
              <span> {fam.info_emergencia_condiciones} </span>
            </div>
            <div>
              <label htmlFor="">Medicamentos</label> <br />{" "}
              <span> ... </span>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
