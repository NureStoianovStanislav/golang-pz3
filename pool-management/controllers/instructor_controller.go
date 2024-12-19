package controllers

import (
	"net/http"
	"pool-management/config"
	"pool-management/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetInstructors(c *gin.Context) {
	instructors, err := models.GetAllInstructors(config.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, instructors)
}

func AddInstructor(c *gin.Context) {
	var instructor models.Instructor
	if err := c.ShouldBindJSON(&instructor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.AddInstructor(config.DB, &instructor); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, instructor)
}

func UpdateInstructor(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var instructor models.Instructor
	if err := c.ShouldBindJSON(&instructor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	instructor.ID = id
	if err := models.UpdateInstructor(config.DB, &instructor); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, instructor)
}

func DeleteInstructor(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := models.DeleteInstructor(config.DB, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Instructor deleted"})
}
