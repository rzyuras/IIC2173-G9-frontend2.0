# IIC2173-G9-frontend2.0
## Instrucciones para correr en local
### Creación de archivos adicionales necesarios
Es necesario generar un .env en /Sample-01 con el siguiente contenido:
```bash
PORT=3002
```

Tambien es necesario generar un archivo auth_config.json en /Sample-01/src con el siguiente contenido:

```bash
{
    "domain": "dev-1op7rfthd5gfwdq8.us.auth0.com",
    "clientId": "wSJzQ00y6ms9nDRROHvTiZFApOjjUNB6",
    "audience": "https://my-api-endpoint/"
}
```

### Corriendo la aplicacion
#### Para instalar las dependencias:
bash yarn  install

#### Para correr la app en local
bash yarn dev

#### Para crear el build de producción
bash yarn build


## Referencias

Utilizamos como referencia para el frontend un sample brindado por auth0, el repositorio original esta ubicado en este [link](https://github.com/auth0-samples/auth0-react-samples/tree/master/Sample-01)