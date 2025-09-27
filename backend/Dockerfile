FROM golang:1.23 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

ARG TARGETOS
ARG TARGETARCH

RUN GOOS=$TARGETOS GOARCH=$TARGETARCH go build .

# Final minimal image
FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=builder /app/main .
EXPOSE 8000
CMD ["./main"]