FROM node:18.10-alpine3.15 as build-stage

WORKDIR /app

ENV TOOL_NODE_FLAGS="--max_old_space_size=4096"

COPY ./ /app/

RUN npm install
RUN npm run build

FROM node:18.10-alpine3.15

WORKDIR /app

COPY --from=build-stage /app/build/ /app/build/

RUN npm install -g serve

ENTRYPOINT [ "serve", "-s", "build" ]