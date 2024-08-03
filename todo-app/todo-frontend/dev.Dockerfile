FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install

ENV VITE_BACKEND_URL=http://localhost:8080/api

USER node

CMD ["npm", "run", "dev", "--", "--host"]