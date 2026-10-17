# Image servie par Dokploy (type de build : Dockerfile).
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html main.js style.css /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY demo /usr/share/nginx/html/demo
EXPOSE 80
