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
        body: JSON.stringify(updatedUser)
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


// JSON de ejemplo para simular una base de datos
let comandesDatabase = [
    { id: 1, data: "2024-11-07", contingut: "dsadadas", estat: "En cuina", client: 1 },
    { id: 2, data: "2024-10-08", contingut: "ddsadasdassadadas", estat: "Preparant", client: 1 },
    { id: 3, data: "2024-10-15", contingut: "comanda de prova", estat: "Lliurat", client: 2 }
];

// Función para obtener la lista de comandas
export async function callGetComandes() {
    return comandesDatabase;
}

// Función para actualizar el estado de una comanda
export async function callUpdateComandaStatus(id, newStatus) {
    const comanda = comandesDatabase.find(c => c.id === id);
    if (comanda) {
        comanda.estat = newStatus;
        return comanda;
    } else {
        throw new Error("Comanda no encontrada");
    }
}






