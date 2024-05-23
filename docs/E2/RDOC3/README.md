# Guía para Desplegar un Servicio PDF usando Serverless desde la Consola

## Introducción

Este documento proporciona una guía detallada para desplegar manualmente un servicio PDF utilizando el Framework Serverless desde la consola. Sigue estos pasos para configurar tu entorno y desplegar tu aplicación en AWS.

## Requisitos Previos

- Tener instalado Node.js y npm en tu máquina.
- Contar con una cuenta de AWS y tener configuradas las credenciales necesarias.
- Tener instalado el Framework Serverless en tu máquina.

## Pasos para el Despliegue

### 1. Configuración del Entorno

#### 1.1. Instalación de Node.js y npm

1. Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/).
2. Verifica la instalación ejecutando los siguientes comandos en tu consola:

    ```bash
    node -v
    npm -v
    ```

#### 1.2. Instalación del Framework Serverless

1. Instala Serverless Framework globalmente usando npm:

    ```bash
    npm install -g serverless
    ```

2. Verifica la instalación ejecutando:

    ```bash
    serverless -v
    ```

### 2. Configuración de Credenciales AWS

1. Configura las credenciales de AWS ejecutando el siguiente comando y siguiendo las instrucciones:

    ```bash
    aws configure
    ```

   Proporciona el `AWS Access Key ID`, `AWS Secret Access Key`, `AWS region`, y `Default output format` cuando se te solicite.

### 3. Preparación del Proyecto

#### 3.1. Navega al Directorio del Proyecto

1. Abre tu consola y navega al directorio donde tienes tu proyecto `pdf-service`:

    ```bash
    cd path/to/pdf-service
    ```

#### 3.2. Instalación de Dependencias del Proyecto

1. Instala las dependencias del proyecto ejecutando:

    ```bash
    npm install
    ```

### 4. Empaquetado del Servicio

1. Empaqueta tu aplicación Serverless ejecutando:

    ```bash
    npx serverless package
    ```

   Este comando generará el paquete listo para ser desplegado.

### 5. Despliegue del Servicio

1. Despliega tu aplicación en AWS ejecutando:

    ```bash
    npx serverless deploy
    ```

   Este comando desplegará tu aplicación en la región de AWS especificada en tu archivo `serverless.yml`.

### 6. Verificación del Despliegue

1. Una vez completado el despliegue, Serverless te proporcionará una URL de endpoint y otros detalles de la implementación.
2. Verifica que tu servicio esté funcionando correctamente accediendo a la URL proporcionada.

## Conclusión

Siguiendo estos pasos, puedes configurar y desplegar manualmente tu servicio PDF utilizando Serverless Framework desde la consola. Asegúrate de tener configuradas correctamente tus credenciales de AWS y de instalar todas las dependencias necesarias para garantizar un despliegue exitoso.
