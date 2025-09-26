package routes

import (
	"main/controllers"

	"github.com/gin-gonic/gin"
)

func HealthRoutes(r *gin.Engine) {
	var ctrl controllers.HealthController

	r.GET("/health", ctrl.HealthCheck)
}
