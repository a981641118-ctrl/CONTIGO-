import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
export default function CardFamiliar({ fam }: any) {
  return (
    <>
      {fam  ? (
        <div className="card card-emergencia">
          <div className="card-text">
            <div className="info-emergencia">
              <p>
                TIPO DE SANGRE
              </p>
              <label>
                {fam.familiar.info_emergencia_tipo_sangre}
              </label>
            </div>
            <div className="info-emergencia">
              <p>
                ALERGIAS
              </p>
              <label>
                {fam.familiar.info_emergencia_alergia}
              </label>
            </div>
            <div className="info-emergencia">
              <p>
                CONDICIONES
              </p>
              <label>
                {fam.familiar.info_emergencia_condiciones}
              </label>
            </div>
            <div className="info-emergencia">
              <p>
                MEDICAMENTOS ACTUALES
              </p>
              <div>
                {fam.medicamentos.map((f :any, index:any) => (
                <span key={index}>
                  {f.nombre_medicamento}, 
                </span>
              ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
