# syntax = docker/dockerfile:1.2
FROM ghcr.io/puppeteer/puppeteer:21.3.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]