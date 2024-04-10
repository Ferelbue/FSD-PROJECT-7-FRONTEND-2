export const validame = (type, value) => {
  switch (type) {
    case "name":
    case "firstName":
    case "nombre":
    case "surname":
    case "lastName":
    case "cognom":
      if (value.length < 3) {
        return "Name must contain at least 3 char";
      }

      return "";

    case "image":

      if (value.length < 3) {
        return "Please, insert a valid image.";
      }

      return "";


    case "email":
    case "e-mail":
    case "correo":
    case "mail":
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

      if (!emailRegex.test(value)) {
        return "Please, introduce a valid email.";
      }

      return "";

    case "password":
    case "contraseña":
      const passwordRegex = /^.{6,}$/;
      if (!passwordRegex.test(value)) {
        return "Password must contain at least 6 char";
      }

      return "";

    case "description":
    case "serviceName":

      return "";


    default:
  }
};
