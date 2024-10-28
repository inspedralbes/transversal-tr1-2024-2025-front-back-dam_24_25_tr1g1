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


import usersData from '../assets/users.json';

// Crear un objeto que permita la mutabilidad
let usersDatabase = JSON.parse(JSON.stringify(usersData));

export async function callGetUsers() {
    return usersDatabase;
}

export async function callGetUserById(id) {
    const user = usersDatabase.find(user => user.id === parseInt(id)); // Convertir a número
    if (user) {
        return user;
    } else {
        throw new Error("Usuario no encontrado");
    }
}

export async function callPutUser(updatedUser) {
    const index = usersDatabase.findIndex(user => user.id === parseInt(updatedUser.id)); // Asegúrate de que el ID sea un número
    if (index !== -1) {
        usersDatabase[index] = { ...usersDatabase[index], ...updatedUser }; // Actualiza el usuario
        return usersDatabase[index]; // Devuelve el usuario actualizado
    } else {
        throw new Error("Usuario no encontrado");
    }
}






