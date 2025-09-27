package routers

import (
	"main/routers/routes"
	"net/http"

	"github.com/gin-gonic/gin"
	"google.golang.org/genai"
)

func RegisterRoutes(engine *gin.Engine, chatbot *genai.Chat) {
	engine.NoRoute(func(ctx *gin.Context) {
		ctx.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Route Not Found :("})
	})

	routes.HealthRoutes(engine)

	routes.ChatRoutes(engine, chatbot)
}
