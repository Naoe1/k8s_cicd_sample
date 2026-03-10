FROM node:25-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN CYPRESS_INSTALL_BINARY=0 CYPRESS_SKIP_VERIFY=true npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/www /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
