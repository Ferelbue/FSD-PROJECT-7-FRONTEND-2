
import './LogOut.css'

export const LogOut = () => {
   sessionStorage.setItem("token", "");
   const token = sessionStorage.getItem("token");
   console.log('token', token)

   return (
      <>
         <div className='logOutDesign'>
            SEE YOU <p className="titleRed"> SOON!</p>
         </div>
      </>

   )
}