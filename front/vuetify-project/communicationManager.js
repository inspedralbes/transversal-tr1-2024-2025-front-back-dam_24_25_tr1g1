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

export async function callPostProduct(product) {
    console.log("product",product);
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/addProd`, {
        method: 'POST',
        body: product
    });
    console.log("qwedsqweqwe",response);
    const newProduct = await response.json();
    return newProduct;
}

export async function callPutProduct(product) {
    const response = await fetch(`${import.meta.env.VITE_API_BACK}/products/${product.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
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

