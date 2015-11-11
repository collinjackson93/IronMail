FROM nginx

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

COPY ssl /etc/nginx/ssl
COPY nginx.conf /etc/nginx/nginx.conf
