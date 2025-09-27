package main

import (
	"context"
	environment "main/config"
	"main/infra/logger"
	"main/routers"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"google.golang.org/genai"
)

func main() {
	c := environment.Configuration{}

	if err := environment.SetupConfig(&c); err != nil {
		logger.Fatalf("Configuration could not be setup: %v", err)
	}

	logger.Infof("Configuration loaded: %+v", c)

	ctx := context.Background()

	chatbot := newChatbot(ctx, &c)

	s3Client := newS3Client(ctx)

	router := routers.NewRouter(chatbot, s3Client)

	logger.Fatalf("%v", router.Run(c.Server.ServerString()))
}

func newChatbot(ctx context.Context, c *environment.Configuration) *genai.Chat {
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

	return chatbot
}

func newS3Client(ctx context.Context) *s3.Client {
	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion("us-east-1"))

	if err != nil {
		logger.Fatalf("unable to load SDK config, %v", err)
	}

	s3 := s3.NewFromConfig(cfg)

	return s3
}
