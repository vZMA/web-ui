FROM node:lts AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm --max_old_space_size=8192 install
COPY . .
RUN npm --max_old_space_size=8192 run build

FROM nginx:alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
