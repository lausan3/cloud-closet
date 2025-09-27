package controllers

import (
	"github.com/gin-gonic/gin"
	"google.golang.org/genai"
)

type ChatController struct{}

type ChatMessage struct {
	Message string `json:"message" binding:"required"`
}

func (ctrl *ChatController) SendChatStream(c *gin.Context) {
	// Implementation for handling chat message streaming
	var chatbot *genai.Chat = c.MustGet("chatbot").(*genai.Chat)

	var message ChatMessage

	c.ShouldBindBodyWithJSON(&message)

	// response := chatbot.SendStream(c, genai.NewPartFromText(message.Message))
	response, err := chatbot.Send(c, genai.NewPartFromText(message.Message))

	if err != nil {
		c.JSON(500, gin.H{"There was an error sending a message to AI": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message":      "Successfully got a response from our AI",
		"chatResponse": response.Text(),
	})

	// c.Stream(func(w io.Writer) bool {
	// 	for chunk, err := range response {
	// 		if err != nil {
	// 			return false
	// 		}

	// 		c.SSEvent("message", chunk.Text())
	// 		time.Sleep(time.Second)
	// 		return true
	// 	}

	// 	return true
	// })
}
