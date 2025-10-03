package main

import (
	"context"
	environment "main/config"
	"main/infra/logger"
	"main/routers"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
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

	s3Client := newS3Client(ctx, &c)

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

	systemPrompt := `You are an outfit stylist that helps users find outfits based on the clothes they have. 
		The front end will provide it to you in JSON format. Don't mention the JSON in your response.
		
		You should not make up clothes that they don't have in their closet.
		
		This message should be in JSON format with the following fields:
		- "outfit": a string describing the outfit you recommend based on the clothes they have in their closet.
		- "reasoning": a string explaining why you recommended this outfit based on the user's message and the clothes they have in their closet.
		- "sources": an array of strings, where each string is a URL to an image of a clothing item from their closet that you used in your outfit recommendation.
		`

	chatbot, err := gemini.Chats.Create(ctx, "gemini-2.5-flash", &genai.GenerateContentConfig{
		SystemInstruction: genai.NewContentFromText(systemPrompt, genai.RoleModel),
	}, nil)

	if err != nil {
		logger.Fatalf("Failed to create chat session: %v", err)
	}

	return chatbot
}

func newS3Client(ctx context.Context, c *environment.Configuration) *s3.Client {
	cfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion("us-east-1"),
		config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(
				c.AWS.AccessKeyID, c.AWS.SecretAccessKey, "",
			),
		),
	)

	if err != nil {
		logger.Fatalf("unable to load SDK config, %v", err)
	}

	s3 := s3.NewFromConfig(cfg)

	return s3
}
