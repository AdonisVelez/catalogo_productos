# Usa una imagen base de Nginx
FROM nginx:alpine

# Elimina el contenido por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia todo el contenido del proyecto (HTML, CSS, JS)
COPY . /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80
