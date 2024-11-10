# client_stats.ipynb
import requests
import pandas as pd
import matplotlib.pyplot as plt
import os
# Obtener datos de clientes desde el servidor
url = "http://localhost:26968/clientes"
response = requests.get(url)
if response.status_code == 200:
    data = response.json()
else:
    print("Error al conectar con la API")
    data = None
if data and "usuaris" in data:
    # Procesar los datos
    processed_data = []
    for usuario in data["usuaris"]:
        id_cliente = usuario["ID"]
        nombre_cliente = usuario["Clients"]
        num_ventas = usuario["Ventes"]
        diners_total = float(usuario["Diners"]) if usuario["Diners"] is not None else 0.0
        diners_venda = diners_total / num_ventas if num_ventas > 0 else 0.0
        cliente_data = {
            "ID": id_cliente,
            "Clients": nombre_cliente,
            "Ventes": num_ventas,
            "Diners": diners_total,
            "Diners/venda": round(diners_venda, 1),
        }
        processed_data.append(cliente_data)
    # Crear un DataFrame con los datos procesados
    df = pd.DataFrame(processed_data)
    # Crear el gráfico
    plt.figure(figsize=(10, 6))
    plt.bar(df["Clients"], df["Diners/venda"], color="skyblue")
    plt.xlabel("Clientes")
    plt.ylabel("Diners per Venta (€)")
    plt.title("Diners per venta de cada client")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    # Guardar el gráfico como imagen en la carpeta `uploads`
    output_dir = os.path.join("..", "node", "uploads")
    os.makedirs(output_dir, exist_ok=True)
    plt.savefig(os.path.join(output_dir, "estats.png"))
    plt.close()
else:
    print("No se pudieron obtener datos de clientes.")