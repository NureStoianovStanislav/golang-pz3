package controllers

import (
	"net/http"
	"pool-management/config"
	"pool-management/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetSubscriptions(c *gin.Context) {
	subscriptions, err := models.GetAllSubscriptions(config.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch subscriptions",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, subscriptions)
}

func AddSubscription(c *gin.Context) {
	var sub models.Subscription
	if err := c.ShouldBindJSON(&sub); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.AddSubscription(config.DB, &sub); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add subscription"})
		return
	}

	c.JSON(http.StatusOK, sub)
}

func UpdateSubscription(c *gin.Context) {
	var sub models.Subscription
	if err := c.ShouldBindJSON(&sub); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.UpdateSubscription(config.DB, &sub); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update subscription"})
		return
	}

	c.JSON(http.StatusOK, sub)
}

func DeleteSubscription(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := models.DeleteSubscription(config.DB, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete subscription"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Subscription deleted"})
}
