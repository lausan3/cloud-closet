package controllers

import (
	"os"

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

	m := message.Message
	stringified, err := os.ReadFile("./data/closet.json")

	if err != nil {
		c.JSON(500, gin.H{"There was an error reading clothes": err.Error()})
		return
	}

	clothes := "\n\nHere are the clothes they have in their closet: " + string(stringified)

	parts := []*genai.Part{
		genai.NewPartFromText(m),
		genai.NewPartFromText(clothes),
	}

	// for
	// 	part := genai.Part{
	// 		Text: m[i:min(i+100, len(m))],
	// 	}

	// 	parts = append(parts, &part)
	// }

	response, err := chatbot.Send(c, parts...)

	if err != nil {
		c.JSON(500, gin.H{"There was an error sending a message to AI": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message":      "Successfully got a response from our AI",
		"chatResponse": response.Text(),
	})
}
