package routes

import (
	"cloudcloset/controllers"

	"github.com/gin-gonic/gin"
)

func HealthRoutes(r *gin.Engine) {
	var ctrl controllers.HealthController

	r.GET("/health", ctrl.HealthCheck)
}
