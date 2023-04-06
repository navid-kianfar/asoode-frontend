FROM node:19-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . ./
RUN npm run publish

FROM nginx:stable-alpine as production
COPY --from=build /app/dist/asoode-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
