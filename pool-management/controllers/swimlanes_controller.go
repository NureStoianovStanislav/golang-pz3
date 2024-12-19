package controllers

import (
	"net/http"
	"pool-management/config"
	"pool-management/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetSwimLanes(c *gin.Context) {
	swimLanes, err := models.GetAllSwimLanes(config.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, swimLanes)
}

func AddSwimLane(c *gin.Context) {
	var lane models.SwimLane
	if err := c.ShouldBindJSON(&lane); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if lane.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "swimlane_id is required and must be a positive integer"})
		return
	}

	if err := models.AddSwimLane(config.DB, &lane); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, lane)
}

func UpdateSwimLane(c *gin.Context) {
	oldID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var lane models.SwimLane
	if err := c.ShouldBindJSON(&lane); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if lane.ID <= 0 || oldID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "New swimlane_id and old swimlane_id must be a positive integer"})
		return
	}

	if err := models.UpdateSwimLane(config.DB, &lane, oldID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, lane)
}

func DeleteSwimLane(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := models.DeleteSwimLane(config.DB, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Swim lane deleted"})
}
