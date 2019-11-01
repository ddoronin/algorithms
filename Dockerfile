FROM mhart/alpine-node:12
RUN npm i lerna -g

WORKDIR /app
COPY . .

RUN lerna bootstrap \
    && yarn build
