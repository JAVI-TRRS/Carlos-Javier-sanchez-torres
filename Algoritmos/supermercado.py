Nom_producto = input ("ingrese el nomre del produto: ")
precio_total = float (input ("digite el valor total de su compra: "))
import random 
numero_aleatorio = random.randint (1,100)
print ("su numero aleatorio es de: ", numero_aleatorio )
if numero_aleatorio  < 74:
    descuento = precio_total * 0.15
else:
    descuento = precio_total * 0.20
print ("su descuento es de: ", descuento )

