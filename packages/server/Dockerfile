FROM node:18-alpine # node version

COPY . .            # copy project files

RUN npm install     # install dependencies
RUN npm run build   # build project

# Add these dependencies to enable your server to make outbound TLS requests
RUN apk update && apk upgrade && \
  apk add ca-certificates && \
  update-ca-certificates

CMD npm start       # start server