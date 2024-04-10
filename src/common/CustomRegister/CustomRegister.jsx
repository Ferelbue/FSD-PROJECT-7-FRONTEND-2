import { useNavigate } from 'react-router-dom'
import './CustomRegister.css'

export const CustomRegister = ({ title, destination }) => {

     //instancio useNavigate para poder usar navigate y moverme en la página
     const navigate = useNavigate();
     
     return (
        <div className="navigateRegisterDesign" onClick={()=>navigate(destination)}>
            {title}
        </div>
     )
}