FROM golang:1.23 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final minimal image
FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=builder /app/main .
EXPOSE 8000
CMD ["./main"]