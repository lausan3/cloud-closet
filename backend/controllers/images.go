package controllers

import (
	"fmt"
	"main/infra/logger"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ImageController struct{}

type UploadImageBody struct {
	UserID       string  `form:"userId" binding:"required"`
	Name         string  `form:"name" binding:"required"`
	Type         string  `form:"type" binding:"required"`
	RelativePath *string `form:"relativePath"`
}

func (ic *ImageController) UploadImage(c *gin.Context) {
	var s3Client *s3.Client = c.MustGet("s3").(*s3.Client)

	var body UploadImageBody
	if err := c.ShouldBind(&body); err != nil {
		logger.Errorf("Failed to bind request body: %v. Error: %v", body, err)

		c.JSON(400, gin.H{"error": "Invalid request body. You are possibly missing a name or type field."})
		return
	}

	uuid := uuid.New()

	var objectKey string = fmt.Sprintf("%s/%s", body.UserID, uuid.String())

	presignClient := s3.NewPresignClient(s3Client)

	params := &s3.PutObjectInput{
		Bucket: aws.String("cloudcloset-uploads"),
		Key:    aws.String(objectKey),
	}

	put, err := presignClient.PresignPutObject(c, params)

	if err != nil {
		logger.Errorf("Failed to generate presigned URL: %v", err)

		c.JSON(500, gin.H{"error": "Failed to generate presigned URL: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"url":    put.URL,
		"method": put.Method,
	})
}

type ClosetItem struct {
	ID     string   `json:"id"`
	UserID string   `json:"userId,omitempty"`
	Source string   `json:"src"`
	Tags   []string `json:"tags"`
}

type ImageBody struct {
	UserID string `form:"userId" binding:"required"`
}

func (ic *ImageController) GetImagesForUser(c *gin.Context) {
	var s3Client *s3.Client = c.MustGet("s3").(*s3.Client)

	var body ImageBody
	if err := c.ShouldBindBodyWithJSON(&body); err != nil {
		logger.Errorf("Failed to bind request body: %v. Error: %v", body, err)

		c.JSON(400, gin.H{"error": "Invalid request body. You are possibly missing a userId field."})
		return
	}

	var objectPrefix string = fmt.Sprintf("%s/", body.UserID)

	listParams := &s3.ListObjectsV2Input{
		Bucket: aws.String("cloudcloset-uploads"),
		Prefix: aws.String(objectPrefix),
	}

	listOutput, err := s3Client.ListObjectsV2(c, listParams)

	if err != nil {
		logger.Errorf("Failed to list objects in S3: %v", err)

		c.JSON(500, gin.H{"error": "Failed to list objects in S3: " + err.Error()})
		return
	}

	items := []ClosetItem{}

	for _, object := range listOutput.Contents {
		item := ClosetItem{
			ID:     (*object.Key)[len(objectPrefix):],
			Source: fmt.Sprintf("https://cloudcloset-uploads.s3.amazonaws.com/%s", *object.Key),
			Tags:   []string{},
		}
		items = append(items, item)
	}

	c.JSON(200, gin.H{
		"closetItems": items,
	})
}

type DeleteImageBody struct {
	ImageBody
	ImageID string `form:"imageId" binding:"required"`
}

func (ic *ImageController) DeleteImage(c *gin.Context) {
	var s3Client *s3.Client = c.MustGet("s3").(*s3.Client)

	var body DeleteImageBody
	if err := c.ShouldBindBodyWithJSON(&body); err != nil {
		logger.Errorf("Failed to bind request body: %v. Error: %v", body, err)

		c.JSON(400, gin.H{"error": "Invalid request body. You are possibly missing an userId or imageId field."})
		return
	}

	var objectKey string = fmt.Sprintf("%s/%s", body.UserID, body.ImageID)

	deleteParams := &s3.DeleteObjectInput{
		Bucket: aws.String("cloudcloset-uploads"),
		Key:    aws.String(objectKey),
	}

	_, err := s3Client.DeleteObject(c, deleteParams)

	if err != nil {
		logger.Errorf("Failed to delete object in S3: %v", err)

		c.JSON(500, gin.H{"error": "Failed to delete object in S3: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message": "Successfully deleted image",
	})
}
