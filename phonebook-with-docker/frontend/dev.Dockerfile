FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENV PORT=8080

CMD ["npm", "run", "dev", "--", "--host"]