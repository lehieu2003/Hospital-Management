FROM node:20-alpine3.19 AS build
WORKDIR /app
ENV API_SERVER=http://localhost:8080
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
FROM caddy:2.8.4-alpine
ARG api_server=http://localhost:8080
ENV API_SERVER=$api_server
COPY --from=build /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
RUN sed -i 's#{API_SERVER}#'"$API_SERVER"'#g' /etc/caddy/Caddyfile

