package middleware

import (
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
)

func S3Middleware(client *s3.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		// You can add AWS client to the context if needed
		c.Set("s3", client)
		c.Next()
	}
}
