package main

import (
	"context"
	"main/config"
	"main/infra/logger"
	"main/routers"

	"google.golang.org/genai"
)

func main() {
	c := config.Configuration{}

	if err := config.SetupConfig(&c); err != nil {
		logger.Fatalf("Configuration could not be setup: %v", err)
	}

	logger.Infof("Configuration loaded: %+v", c)

	ctx := context.Background()

	gemini, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey: c.Gemini.Key,
	})

	if err != nil {
		logger.Fatalf("Failed to create Gemini client: %v", err)
	}

	systemPrompt := `You are an outfit stylist that helps users find outfits based on the clothes they have. At the moment, 
	assume they have black slacks and whatever they tell you they have in their message.`

	chatbot, err := gemini.Chats.Create(ctx, "gemini-2.5-flash", &genai.GenerateContentConfig{
		SystemInstruction: genai.NewContentFromText(systemPrompt, genai.RoleModel),
	}, nil)

	if err != nil {
		logger.Fatalf("Failed to create chat session: %v", err)
	}

	router := routers.NewRouter(chatbot)

	logger.Fatalf("%v", router.Run(c.Server.ServerString()))
}
