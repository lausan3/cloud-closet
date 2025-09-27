package routes

import (
	"main/controllers"
	"main/routers/middleware"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
)

func ImageRoutes(engine *gin.Engine, s3Client *s3.Client) {
	ic := controllers.ImageController{}

	images := engine.Group("/images")

	images.Use(middleware.S3Middleware(s3Client))

	images.GET("", ic.GetImagesForUser)
	images.POST("", ic.UploadImage)
	images.DELETE("", ic.DeleteImage)
}
