package routers

import (
	"main/routers/routes"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	"google.golang.org/genai"
)

func RegisterRoutes(engine *gin.Engine, chatbot *genai.Chat, s3Client *s3.Client) {
	engine.NoRoute(func(ctx *gin.Context) {
		ctx.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Route Not Found :("})
	})

	routes.HealthRoutes(engine)

	routes.ChatRoutes(engine, chatbot)

	routes.ImageRoutes(engine, s3Client)
}
