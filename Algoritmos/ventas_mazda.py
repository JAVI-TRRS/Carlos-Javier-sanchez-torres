vendedor = input("Ingrese su nombre: ")
for i in range(1, 101):
    ventas = float(input("Ingrese por favor la cantidad de ventas: ")) 
    
    comision = (
        ventas * 0.03 if 1000000 <= ventas < 3000000 else
        ventas * 0.04 if 3000000 <= ventas < 5000000 else
        ventas * 0.05 if 5000000 <= ventas < 7000000 else
        ventas * 0.06 if 7000000 <= ventas < 10000000 else 0
    )
    
    print(f"La comisión del vendedor {vendedor} es: {comision:.2f}")
