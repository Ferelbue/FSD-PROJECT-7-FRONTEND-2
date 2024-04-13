
// const root = "https://fsd-project-5-backend-2.onrender.com/api/";
const root = "http://localhost:4000/api/";

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
    return data;

  } catch (error) {
    console.log(error.message);
    return error.message;
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
    console.log(error.message)
    return error;
  }
};

export const getPosts = async (token, criteria, limit, pag) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  };

  try {
    const response = await fetch(`${root}posts?title=${criteria}&page=${pag}&limit=${limit}`, options);
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
    console.log("HOLA")
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

export const getUsers = async (token, criteria, pag, limit) => {

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  };

  try {
    const response = await fetch(`${root}users?firstName=${criteria}&page=${pag}&limit=${limit}`, options);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;

  } catch (error) {
    return error;
  }
};

export const getFollowers = async (token) => {

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  };

  try {
    const response = await fetch(`${root}users/followers`, options);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;

  } catch (error) {
    return error;
  }
};

export const updateProfile = async (token, data) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch(`${root}users/profile`, options);

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return error;
  }
};

export const updateUserPosts = async (token, postId, data) => {
  console.log(token, "token")
  console.log(postId, "post")
  console.log(data, "data")
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch(`${root}posts/${postId}`, options);

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return error;
  }
};

export const createNewPost = async (token, data) => {
  console.log(token, "token")
  console.log(data, "data")

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch(`${root}posts`, options);

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message)
    }

    return data;

  } catch (error) {
    return error
  }
};

export const followUser = async (userId, token) => {

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  };

  try {
    const response = await fetch(`${root}users/follow/${userId}`, options);

    const data = await response.json();
    console.log("esto", data)
    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return error;
  }
};

export const getUserPostById = async (token, userId) => {
  // console.log(token)
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  };

  try {
    const response = await fetch(`${root}users/posts/${userId}`, options);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;

  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

export const getUserProfileById = async (token, userId) => {
  // console.log(token)
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  };

  try {
    const response = await fetch(`${root}users/profile/${userId}`, options);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;

  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

export const deleteUserById = async (token, userId) => {
  try {
    const response = await fetch(`${root}users/${userId}`, {
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

export const updateUserById = async (token, userId, data) => {
  console.log(token, "token")
  console.log(userId, "post")
  console.log(data, "data")
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch(`${root}users/${userId}/role`, options);

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return error;
  }
};