FROM nginx:1.20

COPY build/ /usr/share/nginx/html

COPY static.conf /etc/nginx/conf.d/default.conf