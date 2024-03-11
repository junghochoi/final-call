FROM node:21-alpine

WORKDIR /src

COPY . .

RUN npm ci

ENV PORT 8000

EXPOSE 8000

CMD ["npm", "run", "start"]