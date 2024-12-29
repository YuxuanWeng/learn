FROM nginx:latest
COPY apps/odm-fe/nginx.conf /etc/nginx/nginx.conf
ADD apps/odm-fe/dist/ /opt/dist/

CMD ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]
