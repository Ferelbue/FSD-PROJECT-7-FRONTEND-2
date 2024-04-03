
const root = "https://fsd-project-5-backend-2-dev-jmsx.1.us-1.fl0.io/api/";

export const loginMe = async (credenciales) => {

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credenciales),
  };

  try {
    const response = await fetch(`${root}auth/login`, options);

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message)
    }

    return data;

  } catch (error) {
    return error
  }
};

export const registerMe = async (credenciales) => {

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credenciales),
  };

  try {
    const response = await fetch(`${root}auth/register`, options);

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message)
    }

    return data;

  } catch (error) {
    return error
  }
};

export const getUserProfile = async (token) => {
  // console.log(token)
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  };

  try {
    const response = await fetch(`${root}users/profile`, options);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    console.log(data)
    return data;

  } catch (error) {
    return error;
  }
};

export const getUserPosts = async (token) => {

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  };

  try {
    const response = await fetch(`${root}posts/own`, options);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;

  } catch (error) {
    return error;
  }
};

export const getPosts = async (token) => {

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  };

  try {
    const response = await fetch(`${root}posts`, options);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;

  } catch (error) {
    return error;
  }
};

export const updatePost = async (postId, token) => {
  try {
    const response = await fetch(`${root}posts/like/${postId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    if (!response.ok) {
      throw new Error('No se pudo actualizar el post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al actualizar el post:', error);
    throw error;
  }
};

export const deletePost = async (postId, token) => {
  try {
    const response = await fetch(`${root}posts/${postId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    if (!response.ok) {
      throw new Error('No se pudo eliminar el post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al actualizar el post:', error);
    throw error;
  }
};