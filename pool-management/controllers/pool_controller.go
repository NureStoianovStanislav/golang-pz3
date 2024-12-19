package controllers

import (
	"net/http"
	"pool-management/config"
	"pool-management/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetPools(c *gin.Context) {
	pools, err := models.GetAllPools(config.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, pools)
}

func AddPool(c *gin.Context) {
	var pool models.Pool
	if err := c.ShouldBindJSON(&pool); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if pool.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pool_id is required and must be a positive integer"})
		return
	}

	if err := models.AddPool(config.DB, &pool); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, pool)
}

func UpdatePool(c *gin.Context) {
	oldID, err := strconv.Atoi(c.Param("id"))
	if err != nil || oldID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var pool models.Pool
	if err := c.ShouldBindJSON(&pool); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if pool.ID <= 0 || oldID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "New pool_id and old pool_id must be a positive integer"})
		return
	}

	if err := models.UpdatePool(config.DB, &pool, oldID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, pool)
}

func DeletePool(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := models.DeletePool(config.DB, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Pool deleted"})
}
