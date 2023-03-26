FROM node:lts AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm --max-old-space-size=4096 install
COPY . .
RUN npm --max-old-space-size-4096 run build

FROM nginx:alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
