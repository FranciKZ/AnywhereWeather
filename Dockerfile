FROM node:lts-alpine3.15 as clientBuilder
RUN mkdir /clientApp
WORKDIR /clientApp
COPY ./client/package.json ./client/yarn.lock ./
RUN yarn install
COPY ./client .
RUN yarn run build

FROM golang:1.18.3-alpine3.16 as serverBuilder
RUN mkdir /serverApp
ADD ./server /serverApp
WORKDIR /serverApp
EXPOSE 8080
COPY --from=clientBuilder /clientApp/build ./clientBuild
ENV GIN_MODE=release
RUN go build -o main .
CMD ["/serverApp/main"]
