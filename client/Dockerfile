# builder stage for building vue app
FROM node:16 as builder

# install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# build app
COPY . .
RUN npm run build

# nginx stage for serving content
FROM nginx:alpine

# set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# remove default nginx static assets
RUN rm -rf ./*

# copy static assets from builder stage
COPY --from=builder /app/dist .

# copy certs folder from host machine
COPY cert /etc/nginx/cert

# [add by me] copy nginx.conf to container
COPY ./nginx.conf /etc/nginx/nginx.conf

# expose port 443
EXPOSE 443

# run nginx
CMD ["nginx", "-g", "daemon off;"]
