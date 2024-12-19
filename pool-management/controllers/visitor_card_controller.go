package controllers

import (
	"net/http"
	"pool-management/config"
	"pool-management/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetVisitorCards(c *gin.Context) {
	visitorCards, err := models.GetAllVisitorCards(config.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, visitorCards)
}

func AddVisitorCard(c *gin.Context) {
	var vc models.VisitorCard
	if err := c.ShouldBindJSON(&vc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.AddVisitorCard(config.DB, &vc); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, vc)
}

func UpdateVisitorCard(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var vc models.VisitorCard
	if err := c.ShouldBindJSON(&vc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	vc.ID = id
	if err := models.UpdateVisitorCard(config.DB, &vc); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, vc)
}

func DeleteVisitorCard(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := models.DeleteVisitorCard(config.DB, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Visitor card deleted"})
}
