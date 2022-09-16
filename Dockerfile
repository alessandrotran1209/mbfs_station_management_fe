FROM nginx:latest

COPY ./msfs_station_management_fe/dist/QLCV /usr/share/nginx/html
