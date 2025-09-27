package controllers

import "github.com/gin-gonic/gin"

type HealthController struct{}

func (ctrl *HealthController) HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status": "Welcome to Cloud Closet!",
	})
}
