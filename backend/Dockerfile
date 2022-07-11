FROM node:16.16-alpine

WORKDIR /backend
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install
COPY . ./

EXPOSE 5000

ENTRYPOINT ["sh", "docker-entrypoint.sh"]