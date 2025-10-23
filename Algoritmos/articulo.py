Nombre_Articulo = input("Digite el nombre del artículo: ")
Clave_Articulo = int(input("Digite la clave del artículo (1 o 2): "))
Precio_Original = float(input("Digite el precio original: "))  

descuento1 = Precio_Original * 0.1
descuento2 = Precio_Original * 0.2

if Clave_Articulo == 1:
    print("El descuento es de: ", descuento1)
elif Clave_Articulo == 2:
    print("El descuento es de: ", descuento2)
else:
    print("Digite una clave válida (1 o 2).")
