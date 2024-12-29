FROM nginx:latest
COPY apps/dtm-fe/nginx.conf /etc/nginx/nginx.conf
ADD apps/dtm-fe/dist/ /opt/dist/

CMD ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]
