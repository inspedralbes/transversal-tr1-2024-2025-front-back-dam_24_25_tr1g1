export async function callGetProducts() {
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/getProd`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const products = await response.json();
    return products;
    
}

export async function callGetProductById(id) {
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/getProd/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const product = await response.json();
    return product[0];
}

export async function callPostProduct(product, image) {
    console.log("product",image);
    const formData = new FormData();
    formData.append('nom', product.nom);
    formData.append('descripcio', product.descripcio);
    formData.append('preu', product.preu);
    formData.append('oferta', product.offerPrice || null);
    formData.append('stock', product.stock);
    formData.append('category', product.category);
    formData.append('halal', product.halal);
    formData.append('vegan', product.vegan);
    formData.append('gluten', product.gluten);
    formData.append('lactosa', product.lactosa);
    formData.append('crustacis', product.crustacis);
    formData.append('imatge', image);    
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/addProd`, {
        method: 'POST',
        body: formData,
 
    });

    const newProduct = await response.json();
    return newProduct;
}

export async function callPutProduct(product, image) {
    const formData = new FormData();
    formData.append('nom', product.nom);
    formData.append('descripcio', product.descripcio);
    formData.append('preu', product.preu);
    formData.append('oferta', product.offerPrice || null);
    formData.append('stock', product.stock);
    formData.append('category', product.category);
    formData.append('halal', product.halal);
    formData.append('vegan', product.vegan);
    formData.append('gluten', product.gluten);
    formData.append('lactosa', product.lactosa);
    formData.append('crustacis', product.crustacis);
    formData.append('imatge', image);
    console.log("product",product);
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/modProd/${product.id}`, {
        method: 'PUT',
        body: formData
    });

    const updatedProduct = await response.json();
    return updatedProduct;
}

export async function callDeleteProduct(id) {
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/delProd/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const deletedProduct = await response.json();
    return deletedProduct;
}

export async function callGetCategories() {
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/getCat`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const categories = await response.json();
    return categories;
}

export async function callGetCategoryById(id) {
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/getCat/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const category = await response.json();
    return category;
}

export async function callPostCategory(category) {
    console.log("category",category);
    category= {"nom":category}
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/addCat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    });

    const newCategory = await response.json();
    return newCategory;
}

export async function callPutCategory(category) {

    const response = await fetch(`${import.meta.env.VITE_API_BACK}/modCat/${category.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    });

    const updatedCategory = await response.json();
    return updatedCategory;
}

export async function callDeleteCategory(id) {
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/delCat/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const deletedCategory = await response.json();
    return deletedCategory;
}


//USUARIS

export async function callGetUsers() {
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/getUsers`, {

        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const users = await response.json();
    return users;
}

//export async function callGetUserById(id) {
  //  const user = usersDatabase.find(user => user.id === parseInt(id)); // Convertir a número
    //if (user) {
      //  return user;
    //} else {
      //  throw new Error("Usuario no encontrado");
    //}
//}

export async function callPutUser(usuaris) {
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/editUserAdmin/${usuaris.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            admin: usuaris.admin 
        })
    });

    const updatedUser = await response.json();
    return updatedUser;
}


export async function callDeleteUser(id) {
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/deleteUser/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const deleteUser = await response.json();
    return deleteUser;
}


//COMANDES
export async function callGetComandes() {
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/getComan`, {

        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const comandes = await response.json();
    return comandes;
}


export async function callUpdateComandaStatus(id, newStatus) {
    console.log(newStatus)
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/modComan/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estat: newStatus }), // Envío del nuevo estado
    });

    if (!response.ok) {
        throw new Error("No se pudo actualizar el estado de la comanda");
    }

    return await response.json(); // Devolver la respuesta actualizada
}
// Función para obtener los estados de la base de datos
// communicationManager.js
export async function callGetEstats() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BACK}/estatsComanda`);
        if (!response.ok) {
            throw new Error("No se pudieron obtener los estados");
        }
        const estatOptions = await response.json();
        return estatOptions;
    } catch (error) {
        console.error("Error al obtener los estados:", error);
        throw error;
    }
}






