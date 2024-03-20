FROM  --platform=linux/amd64 node:21-alpine

WORKDIR /final-call


COPY ./package.json .
# COPY /packages/server/package.json ./packages/server/package.json
COPY /packages/server ./packages/server
COPY /packages/shared ./packages/shared




RUN npm install
WORKDIR /final-call/packages/server

EXPOSE 8000


CMD ["npm", "run", "start"]