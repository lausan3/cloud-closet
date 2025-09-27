package routers

import (
	"main/routers/middleware"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"google.golang.org/genai"
)

func NewRouter(chatbot *genai.Chat) *gin.Engine {
	environment := viper.GetBool("DEBUG")

	if environment {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	allowedHosts := viper.GetString("ALLOWED_HOSTS")

	if allowedHosts == "" {
		allowedHosts = "0.0.0.0/0"
	}

	router := gin.New()
	router.SetTrustedProxies([]string{allowedHosts})
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware())

	RegisterRoutes(router, chatbot)

	return router
}
