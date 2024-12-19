package controllers

import (
	"net/http"
	"pool-management/config"
	"pool-management/models"

	"github.com/gin-gonic/gin"
)

func GetPopularSubscriptions(c *gin.Context) {
	results, err := models.GetPopularSubscriptions(config.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, results)
}

func GetTopSpendingClients(c *gin.Context) {
	results, err := models.GetTopSpendingClients(config.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, results)
}

func GetTopTrainingClients(c *gin.Context) {
	results, err := models.GetTopTrainingClients(config.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, results)
}

func GetTopInstructors(c *gin.Context) {
	results, err := models.GetTopInstructors(config.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, results)
}
