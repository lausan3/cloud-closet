package routes

import (
	"main/controllers"
	"main/routers/middleware"

	"github.com/gin-gonic/gin"
	"google.golang.org/genai"
)

func ChatRoutes(engine *gin.Engine, chatbot *genai.Chat) {
	var ctrl controllers.ChatController

	chatGroup := engine.Group("/chats")

	chatGroup.Use(middleware.ChatbotMiddleware(chatbot))

	chatGroup.POST("/message", ctrl.SendChatStream)
}
