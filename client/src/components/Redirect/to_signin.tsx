import { Navigate } from "react-router-dom";
import { SIGN_IN_PATH } from "../../config/constants";

function ToSignin() {
    return <Navigate to={SIGN_IN_PATH}></Navigate>;
}

export default ToSignin;
