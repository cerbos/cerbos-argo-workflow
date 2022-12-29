FROM node:16
LABEL org.opencontainers.image.source=https://github.com/cerbos/cerbos-argo-workflow
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD [ "node", "server.js" ]