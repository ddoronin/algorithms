FROM mhart/alpine-node:12 as jsbuild
ENV NODE_ENV=production
RUN yarn global add lerna
WORKDIR /algorithms
COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN lerna bootstrap \
    && yarn build

FROM nginx:1.16-alpine
COPY --from=jsbuild /algorithms/packages/playground/build /usr/share/nginx/html
