package middleware

import (
	"github.com/gin-gonic/gin"
	"google.golang.org/genai"
)

func ChatbotMiddleware(chatbot *genai.Chat) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("chatbot", chatbot)
		c.Next()
	}
}
